'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

/**
 * Hook that subscribes to Supabase Realtime for the current user's notifications.
 * Returns the current unread count and provides a way to force-refresh.
 */
export function useRealtimeNotifications() {
  const [unreadCount, setUnreadCount] = useState(0)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const userIdRef = useRef<string | null>(null)

  const fetchUnreadCount = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      userIdRef.current = user.id

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false)

      if (!error && count !== null) {
        setUnreadCount(count)
      }
    } catch {
      // silently ignore when not logged in
    }
  }, [])

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    async function setup() {
      // Initial fetch
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !mounted) return

      userIdRef.current = user.id

      // Fetch initial count
      await fetchUnreadCount()

      // Subscribe to realtime changes on the notifications table for this user
      const channel = supabase
        .channel(`notifications:${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (_payload) => {
            // New notification arrived — increment count
            if (mounted) {
              setUnreadCount((prev) => prev + 1)
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
          (_payload) => {
            // A notification was updated (marked read) — re-fetch count
            if (mounted) {
              fetchUnreadCount()
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (_payload) => {
            if (mounted) {
              fetchUnreadCount()
            }
          }
        )
        .subscribe()

      channelRef.current = channel
    }

    setup()

    return () => {
      mounted = false
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [fetchUnreadCount])

  return { unreadCount, setUnreadCount, refreshCount: fetchUnreadCount }
}
