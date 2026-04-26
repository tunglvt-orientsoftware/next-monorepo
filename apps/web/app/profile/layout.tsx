import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Profile',
  description: 'View and manage your travel profile, friends, and settings.',
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
