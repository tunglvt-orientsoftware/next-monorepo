'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Image as ImageIcon } from 'lucide-react'

type DayInfo = {
  day?: number
  title?: string
  description?: string
  activities?: (string | undefined)[]
  imageSearchQuery?: string
}

function TimelineImage({ query }: { query?: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!query) return

    let isMounted = true
    setIsLoading(true)

    fetch(`/api/images?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.url) {
          setImageUrl(data.url)
        }
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [query])

  if (!query) return null

  return (
    <div className="w-full h-48 bg-slate-100 rounded-xl mb-4 overflow-hidden relative flex items-center justify-center">
      {isLoading ? (
        <div className="animate-pulse flex items-center gap-2 text-slate-400">
          <ImageIcon className="w-5 h-5" />
          <span className="text-sm">Finding photo...</span>
        </div>
      ) : imageUrl ? (
        <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
          <img 
            src={imageUrl} 
            alt={query} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
            crossOrigin="anonymous"
          />
        </a>
      ) : (
        <div className="text-slate-400">
          <ImageIcon className="w-8 h-8 opacity-50" />
        </div>
      )}
    </div>
  )
}

export function Timeline({ itinerary }: { itinerary: (DayInfo | undefined)[] }) {
  if (!itinerary || itinerary.length === 0) return null

  return (
    <div className="relative mt-12 w-full max-w-3xl text-left font-sans pl-8 md:pl-12">
      {/* Vertical line - moved to left */}
      <div className="absolute left-[15px] md:left-[23px] top-0 bottom-0 w-0.5 bg-slate-200" />

      <div className="space-y-12">
        {itinerary.map((day, idx) => {
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="relative flex items-start w-full"
            >
              {/* Timeline dot */}
              <div className="absolute left-[-33px] md:left-[-41px] top-6 w-8 h-8 rounded-full bg-[#fdfcf8] border-2 border-[#c96442] shadow-sm flex items-center justify-center z-10">
                <MapPin className="w-4 h-4 text-[#c96442]" />
              </div>

              {/* Content Card */}
              <div className="w-full">
                <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 overflow-hidden group">
                  
                  <TimelineImage query={day?.imageSearchQuery} />

                  <h3 className="font-serif text-2xl text-slate-900 mt-2">
                    <span className="text-[#c96442] mr-2">Day {day?.day}:</span>
                    {day?.title}
                  </h3>
                  <p className="mt-3 text-slate-600 leading-relaxed">
                    {day?.description}
                  </p>
                  
                  {day?.activities && day.activities.length > 0 && (
                    <div className="mt-5 space-y-3 bg-slate-50/50 rounded-xl p-4 border border-slate-100/50">
                      <h4 className="text-sm font-medium text-slate-900 uppercase tracking-wider mb-3">Activities</h4>
                      {day.activities.map((act, i) => (
                        <div key={i} className="flex items-start gap-3 text-slate-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#c96442]/60 mt-2 shrink-0" />
                          <span className="leading-relaxed">{act}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
