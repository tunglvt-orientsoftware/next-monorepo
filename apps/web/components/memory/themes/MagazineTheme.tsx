'use client'

import Image from 'next/image'
import { MapPin, ArrowLeft, Camera, Navigation, X, Trash2, Heart } from 'lucide-react'
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

export function MagazineTheme({ trip, isOwner, hasLiked, likesCount, handleToggleLike, handleDelete, selectedImage, setSelectedImage }: ThemeProps) {
  const totalMilestones = trip.milestones?.length || 0
  const totalPhotos = trip.milestones?.reduce((acc: number, m: any) => acc + (m.images?.length || 0), 0) || 0
  const coverImage = trip.cover_image || trip.milestones?.find((m: any) => m.images && m.images.length > 0)?.images[0]

  return (
    <div className="min-h-screen bg-white py-12 font-sans relative">
      
      {/* Lightbox Overlay */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 backdrop-blur-md p-4 md:p-12 cursor-zoom-out"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-7xl max-h-screen w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 md:-top-4 md:-right-4 text-slate-900 p-3 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-8 h-8 stroke-[1.5]" />
              </button>
              <Image 
                src={selectedImage} 
                alt="Enlarged" 
                className="max-w-full max-h-[85vh] object-contain shadow-2xl" 
              width={1200} height={1200} unoptimized={typeof selectedImage === 'string' && (selectedImage.startsWith('blob:') || selectedImage.startsWith('data:'))} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                src={coverImage} 
                alt={trip.title} 
                className="w-full h-full object-cover grayscale-[20%] contrast-125"
              width={1200} height={1200} unoptimized={typeof coverImage === 'string' && (coverImage.startsWith('blob:') || coverImage.startsWith('data:'))} />
            </motion.div>
          )}
        </div>

        {/* Milestones / Editorial Layout */}
        <div className="space-y-32 pb-32">
          {trip.milestones.map((milestone: any, i: number) => {
            const isEven = i % 2 === 0;
            const hasImages = milestone.images && milestone.images.length > 0;
            
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
                <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : 'lg:order-2'} space-y-8`}>
                  <div className="flex items-start gap-4">
                    <span className="text-[#c96442] font-serif text-6xl leading-none">{(i + 1).toString().padStart(2, '0')}</span>
                    <div>
                      <h3 className="font-serif text-3xl md:text-5xl text-slate-900 mb-2 tracking-tight">
                        {milestone.title || 'Location'}
                      </h3>
                      <div className="w-12 h-1 bg-slate-900 mb-6" />
                      <p className="font-sans text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">
                        {milestone.content}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Image Side */}
                <div className={`lg:col-span-7 ${isEven ? 'lg:order-2' : 'lg:order-1'} h-full w-full`}>
                  {hasImages ? (
                    <MagazineGallery images={milestone.images} onImageClick={setSelectedImage} />
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

function MagazineGallery({ images, onImageClick }: { images: string[], onImageClick: (img: string) => void }) {
  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div 
        onClick={() => onImageClick(images[0]!)}
        className="w-full aspect-[4/5] overflow-hidden cursor-zoom-in group"
      >
        <Image 
          src={images[0] || ""} 
          alt="Milestone" 
          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
        width={1200} height={1200} unoptimized={typeof images[0] === "string" && (images[0].startsWith("blob:") || images[0].startsWith("data:"))} />
      </div>
    )
  }

  if (images.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-4 h-[60vh]">
        <div 
          onClick={() => onImageClick(images[0]!)}
          className="w-full h-full overflow-hidden cursor-zoom-in group mt-12"
        >
          <Image src={images[0] || ""} alt="Milestone 1" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" width={1200} height={1200} unoptimized={typeof images[0] === "string" && (images[0].startsWith("blob:") || images[0].startsWith("data:"))} />
        </div>
        <div 
          onClick={() => onImageClick(images[1]!)}
          className="w-full h-full overflow-hidden cursor-zoom-in group mb-12"
        >
          <Image src={images[1] || ""} alt="Milestone 2" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" width={1200} height={1200} unoptimized={typeof images[1] === "string" && (images[1].startsWith("blob:") || images[1].startsWith("data:"))} />
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-12 gap-4 h-[80vh]">
      <div 
        onClick={() => onImageClick(images[0]!)}
        className="col-span-12 md:col-span-8 h-full overflow-hidden cursor-zoom-in group"
      >
        <Image src={images[0] || ""} alt="Milestone 1" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" width={1200} height={1200} unoptimized={typeof images[0] === "string" && (images[0].startsWith("blob:") || images[0].startsWith("data:"))} />
      </div>
      <div className="col-span-12 md:col-span-4 flex flex-col gap-4 h-full">
        <div 
          onClick={() => onImageClick(images[1]!)}
          className="h-1/2 overflow-hidden cursor-zoom-in group"
        >
          <Image src={images[1] || ""} alt="Milestone 2" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" width={1200} height={1200} unoptimized={typeof images[1] === "string" && (images[1].startsWith("blob:") || images[1].startsWith("data:"))} />
        </div>
        {images[2] && (
          <div 
            onClick={() => onImageClick(images[2]!)}
            className="h-1/2 overflow-hidden cursor-zoom-in group"
          >
            <Image src={images[2] || ""} alt="Milestone 3" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" width={1200} height={1200} unoptimized={typeof images[2] === "string" && (images[2].startsWith("blob:") || images[2].startsWith("data:"))} />
          </div>
        )}
      </div>
    </div>
  )
}
