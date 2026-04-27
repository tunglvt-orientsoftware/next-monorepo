'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import { 
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { useDropzone } from 'react-dropzone'
import { useTripStore, Milestone } from '@/lib/store'
import { Input } from '@workspace/ui/components/input'
import { Textarea } from '@workspace/ui/components/textarea'
import { Button } from '@workspace/ui/components/button'
import { UploadCloud, GripVertical, Loader2, ImagePlus, Globe, Lock, Users, Paintbrush, ChevronDown, ChevronUp, ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { createNotification } from '@/lib/notifications'
import Image from 'next/image'
import imageCompression from 'browser-image-compression'

// Sortable Milestone Item Component
function SortableMilestone({ 
  milestone, 
  updateMilestone, 
  onAddImages, 
  uploadingStates,
  isExpanded,
  onToggleExpand
}: { 
  milestone: Milestone; 
  updateMilestone: (id: string, data: Partial<Milestone>) => void;
  onAddImages: (id: string, files: File[]) => void;
  uploadingStates: Record<string, { progress: number }>;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: milestone.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.heic']
    },
    onDrop: (acceptedFiles) => {
      onAddImages(milestone.id, acceptedFiles)
      if (!isExpanded) onToggleExpand()
    }
  })

  const removeImage = (indexToRemove: number) => {
    const newImages = milestone.images.filter((_, i) => i !== indexToRemove)
    updateMilestone(milestone.id, { images: newImages })
  }

  const handleImageDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('imageIndex', index.toString())
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleImageDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    const sourceIndex = parseInt(e.dataTransfer.getData('imageIndex'))
    if (isNaN(sourceIndex) || sourceIndex === targetIndex) return

    const newImages = [...milestone.images]
    const [movedImage] = newImages.splice(sourceIndex, 1)
    if (movedImage) {
      newImages.splice(targetIndex, 0, movedImage)
      updateMilestone(milestone.id, { images: newImages })
    }
  }

  return (
    <div ref={setNodeRef} style={style} className="relative group pl-5 md:pl-12 py-4">
      {/* Timeline Line & Dot */}
      <div className="absolute left-0 md:left-2 top-0 bottom-0 w-px bg-[#c96442]/20 group-first:top-8 group-last:bottom-auto group-last:h-full" />
      <div className="absolute -left-[9px] md:-left-[1px] top-8 w-5 h-5 rounded-full bg-[#c96442] border-4 border-[#f5f4ed] shadow-sm flex items-center justify-center cursor-pointer" onClick={onToggleExpand}>
        <div className="w-1.5 h-1.5 bg-white rounded-full" />
      </div>

      <div className={`bg-white rounded-2xl overflow-hidden border transition-shadow ${isDragging ? 'shadow-xl border-[#c96442]' : 'border-slate-200 shadow-sm hover:shadow-md'}`}>
        
        {/* Header / Drag Handle */}
        <div 
          className={`flex items-center gap-2 p-3 border-b transition-colors cursor-pointer select-none ${isExpanded ? 'border-slate-100 bg-slate-50/50' : 'border-transparent bg-white hover:bg-slate-50'}`}
          onClick={onToggleExpand}
        >
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-slate-200 rounded-md text-slate-400 hover:text-slate-600 transition-colors" onClick={(e) => e.stopPropagation()}>
            <GripVertical className="w-5 h-5" />
          </div>
          
          <div className="flex-1 flex items-center justify-between gap-2">
            <Input 
              value={milestone.title} 
              onChange={(e) => updateMilestone(milestone.id, { title: e.target.value })} 
              onClick={(e) => e.stopPropagation()}
              placeholder="Where did this happen? (e.g. Fushimi Inari)"
              className="font-serif text-lg border-transparent hover:border-slate-200 focus-visible:ring-[#c96442] bg-transparent shadow-none"
            />
            
            <div className="flex items-center gap-2 flex-shrink-0">
              {!isExpanded && milestone.images.length > 0 && (
                <div className="flex items-center text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
                  <ImageIcon className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {milestone.images.length}
                </div>
              )}
              <div className="text-slate-400 p-1 rounded-md hover:bg-slate-100 transition-colors">
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        {isExpanded && (
          <div className="p-4 md:p-5 space-y-4 md:space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Images Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
              {milestone.images.map((img, i) => {
                const isUploading = uploadingStates[img] !== undefined;
                const progress = uploadingStates[img]?.progress ?? 100;

                return (
                  <div 
                    key={i} 
                    draggable={!isUploading}
                    onDragStart={!isUploading ? (e) => handleImageDragStart(e, i) : undefined}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={!isUploading ? (e) => handleImageDrop(e, i) : undefined}
                    className={`aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative group/img ${!isUploading ? 'cursor-move' : ''}`}
                  >
                    <Image 
                      src={img} 
                      alt="Milestone" 
                      fill 
                      className="object-cover pointer-events-none"
                      unoptimized={img.startsWith('blob:') || img.startsWith('data:')}
                    />
                    
                    {!isUploading && (
                      <button 
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-all backdrop-blur-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    )}

                    {isUploading && (
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-3">
                        <Loader2 className="w-5 h-5 text-white animate-spin mb-2" />
                        <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden">
                          <div className="h-full bg-white transition-all duration-300" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
              
              {/* Inline Dropzone for more images */}
              <div 
                {...getRootProps()} 
                className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-[#c96442] bg-[#c96442]/5' : 'border-slate-300 hover:border-[#c96442]/50 hover:bg-slate-50'
                }`}
              >
                <input {...getInputProps()} />
                <ImagePlus className="w-6 h-6 text-slate-400 mb-2" />
                <span className="text-xs text-slate-500 font-sans font-medium text-center px-2">Add Photo</span>
              </div>
            </div>

            <Textarea 
              value={milestone.content} 
              onChange={(e) => updateMilestone(milestone.id, { content: e.target.value })} 
              placeholder="Tell the story of this moment..."
              className="min-h-[100px] font-sans resize-none text-base border-slate-200 focus-visible:ring-[#c96442] bg-slate-50/50"
            />
          </div>
        )}
      </div>
    </div>
  )
}


export function TimelineEditor({ tripId }: { tripId?: string }) {
  const { tripTitle, tripStory, theme, coverImage, visibility, milestones, setTripTitle, setTripStory, setTheme, setCoverImage, setVisibility, addMilestones, updateMilestone, reorderMilestones, resetTrip } = useTripStore()
  const [isSaving, setIsSaving] = useState(false)
  const [expandedMilestoneId, setExpandedMilestoneId] = useState<string | null>(milestones.length > 0 ? (milestones[0]?.id || null) : null);
  const router = useRouter()

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => e.preventDefault()
    const handleDrop = (e: DragEvent) => e.preventDefault()

    window.addEventListener('dragover', handleDragOver)
    window.addEventListener('drop', handleDrop)

    return () => {
      window.removeEventListener('dragover', handleDragOver)
      window.removeEventListener('drop', handleDrop)
    }
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = milestones.findIndex((m) => m.id === active.id)
      const newIndex = milestones.findIndex((m) => m.id === over.id)
      reorderMilestones(arrayMove(milestones, oldIndex, newIndex))
    }
  }

  const [uploadingStates, setUploadingStates] = useState<Record<string, { progress: number }>>({})

  const uploadFileToSupabase = async (file: File, objectUrl: string, milestoneId?: string) => {
    const supabase = createClient()
    const ext = file.type.split('/')[1] || 'jpeg'
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const path = `uploads/${filename}`;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress > 90) progress = 90;
      setUploadingStates(prev => ({ ...prev, [objectUrl]: { progress } }));
    }, 200);

    try {
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);

      const { data, error } = await supabase.storage.from('trip-images').upload(path, compressedFile, {
        cacheControl: '3600',
        upsert: false
      });

      clearInterval(interval);
      setUploadingStates(prev => ({ ...prev, [objectUrl]: { progress: 100 } }));

      if (error) {
        console.error('Error uploading image:', error);
        return null;
      }
      
      const { data: { publicUrl } } = supabase.storage.from('trip-images').getPublicUrl(path);
      
      if (milestoneId) {
        const currentMilestone = useTripStore.getState().milestones.find(m => m.id === milestoneId)
        if (currentMilestone) {
          useTripStore.getState().updateMilestone(milestoneId, {
            images: currentMilestone.images.map(img => img === objectUrl ? publicUrl : img)
          })
        }
      } else {
        if (useTripStore.getState().coverImage === objectUrl) {
          useTripStore.getState().setCoverImage(publicUrl)
        }
      }
      
      setTimeout(() => {
        setUploadingStates(prev => {
          const newState = { ...prev };
          delete newState[objectUrl];
          return newState;
        });
        URL.revokeObjectURL(objectUrl);
      }, 500);

      return publicUrl;
    } catch (e) {
      clearInterval(interval);
      console.error('Failed to upload image', e);
      return null;
    }
  }

  const handleAddImagesToMilestone = async (id: string, files: File[]) => {
    const objectUrls = files.map(file => URL.createObjectURL(file))
    const milestone = milestones.find(m => m.id === id)
    if (milestone) {
      updateMilestone(id, { images: [...milestone.images, ...objectUrls] })
    }
    
    const newUploadingStates: Record<string, { progress: number }> = {}
    objectUrls.forEach(url => newUploadingStates[url] = { progress: 0 })
    setUploadingStates(prev => ({ ...prev, ...newUploadingStates }))

    files.forEach((file, index) => {
      uploadFileToSupabase(file, objectUrls[index]!, id)
    })
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.heic'] },
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return
      const objectUrls = acceptedFiles.map(file => URL.createObjectURL(file))
      
      const newMilestoneId = Math.random().toString(36).substring(7)
      addMilestones([{
        id: newMilestoneId,
        title: '',
        content: '',
        images: objectUrls
      }])
      setExpandedMilestoneId(newMilestoneId)

      const newUploadingStates: Record<string, { progress: number }> = {}
      objectUrls.forEach(url => newUploadingStates[url] = { progress: 0 })
      setUploadingStates(prev => ({ ...prev, ...newUploadingStates }))

      acceptedFiles.forEach((file, index) => {
        uploadFileToSupabase(file, objectUrls[index]!, newMilestoneId)
      })
    }
  })

  const { getRootProps: getCoverRootProps, getInputProps: getCoverInputProps, isDragActive: isCoverDragActive } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.heic'] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0 || !acceptedFiles[0]) return
      const file = acceptedFiles[0]
      const objectUrl = URL.createObjectURL(file)
      setCoverImage(objectUrl)
      
      setUploadingStates(prev => ({ ...prev, [objectUrl]: { progress: 0 } }))
      uploadFileToSupabase(file, objectUrl)
    }
  })

  const uploadBase64ToSupabase = async (imgUrl: string, supabase: any) => {
    if (!imgUrl.startsWith('data:image')) return imgUrl;
    
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      
      const ext = blob.type.split('/')[1] || 'jpeg'
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      const path = `uploads/${filename}`;
      
      const { data, error } = await supabase.storage.from('trip-images').upload(path, blob, {
        cacheControl: '3600',
        upsert: false
      });
      
      if (error) {
        console.error('Error uploading image:', error);
        return imgUrl;
      }
      
      const { data: { publicUrl } } = supabase.storage.from('trip-images').getPublicUrl(path);
      return publicUrl;
    } catch (e) {
      console.error('Failed to upload image', e);
      return imgUrl;
    }
  }

  const handleSave = async (isDraft: boolean = false) => {
    if (!tripTitle && milestones.length === 0) return;
    setIsSaving(true)
    
    try {
      const supabase = createClient()
      
      let finalCoverImage = coverImage;
      if (coverImage) {
        finalCoverImage = await uploadBase64ToSupabase(coverImage, supabase);
      }

      const updatedMilestones = await Promise.all(milestones.map(async (milestone) => {
        const newImages = await Promise.all(milestone.images.map(img => uploadBase64ToSupabase(img, supabase)));
        
        return {
          ...milestone,
          images: newImages
        }
      }));

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const payload = {
        title: tripTitle || 'Untitled Trip',
        story: tripStory,
        cover_image: finalCoverImage,
        milestones: updatedMilestones,
        user_id: user.id,
        theme: theme,
        visibility: visibility,
        is_draft: isDraft
      }

      let saveError;
      if (tripId) {
        const { error } = await supabase.from('trips').update(payload).eq('id', tripId);
        saveError = error;
      } else {
        const { error } = await supabase.from('trips').insert(payload);
        saveError = error;
      }

      if (saveError) throw saveError;

      resetTrip();
      router.push('/my-memories')
    } catch (err) {
      console.error('Failed to save trip:', err);
      alert('Failed to save trip.');
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-12 pb-32">
      
      <div className="space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        {coverImage && (
          <div className="absolute top-0 left-0 w-full h-48 md:h-64 opacity-20 pointer-events-none">
            <Image 
              src={coverImage} 
              alt="Cover" 
              fill
              className="object-cover" 
              unoptimized={coverImage.startsWith('blob:') || coverImage.startsWith('data:')}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
          </div>
        )}
        
        <div className="relative z-10 space-y-6 pt-4">
          <Input 
            value={tripTitle} 
            onChange={(e) => setTripTitle(e.target.value)} 
            placeholder="Give your trip a beautiful title..."
            className="font-serif text-3xl md:text-4xl py-8 border-transparent hover:border-slate-200 focus-visible:ring-[#c96442] text-center font-medium text-slate-900 placeholder:text-slate-300 bg-transparent"
          />
          <Textarea 
            value={tripStory} 
            onChange={(e) => setTripStory(e.target.value)} 
            placeholder="Write a short summary or introduction to this journey..."
            className="min-h-[120px] font-sans resize-none text-lg border-transparent hover:border-slate-200 focus-visible:ring-[#c96442] text-center text-slate-600 placeholder:text-slate-300 bg-transparent"
          />
          
          <div className="pt-4 border-t border-slate-100 flex justify-center">
            {coverImage ? (
              <div className="relative group w-full max-w-md h-40 rounded-2xl overflow-hidden border shadow-sm">
                <Image 
                  src={coverImage} 
                  alt="Cover Preview" 
                  fill 
                  className="object-cover" 
                  unoptimized={coverImage.startsWith('blob:') || coverImage.startsWith('data:')}
                />
                {!uploadingStates[coverImage] && (
                  <button 
                    onClick={() => setCoverImage(null)}
                    className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                )}
                {uploadingStates[coverImage] && (
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-6">
                    <Loader2 className="w-8 h-8 text-white animate-spin mb-3" />
                    <div className="w-3/4 h-2 bg-white/30 rounded-full overflow-hidden">
                      <div className="h-full bg-white transition-all duration-300" style={{ width: `${uploadingStates[coverImage].progress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div 
                {...getCoverRootProps()} 
                className={`w-full max-w-md h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                  isCoverDragActive ? 'border-[#c96442] bg-[#c96442]/5' : 'border-slate-200 bg-slate-50 hover:border-[#c96442]/50'
                }`}
              >
                <input {...getCoverInputProps()} />
                <ImagePlus className="w-6 h-6 text-slate-400 mb-2" />
                <span className="text-sm text-slate-500 font-sans">Set a Cover Image</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Timeline Container */}
      <div className="relative">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={milestones.map(m => m.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {milestones.map((milestone) => (
                <SortableMilestone 
                  key={milestone.id} 
                  milestone={milestone} 
                  updateMilestone={updateMilestone}
                  onAddImages={handleAddImagesToMilestone}
                  uploadingStates={uploadingStates}
                  isExpanded={expandedMilestoneId === milestone.id}
                  onToggleExpand={() => setExpandedMilestoneId(expandedMilestoneId === milestone.id ? null : milestone.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Global Add Milestone Dropzone */}
        <div className={`pl-5 md:pl-12 mt-8 ${milestones.length === 0 ? 'pl-0 md:pl-0' : ''}`}>
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
              isDragActive ? 'border-[#c96442] bg-[#c96442]/5 scale-[1.02]' : 'border-slate-300 bg-white hover:border-[#c96442]/50 hover:bg-[#f5f4ed]/50'
            } ${milestones.length === 0 ? 'py-20 bg-white/80 shadow-sm border-[#c96442]/30' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className={`rounded-full flex items-center justify-center ${milestones.length === 0 ? 'w-20 h-20 bg-[#c96442]/10' : 'w-14 h-14 bg-[#f5f4ed]'}`}>
                <UploadCloud className={`${milestones.length === 0 ? 'w-10 h-10' : 'w-7 h-7'} text-[#c96442]`} />
              </div>
              <div>
                <p className={`${milestones.length === 0 ? 'text-2xl' : 'text-lg'} font-medium text-slate-900 font-serif`}>
                  {isDragActive ? "Drop to create a new milestone" : "Drag photos here to add a new milestone"}
                </p>
                <p className={`${milestones.length === 0 ? 'text-base' : 'text-sm'} text-slate-500 font-sans mt-2`}>
                  You can upload multiple photos at once. Each drop creates a new story block.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 space-y-12">
        <div className="flex items-center gap-4">
          <div className="h-px bg-slate-200 flex-1"></div>
          <span className="font-serif text-slate-400 text-sm uppercase tracking-widest">Publish Settings</span>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-serif text-xl md:text-2xl text-slate-900 flex items-center">
            <Globe className="w-5 h-5 md:w-6 md:h-6 mr-3 text-[#c96442]" />
            Visibility
          </h3>
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <button
              onClick={() => setVisibility('private')}
              className={`flex-1 p-4 rounded-2xl border-2 text-left transition-all ${visibility === 'private' ? 'border-[#c96442] bg-[#c96442]/5 shadow-sm' : 'border-slate-100 hover:border-[#c96442]/30 bg-slate-50 hover:bg-white'}`}
            >
              <div className="flex items-center font-serif text-lg text-slate-900 mb-1">
                <Lock className={`w-4 h-4 mr-2 ${visibility === 'private' ? 'text-[#c96442]' : 'text-slate-400'}`} /> Just Me
              </div>
              <div className="font-sans text-xs text-slate-500 leading-relaxed">Only you can see this trip.</div>
            </button>
            <button
              onClick={() => setVisibility('friends')}
              className={`flex-1 p-4 rounded-2xl border-2 text-left transition-all ${visibility === 'friends' ? 'border-[#c96442] bg-[#c96442]/5 shadow-sm' : 'border-slate-100 hover:border-[#c96442]/30 bg-slate-50 hover:bg-white'}`}
            >
              <div className="flex items-center font-serif text-lg text-slate-900 mb-1">
                <Users className={`w-4 h-4 mr-2 ${visibility === 'friends' ? 'text-[#c96442]' : 'text-slate-400'}`} /> Friends Only
              </div>
              <div className="font-sans text-xs text-slate-500 leading-relaxed">Only you and your friends can see this.</div>
            </button>
            <button
              onClick={() => setVisibility('public')}
              className={`flex-1 p-4 rounded-2xl border-2 text-left transition-all ${visibility === 'public' ? 'border-[#c96442] bg-[#c96442]/5 shadow-sm' : 'border-slate-100 hover:border-[#c96442]/30 bg-slate-50 hover:bg-white'}`}
            >
              <div className="flex items-center font-serif text-lg text-slate-900 mb-1">
                <Globe className={`w-4 h-4 mr-2 ${visibility === 'public' ? 'text-[#c96442]' : 'text-slate-400'}`} /> Public Community
              </div>
              <div className="font-sans text-xs text-slate-500 leading-relaxed">Anyone in the community can view this.</div>
            </button>
          </div>
        </div>

        {/* Theme Selector */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-serif text-xl md:text-2xl text-slate-900 flex items-center">
            <Paintbrush className="w-5 h-5 md:w-6 md:h-6 mr-3 text-[#c96442]" />
            Choose a Theme
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <button
              onClick={() => setTheme('scrapbook')}
              className={`relative overflow-hidden rounded-2xl border-2 text-left transition-all flex flex-col h-full ${theme === 'scrapbook' ? 'border-[#c96442] shadow-md ring-2 ring-[#c96442]/20' : 'border-slate-200 hover:border-[#c96442]/50 bg-white'}`}
            >
              <div className="relative w-full aspect-video border-b border-slate-100 bg-slate-50">
                <Image src="/themes/theme_scrapbook.png" alt="Scrapbook Theme" fill className="object-cover" />
              </div>
              <div className="p-4 bg-white flex-1">
                <div className="font-serif text-lg text-slate-900 mb-1">Scrapbook</div>
                <div className="font-sans text-sm text-slate-500 line-clamp-2 leading-relaxed">Freeform collages with playful background elements.</div>
              </div>
            </button>
            
            <button
              onClick={() => setTheme('magazine')}
              className={`relative overflow-hidden rounded-2xl border-2 text-left transition-all flex flex-col h-full ${theme === 'magazine' ? 'border-[#c96442] shadow-md ring-2 ring-[#c96442]/20' : 'border-slate-200 hover:border-[#c96442]/50 bg-white'}`}
            >
              <div className="relative w-full aspect-video border-b border-slate-100 bg-slate-50">
                <Image src="/themes/theme_magazine.png" alt="Magazine Theme" fill className="object-cover" />
              </div>
              <div className="p-4 bg-white flex-1">
                <div className="font-serif text-lg text-slate-900 mb-1">Magazine</div>
                <div className="font-sans text-sm text-slate-500 line-clamp-2 leading-relaxed">Elegant typography with large full-width images.</div>
              </div>
            </button>

            <button
              onClick={() => setTheme('polaroid')}
              className={`relative overflow-hidden rounded-2xl border-2 text-left transition-all flex flex-col h-full ${theme === 'polaroid' ? 'border-[#c96442] shadow-md ring-2 ring-[#c96442]/20' : 'border-slate-200 hover:border-[#c96442]/50 bg-white'}`}
            >
              <div className="relative w-full aspect-video border-b border-slate-100 bg-slate-50">
                <Image src="/themes/theme_polaroid.png" alt="Polaroid Theme" fill className="object-cover" />
              </div>
              <div className="p-4 bg-white flex-1">
                <div className="font-serif text-lg text-slate-900 mb-1">Vintage Polaroid</div>
                <div className="font-sans text-sm text-slate-500 line-clamp-2 leading-relaxed">Nostalgic taped polaroid photos on a paper texture.</div>
              </div>
            </button>

            <button
              onClick={() => setTheme('summer')}
              className={`relative overflow-hidden rounded-2xl border-2 text-left transition-all flex flex-col h-full ${theme === 'summer' ? 'border-[#c96442] shadow-md ring-2 ring-[#c96442]/20' : 'border-slate-200 hover:border-[#c96442]/50 bg-white'}`}
            >
              <div className="relative w-full aspect-video border-b border-slate-100 bg-slate-50">
                <Image src="/themes/theme_summer.png" alt="Summer Vibes Theme" fill className="object-cover" />
              </div>
              <div className="p-4 bg-white flex-1">
                <div className="font-serif text-lg text-slate-900 mb-1">Summer Vibes</div>
                <div className="font-sans text-sm text-slate-500 line-clamp-2 leading-relaxed">Bright colors, organic shapes, and a warm summer feel.</div>
              </div>
            </button>

            <button
              onClick={() => setTheme('classic')}
              className={`relative overflow-hidden rounded-2xl border-2 text-left transition-all flex flex-col h-full ${theme === 'classic' ? 'border-[#c96442] shadow-md ring-2 ring-[#c96442]/20' : 'border-slate-200 hover:border-[#c96442]/50 bg-white'}`}
            >
              <div className="relative w-full aspect-video border-b border-slate-100 bg-slate-50">
                <Image src="/themes/theme_classic.png" alt="Classic Grid Theme" fill className="object-cover" />
              </div>
              <div className="p-4 bg-white flex-1">
                <div className="font-serif text-lg text-slate-900 mb-1">Classic Grid</div>
                <div className="font-sans text-sm text-slate-500 line-clamp-2 leading-relaxed">Structured layout with black borders and serif fonts.</div>
              </div>
            </button>

            <button
              onClick={() => setTheme('cinematic')}
              className={`relative overflow-hidden rounded-2xl border-2 text-left transition-all flex flex-col h-full ${theme === 'cinematic' ? 'border-[#c96442] shadow-md ring-2 ring-[#c96442]/20' : 'border-slate-800 hover:border-[#c96442]/50 bg-slate-800'}`}
            >
              <div className="relative w-full aspect-video border-b border-slate-800 bg-slate-900">
                <Image src="/themes/theme_cinematic.png" alt="Cinematic Dark Theme" fill className="object-cover" />
              </div>
              <div className="p-4 bg-slate-800 flex-1">
                <div className="font-serif text-lg text-white mb-1">Cinematic Dark</div>
                <div className="font-sans text-sm text-slate-400 line-clamp-2 leading-relaxed">Dark mode with widescreen photos and glowing accents.</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Save Buttons */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-slate-200 z-50 p-4 md:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-3xl mx-auto flex gap-3">
          <Button 
            onClick={() => handleSave(true)} 
            disabled={isSaving || Object.keys(uploadingStates).length > 0 || (!tripTitle && milestones.length === 0)}
            variant="outline"
            className="flex-1 md:flex-none md:w-40 h-14 rounded-full font-sans transition-all text-lg bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-50 border-slate-200"
          >
            Save Draft
          </Button>
          <Button 
            onClick={() => handleSave(false)} 
            disabled={isSaving || Object.keys(uploadingStates).length > 0 || (!tripTitle && milestones.length === 0)}
            className="flex-[2] md:flex-1 h-14 rounded-full font-sans transition-all text-lg shadow-md bg-[#c96442] hover:bg-[#b05537] hover:scale-[1.02] active:scale-95 disabled:hover:scale-100 disabled:active:scale-100 disabled:bg-slate-300 disabled:cursor-not-allowed text-white"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : Object.keys(uploadingStates).length > 0 ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              'Publish Story'
            )}
          </Button>
        </div>
      </div>

    </div>
  )
}

