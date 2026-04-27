'use client'

import Image from 'next/image'
import { MapPin, ArrowLeft, Camera, Navigation, X, Trash2, Heart } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ImageLightbox } from '../../shared/ImageLightbox'
import { MediaGalleryGrid } from '../../shared/MediaGalleryGrid'

interface ThemeProps {
  trip: any;
  isOwner: boolean;
  hasLiked: boolean;
  likesCount: number;
  handleToggleLike: () => void;
  handleDelete: () => void;
  selectedImage: string | null;
  setSelectedImage: (img: string | null) => void;
}

export function MagazineTheme({ trip, isOwner, hasLiked, likesCount, handleToggleLike, handleDelete, selectedImage, setSelectedImage }: ThemeProps) {
  const totalMilestones = trip.milestones?.length || 0
  const totalPhotos = trip.milestones?.reduce((acc: number, m: any) => acc + (m.images?.length || 0), 0) || 0
  const coverImage = trip.cover_image || trip.milestones?.find((m: any) => m.images && m.images.length > 0)?.images[0]

  return (
    <div className="min-h-screen bg-white py-12 font-sans relative">
      
      {/* Lightbox Overlay for Cover Image */}
      <ImageLightbox 
        images={selectedImage ? [selectedImage] : []}
        initialIndex={0}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-16 relative z-20 pb-6 border-b border-slate-100">
          <Link href="/my-memories" className="inline-flex items-center text-slate-900 hover:text-slate-500 font-sans uppercase tracking-widest text-xs font-semibold transition-colors whitespace-nowrap">
            <ArrowLeft className="w-4 h-4 mr-1.5 sm:mr-3" />
            <span className="hidden sm:inline">My Memories</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <button 
              onClick={handleToggleLike}
              className={`inline-flex items-center font-sans uppercase tracking-widest text-xs font-semibold transition-colors whitespace-nowrap ${hasLiked ? 'text-[#c96442]' : 'text-slate-900 hover:text-[#c96442]'}`}
            >
              <Heart className={`w-4 h-4 mr-1.5 sm:mr-2 ${hasLiked ? 'fill-current' : ''}`} />
              {likesCount} <span className="hidden sm:inline sm:ml-1">{likesCount === 1 ? 'Like' : 'Likes'}</span>
            </button>
            {isOwner && (
              <>
                <Link 
                  href={`/trip/${trip.id}/edit`}
                  className="inline-flex items-center text-slate-900 hover:text-slate-500 font-sans uppercase tracking-widest text-xs font-semibold transition-colors sm:mr-4 whitespace-nowrap"
                >
                  Edit
                </Link>
                <button 
                  onClick={handleDelete}
                  className="inline-flex items-center text-red-600 hover:text-red-400 font-sans uppercase tracking-widest text-xs font-semibold transition-colors whitespace-nowrap"
                >
                  <Trash2 className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-32 items-center">
          <div className="lg:col-span-5 space-y-8">
            <div className="text-slate-400 font-sans uppercase tracking-widest text-xs font-semibold">
              Vol. {totalMilestones} / {new Date(trip.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-8xl font-serif text-slate-900 leading-[0.9] tracking-tight"
            >
              {trip.title || 'Untitled'}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-slate-600 font-sans leading-relaxed"
            >
              {trip.story}
            </motion.p>
          </div>
          
          {coverImage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 h-[60vh] md:h-[80vh] w-full"
            >
              <Image 
                src={coverImage.split('|')[0]} 
                alt={trip.title} 
                onClick={() => setSelectedImage(coverImage)}
                className="w-full h-full object-cover grayscale-[20%] contrast-125 cursor-zoom-in"
              width={1200} height={1200} unoptimized={typeof coverImage === 'string' && (coverImage.startsWith('blob:') || coverImage.startsWith('data:'))} />
            </motion.div>
          )}
        </div>

        {/* Milestones / Editorial Layout */}
        <div className="space-y-32 md:space-y-48 pb-32">
          {trip.milestones.map((milestone: any, i: number) => {
            const hasImages = milestone.images && milestone.images.length > 0;
            const layoutType = i % 3;
            
            // Parse "Day X: Title" if it exists
            const titleMatch = milestone.title?.match(/^Day\s+(\d+)[:\-]?\s*(.*)/i);
            const displayDay = titleMatch ? titleMatch[1].padStart(2, '0') : (i + 1).toString().padStart(2, '0');
            const displayTitle = titleMatch && titleMatch[2] ? titleMatch[2] : (milestone.title || 'Location');
            
            // Layout 2: Center Feature (Full width header, image below)
            if (layoutType === 2) {
              return (
                <motion.div 
                  key={milestone.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col gap-12"
                >
                  <div className="text-center max-w-4xl mx-auto space-y-6 px-4">
                    <span className="text-[#c96442] font-serif text-6xl md:text-8xl leading-none">{displayDay}</span>
                    <h3 className="font-serif text-4xl md:text-6xl text-slate-900 tracking-tight">
                      {displayTitle}
                    </h3>
                    <div className="w-24 h-1 bg-slate-900 mx-auto mt-8 mb-8" />
                    <p className="font-sans text-slate-600 text-lg md:text-xl leading-relaxed whitespace-pre-wrap md:columns-2 gap-8 text-left">
                      {milestone.content}
                    </p>
                  </div>
                  
                  <div className="w-full">
                    {hasImages ? (
                      <MediaGalleryGrid mediaUrls={milestone.images} className="grayscale-[20%] w-full" />
                    ) : (
                      <div className="w-full h-[400px] md:h-[600px] bg-slate-50 flex items-center justify-center">
                        <MapPin className="w-12 h-12 text-slate-200" />
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            }

            // Layout 0 & 1: Classic Split (Text Left vs Text Right)
            const isImageLeft = layoutType === 1;
            
            return (
              <motion.div 
                key={milestone.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center"
              >
                {/* Content Side */}
                <div className={`lg:col-span-5 ${isImageLeft ? 'lg:order-2' : 'lg:order-1'} space-y-8`}>
                  <div className="flex items-start gap-4">
                    <span className="text-[#c96442] font-serif text-6xl md:text-7xl leading-none">{displayDay}</span>
                    <div className="pt-2">
                      <h3 className="font-serif text-3xl md:text-4xl text-slate-900 mb-4 tracking-tight leading-snug">
                        {displayTitle}
                      </h3>
                      <div className="w-12 h-1 bg-slate-900 mb-6" />
                      <p className="font-sans text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">
                        {milestone.content}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Image Side */}
                <div className={`lg:col-span-7 ${isImageLeft ? 'lg:order-1' : 'lg:order-2'} h-full w-full`}>
                  {hasImages ? (
                    <MediaGalleryGrid mediaUrls={milestone.images} className="grayscale-[20%]" />
                  ) : (
                    <div className="w-full h-[400px] bg-slate-50 flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-slate-200" />
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
        
      </div>
    </div>
  )
}


