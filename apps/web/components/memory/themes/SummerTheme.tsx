'use client'

import Image from 'next/image'
import { MapPin, ArrowLeft, Camera, Navigation, X, Trash2, Heart, Sun } from 'lucide-react'
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

export function SummerTheme({ trip, isOwner, hasLiked, likesCount, handleToggleLike, handleDelete, selectedImage, setSelectedImage }: ThemeProps) {
  const totalMilestones = trip.milestones?.length || 0
  const totalPhotos = trip.milestones?.reduce((acc: number, m: any) => acc + (m.images?.length || 0), 0) || 0
  const coverImage = trip.cover_image || trip.milestones?.find((m: any) => m.images && m.images.length > 0)?.images[0]

  return (
    <div className="min-h-screen bg-[#fffdf0] py-16 font-sans relative overflow-hidden">
      
      {/* Lightbox Overlay */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#ffeaa7]/95 backdrop-blur-md p-4 md:p-12 cursor-zoom-out"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50, rotate: -5 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.8, y: 50, rotate: 5 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className="relative max-w-7xl max-h-screen w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 md:-top-4 md:-right-4 bg-orange-400 hover:bg-orange-500 text-white p-3 rounded-full transition-colors shadow-lg z-50"
              >
                <X className="w-6 h-6" />
              </button>
              <Image 
                src={selectedImage} 
                alt="Enlarged" 
                className="max-w-full max-h-[85vh] object-contain rounded-[2rem] shadow-[0_20px_50px_rgba(251,191,36,0.3)] border-4 border-white" 
              width={1200} height={1200} unoptimized={typeof selectedImage === 'string' && (selectedImage.startsWith('blob:') || selectedImage.startsWith('data:'))} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summer Background Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-yellow-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-orange-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] bg-pink-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-16 relative z-20">
          <Link href="/my-memories" className="inline-flex items-center text-orange-600 hover:text-orange-800 font-sans font-bold transition-colors bg-white px-4 py-2 sm:px-5 sm:py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-orange-100 hover:scale-105 transform duration-200 whitespace-nowrap text-sm sm:text-base">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
            Go Back
          </Link>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <button 
              onClick={handleToggleLike}
              className={`inline-flex items-center font-bold transition-all bg-white px-4 py-2 sm:px-5 sm:py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border hover:scale-105 transform duration-200 whitespace-nowrap text-sm sm:text-base ${hasLiked ? 'text-pink-500 border-pink-200' : 'text-orange-500 border-orange-100 hover:text-pink-500'}`}
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 ${hasLiked ? 'fill-current text-pink-500' : ''}`} />
              {likesCount} <span className="hidden sm:inline sm:ml-1">{likesCount === 1 ? 'Like' : 'Likes'}</span>
            </button>
            {isOwner && (
              <>
                <Link 
                  href={`/my-memories/${trip.id}/edit`}
                  className="inline-flex items-center text-orange-600 hover:text-white hover:bg-orange-500 font-bold transition-all bg-white px-4 py-2 sm:px-5 sm:py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-orange-100 hover:scale-105 transform duration-200 whitespace-nowrap text-sm sm:text-base"
                >
                  Edit
                </Link>
                <button 
                  onClick={handleDelete}
                  className="inline-flex items-center text-red-500 hover:text-white hover:bg-red-500 font-bold transition-all bg-white px-4 py-2 sm:px-5 sm:py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-red-100 hover:scale-105 transform duration-200 whitespace-nowrap text-sm sm:text-base"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-32 relative">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="mb-8"
          >
            <Sun className="w-20 h-20 text-yellow-400 fill-yellow-400" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 mb-8 tracking-tight drop-shadow-sm"
          >
            {trip.title || 'Summer Trip'}
          </motion.h1>

          {coverImage && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-4xl mx-auto h-[50vh] md:h-[60vh] mb-12 rounded-[3rem] overflow-hidden shadow-2xl relative border-8 border-white transform hover:scale-[1.02] transition-transform duration-500"
            >
              <Image 
                src={coverImage} 
                alt={trip.title} 
                className="w-full h-full object-cover saturate-150"
              width={1200} height={1200} unoptimized={typeof coverImage === 'string' && (coverImage.startsWith('blob:') || coverImage.startsWith('data:'))} />
            </motion.div>
          )}

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-orange-900/70 font-medium max-w-3xl mx-auto leading-relaxed"
          >
            {trip.story}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-4 bg-white/80 backdrop-blur-md px-8 py-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] text-orange-600 font-bold"
          >
            <span className="flex items-center"><Navigation className="w-5 h-5 mr-2 text-pink-500" /> {totalMilestones} Stops</span>
            <span className="text-orange-300">•</span>
            <span className="flex items-center"><Camera className="w-5 h-5 mr-2 text-purple-500" /> {totalPhotos} Photos</span>
            <span className="text-orange-300">•</span>
            <span>{new Date(trip.created_at).toLocaleDateString()}</span>
          </motion.div>
        </div>

        {/* Milestones / Summer Layout */}
        <div className="space-y-40 pb-32">
          {trip.milestones.map((milestone: any, i: number) => {
            const isEven = i % 2 === 0;
            const hasImages = milestone.images && milestone.images.length > 0;
            
            return (
              <motion.div 
                key={milestone.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative"
              >
                {/* Wavy connection line (hidden on mobile) */}
                {i < trip.milestones.length - 1 && (
                  <svg className="absolute left-1/2 -bottom-40 w-32 h-40 -translate-x-1/2 z-0 hidden lg:block" preserveAspectRatio="none">
                    <path d="M16,0 C48,40 -16,80 16,160" fill="none" stroke="url(#gradient)" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 10" />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                )}

                {/* Content Side */}
                <div className={`${isEven ? 'lg:order-1' : 'lg:order-2'} relative z-10`}>
                  <div className="bg-white/90 backdrop-blur-xl p-10 md:p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(251,191,36,0.15)] border border-orange-50 hover:shadow-[0_20px_50px_rgba(251,191,36,0.3)] transition-shadow duration-500">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 text-white font-black text-2xl mb-8 shadow-lg">
                      {i + 1}
                    </div>
                    
                    <h3 className="font-black text-3xl md:text-4xl text-slate-800 mb-6 flex items-center gap-3">
                      <MapPin className="w-8 h-8 text-orange-500" />
                      {milestone.title || 'Location'}
                    </h3>
                    <p className="font-medium text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">
                      {milestone.content}
                    </p>
                  </div>
                </div>

                {/* Image Side */}
                <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'} relative z-10`}>
                  {hasImages ? (
                    <SummerGallery images={milestone.images} onImageClick={setSelectedImage} />
                  ) : (
                    <div className="w-full aspect-square rounded-[3rem] bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center border-4 border-white shadow-xl">
                      <Camera className="w-20 h-20 text-orange-300" />
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

function SummerGallery({ images, onImageClick }: { images: string[], onImageClick: (img: string) => void }) {
  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div 
        onClick={() => onImageClick(images[0]!)}
        className="relative w-full aspect-square rounded-[3rem] overflow-hidden border-8 border-white shadow-[0_20px_50px_rgba(251,191,36,0.2)] cursor-zoom-in hover:scale-105 hover:rotate-2 transition-all duration-500 group"
      >
        <Image src={images[0] || ""} alt="Milestone" className="w-full h-full object-cover saturate-150 group-hover:scale-110 transition-transform duration-700" width={1200} height={1200} unoptimized={typeof images[0] === "string" && (images[0].startsWith("blob:") || images[0].startsWith("data:"))} />
      </div>
    )
  }

  if (images.length === 2) {
    return (
      <div className="relative w-full aspect-square">
        <div 
          onClick={() => onImageClick(images[0]!)}
          className="absolute top-0 left-0 w-2/3 h-2/3 rounded-full overflow-hidden border-8 border-white shadow-2xl cursor-zoom-in hover:scale-110 hover:z-30 transition-all duration-500 z-10 group"
        >
          <Image src={images[0] || ""} alt="Milestone 1" className="w-full h-full object-cover saturate-150 group-hover:scale-110 transition-transform duration-700" width={1200} height={1200} unoptimized={typeof images[0] === "string" && (images[0].startsWith("blob:") || images[0].startsWith("data:"))} />
        </div>
        <div 
          onClick={() => onImageClick(images[1]!)}
          className="absolute bottom-0 right-0 w-2/3 h-2/3 rounded-full overflow-hidden border-8 border-white shadow-2xl cursor-zoom-in hover:scale-110 hover:z-30 transition-all duration-500 z-20 group"
        >
          <Image src={images[1] || ""} alt="Milestone 2" className="w-full h-full object-cover saturate-150 group-hover:scale-110 transition-transform duration-700" width={1200} height={1200} unoptimized={typeof images[1] === "string" && (images[1].startsWith("blob:") || images[1].startsWith("data:"))} />
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-square">
      <div 
        onClick={() => onImageClick(images[0]!)}
        className="absolute top-0 left-0 w-[60%] h-[60%] rounded-[2rem] overflow-hidden border-8 border-white shadow-xl cursor-zoom-in hover:scale-110 hover:z-30 transition-all duration-500 z-10 group rotate-[-5deg]"
      >
        <Image src={images[0] || ""} alt="Milestone 1" className="w-full h-full object-cover saturate-150 group-hover:scale-110 transition-transform duration-700" width={1200} height={1200} unoptimized={typeof images[0] === "string" && (images[0].startsWith("blob:") || images[0].startsWith("data:"))} />
      </div>
      <div 
        onClick={() => onImageClick(images[1]!)}
        className="absolute top-10 right-0 w-[50%] h-[50%] rounded-[2rem] overflow-hidden border-8 border-white shadow-xl cursor-zoom-in hover:scale-110 hover:z-30 transition-all duration-500 z-20 group rotate-[5deg]"
      >
        <Image src={images[1] || ""} alt="Milestone 2" className="w-full h-full object-cover saturate-150 group-hover:scale-110 transition-transform duration-700" width={1200} height={1200} unoptimized={typeof images[1] === "string" && (images[1].startsWith("blob:") || images[1].startsWith("data:"))} />
      </div>
      <div 
        onClick={() => onImageClick(images[2]!)}
        className="absolute bottom-0 right-10 w-[65%] h-[50%] rounded-[2rem] overflow-hidden border-8 border-white shadow-xl cursor-zoom-in hover:scale-110 hover:z-30 transition-all duration-500 z-30 group rotate-[-2deg]"
      >
        <Image src={images[2] || ""} alt="Milestone 3" className="w-full h-full object-cover saturate-150 group-hover:scale-110 transition-transform duration-700" width={1200} height={1200} unoptimized={typeof images[2] === "string" && (images[2].startsWith("blob:") || images[2].startsWith("data:"))} />
      </div>
    </div>
  )
}
