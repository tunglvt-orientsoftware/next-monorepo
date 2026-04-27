'use client'

import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MapPin, Calendar, Heart, Users, Loader2, Globe, Search } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const MotionImage = motion.create(Image)

const PAGE_SIZE = 9

export default function DashboardPage() {
  const [feedTrips, setFeedTrips] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'friends' | 'discover'>('friends')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  
  // Pagination states
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  
  const observerTarget = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Reset feed when tab or search changes
  useEffect(() => {
    setFeedTrips([])
    setPage(0)
    setHasMore(true)
    setIsLoading(true)
  }, [activeTab, debouncedSearch])

  // Fetch feed
  useEffect(() => {
    async function fetchFeed() {
      // Prevent fetching if no more data and we are not on initial page
      if (!hasMore && page > 0) return

      const isInitialFetch = page === 0

      if (isInitialFetch) {
        setIsLoading(true)
      } else {
        setIsFetchingMore(true)
      }

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      let tripsQuery = supabase
        .from('trips')
        .select('*, profiles:user_id(id, full_name, avatar_url)')

      // Handle search by author name
      let matchingUserIds: string[] = []
      if (debouncedSearch) {
        const { data: users } = await supabase
          .from('profiles')
          .select('id')
          .ilike('full_name', `%${debouncedSearch}%`)
        
        if (users && users.length > 0) {
          matchingUserIds = users.map(u => u.id)
        }
      }

      if (activeTab === 'friends') {
        // Fetch accepted friends
        const { data: friends1 } = await supabase.from('friends').select('friend_id').eq('user_id', user.id).eq('status', 'accepted')
        const { data: friends2 } = await supabase.from('friends').select('user_id').eq('friend_id', user.id).eq('status', 'accepted')
        
        const friendIds = [
          ...(friends1?.map(f => f.friend_id) || []), 
          ...(friends2?.map(f => f.user_id) || [])
        ]

        if (friendIds.length > 0) {
          tripsQuery = tripsQuery.in('user_id', friendIds).neq('visibility', 'private').neq('is_draft', true)
        } else {
          // No friends, return empty
          if (isInitialFetch) setFeedTrips([])
          setIsLoading(false)
          setIsFetchingMore(false)
          setHasMore(false)
          return
        }
      } else {
        // Discover tab: public trips
        tripsQuery = tripsQuery.eq('visibility', 'public').neq('user_id', user.id).neq('is_draft', true)
      }

      // Apply Search (Title, Story, Author)
      if (debouncedSearch) {
        if (matchingUserIds.length > 0) {
          const userIdsStr = matchingUserIds.join(',')
          tripsQuery = tripsQuery.or(`title.ilike.%${debouncedSearch}%,story.ilike.%${debouncedSearch}%,user_id.in.(${userIdsStr})`)
        } else {
          tripsQuery = tripsQuery.or(`title.ilike.%${debouncedSearch}%,story.ilike.%${debouncedSearch}%`)
        }
      }

      // Pagination & Sorting
      const from = page * PAGE_SIZE
      const to = from + PAGE_SIZE - 1
      
      tripsQuery = tripsQuery.order('created_at', { ascending: false }).range(from, to)

      const { data, error } = await tripsQuery
        
      if (data && data.length > 0) {
        // Fetch likes to show count
        const tripIds = data.map(t => t.id)
        const { data: likesData } = await supabase.from('trip_likes').select('trip_id').in('trip_id', tripIds)
        
        const likesCountByTrip = (likesData || []).reduce((acc: any, like: any) => {
          acc[like.trip_id] = (acc[like.trip_id] || 0) + 1
          return acc
        }, {})

        let tripsWithLikes = data.map(trip => ({
          ...trip,
          likesCount: likesCountByTrip[trip.id] || 0
        }))

        // Algorithm for Discover Tab (Trending): Sort locally by likes if we are on Discover tab.
        // Note: For full trending algorithm across all data, an RPC is needed. 
        // This locally prioritizes highly-liked recent posts within the fetched page.
        if (activeTab === 'discover') {
           tripsWithLikes.sort((a, b) => b.likesCount - a.likesCount || new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        }

        setFeedTrips(prev => isInitialFetch ? tripsWithLikes : [...prev, ...tripsWithLikes])
        setHasMore(data.length === PAGE_SIZE)
      } else {
        if (isInitialFetch) {
          setFeedTrips([])
        }
        setHasMore(false)
      }
      
      setIsLoading(false)
      setIsFetchingMore(false)
    }

    fetchFeed()
  }, [router, activeTab, debouncedSearch, page])

  // Intersection Observer for Infinite Scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoading && !isFetchingMore) {
          setPage(prev => prev + 1)
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [hasMore, isLoading, isFetchingMore])

  return (
    <div className="min-h-screen bg-[#fdfcf8] p-4 pt-6 md:p-12 font-serif flex flex-col">
      <div className="max-w-6xl mx-auto space-y-8 w-full flex-grow">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-medium text-slate-900 tracking-tight flex items-center gap-6">
              <button 
                onClick={() => setActiveTab('friends')}
                className={`transition-colors ${activeTab === 'friends' ? 'text-slate-900' : 'text-slate-300 hover:text-slate-600'}`}
              >
                Friends
              </button>
              <button 
                onClick={() => setActiveTab('discover')}
                className={`transition-colors ${activeTab === 'discover' ? 'text-slate-900' : 'text-slate-300 hover:text-slate-600'}`}
              >
                Discover
              </button>
            </h1>
            <p className="text-lg text-slate-600 font-sans max-w-xl">
              {activeTab === 'friends' ? 'See what your friends have been up to.' : 'Explore trending and inspiring journeys from the community.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link href="/my-memories" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto rounded-full h-12 px-6 font-sans border-slate-300">
                My Memories
              </Button>
            </Link>
            <Link href="/profile" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-[#c96442] hover:bg-[#b05537] text-white rounded-full h-12 px-6 font-sans shadow-md">
                <Users className="w-5 h-5 mr-2" />
                Find Friends
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search stories, places, or travelers..."
            className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-full leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c96442]/50 focus:border-[#c96442] sm:text-sm font-sans transition-all duration-300 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading && page === 0 ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 text-[#c96442] animate-spin" />
          </div>
        ) : feedTrips.length === 0 ? (
          <div className="text-center py-32 bg-white/50 border border-slate-200 rounded-3xl">
            {activeTab === 'friends' ? (
              <>
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                <p className="text-xl text-slate-500 mb-6 font-sans">
                  {debouncedSearch ? 'No matching stories from friends found.' : 'No stories from friends yet.'}
                </p>
                {!debouncedSearch && (
                  <Link href="/profile">
                    <Button variant="outline" className="rounded-full h-12 px-6 border-slate-300 font-sans">
                      Invite friends to see their stories
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Globe className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                <p className="text-xl text-slate-500 mb-6 font-sans">
                  {debouncedSearch ? 'No matching public stories found.' : 'No public stories available yet.'}
                </p>
                {!debouncedSearch && (
                  <Link href="/memory">
                    <Button variant="outline" className="rounded-full h-12 px-6 border-slate-300 font-sans">
                      Be the first to share a public story
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="space-y-8 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {feedTrips.map((trip) => {
                const coverImage = trip.milestones?.find((m: any) => m.images && m.images.length > 0)?.images[0]
                
                return (
                  <Link href={`/my-memories/${trip.id}`} key={trip.id} className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col">
                    {/* Author Banner */}
                    <div className="p-4 flex items-center gap-3 border-b border-slate-100 bg-slate-50/50">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 border border-slate-300 flex-shrink-0">
                        {trip.profiles?.avatar_url ? (
                          <Image src={trip.profiles.avatar_url} alt="avatar" className="w-full h-full object-cover" width={100} height={100} unoptimized={typeof trip.profiles.avatar_url === 'string' && (trip.profiles.avatar_url.startsWith('blob:') || trip.profiles.avatar_url.startsWith('data:'))} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-sans">
                            {trip.profiles?.full_name?.charAt(0) || 'U'}
                          </div>
                        )}
                      </div>
                      <div className="font-sans text-sm font-medium text-slate-700 truncate">
                        {trip.profiles?.full_name || 'Traveler'}
                      </div>
                    </div>

                    <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                      {coverImage ? (
                        <MotionImage 
                          layoutId={`trip-cover-${trip.id}`}
                          src={coverImage} 
                          alt={trip.title || 'Trip Cover'} 
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <MapPin className="w-12 h-12 opacity-50" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-sans font-medium text-slate-700 shadow-sm z-10 flex items-center gap-1.5">
                        <Heart className={`w-3.5 h-3.5 ${trip.likesCount > 0 ? 'text-red-500 fill-red-500' : 'text-slate-400'}`} />
                        {trip.likesCount}
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="font-serif text-2xl text-slate-900 mb-2 line-clamp-1">
                        {trip.title || 'Untitled Trip'}
                      </h3>
                      <p className="font-sans text-slate-600 text-sm line-clamp-2 mb-6 flex-grow">
                        {trip.story || 'No summary provided.'}
                      </p>
                      
                      <div className="flex items-center text-slate-400 text-xs font-sans mt-auto">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                        {new Date(trip.created_at).toLocaleDateString(undefined, { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
            
            {/* Infinite Scroll Trigger */}
            <div ref={observerTarget} className="flex justify-center py-8">
              {isFetchingMore && (
                <Loader2 className="w-6 h-6 text-[#c96442] animate-spin" />
              )}
              {!hasMore && feedTrips.length > 0 && (
                <p className="text-slate-400 font-sans text-sm">You've reached the end of the journey.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
