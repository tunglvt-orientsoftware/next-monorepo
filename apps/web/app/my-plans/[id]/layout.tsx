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
  
  const { data: plan } = await supabase
    .from('plans')
    .select('title, prompt')
    .eq('id', id)
    .single()

  if (!plan) {
    return {
      title: 'Plan Not Found',
    }
  }

  // Get previous images to fallback if needed
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: plan.title || 'Untitled Plan',
    description: plan.prompt ? plan.prompt.slice(0, 160) : 'An AI-generated travel plan on WanderLog.',
    openGraph: {
      title: plan.title || 'Untitled Plan',
      description: plan.prompt ? plan.prompt.slice(0, 160) : 'An AI-generated travel plan on WanderLog.',
      images: previousImages,
    },
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
