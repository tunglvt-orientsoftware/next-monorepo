'use client'

import { useState, useCallback } from 'react'
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
import { Loader2, Check, MapPin, GripVertical, ImagePlus, UploadCloud, Paintbrush, Globe, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { createNotification } from '@/lib/notifications'

// Sortable Milestone Item Component
function SortableMilestone({ milestone, updateMilestone, onAddImages }: { 
  milestone: Milestone; 
  updateMilestone: (id: string, data: Partial<Milestone>) => void;
  onAddImages: (id: string, files: File[]) => void;
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
    <div ref={setNodeRef} style={style} className="relative group pl-8 md:pl-12 py-4">
      {/* Timeline Line & Dot */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-[#c96442]/20 group-first:top-8 group-last:bottom-auto group-last:h-full" />
      <div className="absolute -left-[9px] top-8 w-5 h-5 rounded-full bg-[#c96442] border-4 border-[#f5f4ed] shadow-sm flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-white rounded-full" />
      </div>

      <div className={`bg-white rounded-2xl overflow-hidden border transition-shadow ${isDragging ? 'shadow-xl border-[#c96442]' : 'border-slate-200 shadow-sm hover:shadow-md'}`}>
        
        {/* Header / Drag Handle */}
        <div className="flex items-center gap-2 p-3 border-b border-slate-100 bg-slate-50/50">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-slate-200 rounded-md text-slate-400 hover:text-slate-600 transition-colors">
            <GripVertical className="w-5 h-5" />
          </div>
          <Input 
            value={milestone.title} 
            onChange={(e) => updateMilestone(milestone.id, { title: e.target.value })} 
            placeholder="Where did this happen? (e.g. Fushimi Inari)"
            className="font-serif text-lg border-transparent hover:border-slate-200 focus-visible:ring-[#c96442] bg-transparent shadow-none"
          />
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5">
          {/* Images Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {milestone.images.map((img, i) => (
              <div 
                key={i} 
                draggable
                onDragStart={(e) => handleImageDragStart(e, i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleImageDrop(e, i)}
                className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative group/img cursor-move"
              >
                <img src={img} alt="Milestone" className="w-full h-full object-cover pointer-events-none" />
                <button 
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-all backdrop-blur-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            ))}
            
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
      </div>
    </div>
  )
}


export function TimelineEditor({ tripId }: { tripId?: string }) {
  const { tripTitle, tripStory, theme, coverImage, isPublic, milestones, setTripTitle, setTripStory, setTheme, setCoverImage, setIsPublic, addMilestones, updateMilestone, reorderMilestones, resetTrip } = useTripStore()
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

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

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const handleAddImagesToMilestone = async (id: string, files: File[]) => {
    const newImages = await Promise.all(files.map(fileToBase64))
    const milestone = milestones.find(m => m.id === id)
    if (milestone) {
      updateMilestone(id, { images: [...milestone.images, ...newImages] })
    }
  }

  // Global dropzone for creating NEW milestones
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.heic'] },
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return
      const newImages = await Promise.all(acceptedFiles.map(fileToBase64))
      addMilestones([{
        id: Math.random().toString(36).substring(7),
        title: '',
        content: '',
        images: newImages
      }])
    }
  })

  // Cover Image Dropzone
  const { getRootProps: getCoverRootProps, getInputProps: getCoverInputProps, isDragActive: isCoverDragActive } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.heic'] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0 || !acceptedFiles[0]) return
      const base64 = await fileToBase64(acceptedFiles[0])
      setCoverImage(base64)
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

  const handleSave = async () => {
    if (!tripTitle && milestones.length === 0) return;
    setIsSaving(true)
    
    try {
      const supabase = createClient()
      
      let finalCoverImage = coverImage;
      if (coverImage) {
        finalCoverImage = await uploadBase64ToSupabase(coverImage, supabase);
      }

      // 1. Upload new base64 images to Supabase Storage
      const updatedMilestones = await Promise.all(milestones.map(async (milestone) => {
        const newImages = await Promise.all(milestone.images.map(img => uploadBase64ToSupabase(img, supabase)));
        
        return {
          ...milestone,
          images: newImages
        }
      }));

      // 2. Save the final trip payload to Supabase Database
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const payload = {
        title: tripTitle || 'Untitled Trip',
        story: tripStory,
        cover_image: finalCoverImage,
        milestones: updatedMilestones,
        user_id: user.id,
        theme: theme,
        is_public: isPublic
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
      if (tripId) {
        router.push(`/my-memories/${tripId}`)
      } else {
        // Notify all friends about the new trip (only for new trips, not edits)
        try {
          const { data: friends1 } = await supabase.from('friends').select('friend_id').eq('user_id', user.id).eq('status', 'accepted')
          const { data: friends2 } = await supabase.from('friends').select('user_id').eq('friend_id', user.id).eq('status', 'accepted')
          
          const friendIds = [
            ...(friends1?.map(f => f.friend_id) || []),
            ...(friends2?.map(f => f.user_id) || [])
          ]
          
          // Get the newly created trip ID
          const { data: latestTrip } = await supabase
            .from('trips')
            .select('id')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()
          
          if (latestTrip && friendIds.length > 0) {
            await Promise.all(friendIds.map(friendId =>
              createNotification(
                friendId,
                'new_trip',
                user.id,
                latestTrip.id,
                `shared a new trip: "${tripTitle || 'Untitled Trip'}"`
              )
            ))
          }
        } catch (notifErr) {
          console.error('Failed to send new trip notifications:', notifErr)
        }
        router.push('/my-memories')
      }
    } catch (err) {
      console.error('Failed to save trip:', err);
      alert('Failed to save trip. Make sure the database schema is created and bucket exists.');
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-12 pb-32">
      
      {/* Trip Header */}
      <div className="space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Optional Cover Image Background or Preview */}
        {coverImage && (
          <div className="absolute top-0 left-0 w-full h-48 md:h-64 opacity-20 pointer-events-none">
            <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
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
                <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setCoverImage(null)}
                  className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
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
      
      {/* Privacy Settings */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-serif text-2xl text-slate-900 flex items-center">
          <Globe className="w-6 h-6 mr-3 text-[#c96442]" />
          Visibility
        </h3>
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={() => setIsPublic(false)}
            className={`flex-1 p-4 rounded-2xl border-2 text-left transition-all ${!isPublic ? 'border-[#c96442] bg-[#c96442]/5' : 'border-slate-200 hover:border-[#c96442]/50'}`}
          >
            <div className="flex items-center font-serif text-xl text-slate-900 mb-1">
              <Users className="w-5 h-5 mr-2" /> Friends Only
            </div>
            <div className="font-sans text-sm text-slate-500">Only you and your accepted friends can see this trip on their feeds.</div>
          </button>
          <button
            onClick={() => setIsPublic(true)}
            className={`flex-1 p-4 rounded-2xl border-2 text-left transition-all ${isPublic ? 'border-[#c96442] bg-[#c96442]/5' : 'border-slate-200 hover:border-[#c96442]/50'}`}
          >
            <div className="flex items-center font-serif text-xl text-slate-900 mb-1">
              <Globe className="w-5 h-5 mr-2" /> Public Community
            </div>
            <div className="font-sans text-sm text-slate-500">Anyone in the community can discover and view this trip on the public feed.</div>
          </button>
        </div>
      </div>

      {/* Theme Selector */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-serif text-2xl text-slate-900 flex items-center">
          <Paintbrush className="w-6 h-6 mr-3 text-[#c96442]" />
          Choose a Theme
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setTheme('scrapbook')}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${theme === 'scrapbook' ? 'border-[#c96442] bg-[#c96442]/5' : 'border-slate-200 hover:border-[#c96442]/50'}`}
          >
            <div className="font-serif text-xl text-slate-900 mb-1">Scrapbook</div>
            <div className="font-sans text-sm text-slate-500">Freeform collages with playful background elements.</div>
          </button>
          <button
            onClick={() => setTheme('magazine')}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${theme === 'magazine' ? 'border-[#c96442] bg-[#c96442]/5' : 'border-slate-200 hover:border-[#c96442]/50'}`}
          >
            <div className="font-serif text-xl text-slate-900 mb-1">Minimalist Magazine</div>
            <div className="font-sans text-sm text-slate-500">Elegant typography with large full-width images.</div>
          </button>
          <button
            onClick={() => setTheme('polaroid')}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${theme === 'polaroid' ? 'border-[#c96442] bg-[#c96442]/5' : 'border-slate-200 hover:border-[#c96442]/50'}`}
          >
            <div className="font-serif text-xl text-slate-900 mb-1">Vintage Polaroid</div>
            <div className="font-sans text-sm text-slate-500">Nostalgic taped polaroid photos on a paper texture.</div>
          </button>
          <button
            onClick={() => setTheme('summer')}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${theme === 'summer' ? 'border-[#c96442] bg-[#c96442]/5' : 'border-slate-200 hover:border-[#c96442]/50'}`}
          >
            <div className="font-serif text-xl text-slate-900 mb-1">Summer Vibes</div>
            <div className="font-sans text-sm text-slate-500">Bright colors, organic shapes, and a warm summer feel.</div>
          </button>
          <button
            onClick={() => setTheme('classic')}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${theme === 'classic' ? 'border-[#c96442] bg-[#c96442]/5' : 'border-slate-200 hover:border-[#c96442]/50'}`}
          >
            <div className="font-serif text-xl text-slate-900 mb-1">Classic Grid</div>
            <div className="font-sans text-sm text-slate-500">Structured layout with black borders and serif fonts.</div>
          </button>
          <button
            onClick={() => setTheme('cinematic')}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${theme === 'cinematic' ? 'border-[#c96442] bg-[#c96442]/5' : 'border-slate-200 hover:border-[#c96442]/50'}`}
          >
            <div className="font-serif text-xl text-slate-900 mb-1">Cinematic Dark</div>
            <div className="font-sans text-sm text-slate-500">Dark mode with widescreen photos and glowing accents.</div>
          </button>
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
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Global Add Milestone Dropzone */}
        <div className="pl-8 md:pl-12 mt-8">
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
              isDragActive ? 'border-[#c96442] bg-[#c96442]/5 scale-[1.02]' : 'border-slate-300 bg-white hover:border-[#c96442]/50 hover:bg-[#f5f4ed]/50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#f5f4ed] flex items-center justify-center">
                <UploadCloud className="w-7 h-7 text-[#c96442]" />
              </div>
              <div>
                <p className="text-lg font-medium text-slate-900 font-serif">
                  {isDragActive ? "Drop to create a new milestone" : "Drag photos here to add a new milestone"}
                </p>
                <p className="text-sm text-slate-500 font-sans mt-1">
                  You can upload multiple photos at once.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Save Button */}
      <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-sm md:w-auto z-50">
        <Button 
          onClick={handleSave} 
          disabled={isSaving || (!tripTitle && milestones.length === 0)}
          className="w-full h-14 md:px-8 rounded-full font-sans transition-all text-lg shadow-xl bg-[#c96442] hover:bg-[#b05537] hover:scale-105 active:scale-95 text-white"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Publishing Story...
            </>
          ) : (
            'Publish Trip Story'
          )}
        </Button>
      </div>

    </div>
  )
}
