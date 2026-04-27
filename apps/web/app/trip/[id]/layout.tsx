import { Metadata, ResolvingMetadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id
  
  const supabase = await createClient()
  
  const { data: trip } = await supabase
    .from('trips')
    .select('title, story, cover_image')
    .eq('id', id)
    .single()

  if (!trip) {
    return {
      title: 'Trip Not Found',
    }
  }

  // Get previous images to fallback if needed
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: trip.title || 'Untitled Trip',
    description: trip.story ? trip.story.slice(0, 160) : 'A beautiful travel memory shared on WanderLog.',
    openGraph: {
      title: trip.title || 'Untitled Trip',
      description: trip.story ? trip.story.slice(0, 160) : 'A beautiful travel memory shared on WanderLog.',
      images: trip.cover_image 
        ? [{ url: trip.cover_image, width: 1200, height: 630 }]
        : previousImages,
    },
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
