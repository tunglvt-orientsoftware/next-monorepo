'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MapPin, Calendar, Heart, Users, Loader2, Globe } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function FeedPage() {
  const [feedTrips, setFeedTrips] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'friends' | 'discover'>('friends')
  const router = useRouter()

  useEffect(() => {
    async function fetchFeed() {
      setIsLoading(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      let tripsQuery = supabase
        .from('trips')
        .select('*, profiles:user_id(id, full_name, avatar_url)')
        .order('created_at', { ascending: false })

      if (activeTab === 'friends') {
        // Fetch accepted friends
        const { data: friends1 } = await supabase.from('friends').select('friend_id').eq('user_id', user.id).eq('status', 'accepted')
        const { data: friends2 } = await supabase.from('friends').select('user_id').eq('friend_id', user.id).eq('status', 'accepted')
        
        const friendIds = [
          ...(friends1?.map(f => f.friend_id) || []), 
          ...(friends2?.map(f => f.user_id) || [])
        ]

        if (friendIds.length > 0) {
          tripsQuery = tripsQuery.in('user_id', friendIds)
        } else {
          // No friends, return empty
          setFeedTrips([])
          setIsLoading(false)
          return
        }
      } else {
        // Discover tab: public trips (not including own trips)
        tripsQuery = tripsQuery.eq('is_public', true).neq('user_id', user.id)
      }

      const { data, error } = await tripsQuery
        
      if (data && data.length > 0) {
        // Also fetch likes to show count
        const tripIds = data.map(t => t.id)
        const { data: likesData } = await supabase.from('trip_likes').select('trip_id').in('trip_id', tripIds)
        
        const likesCountByTrip = (likesData || []).reduce((acc: any, like: any) => {
          acc[like.trip_id] = (acc[like.trip_id] || 0) + 1
          return acc
        }, {})

        const tripsWithLikes = data.map(trip => ({
          ...trip,
          likesCount: likesCountByTrip[trip.id] || 0
        }))

        setFeedTrips(tripsWithLikes)
      } else {
        setFeedTrips([])
      }
      setIsLoading(false)
    }
    fetchFeed()
  }, [router, activeTab])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fdfcf8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#c96442] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fdfcf8] p-6 md:p-12 font-serif">
      <div className="max-w-6xl mx-auto space-y-12">
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
              {activeTab === 'friends' ? 'See what your friends have been up to.' : 'Explore inspiring journeys from the community.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
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

        {feedTrips.length === 0 ? (
          <div className="text-center py-32 bg-white/50 border border-slate-200 rounded-3xl">
            {activeTab === 'friends' ? (
              <>
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                <p className="text-xl text-slate-500 mb-6">No stories from friends yet.</p>
                <Link href="/profile">
                  <Button variant="outline" className="rounded-full h-12 px-6 border-slate-300">
                    Invite friends to see their stories
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Globe className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                <p className="text-xl text-slate-500 mb-6">No public stories available yet.</p>
                <Link href="/memory">
                  <Button variant="outline" className="rounded-full h-12 px-6 border-slate-300">
                    Be the first to share a public story
                  </Button>
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {feedTrips.map((trip) => {
              const coverImage = trip.milestones?.find((m: any) => m.images && m.images.length > 0)?.images[0]
              
              return (
                <Link href={`/my-memories/${trip.id}`} key={trip.id} className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col block">
                  {/* Author Banner */}
                  <div className="p-4 flex items-center gap-3 border-b border-slate-100 bg-slate-50/50">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 border border-slate-300 flex-shrink-0">
                      {trip.profiles?.avatar_url ? (
                        <img src={trip.profiles.avatar_url} alt="avatar" className="w-full h-full object-cover" />
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
                      <motion.img 
                        layoutId={`trip-cover-${trip.id}`}
                        src={coverImage} 
                        alt={trip.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
        )}
      </div>
    </div>
  )
}
