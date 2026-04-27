'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { VideoPlayerWidget } from './VideoPlayerWidget'

interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageLightbox({ images, initialIndex, isOpen, onClose }: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Sync index when it opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const handleNext = useCallback((e?: React.MouseEvent | Event) => {
    if (e) e.stopPropagation();
    if (images.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }
  }, [images.length]);

  const handlePrev = useCallback((e?: React.MouseEvent | Event) => {
    if (e) e.stopPropagation();
    if (images.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext(e);
      if (e.key === 'ArrowLeft') handlePrev(e);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  const isVideo = (url: string) => {
    const cleanUrl = url.split('|')[0]?.split('?')[0]?.toLowerCase() || '';
    return cleanUrl.endsWith('.mp4') || cleanUrl.endsWith('.mov') || cleanUrl.endsWith('.webm');
  };

  const getMediaUrl = (url: string) => {
    return url.split('|')[0] || '';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-xl p-4 md:p-12 cursor-zoom-out"
        >
          <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50">
            <button 
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {images.length > 1 && (
            <>
              <button 
                onClick={handlePrev}
                className="absolute left-4 md:left-8 z-50 bg-white/10 hover:bg-white/20 text-white p-3 md:p-4 rounded-full backdrop-blur-md transition-colors"
              >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
              </button>
              
              <button 
                onClick={handleNext}
                className="absolute right-4 md:right-8 z-50 bg-white/10 hover:bg-white/20 text-white p-3 md:p-4 rounded-full backdrop-blur-md transition-colors"
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
              </button>
              
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white/70 text-sm tracking-widest uppercase border border-white/10">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}

          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-screen-2xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {isVideo(images[currentIndex] || '') ? (
              <div className="w-full h-full max-h-[90vh] flex items-center justify-center rounded-sm overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.05)] cursor-default">
                <VideoPlayerWidget 
                  url={getMediaUrl(images[currentIndex] || '')} 
                  autoPlay={true}
                  controls={true}
                  className="w-full h-full max-h-[90vh]"
                />
              </div>
            ) : (
              <Image 
                src={getMediaUrl(images[currentIndex] || '')} 
                alt={`Media ${currentIndex + 1}`} 
                className="max-w-full max-h-[90vh] object-contain rounded-sm shadow-[0_0_100px_rgba(255,255,255,0.05)] cursor-default" 
                width={1920} 
                height={1080} 
                unoptimized={typeof images[currentIndex] === 'string' && (images[currentIndex].startsWith('blob:') || images[currentIndex].startsWith('data:'))} 
                priority
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
