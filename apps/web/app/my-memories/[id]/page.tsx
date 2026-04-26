'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MapPin, ArrowLeft, Camera, Navigation, X, Trash2, Heart } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

import { ScrapbookTheme } from '@/components/memory/themes/ScrapbookTheme'
import { MagazineTheme } from '@/components/memory/themes/MagazineTheme'
import { PolaroidTheme } from '@/components/memory/themes/PolaroidTheme'

import { SummerTheme } from '@/components/memory/themes/SummerTheme'
import { ClassicTheme } from '@/components/memory/themes/ClassicTheme'
import { CinematicTheme } from '@/components/memory/themes/CinematicTheme'

export default function TripViewPage() {
  const params = useParams()
  const router = useRouter()
  const [trip, setTrip] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [likesCount, setLikesCount] = useState(0)
  const [hasLiked, setHasLiked] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  
  // Lightbox State
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  
  useEffect(() => {
    async function fetchTrip() {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)

      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', params?.id)
        .single()

      if (data) {
        setTrip(data)
        
        // Fetch likes count
        const { count, error: likesError } = await supabase
          .from('trip_likes')
          .select('*', { count: 'exact', head: true })
          .eq('trip_id', params.id)
          
        if (!likesError && count !== null) {
          setLikesCount(count)
        }
        
        // Check if current user has liked
        if (user) {
          const { data: userLike, error: userLikeError } = await supabase
            .from('trip_likes')
            .select('*')
            .eq('trip_id', params.id)
            .eq('user_id', user.id)
            .maybeSingle()
            
          if (userLikeError) console.error("Error fetching user like:", userLikeError);
          setHasLiked(!!userLike)
        }
      } else {
        router.push('/my-memories')
      }
      setIsLoading(false)
    }
    fetchTrip()
  }, [params, router])

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this trip story?')) {
      const supabase = createClient()
      const { error } = await supabase.from('trips').delete().eq('id', params?.id)
      if (!error) {
        router.push('/my-memories')
      } else {
        alert('Failed to delete trip.')
      }
    }
  }

  const handleToggleLike = async () => {
    if (!currentUser) {
      router.push('/login')
      return
    }
    
    const supabase = createClient()
    
    if (hasLiked) {
      setHasLiked(false)
      setLikesCount(prev => Math.max(0, prev - 1))
      await supabase
        .from('trip_likes')
        .delete()
        .eq('trip_id', params.id)
        .eq('user_id', currentUser.id)
    } else {
      setHasLiked(true)
      setLikesCount(prev => prev + 1)
      await supabase
        .from('trip_likes')
        .insert({
          trip_id: params.id,
          user_id: currentUser.id
        })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fdfcf8] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#c96442] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!trip) return null

  const isOwner = currentUser?.id === trip.user_id

  const themeProps = {
    trip,
    isOwner,
    hasLiked,
    likesCount,
    handleToggleLike,
    handleDelete,
    selectedImage,
    setSelectedImage
  }

  if (trip.theme === 'summer') return <SummerTheme {...themeProps} />
  if (trip.theme === 'classic') return <ClassicTheme {...themeProps} />
  if (trip.theme === 'cinematic') return <CinematicTheme {...themeProps} />
  if (trip.theme === 'magazine') return <MagazineTheme {...themeProps} />
  if (trip.theme === 'polaroid') return <PolaroidTheme {...themeProps} />
  return <ScrapbookTheme {...themeProps} />
}

