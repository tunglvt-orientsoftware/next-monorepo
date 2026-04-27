'use client'

import { TimelineEditor } from '@/components/memory/TimelineEditor'
import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTripStore } from '@/lib/store'

function MemoryContent() {
  const resetTrip = useTripStore(state => state.resetTrip)
  const milestones = useTripStore(state => state.milestones)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Don't reset if coming from plan conversion (store already has data)
    const fromPlan = searchParams.get('fromPlan')
    if (!fromPlan || milestones.length === 0) {
      resetTrip()
    }
  }, [resetTrip, searchParams, milestones.length])

  return (
    <div className="flex min-h-screen flex-col items-center py-16 bg-[#f5f4ed] p-4 font-serif">
      <div className="w-full max-w-6xl space-y-12">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl font-medium text-slate-900 tracking-tight">
            Craft Your Trip Story
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-sans max-w-2xl mx-auto">
            Upload multiple photos from your journey. Drag and drop to organize them into a beautiful, interactive story timeline.
          </p>
        </div>

        <TimelineEditor />
      </div>
    </div>
  )
}

export default function MemoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f5f4ed] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#c96442] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <MemoryContent />
    </Suspense>
  )
}
