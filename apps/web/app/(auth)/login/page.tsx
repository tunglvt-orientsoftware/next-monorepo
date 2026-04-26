import { login, demoLogin, loginWithGoogle } from '../actions'
import { SubmitButton } from '@/components/auth/SubmitButton'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const message = (await searchParams).message

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f4ed] p-4 font-serif">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-sm">
        <div className="text-center">
          <h2 className="text-3xl font-medium text-slate-900 tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-600">Please sign in to your account</p>
        </div>

        <div className="mt-8 space-y-6">
          <form action={login} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="font-sans border-slate-200 focus-visible:ring-[#c96442]"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="font-sans border-slate-200 focus-visible:ring-[#c96442]"
                />
              </div>
            </div>

            {message && (
              <div className="text-sm text-red-600 font-sans text-center">
                {message}
              </div>
            )}

            <SubmitButton
              pendingText="Signing in..."
              className="w-full bg-[#c96442] hover:bg-[#b05537] text-white rounded-full h-11 font-sans shadow-md"
            >
              Sign in
            </SubmitButton>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500 font-sans">Or continue with</span>
            </div>
          </div>

          <div className="space-y-3">
            <form action={loginWithGoogle}>
              <SubmitButton
                variant="outline"
                pendingText="Connecting..."
                className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full h-11 font-sans flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </SubmitButton>
            </form>

            <form action={demoLogin}>
              <SubmitButton
                variant="outline"
                pendingText="Setting up demo..."
                className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full h-11 font-sans"
              >
                Try Demo Account
              </SubmitButton>
            </form>
          </div>

          <p className="text-center text-sm text-slate-600 font-sans">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-[#c96442] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
