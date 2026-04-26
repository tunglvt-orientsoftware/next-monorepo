import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Memories',
  description: 'View your saved travel memories and experiences.',
}

export default function MyMemoriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
