'use client'

import { TimelineEditor } from '@/components/memory/TimelineEditor'
import { useEffect } from 'react'
import { useTripStore } from '@/lib/store'

export default function MemoryPage() {
  const resetTrip = useTripStore(state => state.resetTrip)

  useEffect(() => {
    resetTrip()
  }, [resetTrip])

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
