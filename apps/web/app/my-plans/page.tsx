'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { MapPin, Calendar, Heart, Loader2, Trash2, Compass, Sparkles } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function MyPlansPage() {
  const [plans, setPlans] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchPlans() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        
      if (data) {
        setPlans(data)
      }
      setIsLoading(false)
    }
    fetchPlans()
  }, [router])

  const handleToggleFavorite = async (e: React.MouseEvent, planId: string, currentFav: boolean) => {
    e.preventDefault()
    e.stopPropagation()

    const supabase = createClient()
    const { error } = await supabase
      .from('plans')
      .update({ is_favorite: !currentFav })
      .eq('id', planId)

    if (!error) {
      setPlans(prev => prev.map(p => p.id === planId ? { ...p, is_favorite: !currentFav } : p))
    }
  }

  const handleDelete = async (e: React.MouseEvent, planId: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!window.confirm('Delete this plan?')) return

    const supabase = createClient()
    const { error } = await supabase.from('plans').delete().eq('id', planId)
    if (!error) {
      setPlans(prev => prev.filter(p => p.id !== planId))
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fdfcf8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#c96442] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fdfcf8] p-4 pt-6 md:p-12 font-serif">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-medium text-slate-900 tracking-tight">
              My Plans
            </h1>
            <p className="text-lg text-slate-600 font-sans max-w-xl">
              Your AI-generated trip itineraries, saved and ready to explore.
            </p>
          </div>
          <Link href="/itinerary" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-[#c96442] hover:bg-[#b05537] text-white rounded-full h-12 px-6 font-sans shadow-md">
              <Sparkles className="w-5 h-5 mr-2" />
              New AI Plan
            </Button>
          </Link>
        </div>

        {plans.length === 0 ? (
          <div className="text-center py-32 bg-white/50 border border-slate-200 rounded-3xl">
            <Compass className="w-16 h-16 text-slate-300 mx-auto mb-6" />
            <p className="text-xl text-slate-500 mb-6">No saved plans yet.</p>
            <Link href="/itinerary">
              <Button variant="outline" className="rounded-full h-12 px-6 border-slate-300">
                Generate your first itinerary
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan, idx) => {
              const dayCount = Array.isArray(plan.itinerary) ? plan.itinerary.length : 0
              const checklistCount = Array.isArray(plan.checklist) ? plan.checklist.length : 0
              const firstDay = dayCount > 0 ? plan.itinerary[0] : null

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={`/my-plans/${plan.id}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full block"
                  >
                    {/* Gradient header */}
                    <div className="h-32 bg-gradient-to-br from-[#c96442]/10 via-[#e0cdc0]/30 to-[#fdfcf8] relative p-5 flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-sans font-medium text-slate-700 shadow-sm flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-[#c96442]" />
                          {dayCount} {dayCount === 1 ? 'Day' : 'Days'}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleToggleFavorite(e, plan.id, plan.is_favorite)}
                            className={`p-1.5 rounded-full transition-all backdrop-blur-sm shadow-sm ${
                              plan.is_favorite 
                                ? 'bg-red-50 text-red-500' 
                                : 'bg-white/90 text-slate-400 hover:text-red-500'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${plan.is_favorite ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, plan.id)}
                            className="p-1.5 rounded-full bg-white/90 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all backdrop-blur-sm shadow-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {checklistCount > 0 && (
                        <div className="text-xs font-sans text-slate-500 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1 self-start shadow-sm">
                          {checklistCount} checklist items
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="font-serif text-xl text-slate-900 mb-2 line-clamp-2 group-hover:text-[#c96442] transition-colors">
                        {plan.title || 'Untitled Plan'}
                      </h3>
                      
                      {plan.prompt && (
                        <p className="font-sans text-slate-500 text-sm line-clamp-2 mb-4 italic">
                          "{plan.prompt}"
                        </p>
                      )}

                      {firstDay && (
                        <p className="font-sans text-slate-600 text-sm line-clamp-2 mb-4 flex-grow">
                          {firstDay.description}
                        </p>
                      )}
                      
                      <div className="flex items-center text-slate-400 text-xs font-sans mt-auto pt-3 border-t border-slate-100">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                        {new Date(plan.created_at).toLocaleDateString(undefined, { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
