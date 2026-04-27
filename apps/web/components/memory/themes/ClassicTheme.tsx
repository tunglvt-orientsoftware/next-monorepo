'use client'

import Image from 'next/image'
import { MapPin, ArrowLeft, Camera, X, Trash2, Heart } from 'lucide-react'
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

export function ClassicTheme({ trip, isOwner, hasLiked, likesCount, handleToggleLike, handleDelete, selectedImage, setSelectedImage }: ThemeProps) {
  const totalMilestones = trip.milestones?.length || 0
  const totalPhotos = trip.milestones?.reduce((acc: number, m: any) => acc + (m.images?.length || 0), 0) || 0
  const coverImage = trip.cover_image || trip.milestones?.find((m: any) => m.images && m.images.length > 0)?.images[0]

  return (
    <div className="min-h-screen bg-[#fdfdfc] py-16 font-serif relative">
      
      {/* Lightbox Overlay for Cover Image */}
      <ImageLightbox 
        images={selectedImage ? [selectedImage] : []}
        initialIndex={0}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12 border-b-4 border-slate-900 pb-6">
          <Link href="/my-memories" className="inline-flex items-center text-slate-900 hover:text-slate-600 font-bold uppercase tracking-widest text-xs sm:text-sm transition-colors whitespace-nowrap">
            <ArrowLeft className="w-4 h-4 mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Return to Archive</span>
            <span className="sm:hidden">Archive</span>
          </Link>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <button 
              onClick={handleToggleLike}
              className={`inline-flex items-center font-bold uppercase tracking-widest text-xs sm:text-sm transition-colors px-3 py-1.5 sm:px-4 sm:py-2 border-2 whitespace-nowrap ${hasLiked ? 'text-slate-900 border-slate-900 bg-slate-100' : 'text-slate-500 border-slate-300 hover:text-slate-900 hover:border-slate-900'}`}
            >
              <Heart className={`w-4 h-4 mr-1.5 sm:mr-2 ${hasLiked ? 'fill-current' : ''}`} />
              {likesCount} <span className="hidden sm:inline sm:ml-1">{likesCount === 1 ? 'Endorsement' : 'Endorsements'}</span>
            </button>
            {isOwner && (
              <>
                <Link 
                  href={`/trip/${trip.id}/edit`}
                  className="inline-flex items-center text-slate-900 hover:text-white hover:bg-slate-900 font-bold uppercase tracking-widest text-xs sm:text-sm transition-colors px-3 py-1.5 sm:px-4 sm:py-2 border-2 border-slate-900 whitespace-nowrap"
                >
                  Edit <span className="hidden sm:inline sm:ml-1">Record</span>
                </Link>
                <button 
                  onClick={handleDelete}
                  className="inline-flex items-center text-red-700 hover:text-white hover:bg-red-700 font-bold uppercase tracking-widest text-xs sm:text-sm transition-colors px-3 py-1.5 sm:px-4 sm:py-2 border-2 border-red-700 whitespace-nowrap"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Header Section */}
        <div className="text-center mb-24 relative">
          
          <div className="inline-block border-y-2 border-slate-900 py-2 px-12 mb-8 text-sm uppercase tracking-[0.3em] font-bold text-slate-600">
            A Photographic Journal
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 uppercase tracking-tight leading-tight"
          >
            {trip.title || 'Untitled Archive'}
          </motion.h1>

          <div className="flex justify-center items-center gap-6 text-sm uppercase tracking-widest text-slate-500 font-bold mb-12">
            <span>{totalMilestones} Entries</span>
            <span className="text-slate-300">|</span>
            <span>{totalPhotos} Plates</span>
            <span className="text-slate-300">|</span>
            <span>{new Date(trip.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>

          {coverImage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-4xl mx-auto mb-16 p-2 bg-white border-4 border-double border-slate-900 shadow-xl relative"
            >
              <Image 
                src={coverImage.split('|')[0]} 
                alt={trip.title} 
                onClick={() => setSelectedImage(coverImage)}
                className="w-full h-[60vh] object-cover grayscale-[20%] contrast-125 cursor-zoom-in"
              width={1200} height={1200} unoptimized={typeof coverImage === 'string' && (coverImage.startsWith('blob:') || coverImage.startsWith('data:'))} />
              <div className="absolute -bottom-4 right-8 bg-white px-4 border-2 border-slate-900 text-xs font-bold uppercase tracking-widest">
                Fig 1. Cover
              </div>
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-slate-800 leading-loose text-justify text-justify-last-center"
          >
            <p className="first-letter:text-6xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1">
              {trip.story}
            </p>
          </motion.div>
        </div>

        {/* Milestones / Classic Grid Layout */}
        <div className="space-y-32 pb-32">
          {trip.milestones.map((milestone: any, i: number) => {
            const hasImages = milestone.images && milestone.images.length > 0;
            
            return (
              <motion.div 
                key={milestone.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="relative"
              >
                {/* Section Divider */}
                <div className="flex items-center mb-12">
                  <h2 className="text-2xl font-bold uppercase tracking-widest text-slate-900 mr-6 whitespace-nowrap">
                    Section {String(i + 1).padStart(2, '0')}
                  </h2>
                  <div className="h-0.5 w-full bg-slate-900"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                  
                  {/* Content Column */}
                  <div className={`md:col-span-5 ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                    <h3 className="font-bold text-3xl md:text-4xl text-slate-900 mb-6 uppercase leading-snug">
                      {milestone.title || 'Location'}
                    </h3>
                    <p className="font-serif text-slate-700 text-lg leading-relaxed text-justify mb-8">
                      {milestone.content}
                    </p>
                    <div className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-400">
                      <MapPin className="w-3 h-3 mr-2" />
                      Recorded Entry
                    </div>
                  </div>

                  {/* Image Column */}
                  <div className={`md:col-span-7 ${i % 2 === 1 ? 'md:order-1' : ''}`}>
                    {hasImages ? (
                      <div className="p-2 bg-white border-2 border-slate-900 shadow-md">
                        <MediaGalleryGrid mediaUrls={milestone.images} className="grayscale-[20%] contrast-125" />
                        <div className="mt-2 text-right text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          Plate {i + 1}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full aspect-[4/3] bg-slate-100 border-4 border-slate-900 flex flex-col items-center justify-center p-8 text-center">
                        <Camera className="w-12 h-12 text-slate-300 mb-4" />
                        <span className="text-sm font-bold uppercase tracking-widest text-slate-400">Plate Missing</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
        
      </div>
    </div>
  )
}


