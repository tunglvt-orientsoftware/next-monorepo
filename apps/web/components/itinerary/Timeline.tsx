'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Image as ImageIcon, X, ZoomIn } from 'lucide-react'

type DayInfo = {
  day?: number
  title?: string
  description?: string
  activities?: (string | undefined)[]
  imageSearchQuery?: string
}

function TimelineImage({ query, onImageClick }: { query?: string; onImageClick: (url: string, alt: string) => void }) {
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!query) return

    let isMounted = true
    setIsLoading(true)

    fetch(`/api/images?q=${encodeURIComponent(query)}&count=3`)
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          if (data.urls && data.urls.length > 0) {
            setImageUrls(data.urls)
          } else if (data.url) {
            setImageUrls([data.url])
          }
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
    <div className="w-full mb-4">
      {isLoading ? (
        <div className="w-full h-48 bg-slate-100 rounded-xl overflow-hidden relative flex items-center justify-center">
          <div className="animate-pulse flex items-center gap-2 text-slate-400">
            <ImageIcon className="w-5 h-5" />
            <span className="text-sm">Finding photo...</span>
          </div>
        </div>
      ) : imageUrls.length > 0 ? (
        <div className={`grid gap-2 ${imageUrls.length === 1 ? 'grid-cols-1' : imageUrls.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {imageUrls.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onImageClick(url, query)}
              className={`block relative cursor-zoom-in rounded-xl overflow-hidden group ${imageUrls.length === 1 ? 'w-full h-48' : imageUrls.length === 2 ? 'w-full h-40' : i === 0 ? 'col-span-2 row-span-2 h-64' : 'w-full h-[124px]'}`}
            >
              <Image
                src={url}
                alt={`${query} ${i + 1}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
                crossOrigin="anonymous"
                width={800} height={800} unoptimized={typeof url === 'string' && (url.startsWith('blob:') || url.startsWith('data:'))} />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg">
                  <ZoomIn className="w-5 h-5 text-slate-700" />
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="w-full h-48 bg-slate-100 rounded-xl overflow-hidden relative flex items-center justify-center">
          <div className="text-slate-400">
            <ImageIcon className="w-8 h-8 opacity-50" />
          </div>
        </div>
      )}
    </div>
  )
}

// ──────────────────────────────────────────
// Lightbox Component
// ──────────────────────────────────────────
function ImageLightbox({ url, alt, onClose }: { url: string; alt: string; onClose: () => void }) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8 cursor-pointer"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2.5 rounded-full transition-colors border border-white/10"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Image */}
      <motion.img
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        src={url}
        alt={alt}
        crossOrigin="anonymous"
        className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl cursor-default"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Caption */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm font-sans bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {alt}
      </motion.p>
    </motion.div>
  )
}

export function Timeline({ itinerary }: { itinerary: (DayInfo | undefined)[] }) {
  const [lightbox, setLightbox] = useState<{ url: string; alt: string } | null>(null)

  const handleImageClick = useCallback((url: string, alt: string) => {
    setLightbox({ url, alt })
  }, [])

  const closeLightbox = useCallback(() => {
    setLightbox(null)
  }, [])

  if (!itinerary || itinerary.length === 0) return null

  return (
    <>
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

                    <TimelineImage query={day?.imageSearchQuery} onImageClick={handleImageClick} />

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

      {/* Lightbox overlay */}
      <AnimatePresence>
        {lightbox && (
          <ImageLightbox
            url={lightbox.url}
            alt={lightbox.alt}
            onClose={closeLightbox}
          />
        )}
      </AnimatePresence>
    </>
  )
}
