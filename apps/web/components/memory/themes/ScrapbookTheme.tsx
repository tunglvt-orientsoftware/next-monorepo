'use client'

import Image from 'next/image'
import { MapPin, ArrowLeft, Camera, Navigation, X, Trash2, Heart } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'

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

export function ScrapbookTheme({ trip, isOwner, hasLiked, likesCount, handleToggleLike, handleDelete, selectedImage, setSelectedImage }: ThemeProps) {
  const { scrollYProgress } = useScroll()
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 800])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -400])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 600])

  const totalMilestones = trip.milestones?.length || 0
  const totalPhotos = trip.milestones?.reduce((acc: number, m: any) => acc + (m.images?.length || 0), 0) || 0
  const coverImage = trip.cover_image || trip.milestones?.find((m: any) => m.images && m.images.length > 0)?.images[0]

  return (
    <div className="min-h-screen bg-[#fdfcf8] py-16 font-serif relative overflow-hidden">
      
      {/* 1. Cinematic Lightbox Overlay */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 md:p-12 cursor-zoom-out"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-7xl max-h-screen w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 md:-top-4 md:-right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <Image 
                src={selectedImage} 
                alt="Enlarged" 
                className="max-w-full max-h-[85vh] object-contain rounded-sm shadow-2xl" 
              width={1200} height={1200} unoptimized={typeof selectedImage === 'string' && (selectedImage.startsWith('blob:') || selectedImage.startsWith('data:'))} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkered Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#c9644215_1px,transparent_1px),linear-gradient(to_bottom,#c9644215_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      {/* Floating Parallax Souvenirs */}
      <motion.div style={{ y: y1 }} className="absolute top-[10%] left-[5%] opacity-10 pointer-events-none rotate-12">
        <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="#c96442" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/></svg>
      </motion.div>
      <motion.div style={{ y: y2 }} className="absolute top-[40%] right-[5%] opacity-[0.07] pointer-events-none -rotate-12">
        <svg width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="#c96442" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.7l-1.2 3.6c-.1.5.2.9.7 1.1L9 13l-4.3 4.3-2.9-.7c-.4-.1-.8.2-.9.6l-.6 1.8c-.1.4.2.8.6.9l4.5 1.1c.4.1.8 0 1.1-.3L11 15l1.4 5.8c.1.5.6.8 1.1.7l3.6-1.2c.5-.2.8-.6.7-1.1z"/></svg>
      </motion.div>
      <motion.div style={{ y: y3 }} className="absolute bottom-[20%] left-[10%] opacity-[0.05] pointer-events-none rotate-45">
        <svg width="250" height="250" viewBox="0 0 24 24" fill="none" stroke="#c96442" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
      </motion.div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12 relative z-20">
          <Link href="/my-memories" className="inline-flex items-center text-[#c96442] hover:text-[#b05537] font-sans font-medium transition-colors bg-white/80 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-sm border border-[#c96442]/20 whitespace-nowrap text-sm sm:text-base">
            <ArrowLeft className="w-4 h-4 mr-1.5 sm:mr-2" />
            Back
          </Link>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button 
              onClick={handleToggleLike}
              className={`inline-flex items-center font-sans font-medium transition-colors bg-white/80 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-sm border cursor-pointer whitespace-nowrap text-sm sm:text-base ${hasLiked ? 'text-red-500 border-red-500/20' : 'text-slate-600 border-slate-200 hover:text-red-500 hover:border-red-500/20'}`}
            >
              <Heart className={`w-4 h-4 mr-1.5 sm:mr-2 ${hasLiked ? 'fill-current' : ''}`} />
              {likesCount} <span className="hidden sm:inline sm:ml-1">{likesCount === 1 ? 'Like' : 'Likes'}</span>
            </button>
            {isOwner && (
              <>
                <Link 
                  href={`/trip/${trip.id}/edit`}
                  className="inline-flex items-center text-slate-600 hover:text-white hover:bg-slate-800 font-sans font-medium transition-colors bg-white/80 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-sm border border-slate-200 cursor-pointer whitespace-nowrap text-sm sm:text-base"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-0 sm:mr-2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                  <span className="hidden sm:inline">Edit</span>
                </Link>
                <button 
                  onClick={handleDelete}
                  className="inline-flex items-center text-red-500 hover:text-white hover:bg-red-500 font-sans font-medium transition-colors bg-white/80 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-sm border border-red-500/20 cursor-pointer whitespace-nowrap text-sm sm:text-base"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="sr-only">Delete Trip</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Header Section */}
        <div className="text-center mb-32 relative">
          {coverImage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-4xl mx-auto h-[40vh] md:h-[50vh] mb-12 rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <motion.img 
                layoutId={`trip-cover-${trip.id}`}
                src={coverImage} 
                alt={trip.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </motion.div>
          )}

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif text-slate-900 mb-8 drop-shadow-sm px-4"
          >
            {trip.title || 'Untitled Trip'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-slate-600 font-sans max-w-3xl mx-auto leading-relaxed px-4"
          >
            {trip.story}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-12 inline-flex flex-wrap items-center justify-center gap-4 md:gap-8 bg-white/60 backdrop-blur-md px-8 py-4 rounded-full border border-[#c96442]/20 shadow-lg"
          >
            <div className="flex items-center text-slate-700 font-sans font-medium">
              <Navigation className="w-5 h-5 mr-2 text-[#c96442]" />
              {totalMilestones} Stops
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 hidden sm:block" />
            <div className="flex items-center text-slate-700 font-sans font-medium">
              <Camera className="w-5 h-5 mr-2 text-[#c96442]" />
              {totalPhotos} Photos
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 hidden sm:block" />
            <div className="text-slate-500 font-sans uppercase tracking-widest text-sm">
              {new Date(trip.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
          </motion.div>
        </div>

        {/* Central Timeline Layout */}
        <div className="relative pb-32">
          {/* Central Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-[#c96442]/20 -translate-x-1/2" />

          {trip.milestones.map((milestone: any, i: number) => {
            const isEven = i % 2 === 0;
            
            return (
              <motion.div 
                key={milestone.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative mb-24 lg:mb-32 flex flex-col lg:flex-row items-center justify-center group"
              >
                {/* Timeline Anchor Dot */}
                <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-sm rotate-45 bg-[#c96442] border-4 border-[#fdfcf8] shadow-md items-center justify-center z-20 group-hover:scale-125 transition-transform duration-500">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>

                {/* Left Side */}
                <div className={`w-full lg:w-[45%] flex ${isEven ? 'lg:justify-end' : 'lg:justify-start lg:order-1 order-2 mt-8 lg:mt-0'} px-4 lg:px-12`}>
                  {isEven ? (
                    <div className="bg-white/80 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 max-w-xl text-left w-full hover:shadow-2xl transition-shadow duration-300">
                      <h3 className="font-serif text-3xl md:text-4xl text-slate-900 mb-8 flex items-center gap-3">
                        <MapPin className="w-8 h-8 text-[#c96442] flex-shrink-0" />
                        {milestone.title || 'Location'}
                      </h3>
                      <div className="max-h-[350px] overflow-y-auto pr-4 custom-scrollbar">
                        <p className="font-sans text-slate-600 text-lg md:text-xl leading-relaxed whitespace-pre-wrap first-letter:text-6xl md:first-letter:text-7xl first-letter:font-serif first-letter:text-[#c96442] first-letter:float-left first-letter:mr-4 first-letter:mt-2 first-letter:leading-none">
                          {milestone.content}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <ScrapbookCollage images={milestone.images} onImageClick={setSelectedImage} />
                  )}
                </div>

                {/* Right Side */}
                <div className={`w-full lg:w-[45%] flex ${isEven ? 'lg:justify-start lg:order-2 order-2 mt-8 lg:mt-0' : 'lg:justify-start lg:order-2 order-1'} px-4 lg:px-12`}>
                  {isEven ? (
                    <ScrapbookCollage images={milestone.images} onImageClick={setSelectedImage} />
                  ) : (
                    <div className="bg-white/80 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 max-w-xl text-left w-full hover:shadow-2xl transition-shadow duration-300">
                      <h3 className="font-serif text-3xl md:text-4xl text-slate-900 mb-8 flex items-center gap-3">
                        <MapPin className="w-8 h-8 text-[#c96442] flex-shrink-0" />
                        {milestone.title || 'Location'}
                      </h3>
                      <div className="max-h-[350px] overflow-y-auto pr-4 custom-scrollbar">
                        <p className="font-sans text-slate-600 text-lg md:text-xl leading-relaxed whitespace-pre-wrap first-letter:text-6xl md:first-letter:text-7xl first-letter:font-serif first-letter:text-[#c96442] first-letter:float-left first-letter:mr-4 first-letter:mt-2 first-letter:leading-none">
                          {milestone.content}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile UI */}
                <div className="lg:hidden absolute top-[-16px] left-8 w-6 h-6 rounded-sm rotate-45 bg-[#c96442] border-4 border-[#fdfcf8] shadow-sm flex items-center justify-center z-20">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
                <div className="lg:hidden absolute left-11 top-4 bottom-[-100px] w-px bg-[#c96442]/20 -translate-x-1/2 -z-10" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ScrapbookCollage({ images, onImageClick }: { images: string[], onImageClick: (img: string) => void }) {
  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div 
        onClick={() => onImageClick(images[0]!)}
        className={`relative bg-white p-4 pb-16 shadow-2xl border border-slate-200 rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-500 w-full max-w-xl mx-auto cursor-zoom-in`}
      >
        <Image src={images[0] || ""} alt="Milestone" className="w-full aspect-[4/3] object-cover bg-slate-100" width={1200} height={1200} unoptimized={typeof images[0] === "string" && (images[0].startsWith("blob:") || images[0].startsWith("data:"))} />
        <div className="absolute bottom-5 left-0 right-0 text-center font-sans text-slate-400 opacity-60 italic text-sm">Moment captured</div>
      </div>
    )
  }

  if (images.length === 2) {
    return (
      <div className="relative w-full max-w-xl mx-auto h-[400px] md:h-[500px]">
        <div 
          onClick={() => onImageClick(images[0]!)}
          className="absolute top-0 left-0 w-3/4 bg-white p-3 pb-12 shadow-xl border border-slate-200 -rotate-3 hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-500 z-10 cursor-zoom-in"
        >
          <Image src={images[0] || ""} alt="Milestone 1" className="w-full aspect-square object-cover" width={1200} height={1200} unoptimized={typeof images[0] === "string" && (images[0].startsWith("blob:") || images[0].startsWith("data:"))} />
        </div>
        <div 
          onClick={() => onImageClick(images[1]!)}
          className="absolute bottom-0 right-0 w-3/4 bg-white p-3 pb-12 shadow-2xl border border-slate-200 rotate-6 hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-500 z-20 cursor-zoom-in"
        >
          <Image src={images[1] || ""} alt="Milestone 2" className="w-full aspect-square object-cover" width={1200} height={1200} unoptimized={typeof images[1] === "string" && (images[1].startsWith("blob:") || images[1].startsWith("data:"))} />
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-xl mx-auto h-[500px] md:h-[600px] flex items-center justify-center">
      {images.slice(0, 4).map((img, idx) => {
        const rotations = ['-rotate-6', 'rotate-3', '-rotate-2', 'rotate-12'];
        const positions = ['top-0 left-0', 'top-10 right-0', 'bottom-10 left-10', 'bottom-0 right-10'];
        
        return (
          <div 
            key={idx}
            onClick={() => onImageClick(img!)}
            className={`absolute ${positions[idx % 4]} w-2/3 bg-white p-3 pb-12 shadow-xl border border-slate-200 ${rotations[idx % 4]} hover:rotate-0 hover:z-50 hover:scale-110 transition-all duration-500 cursor-zoom-in`}
            style={{ zIndex: idx }}
          >
            <Image src={img} alt={`Milestone ${idx+1}`} className="w-full aspect-square object-cover" width={1200} height={1200} unoptimized={typeof img === 'string' && (img.startsWith('blob:') || img.startsWith('data:'))} />
          </div>
        )
      })}
    </div>
  )
}
