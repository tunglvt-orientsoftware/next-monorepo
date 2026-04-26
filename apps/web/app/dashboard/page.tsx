import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your travel itineraries and memories.',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#f5f4ed] p-4 md:p-8 font-serif">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-medium text-slate-900 tracking-tight">Dashboard</h1>
        <p className="mt-4 text-slate-600 font-sans">
          Welcome back, {user.email}! Here are your travel memories.
        </p>
      </div>
    </div>
  )
}
