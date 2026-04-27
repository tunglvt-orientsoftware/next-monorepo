'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Map, Camera, ArrowRight, PlaneTakeoff, Sparkles, User, Menu, X, ChevronRight } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { createClient } from '@/lib/supabase/client'

export default function LandingPage() {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#fdfcf8] selection:bg-[#c96442]/20 font-sans relative overflow-x-hidden">
      {/* Background ambient blurs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] max-w-[1000px] h-[600px] bg-gradient-to-b from-[#f5e6d3] to-transparent rounded-full blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute top-40 -right-64 w-[600px] h-[600px] bg-[#e8cdb5] rounded-full blur-[120px] opacity-30 pointer-events-none hidden md:block" />
      <div className="absolute -bottom-64 -left-64 w-[800px] h-[800px] bg-orange-100/40 rounded-full blur-[100px] opacity-50 pointer-events-none" />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#fdfcf8]/90 backdrop-blur-xl border-b border-[#c96442]/10 shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group z-50 hover:opacity-90 transition-opacity">
            <Image src="/logo.png" alt="WanderLog Logo" width={32} height={32} className="object-contain" />
            <span className="font-serif text-2xl font-semibold tracking-tight text-slate-900 group-hover:text-[#c96442] transition-colors">
              WanderLog
            </span>
          </Link>
          
          {/* Desktop Nav Actions */}
          <div className="hidden md:flex items-center gap-4">
            {!loadingUser && userProfile ? (
              <Link href="/dashboard">
                <Button variant="ghost" className="font-medium text-slate-700 hover:text-[#c96442] hover:bg-[#c96442]/5 flex items-center gap-2 rounded-full px-5 py-2 border border-slate-200/60 shadow-sm bg-white/50 backdrop-blur-md transition-all">
                  <div className="w-6 h-6 bg-slate-100 rounded-full overflow-hidden flex items-center justify-center border border-slate-200">
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
                  <Button variant="ghost" className="font-medium text-slate-600 hover:text-[#c96442] hover:bg-transparent text-base">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-[#c96442] hover:bg-[#b05537] text-white rounded-full px-7 h-11 text-base shadow-[0_8px_20px_rgba(201,100,66,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(201,100,66,0.3)]">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
               <div className="w-24 h-10 bg-slate-200/50 animate-pulse rounded-full" />
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center z-50">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -mr-2 text-slate-600 hover:text-[#c96442] transition-colors focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#fdfcf8]/95 backdrop-blur-2xl pt-24 px-6 md:hidden flex flex-col"
          >
            <div className="flex flex-col gap-4 mt-8">
              {!loadingUser && userProfile ? (
                <>
                  <div className="flex items-center gap-4 mb-8 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 bg-slate-100 rounded-full overflow-hidden flex items-center justify-center border border-slate-200">
                      {userProfile.avatar_url ? (
                        <Image src={userProfile.avatar_url} alt="Avatar" className="w-full h-full object-cover" width={100} height={100} unoptimized />
                      ) : (
                        <User className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-serif text-lg font-medium text-slate-900">{userProfile.full_name}</div>
                      <div className="font-sans text-sm text-slate-500">Welcome back</div>
                    </div>
                  </div>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-[#c96442] hover:bg-[#b05537] text-white rounded-2xl h-14 text-lg shadow-md justify-between px-6">
                      Go to Dashboard <ChevronRight className="w-5 h-5 opacity-70" />
                    </Button>
                  </Link>
                  <Link href="/memory" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full rounded-2xl h-14 text-lg border-slate-200 text-slate-700 justify-between px-6 bg-white">
                      Create Story <Camera className="w-5 h-5 opacity-70" />
                    </Button>
                  </Link>
                </>
              ) : !loadingUser ? (
                <>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-[#c96442] hover:bg-[#b05537] text-white rounded-2xl h-14 text-lg shadow-md">
                      Get Started for Free
                    </Button>
                  </Link>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full rounded-2xl h-14 text-lg border-slate-200 text-slate-700 bg-white">
                      Log in to your account
                    </Button>
                  </Link>
                </>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <main className="pt-32 md:pt-40 pb-24 px-6 relative z-10 min-h-[90vh] flex flex-col justify-center">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-4xl mx-auto space-y-8 md:space-y-10"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-[#c96442]/20 text-[#c96442] text-sm md:text-base font-medium shadow-[0_4px_15px_rgba(201,100,66,0.08)]"
            >
              <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
              <span>The future of travel planning is here</span>
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-serif text-slate-900 tracking-tight leading-[1.05]">
              Craft Your Next <br className="hidden sm:block" />
              <span className="relative inline-block mt-2 sm:mt-0">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#c96442] to-[#e88d72] italic pr-4">Journey with AI</span>
                <span className="absolute bottom-2 md:bottom-4 left-0 w-full h-4 md:h-6 bg-[#c96442]/10 -rotate-2 z-0 rounded-full" />
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-600/90 leading-relaxed max-w-3xl mx-auto font-light">
              Transform your travel dreams into perfectly planned itineraries, and turn your raw photos into beautiful, shareable memory canvases in seconds.
            </p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
            >
              <Link href={userProfile ? "/itinerary" : "/signup"} className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-[#c96442] hover:bg-[#b05537] text-white rounded-full px-8 h-14 sm:h-16 text-lg shadow-[0_8px_25px_rgba(201,100,66,0.25)] transition-all hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(201,100,66,0.3)] group">
                  Start Planning
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href={userProfile ? "/memory" : "/signup"} className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto rounded-full px-8 h-14 sm:h-16 text-lg border-slate-300 text-slate-700 bg-white/50 backdrop-blur-sm hover:bg-white transition-all hover:-translate-y-1 hover:shadow-lg">
                  <Camera className="mr-2 w-5 h-5 text-slate-500" />
                  Create a Memory
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mt-24 md:mt-32 relative z-20">
            {/* Feature 1: Itinerary */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href="/itinerary" className="block group h-full focus:outline-none">
                <div className="bg-white/70 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 group-hover:shadow-[0_20px_40px_rgba(201,100,66,0.1)] group-hover:-translate-y-2 group-hover:border-[#c96442]/20 transition-all duration-500 h-full flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#c96442]/10 to-transparent rounded-bl-[100px] -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-150" />
                  
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-white to-orange-50 border border-[#c96442]/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm relative z-10">
                    <Map className="w-8 h-8 text-[#c96442]" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4 relative z-10 tracking-tight">Smart Itineraries</h2>
                  <p className="text-slate-600 md:text-lg leading-relaxed mb-10 flex-grow relative z-10 font-light">
                    Tell us where you want to go. Our AI instantly generates a vertical timeline of activities, hidden gems, and local secrets tailored exactly to your preferences.
                  </p>
                  <div className="flex items-center text-[#c96442] font-medium mt-auto relative z-10 text-lg">
                    Plan a trip <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-3 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Feature 2: Memory Canvas */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href="/memory" className="block group h-full focus:outline-none">
                <div className="bg-white/70 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 group-hover:shadow-[0_20px_40px_rgba(201,100,66,0.1)] group-hover:-translate-y-2 group-hover:border-[#c96442]/20 transition-all duration-500 h-full flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#c96442]/10 to-transparent rounded-bl-[100px] -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-150" />
                  
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-white to-orange-50 border border-[#c96442]/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm relative z-10">
                    <Camera className="w-8 h-8 text-[#c96442]" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4 relative z-10 tracking-tight">Memory Canvas</h2>
                  <p className="text-slate-600 md:text-lg leading-relaxed mb-10 flex-grow relative z-10 font-light">
                    Upload photos from your journey. We'll help you craft beautiful, interactive scrapbook layouts ready to be shared with friends and the world.
                  </p>
                  <div className="flex items-center text-[#c96442] font-medium mt-auto relative z-10 text-lg">
                    Create a memory <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-3 transition-transform duration-300" />
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
