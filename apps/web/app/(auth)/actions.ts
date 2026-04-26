'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

function getBaseUrl() {
  // 1. Explicit env var (set this on Vercel to your production URL)
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  // 2. Vercel auto-provides this for preview & production deployments
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  // 3. Fallback to localhost for development
  return 'http://localhost:3000'
}

export async function loginWithGoogle() {
  const supabase = await createClient()
  const baseUrl = getBaseUrl()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${baseUrl}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent select_account',
      },
    },
  })

  if (data.url) {
    redirect(data.url)
  }
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?message=Could not authenticate user')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const baseUrl = getBaseUrl()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${baseUrl}/auth/callback`,
    }
  })

  if (error) {
    redirect('/signup?message=Could not authenticate user')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function demoLogin() {
  const supabase = await createClient()

  const data = {
    email: 'demo@travelai.com',
    password: 'TravelDemoPassword123!',
  }

  // Attempt to sign up the demo user (in case it doesn't exist)
  const signUpRes = await supabase.auth.signUp(data)
  if (signUpRes.error) {
    console.error('Demo SignUp Error:', signUpRes.error.message)
  }

  // Sign in
  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Demo SignIn Error:', error.message)
    redirect(`/login?message=Error: ${error.message}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
