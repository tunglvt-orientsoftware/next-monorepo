'use client'

import Image from 'next/image'
import { MapPin, ArrowLeft, Camera, X, Trash2, Heart } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

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
      
      {/* Lightbox Overlay */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 backdrop-blur-sm p-4 md:p-12 cursor-zoom-out"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-7xl max-h-screen w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 md:-top-4 md:-right-4 bg-black text-white hover:bg-slate-800 p-3 transition-colors z-50 rounded-sm"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="p-4 border-8 border-double border-slate-900 bg-white shadow-2xl max-h-[90vh]">
                <Image 
                  src={selectedImage} 
                  alt="Enlarged" 
                  className="max-w-full max-h-[80vh] object-contain grayscale-[30%] contrast-125" 
                width={1200} height={1200} unoptimized={typeof selectedImage === 'string' && (selectedImage.startsWith('blob:') || selectedImage.startsWith('data:'))} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                src={coverImage} 
                alt={trip.title} 
                className="w-full h-[60vh] object-cover grayscale-[20%] contrast-125"
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
                      <ClassicGallery images={milestone.images} onImageClick={setSelectedImage} index={i} />
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

function ClassicGallery({ images, onImageClick, index }: { images: string[], onImageClick: (img: string) => void, index: number }) {
  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="relative p-2 bg-white border-2 border-slate-900 shadow-md group">
        <div 
          onClick={() => onImageClick(images[0]!)}
          className="relative w-full aspect-[4/3] overflow-hidden cursor-zoom-in"
        >
          <Image src={images[0] || ""} alt="Milestone" className="w-full h-full object-cover grayscale-[20%] contrast-125 group-hover:scale-105 transition-transform duration-700" width={1200} height={1200} unoptimized={typeof images[0] === "string" && (images[0].startsWith("blob:") || images[0].startsWith("data:"))} />
        </div>
        <div className="absolute -bottom-3 right-4 bg-white px-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Plate {index + 1}.A
        </div>
      </div>
    )
  }

  if (images.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {images.map((img, i) => (
          <div key={i} className="relative p-1.5 bg-white border border-slate-900 shadow-sm group">
            <div 
              onClick={() => onImageClick(img)}
              className="relative w-full aspect-[3/4] overflow-hidden cursor-zoom-in"
            >
              <Image src={img} alt={`Milestone ${i}`} className="w-full h-full object-cover grayscale-[20%] contrast-125 group-hover:scale-105 transition-transform duration-700" width={1200} height={1200} unoptimized={typeof img === 'string' && (img.startsWith('blob:') || img.startsWith('data:'))} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Large Featured Image */}
      <div className="col-span-12 relative p-2 bg-white border-2 border-slate-900 shadow-sm group">
        <div 
          onClick={() => onImageClick(images[0]!)}
          className="relative w-full aspect-[16/9] overflow-hidden cursor-zoom-in"
        >
          <Image src={images[0] || ""} alt="Milestone 1" className="w-full h-full object-cover grayscale-[20%] contrast-125 group-hover:scale-105 transition-transform duration-700" width={1200} height={1200} unoptimized={typeof images[0] === "string" && (images[0].startsWith("blob:") || images[0].startsWith("data:"))} />
        </div>
      </div>
      {/* Smaller Images below */}
      {images.slice(1, 3).map((img, i) => (
        <div key={i + 1} className="col-span-6 relative p-1.5 bg-white border border-slate-900 shadow-sm group">
          <div 
            onClick={() => onImageClick(img)}
            className="relative w-full aspect-square overflow-hidden cursor-zoom-in"
          >
            <Image src={img} alt={`Milestone ${i + 1}`} className="w-full h-full object-cover grayscale-[20%] contrast-125 group-hover:scale-105 transition-transform duration-700" width={1200} height={1200} unoptimized={typeof img === 'string' && (img.startsWith('blob:') || img.startsWith('data:'))} />
          </div>
        </div>
      ))}
    </div>
  )
}
