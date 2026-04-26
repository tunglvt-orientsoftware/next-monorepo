'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { User, Copy, Users, LogOut, Check, MapPin, Compass, Settings, Edit3, Camera } from 'lucide-react'
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

      const avatarFromAuth = user.user_metadata?.avatar_url || user.user_metadata?.picture || null
      const nameFromAuth = user.user_metadata?.full_name || user.user_metadata?.name || 'Traveler'

      if (!data) {
        // If profile doesn't exist, trigger might not have run. Create manually.
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert({ 
            id: user.id, 
            full_name: nameFromAuth,
            avatar_url: avatarFromAuth 
          })
          .select()
          .single()
        
        if (newProfile) data = newProfile
      } else {
        // Retroactively sync data from Google if missing in DB
        let needsUpdate = false
        let updateData: any = {}
        
        if (!data.avatar_url && avatarFromAuth) {
          updateData.avatar_url = avatarFromAuth
          needsUpdate = true
        }
        
        if (data.full_name === 'Traveler' && nameFromAuth !== 'Traveler') {
          updateData.full_name = nameFromAuth
          needsUpdate = true
        }
        
        if (needsUpdate) {
          const { data: updatedSync } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', user.id)
            .select()
            .single()
            
          if (updatedSync) data = updatedSync
        }
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

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#fdfcf8]"><div className="w-8 h-8 border-4 border-[#c96442] border-t-transparent rounded-full animate-spin" /></div>
  }

  const inviteUrl = origin && profile?.invite_code ? `${origin}/invite/${profile.invite_code}` : ''

  return (
    <div className="min-h-screen bg-[#fdfcf8] font-serif pb-24 md:pb-12">
      {/* Cover Photo Area */}
      <div className="h-64 md:h-80 w-full relative overflow-hidden bg-gradient-to-br from-[#e0cdc0] to-[#c96442]/20">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,#c96442_1px,transparent_0)] bg-[length:24px_24px]"></div>
        
        {/* Top actions */}
        <div className="absolute top-4 md:top-8 left-4 right-4 md:left-8 md:right-8 flex justify-between items-center z-10">
          <Link href="/my-memories" className="inline-flex items-center text-slate-800 hover:text-slate-900 font-sans font-medium transition-colors bg-white/70 hover:bg-white backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
            <Compass className="w-4 h-4 mr-2" />
            Home
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        
        {/* Main Profile Card */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-200/40 border border-white/60 backdrop-blur-xl mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left relative">
            
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white p-2 rounded-full shadow-lg shadow-slate-200/50 flex-shrink-0 -mt-16 md:-mt-20 border-2 border-[#fdfcf8]">
                <div className="w-full h-full rounded-full bg-slate-100 overflow-hidden flex items-center justify-center relative">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-slate-300" />
                  )}
                </div>
              </div>
              <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md text-slate-600 hover:text-[#c96442] border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-2 mt-2 w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl text-slate-900 font-medium tracking-tight mb-1">
                    {profile?.full_name || 'Traveler'}
                  </h1>
                  <p className="text-slate-500 font-sans text-base">
                    @{profile?.username || profile?.id?.slice(0, 8)}
                  </p>
                </div>
                
                <Button variant="outline" className="rounded-full font-sans gap-2 mx-auto md:mx-0 shrink-0">
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </Button>
              </div>

              {profile?.bio && (
                <p className="text-slate-600 font-sans text-sm md:text-base leading-relaxed max-w-lg pt-2">
                  {profile.bio}
                </p>
              )}
              
              <div className="flex items-center justify-center md:justify-start gap-4 pt-4 font-sans text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#c96442]" />
                  Global Citizen
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Stats / Info Sidebar */}
          <div className="space-y-6 md:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60">
              <h3 className="font-sans font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4 text-slate-400" />
                Account Settings
              </h3>
              <ul className="space-y-3 font-sans text-sm">
                <li>
                  <button className="text-slate-600 hover:text-[#c96442] transition-colors flex items-center justify-between w-full">
                    Personal Information
                  </button>
                </li>
                <li>
                  <button className="text-slate-600 hover:text-[#c96442] transition-colors flex items-center justify-between w-full">
                    Privacy & Safety
                  </button>
                </li>
                <li>
                  <button className="text-slate-600 hover:text-[#c96442] transition-colors flex items-center justify-between w-full">
                    Notifications
                  </button>
                </li>
              </ul>
            </div>
            
            <Button onClick={handleLogout} variant="outline" className="w-full rounded-2xl font-sans text-red-600 hover:text-white hover:bg-red-500 hover:border-red-500 border-red-100 h-12 transition-all">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Connect Card */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm md:col-span-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <Users className="w-32 h-32" />
            </div>
            
            <h3 className="text-2xl text-slate-900 mb-2 font-medium flex items-center gap-2">
              <Users className="w-6 h-6 text-[#c96442]" />
              Share Your Journey
            </h3>
            <p className="text-slate-500 font-sans text-sm mb-8 max-w-md">
              Let friends scan your QR code or share your unique invite link to give them access to your travel stories and memories.
            </p>

            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex-shrink-0">
                {inviteUrl ? (
                  <QRCodeSVG value={inviteUrl} size={140} fgColor="#0f172a" />
                ) : (
                  <div className="w-[140px] h-[140px] bg-slate-50 flex items-center justify-center rounded-xl text-slate-400 text-sm">No code</div>
                )}
              </div>
              
              <div className="flex-1 min-w-0 w-full space-y-4">
                <div>
                  <label className="block text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider mb-2">Your Invite Link</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-grow min-w-0 bg-slate-50 border border-slate-200 p-3.5 rounded-xl font-sans text-sm text-slate-600 break-all select-all">
                      {inviteUrl}
                    </div>
                    <Button onClick={copyInviteLink} className="bg-[#c96442] hover:bg-[#b05537] text-white rounded-xl h-[50px] w-[50px] p-0 shadow-sm flex-shrink-0">
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
                
                <div className="pt-2">
                  <p className="text-xs text-slate-400 font-sans">
                    Anyone with this link will be able to send you a friend request.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
