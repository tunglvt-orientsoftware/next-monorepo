import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Friend Invitation',
  description: 'You have been invited to connect on Travel AI.',
}

export default function InviteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
