'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { ImageLightbox } from './ImageLightbox'

interface MediaGalleryGridProps {
  mediaUrls: string[];
  className?: string;
}

export function MediaGalleryGrid({ mediaUrls, className = '' }: MediaGalleryGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!mediaUrls || mediaUrls.length === 0) return null;

  const count = mediaUrls.length;

  const isVideo = (url: string) => {
    const cleanUrl = url.split('|')[0]?.split('?')[0]?.toLowerCase() || '';
    return cleanUrl.endsWith('.mp4') || cleanUrl.endsWith('.mov') || cleanUrl.endsWith('.webm');
  };

  const getMediaUrl = (url: string) => {
    return url.split('|')[0] || '';
  };

  const getThumbnailUrl = (url: string) => {
    const parts = url.split('|');
    return parts.length > 1 ? parts[1] : null;
  };

  const handleOpen = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const renderMediaItem = (index: number) => {
    const rawUrl = mediaUrls[index];
    if (!rawUrl) return null;

    const video = isVideo(rawUrl);
    const mediaUrl = getMediaUrl(rawUrl);
    const thumbnailUrl = getThumbnailUrl(rawUrl);

    return (
      <div 
        className="relative w-full h-full overflow-hidden group cursor-zoom-in bg-black"
        onClick={() => handleOpen(index)}
      >
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
        {video ? (
          thumbnailUrl ? (
            <Image 
              src={thumbnailUrl} 
              alt={`Video Thumbnail ${index + 1}`} 
              fill
              className="object-cover opacity-90 group-hover:opacity-100 scale-105 group-hover:scale-100 transition-all duration-700 ease-out" 
              unoptimized={thumbnailUrl.startsWith('blob:') || thumbnailUrl.startsWith('data:')} 
            />
          ) : (
            <div className="w-full h-full bg-slate-900 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
              <Play className="w-12 h-12 text-white/30" />
            </div>
          )
        ) : (
          <Image 
            src={mediaUrl} 
            alt={`Media ${index + 1}`} 
            fill
            className="object-cover opacity-90 group-hover:opacity-100 scale-105 group-hover:scale-100 transition-all duration-700 ease-out" 
            unoptimized={mediaUrl.startsWith('blob:') || mediaUrl.startsWith('data:')} 
          />
        )}
        
        {/* Video Icon Overlay */}
        {video && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Play className="w-5 h-5 md:w-6 md:h-6 text-white ml-1 fill-current opacity-90" />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderGrid = () => {
    if (count === 1) {
      return (
        <div className="w-full aspect-[21/9] md:aspect-[16/9] max-h-[600px]">
          {renderMediaItem(0)}
        </div>
      );
    }
    
    if (count === 2) {
      return (
        <div className="grid grid-cols-2 gap-2 aspect-[16/9] md:aspect-[21/9] max-h-[500px]">
          {renderMediaItem(0)}
          {renderMediaItem(1)}
        </div>
      );
    }

    if (count === 3) {
      return (
        <div className="grid grid-cols-3 gap-2 aspect-[16/9] md:aspect-[21/9] max-h-[600px]">
          <div className="col-span-2">
            {renderMediaItem(0)}
          </div>
          <div className="grid grid-rows-2 gap-2">
            {renderMediaItem(1)}
            {renderMediaItem(2)}
          </div>
        </div>
      );
    }

    // 4 or more items
    return (
      <div className="grid grid-rows-2 gap-2 aspect-[4/3] md:aspect-[16/9] max-h-[700px]">
        <div className="grid grid-cols-2 gap-2">
          {renderMediaItem(0)}
          {renderMediaItem(1)}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {renderMediaItem(2)}
          <div className="relative">
            {renderMediaItem(3)}
            {count > 4 && (
              <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-30 cursor-pointer hover:bg-black/50 transition-colors"
                onClick={() => handleOpen(3)}
              >
                <span className="text-white text-3xl md:text-5xl font-light">+{count - 4}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full ${className}`}>
      {renderGrid()}
      
      <ImageLightbox 
        images={mediaUrls}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
