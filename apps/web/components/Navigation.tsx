'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Home, LayoutDashboard, Image as ImageIcon, User, Compass, Bell } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function Navigation() {
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState(0)

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Memories', href: '/my-memories', icon: ImageIcon },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  // Hide on landing and auth pages
  const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/signup'

  // Poll for unread notifications
  useEffect(() => {
    if (isPublicPage) return

    async function fetchUnread() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { count, error } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_read', false)

        if (!error && count !== null) {
          setUnreadCount(count)
        }
      } catch {
        // silently ignore on public pages or when not logged in
      }
    }

    fetchUnread()
    const interval = setInterval(fetchUnread, 30000) // Poll every 30s
    return () => clearInterval(interval)
  }, [pathname, isPublicPage])

  if (isPublicPage) return null

  const isNotificationsActive = pathname === '/notifications'

  return (
    <>
      {/* Top Header Navigation (Desktop) */}
      <header className="hidden md:flex fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 h-16 items-center px-8">
        <div className="flex items-center gap-2 font-serif text-xl font-bold text-[#c96442] mr-8">
          <Compass className="w-6 h-6" />
          <span>TravelAI</span>
        </div>
        <nav className="flex items-center gap-1 flex-1 max-w-5xl">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-[#c96442]/10 text-[#c96442]' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        {/* Notification Bell (Desktop) */}
        <Link
          href="/notifications"
          className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all ml-4 ${
            isNotificationsActive
              ? 'bg-[#c96442]/10 text-[#c96442]'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 shadow-sm animate-in zoom-in-50 duration-200">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Link>
      </header>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-white border-t border-slate-200 z-[100] px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive ? 'text-[#c96442]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`p-1.5 rounded-full transition-colors ${isActive ? 'bg-[#c96442]/10' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'fill-[#c96442]/20' : ''}`} />
              </div>
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          )
        })}
        
        {/* Notification Bell (Mobile) */}
        <Link
          href="/notifications"
          className={`flex flex-col items-center gap-1 transition-all relative ${
            isNotificationsActive ? 'text-[#c96442]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-1.5 rounded-full transition-colors relative ${isNotificationsActive ? 'bg-[#c96442]/10' : ''}`}>
            <Bell className={`w-5 h-5 ${isNotificationsActive ? 'fill-[#c96442]/20' : ''}`} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full px-0.5 shadow-sm">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Alerts</span>
        </Link>
      </nav>
    </>
  )
}
