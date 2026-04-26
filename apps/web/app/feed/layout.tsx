import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Public Feed',
  description: 'Discover travel memories and itineraries shared by the community.',
}

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
