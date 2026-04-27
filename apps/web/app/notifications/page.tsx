'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { markAsRead, markAllAsRead } from '@/lib/notifications'
import { Bell, Heart, UserPlus, UserCheck, MapPin, Check, CheckCheck, Loader2, Inbox } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { motion, AnimatePresence } from 'framer-motion'

interface Notification {
  id: string
  user_id: string
  type: 'friend_request' | 'friend_accepted' | 'trip_liked' | 'new_trip'
  actor_id: string
  reference_id: string | null
  message: string
  is_read: boolean
  created_at: string
  actor?: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
}

const typeConfig = {
  friend_request: { icon: UserPlus, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
  friend_accepted: { icon: UserCheck, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-100' },
  trip_liked: { icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100' },
  new_trip: { icon: MapPin, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [markingAll, setMarkingAll] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    let channel: any = null

    async function fetchNotifications() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*, actor:actor_id(id, full_name, avatar_url)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (data) {
        setNotifications(data as Notification[])
      }
      setIsLoading(false)

      // Subscribe to realtime changes for this user's notifications
      channel = supabase
        .channel(`notifications-page:${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          async (payload: any) => {
            // Fetch full notification with actor info
            const { data: newNotif } = await supabase
              .from('notifications')
              .select('*, actor:actor_id(id, full_name, avatar_url)')
              .eq('id', payload.new.id)
              .single()

            if (newNotif) {
              setNotifications(prev => [newNotif as Notification, ...prev])
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload: any) => {
            setNotifications(prev =>
              prev.map(n => n.id === payload.new.id ? { ...n, ...payload.new } : n)
            )
          }
        )
        .subscribe()
    }

    fetchNotifications()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [router])

  const handleNotificationClick = async (notif: Notification) => {
    // Mark as read
    if (!notif.is_read) {
      await markAsRead(notif.id)
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n))
    }

    // Navigate based on type
    switch (notif.type) {
      case 'friend_request':
        if (notif.reference_id) {
          // reference_id could be invite_code or profile id
          // Check if it looks like a UUID
          const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(notif.reference_id)
          if (isUUID) {
            router.push(`/profile/${notif.actor_id}`)
          } else {
            router.push(`/invite/${notif.reference_id}`)
          }
        } else {
          router.push(`/profile/${notif.actor_id}`)
        }
        break
      case 'friend_accepted':
        router.push(`/profile/${notif.actor_id}`)
        break
      case 'trip_liked':
      case 'new_trip':
        if (notif.reference_id) {
          router.push(`/trip/${notif.reference_id}`)
        }
        break
    }
  }

  const handleMarkAllRead = async () => {
    setMarkingAll(true)
    await markAllAsRead()
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setMarkingAll(false)
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fdfcf8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#c96442] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fdfcf8] font-serif pb-24 md:pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-medium text-slate-900 tracking-tight flex items-center gap-3">
              <Bell className="w-8 h-8 text-[#c96442]" />
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="text-slate-500 font-sans text-sm mt-1">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllRead}
              disabled={markingAll}
              variant="outline"
              className="rounded-full font-sans text-sm h-10 px-5 border-slate-200 hover:border-[#c96442]/30 hover:bg-[#c96442]/5 hover:text-[#c96442]"
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              {markingAll ? 'Marking...' : 'Mark all read'}
            </Button>
          )}
        </div>

        {/* Notification List */}
        {notifications.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <Inbox className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-xl text-slate-400 font-sans">No notifications yet</p>
            <p className="text-sm text-slate-400 font-sans mt-2">
              When someone interacts with you, you&apos;ll see it here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {notifications.map((notif, index) => {
                const config = typeConfig[notif.type]
                const Icon = config.icon
                const actorName = notif.actor?.full_name || 'Someone'

                return (
                  <motion.button
                    key={notif.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.25 }}
                    onClick={() => handleNotificationClick(notif)}
                    className={`w-full text-left flex items-start gap-4 p-5 rounded-2xl border transition-all group cursor-pointer ${
                      notif.is_read
                        ? 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm'
                        : `bg-white border-[#c96442]/15 shadow-sm hover:shadow-md ring-1 ring-[#c96442]/5`
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                        {notif.actor?.avatar_url ? (
                          <img src={notif.actor.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg font-sans font-semibold text-slate-400">
                            {actorName.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${config.bg} ${config.border} border flex items-center justify-center`}>
                        <Icon className={`w-3 h-3 ${config.color}`} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-sans text-sm leading-relaxed ${notif.is_read ? 'text-slate-600' : 'text-slate-900'}`}>
                        <span className="font-semibold">{actorName}</span>{' '}
                        {notif.message}
                      </p>
                      <p className={`font-sans text-xs mt-1 ${notif.is_read ? 'text-slate-400' : 'text-[#c96442]'}`}>
                        {timeAgo(notif.created_at)}
                      </p>
                    </div>

                    {/* Unread indicator */}
                    {!notif.is_read && (
                      <div className="flex-shrink-0 mt-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#c96442] shadow-sm shadow-[#c96442]/30" />
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
