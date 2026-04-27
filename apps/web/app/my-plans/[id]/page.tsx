'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTripStore } from '@/lib/store'
import { ArrowLeft, Heart, Trash2, Loader2, MapPin, Check, PenLine } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Checkbox } from '@workspace/ui/components/checkbox'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function PlanDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [plan, setPlan] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({})
  const { setTripTitle, setTripStory, addMilestones, resetTrip } = useTripStore()

  useEffect(() => {
    async function fetchPlan() {
      if (!params?.id) return

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error || !data) {
        router.push('/my-plans')
        return
      }

      setPlan(data)
      setIsLoading(false)
    }
    fetchPlan()
  }, [params, router])

  const handleToggleFavorite = async () => {
    if (!plan) return
    const supabase = createClient()
    const { error } = await supabase
      .from('plans')
      .update({ is_favorite: !plan.is_favorite })
      .eq('id', plan.id)

    if (!error) {
      setPlan((p: any) => ({ ...p, is_favorite: !p.is_favorite }))
    }
  }

  const handleDelete = async () => {
    if (!plan || !window.confirm('Delete this plan permanently?')) return
    const supabase = createClient()
    const { error } = await supabase.from('plans').delete().eq('id', plan.id)
    if (!error) {
      router.push('/my-plans')
    }
  }

  const handleConvertToTrip = () => {
    if (!plan?.itinerary) return

    resetTrip()

    const milestones = plan.itinerary.map((day: any) => ({
      id: crypto.randomUUID(),
      title: `Day ${day.day || ''}: ${day.title || ''}`,
      content: `${day.description || ''}\n\nActivities:\n${(day.activities || []).map((a: string) => `- ${a}`).join('\n')}`,
      images: [],
    }))

    setTripTitle(plan.title || 'My Trip Plan')
    setTripStory(`Generated from AI plan: "${plan.prompt || ''}"`)
    addMilestones(milestones)

    // Use a small delay so store is populated before navigation
    setTimeout(() => {
      router.push('/memory?fromPlan=true')
    }, 100)
  }

  const toggleCheck = (index: number) => {
    setCheckedItems(prev => ({ ...prev, [index]: !prev[index] }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fdfcf8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#c96442] animate-spin" />
      </div>
    )
  }

  if (!plan) return null

  const itinerary = Array.isArray(plan.itinerary) ? plan.itinerary : []
  const checklist = Array.isArray(plan.checklist) ? plan.checklist : []

  return (
    <div className="min-h-screen bg-[#fdfcf8] font-serif pb-24 md:pb-12">
      {/* Hero header */}
      <div className="bg-gradient-to-br from-[#c96442]/10 via-[#e0cdc0]/20 to-[#fdfcf8] pt-6 pb-16 md:pt-8 md:pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Top actions */}
          <div className="flex items-center justify-between mb-8">
            <Link 
              href="/my-plans" 
              className="inline-flex items-center text-[#c96442] hover:text-[#b05537] font-sans font-medium transition-colors bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-[#c96442]/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              My Plans
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleFavorite}
                className={`inline-flex items-center font-sans font-medium transition-colors bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border cursor-pointer ${
                  plan.is_favorite 
                    ? 'text-red-500 border-red-500/20' 
                    : 'text-slate-600 border-slate-200 hover:text-red-500 hover:border-red-500/20'
                }`}
              >
                <Heart className={`w-4 h-4 mr-1.5 ${plan.is_favorite ? 'fill-current' : ''}`} />
                <span className="text-sm">{plan.is_favorite ? 'Favorited' : 'Favorite'}</span>
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center text-red-500 hover:text-white hover:bg-red-500 font-sans font-medium transition-colors bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm border border-red-500/20 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Plan title & meta */}
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-medium text-slate-900 tracking-tight leading-tight">
              {plan.title}
            </h1>
            {plan.prompt && (
              <p className="text-base md:text-lg text-slate-500 font-sans italic">
                "{plan.prompt}"
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm font-sans text-slate-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#c96442]" />
                {itinerary.length} {itinerary.length === 1 ? 'day' : 'days'}
              </span>
              {checklist.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#c96442]" />
                  {checklist.length} checklist items
                </span>
              )}
              <span>
                {new Date(plan.created_at).toLocaleDateString(undefined, { 
                  year: 'numeric', month: 'long', day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8 space-y-10 relative z-10">
        {/* Convert to Trip button */}
        <div className="flex justify-center">
          <Button
            onClick={handleConvertToTrip}
            className="bg-[#c96442] hover:bg-[#b05537] text-white rounded-full px-8 h-12 font-sans shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            <PenLine className="w-5 h-5 mr-2" />
            Convert to Trip Story
          </Button>
        </div>

        {/* Itinerary Timeline */}
        {itinerary.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100">
              <h2 className="text-2xl font-medium text-slate-900">Itinerary</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {itinerary.map((day: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  className="p-6 md:p-8 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#c96442]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-[#c96442] font-sans">{day.day}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-medium text-slate-900 mb-2">{day.title}</h3>
                      <p className="text-slate-600 font-sans text-sm leading-relaxed mb-4">{day.description}</p>
                      
                      {day.activities && day.activities.length > 0 && (
                        <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
                          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-sans">Activities</h4>
                          {day.activities.map((act: string, i: number) => (
                            <div key={i} className="flex items-start gap-2.5 text-sm text-slate-700 font-sans">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#c96442]/50 mt-1.5 shrink-0" />
                              <span className="leading-relaxed">{act}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Checklist */}
        {checklist.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100">
              <h2 className="text-2xl font-medium text-slate-900 flex items-center gap-2">
                <span className="text-[#c96442]">✓</span> Trip Checklist
              </h2>
            </div>
            <div className="p-6 md:p-8">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {checklist.map((item: string, index: number) => (
                  <li
                    key={index}
                    className={`flex items-start gap-3 transition-colors cursor-pointer select-none font-sans text-sm ${
                      checkedItems[index] ? 'text-slate-400 line-through' : 'text-slate-700'
                    }`}
                    onClick={() => toggleCheck(index)}
                  >
                    <Checkbox
                      checked={checkedItems[index] || false}
                      className="mt-0.5 border-[#c96442]/40 data-[state=checked]:bg-[#c96442] data-[state=checked]:border-[#c96442] cursor-pointer"
                    />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
