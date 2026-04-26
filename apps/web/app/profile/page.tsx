'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { User, Copy, Users, LogOut, Check, ArrowLeft } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import Link from 'next/link'

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [origin, setOrigin] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!data) {
        // If profile doesn't exist, trigger might not have run. Create manually.
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert({ id: user.id, full_name: user.user_metadata?.full_name || 'Traveler' })
          .select()
          .single()
        
        if (newProfile) data = newProfile
      }
      
      // If profile exists but invite_code is missing/null, generate one and update
      if (data && !data.invite_code) {
        const newCode = Math.random().toString(36).substring(2, 10)
        const { data: updatedProfile } = await supabase
          .from('profiles')
          .update({ invite_code: newCode })
          .eq('id', user.id)
          .select()
          .single()
          
        if (updatedProfile) data = updatedProfile
      }
      
      setProfile(data)
      setLoading(false)
    }
    loadProfile()
    setOrigin(window.location.origin)
  }, [router])

  const copyInviteLink = () => {
    if (!profile) return
    const inviteUrl = `${window.location.origin}/invite/${profile.invite_code}`
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#fdfcf8]"><div className="w-8 h-8 border-4 border-[#c96442] border-t-transparent rounded-full animate-spin" /></div>
  }

  const inviteUrl = origin && profile?.invite_code ? `${origin}/invite/${profile.invite_code}` : ''

  return (
    <div className="min-h-screen bg-[#fdfcf8] font-serif py-12 px-4 relative">
      <Link href="/my-memories" className="absolute top-4 left-4 md:top-8 md:left-8 inline-flex items-center text-[#c96442] hover:text-[#b05537] font-sans font-medium transition-colors bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-[#c96442]/20">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Link>
          
      <div className="max-w-md mx-auto space-y-8 mt-16 md:mt-12">
        <h1 className="text-4xl text-slate-900 font-medium text-center">Your Profile</h1>
        
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
          <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto flex items-center justify-center mb-4 overflow-hidden border border-slate-200">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-slate-400" />
            )}
          </div>
          <h2 className="text-2xl text-slate-900 mb-1">{profile?.full_name || 'Traveler'}</h2>
          <p className="text-slate-500 font-sans text-sm mb-6">@{profile?.username || profile?.id?.slice(0, 8)}</p>
          
          <Button onClick={handleSignOut} variant="outline" className="rounded-full font-sans">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-2xl text-slate-900 text-center flex items-center justify-center gap-2">
            <Users className="w-6 h-6 text-[#c96442]" />
            Add Friends
          </h3>
          <p className="text-slate-600 font-sans text-center text-sm">
            Share this QR code or invite link to let others see your trip stories.
          </p>

          <div className="flex justify-center py-4">
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
              {inviteUrl ? (
                <QRCodeSVG value={inviteUrl} size={180} fgColor="#0f172a" />
              ) : (
                <div className="w-[180px] h-[180px] bg-slate-100 flex items-center justify-center rounded-xl text-slate-400 text-sm">No code</div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-grow bg-slate-50 border border-slate-200 p-3 rounded-xl font-sans text-sm text-slate-500 truncate select-all">
              {inviteUrl}
            </div>
            <Button onClick={copyInviteLink} className="bg-[#c96442] hover:bg-[#b05537] text-white rounded-xl h-full p-3 shadow-sm">
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
