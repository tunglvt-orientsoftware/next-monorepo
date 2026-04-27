'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Mail, Globe, Code } from 'lucide-react'

export function Footer() {
  const pathname = usePathname()

  // Hide on auth pages and specific full-screen flows like trip viewer/editor
  const isAuthPage = pathname === '/login' || pathname === '/signup'
  const isTripPage = pathname?.startsWith('/trip/') || pathname === '/memory'
  
  if (isAuthPage || isTripPage) return null

  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-[calc(80px+env(safe-area-inset-bottom))] md:pb-12 px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 md:gap-8 mb-12">
          
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group hover:opacity-90 transition-opacity">
              <Image src="/logo.png" alt="WanderLog Logo" width={28} height={28} className="object-contain" />
              <span className="font-serif text-xl font-medium tracking-tight text-slate-900">
                WanderLog
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Crafting perfect journeys with AI. Turn your travel dreams into reality, and your memories into beautiful stories.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-[#c96442] transition-colors">
                <span className="sr-only">Contact</span>
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-[#c96442] transition-colors">
                <span className="sr-only">Website</span>
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">
                <span className="sr-only">Developers</span>
                <Code className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif font-medium text-slate-900 mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboard" className="text-slate-500 hover:text-[#c96442] text-sm transition-colors">
                  Itinerary Planner
                </Link>
              </li>
              <li>
                <Link href="/my-memories" className="text-slate-500 hover:text-[#c96442] text-sm transition-colors">
                  Memory Canvas
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-slate-500 hover:text-[#c96442] text-sm transition-colors">
                  Community Feed
                </Link>
              </li>
              <li>
                <a href="#" className="text-slate-500 hover:text-[#c96442] text-sm transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-medium text-slate-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-slate-500 hover:text-[#c96442] text-sm transition-colors">
                  Travel Guides
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-500 hover:text-[#c96442] text-sm transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-500 hover:text-[#c96442] text-sm transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-500 hover:text-[#c96442] text-sm transition-colors">
                  API Documentation
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h3 className="font-serif font-medium text-slate-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-slate-500 hover:text-[#c96442] text-sm transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-500 hover:text-[#c96442] text-sm transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-500 hover:text-[#c96442] text-sm transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-500 hover:text-[#c96442] text-sm transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between md:items-center items-start gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} WanderLog. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>Made with</span>
            <span className="text-red-500">♥</span>
            <span>for travelers</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
