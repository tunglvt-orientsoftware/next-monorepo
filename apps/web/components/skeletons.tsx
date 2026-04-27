'use client'

import { motion } from 'framer-motion'

// Base shimmer animation block
function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-lg bg-slate-200/60 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </div>
  )
}

// ──────────────────────────────────────────
// My Plans Page Skeleton
// ──────────────────────────────────────────
export function MyPlansPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#fdfcf8] p-4 pt-6 md:p-12 font-serif">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Shimmer className="h-10 w-48 rounded-xl" />
            <Shimmer className="h-5 w-72 rounded-lg" />
          </div>
          <Shimmer className="h-12 w-40 rounded-full" />
        </div>

        {/* Cards grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.4 }}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm"
            >
              {/* Gradient header */}
              <div className="h-32 bg-gradient-to-br from-slate-100 via-slate-50 to-white p-5 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <Shimmer className="h-6 w-16 rounded-full" />
                  <div className="flex items-center gap-2">
                    <Shimmer className="h-7 w-7 rounded-full" />
                    <Shimmer className="h-7 w-7 rounded-full" />
                  </div>
                </div>
                <Shimmer className="h-5 w-28 rounded-full" />
              </div>
              {/* Content */}
              <div className="p-5 space-y-3">
                <Shimmer className="h-6 w-3/4 rounded-lg" />
                <Shimmer className="h-4 w-full rounded-lg" />
                <Shimmer className="h-4 w-5/6 rounded-lg" />
                <div className="pt-3 border-t border-slate-100 mt-4">
                  <Shimmer className="h-3 w-32 rounded-lg" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────
// Dashboard Page Skeleton (Feed cards)
// ──────────────────────────────────────────
export function DashboardPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#fdfcf8] p-4 pt-6 md:p-12 font-serif">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              <Shimmer className="h-10 w-28 rounded-xl" />
              <Shimmer className="h-10 w-28 rounded-xl" />
            </div>
            <Shimmer className="h-5 w-64 rounded-lg" />
          </div>
          <div className="flex gap-3">
            <Shimmer className="h-12 w-32 rounded-full" />
            <Shimmer className="h-12 w-36 rounded-full" />
          </div>
        </div>

        {/* Feed cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.4 }}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm"
            >
              {/* Author banner */}
              <div className="p-4 flex items-center gap-3 border-b border-slate-100 bg-slate-50/50">
                <Shimmer className="w-8 h-8 rounded-full" />
                <Shimmer className="h-4 w-24 rounded-lg" />
              </div>
              {/* Cover image placeholder */}
              <Shimmer className="aspect-[4/3] w-full rounded-none" />
              {/* Content */}
              <div className="p-6 space-y-3">
                <Shimmer className="h-7 w-3/4 rounded-lg" />
                <Shimmer className="h-4 w-full rounded-lg" />
                <Shimmer className="h-4 w-5/6 rounded-lg" />
                <Shimmer className="h-3 w-32 rounded-lg mt-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────
// Notifications Page Skeleton
// ──────────────────────────────────────────
export function NotificationsPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#fdfcf8] font-serif pb-24 md:pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3">
              <Shimmer className="w-8 h-8 rounded-lg" />
              <Shimmer className="h-9 w-44 rounded-xl" />
            </div>
            <Shimmer className="h-4 w-36 rounded-lg mt-2" />
          </div>
          <Shimmer className="h-10 w-32 rounded-full" />
        </div>

        {/* Notification items */}
        <div className="space-y-3">
          {[...Array(8)].map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.25 }}
              className="flex items-start gap-4 p-5 rounded-2xl border border-slate-100 bg-white"
            >
              {/* Avatar with badge */}
              <div className="relative flex-shrink-0">
                <Shimmer className="w-12 h-12 rounded-full" />
                <Shimmer className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full" />
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0 space-y-2">
                <Shimmer className="h-4 w-full rounded-lg" />
                <Shimmer className="h-3 w-16 rounded-lg" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────
// My Memories Page Skeleton
// ──────────────────────────────────────────
export function MyMemoriesPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#f5f4ed] p-4 pt-6 md:p-12 font-serif">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Shimmer className="h-10 w-52 rounded-xl" />
            <Shimmer className="h-5 w-80 rounded-lg" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Shimmer className="h-12 w-36 rounded-full" />
            <Shimmer className="h-12 w-40 rounded-full" />
          </div>
        </div>

        {/* Trip cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.4 }}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm"
            >
              {/* Cover image */}
              <Shimmer className="aspect-[4/3] w-full rounded-none" />
              {/* Content */}
              <div className="p-6 space-y-3">
                <Shimmer className="h-7 w-3/4 rounded-lg" />
                <Shimmer className="h-4 w-full rounded-lg" />
                <Shimmer className="h-4 w-5/6 rounded-lg" />
                <Shimmer className="h-3 w-32 rounded-lg mt-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────
// Profile Page Skeleton
// ──────────────────────────────────────────
export function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-[#fdfcf8] font-serif pb-24 md:pb-12">
      {/* Cover */}
      <div className="h-64 md:h-80 w-full bg-gradient-to-br from-[#e0cdc0] to-[#c96442]/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,#c96442_1px,transparent_0)] bg-[length:24px_24px]" />
        <div className="absolute top-4 md:top-8 left-4 md:left-8">
          <Shimmer className="h-10 w-20 rounded-full" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        {/* Main card */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-200/40 border border-white/60 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Avatar */}
            <div className="-mt-16 md:-mt-20">
              <Shimmer className="w-32 h-32 md:w-40 md:h-40 rounded-full" />
            </div>
            {/* Info */}
            <div className="flex-1 space-y-3 mt-2 w-full text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <Shimmer className="h-9 w-48 rounded-xl mx-auto md:mx-0" />
                  <Shimmer className="h-5 w-24 rounded-lg mx-auto md:mx-0" />
                </div>
                <Shimmer className="h-10 w-28 rounded-full mx-auto md:mx-0" />
              </div>
              <Shimmer className="h-4 w-32 rounded-lg mx-auto md:mx-0 mt-4" />
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6 md:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 space-y-4">
              <Shimmer className="h-5 w-36 rounded-lg" />
              <Shimmer className="h-4 w-full rounded-lg" />
              <Shimmer className="h-4 w-full rounded-lg" />
              <Shimmer className="h-4 w-full rounded-lg" />
            </div>
            <Shimmer className="h-12 w-full rounded-2xl" />
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm md:col-span-2 space-y-6">
            <Shimmer className="h-7 w-48 rounded-lg" />
            <Shimmer className="h-4 w-72 rounded-lg" />
            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
              <Shimmer className="w-[172px] h-[172px] rounded-2xl flex-shrink-0" />
              <div className="flex-1 w-full space-y-4">
                <Shimmer className="h-3 w-20 rounded-lg" />
                <Shimmer className="h-12 w-full rounded-xl" />
                <Shimmer className="h-3 w-56 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────
// Plan Detail Page Skeleton
// ──────────────────────────────────────────
export function PlanDetailPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#fdfcf8] font-serif pb-24 md:pb-12">
      {/* Hero header */}
      <div className="bg-gradient-to-br from-[#c96442]/10 via-[#e0cdc0]/20 to-[#fdfcf8] pt-6 pb-16 md:pt-8 md:pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Shimmer className="h-10 w-24 rounded-full" />
            <div className="flex items-center gap-2">
              <Shimmer className="h-10 w-28 rounded-full" />
              <Shimmer className="h-10 w-10 rounded-full" />
            </div>
          </div>
          <div className="space-y-4 max-w-3xl">
            <Shimmer className="h-12 w-96 max-w-full rounded-xl" />
            <Shimmer className="h-5 w-72 rounded-lg" />
            <div className="flex gap-4">
              <Shimmer className="h-4 w-20 rounded-lg" />
              <Shimmer className="h-4 w-32 rounded-lg" />
              <Shimmer className="h-4 w-36 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8 space-y-10 relative z-10">
        <div className="flex justify-center">
          <Shimmer className="h-12 w-52 rounded-full" />
        </div>

        {/* Itinerary skeleton */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-100">
            <Shimmer className="h-7 w-28 rounded-lg" />
          </div>
          <div className="divide-y divide-slate-100">
            {[...Array(4)].map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.3 }}
                className="p-6 md:p-8"
              >
                <div className="flex items-start gap-4">
                  <Shimmer className="w-10 h-10 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <Shimmer className="h-6 w-48 rounded-lg" />
                    <Shimmer className="h-4 w-full rounded-lg" />
                    <Shimmer className="h-4 w-3/4 rounded-lg" />
                    <div className="bg-slate-50 rounded-xl p-4 space-y-2.5 mt-2">
                      <Shimmer className="h-3 w-16 rounded-lg" />
                      <Shimmer className="h-3 w-64 rounded-lg" />
                      <Shimmer className="h-3 w-48 rounded-lg" />
                      <Shimmer className="h-3 w-56 rounded-lg" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────
// Trip View Page Skeleton
// ──────────────────────────────────────────
export function TripViewPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#fdfcf8] font-serif">
      {/* Full-width cover */}
      <Shimmer className="w-full h-72 md:h-96 rounded-none" />

      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10 space-y-8 pb-24">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <Shimmer className="h-10 w-24 rounded-full" />
            <div className="flex gap-2">
              <Shimmer className="h-10 w-10 rounded-full" />
              <Shimmer className="h-10 w-10 rounded-full" />
            </div>
          </div>
          <Shimmer className="h-10 w-3/4 rounded-xl" />
          <Shimmer className="h-5 w-full rounded-lg" />
          <Shimmer className="h-5 w-2/3 rounded-lg" />
        </div>

        {/* Milestone skeletons */}
        {[...Array(3)].map((_, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4"
          >
            <Shimmer className="h-6 w-48 rounded-lg" />
            <Shimmer className="aspect-video w-full rounded-2xl" />
            <Shimmer className="h-4 w-full rounded-lg" />
            <Shimmer className="h-4 w-4/5 rounded-lg" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────
// Edit Trip Page Skeleton
// ──────────────────────────────────────────
export function EditTripPageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col items-center py-6 md:py-16 bg-[#f5f4ed] px-4 font-serif">
      <div className="w-full max-w-6xl space-y-6 md:space-y-12">
        <Shimmer className="h-10 w-24 rounded-full" />

        <div className="space-y-4 text-center">
          <Shimmer className="h-10 w-72 rounded-xl mx-auto" />
          <Shimmer className="h-5 w-96 max-w-full rounded-lg mx-auto" />
        </div>

        {/* Editor skeleton */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
          <div className="space-y-4">
            <Shimmer className="h-5 w-20 rounded-lg" />
            <Shimmer className="h-12 w-full rounded-xl" />
          </div>
          <div className="space-y-4">
            <Shimmer className="h-5 w-16 rounded-lg" />
            <Shimmer className="h-24 w-full rounded-xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Shimmer className="h-48 w-full rounded-2xl" />
            <Shimmer className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────
// Public Profile / Invite Page Skeleton
// ──────────────────────────────────────────
export function ProfileCardSkeleton() {
  return (
    <div className="min-h-screen bg-[#fdfcf8] font-serif py-12 px-4 relative">
      <div className="absolute top-8 left-8">
        <Shimmer className="h-10 w-20 rounded-full" />
      </div>

      <div className="max-w-md mx-auto mt-12">
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
          <Shimmer className="w-32 h-32 rounded-full mx-auto" />
          <Shimmer className="h-8 w-40 rounded-xl mx-auto" />
          <Shimmer className="h-5 w-24 rounded-lg mx-auto" />
          <Shimmer className="h-14 w-full rounded-full" />
        </div>
      </div>
    </div>
  )
}
