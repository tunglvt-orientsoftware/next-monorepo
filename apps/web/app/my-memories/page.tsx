'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { MapPin, Calendar, Plus, Loader2, Trash2, Users } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function MyMemoriesPage() {
  const [savedTrips, setSavedTrips] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchTrips() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }
      setUserId(user.id)

      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        
      if (data) {
        setSavedTrips(data)
      }
      setIsLoading(false)
    }
    fetchTrips()
  }, [])

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this trip story?')) {
      const supabase = createClient()
      const { error } = await supabase.from('trips').delete().eq('id', id)
      if (!error) {
        setSavedTrips(prev => prev.filter(t => t.id !== id))
      } else {
        alert('Failed to delete trip.')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f4ed] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#c96442] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f4ed] p-6 md:p-12 font-serif">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-medium text-slate-900 tracking-tight">
              My Memories
            </h1>
            <p className="text-lg text-slate-600 font-sans max-w-xl">
              A collection of your beautifully crafted trip stories.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto rounded-full h-12 px-6 font-sans border-slate-300">
                <Users className="w-5 h-5 mr-2" />
                Friends' Feed
              </Button>
            </Link>
            <Link href="/memory" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-[#c96442] hover:bg-[#b05537] text-white rounded-full h-12 px-6 font-sans shadow-md">
                <Plus className="w-5 h-5 mr-2" />
                New Trip Story
              </Button>
            </Link>
          </div>
        </div>

        {savedTrips.length === 0 ? (
          <div className="text-center py-32 bg-white/50 border border-slate-200 rounded-3xl">
            <p className="text-xl text-slate-500 mb-6">You haven't saved any trip stories yet.</p>
            <Link href="/memory">
              <Button variant="outline" className="rounded-full h-12 px-6 border-slate-300">
                Create your first story
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedTrips.map((trip) => {
              // Priority: 1. Cover Image, 2. First image of first milestone with images
              const coverImage = trip.cover_image || trip.milestones?.find((m: any) => m.images && m.images.length > 0)?.images[0]
              
              return (
                <Link href={`/my-memories/${trip.id}`} key={trip.id} className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col block">
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
                    <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-sans font-medium text-slate-700 shadow-sm">
                        {trip.milestones.length} Milestones
                      </div>
                      <button
                        onClick={(e) => handleDelete(e, trip.id)}
                        className="bg-white/90 hover:bg-red-500 hover:text-white text-slate-700 p-1.5 rounded-full backdrop-blur-sm transition-colors shadow-sm"
                        title="Delete Trip"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
