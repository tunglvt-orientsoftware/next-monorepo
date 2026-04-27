'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Map, Camera, ArrowRight, PlaneTakeoff, Sparkles, User } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { createClient } from '@/lib/supabase/client'

export default function LandingPage() {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loadingUser, setLoadingUser] = useState(true)

  useEffect(() => {
    async function getUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setUserProfile(profile || { full_name: user.user_metadata?.full_name || 'Traveler', id: user.id })
      }
      setLoadingUser(false)
    }
    getUser()
  }, [])

  return (
    <div className="min-h-screen bg-[#fdfcf8] selection:bg-[#c96442]/20 font-sans relative overflow-hidden">
      {/* Background ambient blurs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#f5e6d3] rounded-full blur-[120px] opacity-50 pointer-events-none" />
      <div className="absolute -bottom-64 -right-64 w-[600px] h-[600px] bg-[#e8cdb5] rounded-full blur-[100px] opacity-30 pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#fdfcf8]/80 backdrop-blur-xl border-b border-[#c96442]/5 transition-all">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-[#c96442]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <PlaneTakeoff className="h-5 w-5 text-[#c96442]" />
            </div>
            <span className="font-serif text-xl font-medium tracking-tight text-slate-900">
              Travel AI
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {!loadingUser && userProfile ? (
              <Link href="/dashboard">
                <Button variant="ghost" className="font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 flex items-center gap-2 rounded-full px-4 py-2 border border-slate-200">
                  <div className="w-6 h-6 bg-slate-100 rounded-full overflow-hidden flex items-center justify-center">
                    {userProfile.avatar_url ? (
                      <Image src={userProfile.avatar_url} alt="Avatar" className="w-full h-full object-cover" width={1200} height={1200} unoptimized={typeof userProfile.avatar_url === 'string' && (userProfile.avatar_url.startsWith('blob:') || userProfile.avatar_url.startsWith('data:'))} />
                    ) : (
                      <User className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <span>{userProfile.full_name?.split(' ')[0] || 'Dashboard'}</span>
                </Button>
              </Link>
            ) : !loadingUser ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/50">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-[#c96442] hover:bg-[#b05537] text-white rounded-full px-6 shadow-md shadow-[#c96442]/20 transition-all hover:shadow-lg hover:-translate-y-0.5">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
               <div className="w-24 h-10 bg-slate-100 animate-pulse rounded-full" />
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-4xl mx-auto mt-16 md:mt-24 space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#c96442]/20 text-[#c96442] text-sm font-medium mb-4 shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>The future of travel planning</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif text-slate-900 tracking-tight leading-[1.1]">
              Craft Your Next <br/>
              <span className="relative">
                <span className="relative z-10 text-[#c96442] italic">Journey with AI</span>
                <span className="absolute bottom-2 left-0 w-full h-4 bg-[#c96442]/10 -rotate-2 z-0" />
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-light">
              Transform your travel dreams into perfectly planned itineraries, and turn your raw photos into beautiful, shareable memory canvases in seconds.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 mt-24">
            {/* Feature 1: Itinerary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href="/itinerary" className="block group h-full">
                <div className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-sm border border-slate-200 group-hover:shadow-2xl group-hover:-translate-y-1 group-hover:border-[#c96442]/30 transition-all duration-500 h-full flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#c96442]/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                  
                  <div className="w-16 h-16 rounded-2xl bg-[#fdfcf8] border border-[#c96442]/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm relative z-10">
                    <Map className="w-8 h-8 text-[#c96442]" />
                  </div>
                  <h2 className="text-3xl font-serif text-slate-900 mb-4 relative z-10">Smart Itineraries</h2>
                  <p className="text-slate-600 leading-relaxed mb-8 flex-grow relative z-10">
                    Tell us where you want to go. Our AI instantly generates a vertical timeline of activities, hidden gems, and local secrets tailored just for you.
                  </p>
                  <div className="flex items-center text-[#c96442] font-medium mt-auto relative z-10">
                    Try it out <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Feature 2: Memory Canvas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href="/memory" className="block group h-full">
                <div className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-sm border border-slate-200 group-hover:shadow-2xl group-hover:-translate-y-1 group-hover:border-[#c96442]/30 transition-all duration-500 h-full flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#c96442]/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                  
                  <div className="w-16 h-16 rounded-2xl bg-[#fdfcf8] border border-[#c96442]/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm relative z-10">
                    <Camera className="w-8 h-8 text-[#c96442]" />
                  </div>
                  <h2 className="text-3xl font-serif text-slate-900 mb-4 relative z-10">Memory Canvas</h2>
                  <p className="text-slate-600 leading-relaxed mb-8 flex-grow relative z-10">
                    Upload a photo from your journey. We'll analyze the scene and help you craft a beautiful Polaroid-style layout ready to be shared with the world.
                  </p>
                  <div className="flex items-center text-[#c96442] font-medium mt-auto relative z-10">
                    Create a memory <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
