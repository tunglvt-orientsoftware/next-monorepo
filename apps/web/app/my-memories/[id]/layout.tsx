import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Trip Memory',
  description: 'A beautiful travel memory shared on Travel AI.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
