'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTripStore } from '@/lib/store'
import { TimelineEditor } from '@/components/memory/TimelineEditor'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditTripPage() {
  const params = useParams()
  const router = useRouter()
  const { setTripData, resetTrip } = useTripStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchTrip() {
      if (!params?.id) return
      
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase.from('trips').select('*').eq('id', params.id).single()
      
      if (error || !data) {
        console.error("Error fetching trip:", error)
        router.push('/my-memories')
        return
      }

      // Check ownership
      if (data.user_id !== user.id) {
        router.push(`/my-memories/${params.id}`)
        return
      }

      // Populate store
      setTripData({
        tripTitle: data.title || '',
        tripStory: data.story || '',
        theme: data.theme || 'scrapbook',
        coverImage: data.cover_image || null,
        isPublic: data.is_public || false,
        milestones: data.milestones || []
      })
      
      setIsLoading(false)
    }

    fetchTrip()
    
    // Cleanup on unmount
    return () => {
      // We don't reset trip here because TimelineEditor handles it on save
    }
  }, [params, router, setTripData])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fdfcf8] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#c96442] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center py-6 md:py-16 bg-[#f5f4ed] px-4 font-serif relative">
      <div className="w-full max-w-6xl space-y-6 md:space-y-12">
        <div>
          <Link href={`/my-memories/${params.id}`} className="inline-flex items-center text-[#c96442] hover:text-[#b05537] font-sans font-medium transition-colors bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-[#c96442]/20 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancel
          </Link>
        </div>

        <div className="space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl font-medium text-slate-900 tracking-tight">
            Edit Your Trip Story
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-sans max-w-2xl mx-auto">
            Update your photos, tweak your story, or add new milestones to this journey.
          </p>
        </div>

        {/* Pass tripId to TimelineEditor so it knows to update */}
        <TimelineEditor tripId={params.id as string} />
      </div>
    </div>
  )
}
