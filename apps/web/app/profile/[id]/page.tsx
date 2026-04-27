'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { User, UserPlus, UserMinus, Check, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import Link from 'next/link'
import { createNotification } from '@/lib/notifications'

export default function PublicProfilePage() {
  const { id } = useParams()
  const router = useRouter()
  const [targetProfile, setTargetProfile] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [friendStatus, setFriendStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    async function loadData() {
      if (!id) return
      
      const supabase = createClient()
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)

      // Get target profile by ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (profile) {
        setTargetProfile(profile)
        
        if (user && user.id !== profile.id) {
          // Check friendship status
          const { data: friendship } = await supabase
            .from('friends')
            .select('*')
            .or(`and(user_id.eq.${user.id},friend_id.eq.${profile.id}),and(user_id.eq.${profile.id},friend_id.eq.${user.id})`)
            .single()
            
          if (friendship) {
            setFriendStatus(friendship.status)
          }
        }
      }
      
      setLoading(false)
    }
    loadData()
  }, [id])

  const handleAddFriend = async () => {
    if (!currentUser) {
      router.push('/login')
      return
    }
    
    setActionLoading(true)
    const supabase = createClient()
    
    const { error } = await supabase
      .from('friends')
      .insert({
        user_id: currentUser.id,
        friend_id: targetProfile.id,
        status: 'pending'
      })
      
    if (!error) {
      setFriendStatus('pending')
      // Notify the target user about the friend request
      await createNotification(
        targetProfile.id,
        'friend_request',
        currentUser.id,
        targetProfile.id,
        `wants to be your friend`
      )
    }
    setActionLoading(false)
  }

  const handleUnfriend = async () => {
    if (!currentUser) return
    
    if (!confirm('Are you sure you want to unfriend this user?')) return;
    
    setActionLoading(true)
    const supabase = createClient()
    
    const { error } = await supabase
      .from('friends')
      .delete()
      .or(`and(user_id.eq.${currentUser.id},friend_id.eq.${targetProfile.id}),and(user_id.eq.${targetProfile.id},friend_id.eq.${currentUser.id})`)
      
    if (!error) {
      setFriendStatus(null)
    }
    setActionLoading(false)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#fdfcf8]"><Loader2 className="w-8 h-8 text-[#c96442] animate-spin" /></div>
  }

  if (!targetProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfcf8] font-serif space-y-4">
        <h1 className="text-2xl text-slate-900">Profile Not Found</h1>
        <Link href="/dashboard">
          <Button variant="outline" className="mt-4 rounded-full font-sans">Go to Dashboard</Button>
        </Link>
      </div>
    )
  }

  const isSelf = currentUser?.id === targetProfile.id

  return (
    <div className="min-h-screen bg-[#fdfcf8] font-serif py-12 px-4 relative">
      <div className="absolute top-8 left-8">
        <Button variant="ghost" onClick={() => router.back()} className="inline-flex items-center text-[#c96442] hover:text-[#b05537] font-sans font-medium transition-colors bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-[#c96442]/20">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="max-w-md mx-auto mt-12">
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl text-center">
          <div className="w-32 h-32 bg-slate-100 rounded-full mx-auto flex items-center justify-center mb-6 overflow-hidden border-4 border-white shadow-md">
            {targetProfile.avatar_url ? (
              <img src={targetProfile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-slate-400" />
            )}
          </div>
          <h2 className="text-3xl text-slate-900 mb-2">{targetProfile.full_name || 'Traveler'}</h2>
          <p className="text-slate-500 font-sans mb-8">@{targetProfile.username || targetProfile.id.slice(0, 8)}</p>

          {!isSelf && (
            friendStatus === 'accepted' ? (
              <div className="flex gap-2">
                <div className="flex-1 bg-green-50 text-green-700 font-sans p-4 rounded-2xl border border-green-200 flex items-center justify-center">
                  <Check className="w-5 h-5 mr-2" />
                  Friends
                </div>
                <Button onClick={handleUnfriend} disabled={actionLoading} variant="outline" className="w-14 h-14 rounded-2xl flex-shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200">
                  <UserMinus className="w-5 h-5" />
                </Button>
              </div>
            ) : friendStatus === 'pending' ? (
              <div className="bg-amber-50 text-amber-700 font-sans p-4 rounded-2xl border border-amber-200">
                Friend request pending
              </div>
            ) : (
              <Button onClick={handleAddFriend} disabled={actionLoading} className="w-full rounded-full h-14 font-sans text-lg bg-[#c96442] hover:bg-[#b05537] shadow-md">
                <UserPlus className="w-5 h-5 mr-2" />
                Add Friend
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  )
}
