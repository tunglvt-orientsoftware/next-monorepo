-- ==============================================
-- Enable Realtime for Notifications Table
-- Run this in Supabase Dashboard → SQL Editor
-- ==============================================

-- Enable realtime on the notifications table so clients
-- can subscribe to INSERT/UPDATE/DELETE events via
-- supabase.channel().on('postgres_changes', ...)
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
