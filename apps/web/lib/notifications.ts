import { createClient } from '@/lib/supabase/client'

export type NotificationType = 'friend_request' | 'friend_accepted' | 'trip_liked' | 'new_trip'

/**
 * Create a notification for a user.
 * @param userId - The user who will receive the notification
 * @param type - The notification type
 * @param actorId - The user who triggered the notification
 * @param referenceId - The related entity ID (trip_id, invite_code, etc.)
 * @param message - Human-readable notification message
 */
export async function createNotification(
  userId: string,
  type: NotificationType,
  actorId: string,
  referenceId: string | null,
  message: string
) {
  // Don't notify yourself
  if (userId === actorId) return

  const supabase = createClient()

  const { error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type,
      actor_id: actorId,
      reference_id: referenceId,
      message,
    })

  if (error) {
    console.error('Failed to create notification:', error)
  }
}

/**
 * Get unread notification count for the current user.
 */
export async function getUnreadCount(): Promise<number> {
  const supabase = createClient()
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false)

  if (error) {
    console.error('Failed to get unread count:', error)
    return 0
  }

  return count || 0
}

/**
 * Mark a single notification as read.
 */
export async function markAsRead(notificationId: string) {
  const supabase = createClient()
  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
}

/**
 * Mark all notifications as read for the current user.
 */
export async function markAllAsRead() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false)
}
