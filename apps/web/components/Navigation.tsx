'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LayoutDashboard, Image as ImageIcon, User, Compass } from 'lucide-react'

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Memories', href: '/my-memories', icon: ImageIcon },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  // Hide on landing and auth pages
  const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/signup'
  if (isPublicPage) return null

  return (
    <>
      {/* Top Header Navigation (Desktop) */}
      <header className="hidden md:flex fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 h-16 items-center px-8">
        <div className="flex items-center gap-2 font-serif text-xl font-bold text-[#c96442] mr-8">
          <Compass className="w-6 h-6" />
          <span>TravelAI</span>
        </div>
        <nav className="flex items-center gap-1 w-full max-w-5xl">
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
      </header>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-white border-t border-slate-200 z-[100] px-6 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
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
      </nav>
    </>
  )
}
