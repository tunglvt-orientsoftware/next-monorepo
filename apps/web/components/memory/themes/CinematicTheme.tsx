'use client'

import Image from 'next/image'
import { MapPin, ArrowLeft, Camera, X, Trash2, Heart, Film } from 'lucide-react'
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

export function CinematicTheme({ trip, isOwner, hasLiked, likesCount, handleToggleLike, handleDelete, selectedImage, setSelectedImage }: ThemeProps) {
  const totalMilestones = trip.milestones?.length || 0
  const totalPhotos = trip.milestones?.reduce((acc: number, m: any) => acc + (m.images?.length || 0), 0) || 0
  const coverImage = trip.cover_image || trip.milestones?.find((m: any) => m.images && m.images.length > 0)?.images[0]

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-300 py-16 font-sans relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Lightbox Overlay */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-xl p-4 md:p-12 cursor-zoom-out"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-screen-2xl max-h-screen w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 md:-top-4 md:-right-4 bg-white/10 hover:bg-white/20 text-white p-3 transition-colors z-50 rounded-full backdrop-blur-md"
              >
                <X className="w-6 h-6" />
              </button>
              <Image 
                src={selectedImage} 
                alt="Enlarged" 
                className="max-w-full max-h-[90vh] object-contain shadow-[0_0_100px_rgba(255,255,255,0.05)]" 
              width={1200} height={1200} unoptimized={typeof selectedImage === 'string' && (selectedImage.startsWith('blob:') || selectedImage.startsWith('data:'))} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-24 relative z-20">
          <Link href="/my-memories" className="inline-flex items-center text-slate-400 hover:text-white font-medium uppercase tracking-[0.1em] sm:tracking-[0.2em] text-xs transition-colors whitespace-nowrap">
            <ArrowLeft className="w-4 h-4 mr-1.5 sm:mr-3" />
            <span className="hidden sm:inline">Exit Viewing</span>
            <span className="sm:hidden">Exit</span>
          </Link>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <button 
              onClick={handleToggleLike}
              className={`inline-flex items-center font-medium uppercase tracking-[0.05em] sm:tracking-[0.1em] text-xs transition-all px-3 py-1.5 sm:px-4 sm:py-2 rounded-sm border whitespace-nowrap ${hasLiked ? 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10' : 'text-slate-400 border-slate-800 hover:text-white hover:border-slate-600'}`}
            >
              <Heart className={`w-4 h-4 mr-1.5 sm:mr-2 ${hasLiked ? 'fill-current' : ''}`} />
              {likesCount} <span className="hidden sm:inline sm:ml-1">{likesCount === 1 ? 'Appreciation' : 'Appreciations'}</span>
            </button>
            {isOwner && (
              <>
                <Link 
                  href={`/my-memories/${trip.id}/edit`}
                  className="inline-flex items-center text-slate-400 hover:text-white font-medium uppercase tracking-[0.05em] sm:tracking-[0.1em] text-xs transition-colors px-3 py-1.5 sm:px-4 sm:py-2 border border-slate-800 hover:border-slate-600 rounded-sm whitespace-nowrap"
                >
                  Edit <span className="hidden sm:inline sm:ml-1">Cut</span>
                </Link>
                <button 
                  onClick={handleDelete}
                  className="inline-flex items-center text-red-500/70 hover:text-red-400 font-medium uppercase tracking-[0.05em] sm:tracking-[0.1em] text-xs transition-colors px-3 py-1.5 sm:px-4 sm:py-2 border border-red-900/30 hover:border-red-500/50 rounded-sm whitespace-nowrap"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-40 relative">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-6 flex items-center justify-center text-indigo-500/50"
          >
            <Film className="w-8 h-8 mr-4" />
            <span className="uppercase tracking-[0.5em] text-xs font-bold text-slate-500">A Travel Feature</span>
            <Film className="w-8 h-8 ml-4" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-5xl md:text-8xl lg:text-9xl font-black text-white mb-12 uppercase tracking-[0.1em] leading-none text-center"
            style={{ textShadow: '0 0 80px rgba(255,255,255,0.1)' }}
          >
            {trip.title || 'Untitled'}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex justify-center items-center gap-8 text-xs uppercase tracking-[0.3em] text-slate-500 font-medium mb-16"
          >
            <span>{totalMilestones} Scenes</span>
            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
            <span>{totalPhotos} Frames</span>
            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
            <span>{new Date(trip.created_at).getFullYear()}</span>
          </motion.div>

          {coverImage && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[100vw] mx-auto mb-20 relative group"
            >
              {/* Cinematic Widescreen Aspect Ratio */}
              <div className="relative w-full aspect-[21/9] bg-black overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                {/* Black bars top and bottom for ultra-cinematic feel */}
                <div className="absolute top-0 left-0 w-full h-[5%] bg-black z-20"></div>
                <div className="absolute bottom-0 left-0 w-full h-[5%] bg-black z-20"></div>
                
                <Image 
                  src={coverImage} 
                  alt={trip.title} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-1000 scale-105 group-hover:scale-100"
                width={1200} height={1200} unoptimized={typeof coverImage === 'string' && (coverImage.startsWith('blob:') || coverImage.startsWith('data:'))} />
                
                {/* Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none z-10" />
              </div>
            </motion.div>
          )}

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="text-lg md:text-xl text-slate-400 font-light max-w-4xl mx-auto leading-loose"
          >
            {trip.story}
          </motion.p>
        </div>

        {/* Milestones / Timeline */}
        <div className="space-y-40 pb-32">
          {trip.milestones.map((milestone: any, i: number) => {
            const hasImages = milestone.images && milestone.images.length > 0;
            
            return (
              <motion.div 
                key={milestone.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative"
              >
                <div className="flex flex-col items-center mb-16 text-center">
                  <div className="text-indigo-500/40 text-sm font-bold tracking-[0.4em] uppercase mb-4">
                    Scene {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="font-bold text-3xl md:text-5xl text-white uppercase tracking-widest leading-tight">
                    {milestone.title || 'Location'}
                  </h3>
                </div>

                {hasImages ? (
                  <CinematicGallery images={milestone.images} onImageClick={setSelectedImage} />
                ) : (
                  <div className="w-full aspect-[21/9] bg-[#111116] border border-white/5 flex flex-col items-center justify-center mb-12">
                    <Camera className="w-12 h-12 text-white/10 mb-4" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/20">Missing Footage</span>
                  </div>
                )}

                <div className="max-w-3xl mx-auto mt-16 text-center">
                  <p className="font-light text-slate-400 text-lg md:text-xl leading-relaxed">
                    {milestone.content}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
        
        {/* Cinematic Credits Footer */}
        <div className="pt-32 pb-16 text-center border-t border-white/5">
          <div className="text-[10px] uppercase tracking-[0.5em] text-slate-600 mb-4">Directed by</div>
          <div className="text-xl tracking-widest text-slate-400 uppercase">The Creator</div>
          <div className="mt-12 w-px h-12 bg-white/10 mx-auto"></div>
        </div>
      </div>
    </div>
  )
}

function CinematicGallery({ images, onImageClick }: { images: string[], onImageClick: (img: string) => void }) {
  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div 
        onClick={() => onImageClick(images[0]!)}
        className="relative w-full aspect-[21/9] bg-black overflow-hidden cursor-zoom-in group"
      >
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
        <Image src={images[0] || ""} alt="Scene" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 scale-105 group-hover:scale-100 transition-all duration-1000 ease-out" width={1200} height={1200} unoptimized={typeof images[0] === "string" && (images[0].startsWith("blob:") || images[0].startsWith("data:"))} />
      </div>
    )
  }

  if (images.length === 2) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((img, i) => (
          <div 
            key={i}
            onClick={() => onImageClick(img)}
            className="relative w-full aspect-[16/9] bg-black overflow-hidden cursor-zoom-in group"
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
            <Image src={img} alt={`Scene ${i}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 scale-105 group-hover:scale-100 transition-all duration-1000 ease-out" width={1200} height={1200} unoptimized={typeof img === 'string' && (img.startsWith('blob:') || img.startsWith('data:'))} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Featured Wide Image */}
      <div 
        onClick={() => onImageClick(images[0]!)}
        className="relative w-full aspect-[21/9] bg-black overflow-hidden cursor-zoom-in group"
      >
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
        <Image src={images[0] || ""} alt="Main Scene" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 scale-105 group-hover:scale-100 transition-all duration-1000 ease-out" width={1200} height={1200} unoptimized={typeof images[0] === "string" && (images[0].startsWith("blob:") || images[0].startsWith("data:"))} />
      </div>
      
      {/* Split secondary images */}
      <div className="grid grid-cols-2 gap-4">
        {images.slice(1, 3).map((img, i) => (
          <div 
            key={i + 1}
            onClick={() => onImageClick(img)}
            className="relative w-full aspect-[16/9] bg-black overflow-hidden cursor-zoom-in group"
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
            <Image src={img} alt={`B-Roll ${i + 1}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 scale-105 group-hover:scale-100 transition-all duration-1000 ease-out" width={1200} height={1200} unoptimized={typeof img === 'string' && (img.startsWith('blob:') || img.startsWith('data:'))} />
          </div>
        ))}
      </div>
    </div>
  )
}
