import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Traveler Profile',
  description: 'View this traveler\'s profile and shared memories.',
}

export default function UserProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
