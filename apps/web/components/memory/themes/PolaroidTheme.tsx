'use client'

import Image from 'next/image'
import { MapPin, ArrowLeft, Camera, Navigation, X, Trash2, Heart } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ImageLightbox } from '../../shared/ImageLightbox'
import { Play } from 'lucide-react'

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

export function PolaroidTheme({ trip, isOwner, hasLiked, likesCount, handleToggleLike, handleDelete, selectedImage, setSelectedImage }: ThemeProps) {
  const totalMilestones = trip.milestones?.length || 0
  const totalPhotos = trip.milestones?.reduce((acc: number, m: any) => acc + (m.images?.length || 0), 0) || 0
  const coverImage = trip.cover_image || trip.milestones?.find((m: any) => m.images && m.images.length > 0)?.images[0]

  return (
    <div className="min-h-screen bg-[#e8e4db] py-16 font-sans relative overflow-hidden">
      
      {/* Lightbox Overlay for Cover Image */}
      <ImageLightbox 
        images={selectedImage ? [selectedImage] : []}
        initialIndex={0}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-16 relative z-20">
          <Link href="/my-memories" className="inline-flex items-center text-amber-900 hover:text-amber-700 font-serif text-sm sm:text-lg transition-colors bg-[#f4f1ea] px-3 py-1.5 sm:px-4 sm:py-2 shadow-md rotate-[-1deg] border border-[#d8d3c5] whitespace-nowrap">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
            Return
          </Link>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <button 
              onClick={handleToggleLike}
              className={`inline-flex items-center font-serif text-sm sm:text-lg transition-colors bg-[#f4f1ea] px-3 py-1.5 sm:px-4 sm:py-2 shadow-md rotate-[1deg] border border-[#d8d3c5] whitespace-nowrap ${hasLiked ? 'text-red-600' : 'text-amber-900 hover:text-amber-700'}`}
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 ${hasLiked ? 'fill-current' : ''}`} />
              {likesCount} <span className="hidden sm:inline sm:ml-1">{likesCount === 1 ? 'Like' : 'Likes'}</span>
            </button>
            {isOwner && (
              <>
                <Link 
                  href={`/trip/${trip.id}/edit`}
                  className="inline-flex items-center text-amber-900 hover:text-amber-700 font-serif text-sm sm:text-lg transition-colors bg-[#f4f1ea] px-3 py-1.5 sm:px-4 sm:py-2 shadow-md rotate-[-1deg] border border-[#d8d3c5] whitespace-nowrap"
                >
                  Edit
                </Link>
                <button 
                  onClick={handleDelete}
                  className="inline-flex items-center text-red-700 hover:text-red-500 font-serif text-sm sm:text-lg transition-colors bg-[#f4f1ea] px-3 py-1.5 sm:px-4 sm:py-2 shadow-md rotate-[-2deg] border border-[#d8d3c5] whitespace-nowrap"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-32 relative">
          
          {coverImage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: 2 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative bg-white p-4 md:p-6 shadow-2xl mb-12 max-w-2xl w-full flex flex-col"
            >
              {/* Tape */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/40 backdrop-blur-sm -rotate-2 border border-white/20 shadow-sm z-10" />
              
              <Image 
                src={coverImage.split('|')[0]} 
                alt={trip.title} 
                onClick={() => setSelectedImage(coverImage)}
                className="w-full aspect-[4/3] object-cover sepia-[0.3] cursor-zoom-in"
              width={1200} height={1200} unoptimized={typeof coverImage === 'string' && (coverImage.startsWith('blob:') || coverImage.startsWith('data:'))} />
              
              <div className="mt-8 md:mt-12 mb-4 md:mb-6 text-center px-4 md:px-6 flex-grow flex flex-col justify-center">
                 <h1 className="text-4xl md:text-5xl font-serif text-slate-800 -rotate-2 leading-tight">
                  {trip.title || 'Untitled Trip'}
                 </h1>
              </div>
            </motion.div>
          )}

          {!coverImage && (
            <h1 className="text-5xl md:text-7xl font-serif text-amber-900 mb-8 -rotate-2">
              {trip.title || 'Untitled Trip'}
            </h1>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#f4f1ea] p-8 max-w-2xl mx-auto shadow-md border border-[#d8d3c5] rotate-1"
          >
            <p className="text-xl text-amber-900/80 font-serif leading-relaxed italic">
              "{trip.story}"
            </p>
            <div className="mt-6 flex justify-center gap-6 text-amber-800 font-serif text-lg">
              <span>{totalMilestones} Stops</span>
              <span>•</span>
              <span>{new Date(trip.created_at).toLocaleDateString()}</span>
            </div>
          </motion.div>
        </div>

        {/* Milestones / Polaroid Layout */}
        <div className="space-y-16 pb-16">
          {trip.milestones.map((milestone: any, i: number) => {
            const isEven = i % 2 === 0;
            const hasImages = milestone.images && milestone.images.length > 0;
            const rotation = isEven ? 'rotate-2' : '-rotate-2';
            
            return (
              <motion.div 
                key={milestone.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative"
              >
                {/* Connection string (pseudo timeline) */}
                {i < trip.milestones.length - 1 && (
                  <svg className="absolute left-1/2 -bottom-16 w-24 h-16 -translate-x-1/2 z-0 hidden md:block" preserveAspectRatio="none">
                    <path d="M12,0 Q24,16 12,32 T12,64" fill="none" stroke="#d8d3c5" strokeWidth="2" strokeDasharray="4 4" />
                  </svg>
                )}

                <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                  {/* Content Note */}
                  <div className={`w-full md:w-1/2 ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                    <div className={`bg-[#fffae6] p-8 shadow-md border border-[#eaddb6] ${isEven ? '-rotate-1' : 'rotate-1'} relative`}>
                      {/* Push pin */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-red-800 shadow-md border-2 border-red-900/50">
                        <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/40" />
                      </div>
                      
                      <h3 className="font-serif text-2xl md:text-3xl text-amber-900 mb-4 flex items-center gap-2">
                        <MapPin className="w-6 h-6" />
                        {milestone.title || 'Location'}
                      </h3>
                      <p className="font-serif text-amber-900/80 text-lg leading-relaxed whitespace-pre-wrap">
                        {milestone.content}
                      </p>
                    </div>
                  </div>

                  {/* Polaroids */}
                  <div className={`w-full md:w-1/2 ${isEven ? 'md:order-2' : 'md:order-1'}`}>
                    {hasImages ? (
                      <PolaroidGallery images={milestone.images} />
                    ) : (
                      <div className="w-full aspect-square max-w-sm mx-auto bg-white p-4 pb-16 shadow-xl flex items-center justify-center rotate-3">
                        <div className="absolute -top-3 right-8 w-16 h-6 bg-white/50 backdrop-blur-sm rotate-12 border border-white/20 shadow-sm" />
                        <Camera className="w-16 h-16 text-slate-200" />
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

function PolaroidGallery({ images }: { images: string[] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const handleOpen = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const renderMedia = (rawUrl: string) => {
    const isVideo = rawUrl.split('|')[0]?.split('?')[0]?.toLowerCase().match(/\.(mp4|mov|webm)$/);
    const mediaUrl = rawUrl.split('|')[0] || '';
    const thumbnailUrl = rawUrl.split('|')[1];

    return (
      <>
        {isVideo ? (
          thumbnailUrl ? (
            <Image src={thumbnailUrl} alt="Milestone Video" className="w-full aspect-square object-cover sepia-[0.4]" width={1200} height={1200} unoptimized={thumbnailUrl.startsWith('blob:') || thumbnailUrl.startsWith('data:')} />
          ) : (
            <div className="w-full aspect-square bg-slate-900 flex items-center justify-center">
              <Play className="w-12 h-12 text-white/30" />
            </div>
          )
        ) : (
          <Image src={mediaUrl} alt="Milestone" className="w-full aspect-square object-cover sepia-[0.4]" width={1200} height={1200} unoptimized={mediaUrl.startsWith('blob:') || mediaUrl.startsWith('data:')} />
        )}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Play className="w-5 h-5 text-white ml-1 fill-current opacity-90" />
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div className="relative w-full max-w-sm mx-auto h-[450px] md:h-[500px] group mt-8 md:mt-0">
        {images.slice(0, 3).map((img, idx) => {
          // Default stack positions
          const defaultRotations = ['rotate-3', '-rotate-6', 'rotate-6'];
          const defaultTranslate = [
            'translate-x-0 translate-y-0', 
            'translate-x-3 translate-y-4', 
            'translate-x-6 translate-y-8'
          ];
          const zIndexes = [30, 20, 10];
          
          // Hover spread positions (fan out)
          // idx 0 moves left, idx 1 stays center/up slightly, idx 2 moves right
          const hoverRotations = ['group-hover:-rotate-12', 'group-hover:rotate-0', 'group-hover:rotate-12'];
          const hoverTranslate = [
            'group-hover:-translate-x-12 md:group-hover:-translate-x-28 group-hover:-translate-y-4', 
            'group-hover:translate-x-0 group-hover:-translate-y-8', 
            'group-hover:translate-x-12 md:group-hover:translate-x-28 group-hover:-translate-y-2'
          ];
          
          return (
            <div 
              key={idx}
              onClick={() => handleOpen(idx)}
              className={`absolute top-0 left-0 right-0 mx-auto w-4/5 bg-white p-4 pb-20 shadow-[0_15px_40px_rgba(0,0,0,0.15)] border border-slate-200 
                ${defaultRotations[idx]} ${defaultTranslate[idx]}
                ${hoverRotations[idx]} ${hoverTranslate[idx]}
                hover:!z-50 hover:!scale-105 hover:shadow-2xl
                transition-all duration-700 ease-out cursor-zoom-in`}
              style={{ zIndex: zIndexes[idx] }}
            >
              {/* Tape */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-amber-100/50 backdrop-blur-sm -rotate-3 border border-amber-200/20 shadow-sm z-10" />
              
              <div className="w-full aspect-square relative">{renderMedia(img)}</div>
              <div className="absolute bottom-6 left-0 right-0 text-center font-serif text-xl text-slate-700 opacity-80 -rotate-2">
                Photo {idx + 1}
              </div>
            </div>
          )
        })}
      </div>
      <ImageLightbox 
        images={images}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  )
}
