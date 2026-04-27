import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Milestone {
  id: string
  images: string[]
  title: string
  content: string
}

export interface SavedTrip {
  id: string
  title: string
  story: string
  milestones: Milestone[]
  createdAt: number
}

export interface TripState {
  tripTitle: string
  tripStory: string
  theme: string
  coverImage: string | null
  visibility: 'public' | 'friends' | 'private'
  milestones: Milestone[]
  setTripTitle: (title: string) => void
  setTripStory: (story: string) => void
  setTheme: (theme: string) => void
  setCoverImage: (image: string | null) => void
  setVisibility: (visibility: 'public' | 'friends' | 'private') => void
  addMilestones: (milestones: Milestone[]) => void
  updateMilestone: (id: string, data: Partial<Milestone>) => void
  removeMilestone: (id: string) => void
  reorderMilestones: (milestones: Milestone[]) => void
  setTripData: (data: { tripTitle: string, tripStory: string, theme: string, coverImage: string | null, visibility: 'public' | 'friends' | 'private', milestones: Milestone[] }) => void
  resetTrip: () => void
}

export const useTripStore = create<TripState>((set, get) => ({
  tripTitle: '',
  tripStory: '',
  theme: 'scrapbook',
  coverImage: null,
  visibility: 'friends',
  milestones: [],
  setTripTitle: (tripTitle) => set({ tripTitle }),
  setTripStory: (tripStory) => set({ tripStory }),
  setTheme: (theme) => set({ theme }),
  setCoverImage: (coverImage) => set({ coverImage }),
  setVisibility: (visibility) => set({ visibility }),
  addMilestones: (newMilestones) => 
    set((state) => ({ milestones: [...state.milestones, ...newMilestones] })),
  updateMilestone: (id, data) =>
    set((state) => ({
      milestones: state.milestones.map((m) => (m.id === id ? { ...m, ...data } : m)),
    })),
  removeMilestone: (id) =>
    set((state) => ({
      milestones: state.milestones.filter((m) => m.id !== id),
    })),
  reorderMilestones: (milestones) => set({ milestones }),
  setTripData: (data) => set({ ...data }),
  resetTrip: () => set({ tripTitle: '', tripStory: '', theme: 'scrapbook', coverImage: null, visibility: 'friends', milestones: [] }),
}))
