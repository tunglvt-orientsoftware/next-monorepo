import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Memory',
  description: 'Create a beautiful new travel memory canvas from your photos.',
}

export default function MemoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
