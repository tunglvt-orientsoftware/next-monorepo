'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Camera, Loader2, X, User } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import Image from 'next/image'
import imageCompression from 'browser-image-compression'

interface EditProfileDialogProps {
  profile: any
  open: boolean
  onClose: () => void
  onSave: (updatedProfile: any) => void
}

export function EditProfileDialog({ profile, open, onClose, onSave }: EditProfileDialogProps) {
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [username, setUsername] = useState(profile?.username || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Re-sync form fields when dialog opens or profile changes
  useEffect(() => {
    if (open && profile) {
      setFullName(profile.full_name || '')
      setUsername(profile.username || '')
      setBio(profile.bio || '')
      setAvatarUrl(profile.avatar_url || '')
      setAvatarPreview(null)
      setAvatarFile(null)
      setError(null)
    }
  }, [open, profile])

  const handleAvatarSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB')
      return
    }

    setError(null)
    setAvatarFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  const uploadAvatar = async (userId: string): Promise<string | null> => {
    if (!avatarFile) return avatarUrl

    setUploading(true)
    try {
      // Compress the image before uploading
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 500, // Avatars don't need to be huge
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(avatarFile, options);

      const supabase = createClient()
      const fileExt = compressedFile.name.split('.').pop() || 'jpeg'
      const fileName = `${userId}/avatar.${fileExt}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, compressedFile, {
          cacheControl: '3600',
          upsert: true,
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        setError('Failed to upload image. Please try again.')
        return null
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // Add cache-busting timestamp to force refresh
      return `${publicUrl}?t=${Date.now()}`
    } catch (err) {
      console.error('Upload failed:', err)
      setError('Failed to upload image')
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('Not authenticated')
        setSaving(false)
        return
      }

      // Upload avatar if changed
      let finalAvatarUrl = avatarUrl
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar(user.id)
        if (uploadedUrl === null) {
          setSaving(false)
          return
        }
        finalAvatarUrl = uploadedUrl
      }

      // Update profile in database
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          username: username.trim() || null,
          bio: bio.trim() || null,
          avatar_url: finalAvatarUrl || null,
        })
        .eq('id', user.id)
        .select()
        .single()

      if (updateError) {
        // Handle unique constraint violation on username
        if (updateError.code === '23505' && updateError.message?.includes('username')) {
          setError('This username is already taken. Please choose another one.')
        } else {
          setError('Failed to update profile. Please try again.')
        }
        console.error('Update error:', updateError)
        setSaving(false)
        return
      }

      onSave(updatedProfile)
      onClose()
    } catch (err) {
      console.error('Save failed:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  const currentAvatar = avatarPreview || avatarUrl

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in-0 duration-200"
        onClick={onClose}
      />

      {/* Dialog Content */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-slate-900/10 animate-in zoom-in-95 fade-in-0 slide-in-from-bottom-4 duration-300 overflow-hidden">
        
        {/* Header with gradient */}
        <div className="relative h-28 bg-gradient-to-br from-[#c96442]/80 to-[#e0cdc0] overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] bg-[length:20px_20px]" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <h2 className="absolute bottom-4 left-6 text-xl font-serif font-medium text-white drop-shadow-sm">
            Edit Profile
          </h2>
        </div>

        {/* Avatar Upload - overlapping header */}
        <div className="flex justify-center -mt-14 relative z-10">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full bg-white p-1.5 shadow-lg">
              <div className="relative w-full h-full rounded-full bg-slate-100 overflow-hidden flex items-center justify-center">
                {currentAvatar ? (
                  <Image
                    src={currentAvatar}
                    alt="Avatar preview"
                    fill
                    className="object-cover"
                    unoptimized={currentAvatar.startsWith('blob:') || currentAvatar.startsWith('data:')}
                  />
                ) : (
                  <User className="w-12 h-12 text-slate-300" />
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 bg-[#c96442] hover:bg-[#b05537] text-white p-2.5 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Form */}
        <div className="px-6 pt-5 pb-6 space-y-5">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider">
              Display Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your display name"
              maxLength={50}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c96442]/30 focus:border-[#c96442] transition-all"
            />
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="block text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-sans text-sm">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="username"
                maxLength={30}
                className="w-full h-12 pl-9 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c96442]/30 focus:border-[#c96442] transition-all"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label className="block text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the world about your travel adventures..."
              maxLength={160}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c96442]/30 focus:border-[#c96442] transition-all resize-none"
            />
            <p className="text-xs font-sans text-slate-400 text-right">{bio.length}/160</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl font-sans text-sm border border-red-100 animate-in fade-in-0 slide-in-from-top-1 duration-200">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 rounded-xl h-12 font-sans border-slate-200 text-slate-600 hover:bg-slate-50"
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !fullName.trim()}
              className="flex-1 rounded-xl h-12 font-sans bg-[#c96442] hover:bg-[#b05537] text-white shadow-md disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
