import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit Trip Memory',
  description: 'Edit your beautiful travel memory canvas.',
}

export default function EditTripMemoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
