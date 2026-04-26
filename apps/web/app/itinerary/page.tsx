import { ChatInput } from '@/components/itinerary/ChatInput'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Plan Itinerary',
  description: 'Tell us about your dream destination, travel style, and interests. We will craft a personalized itinerary just for you.',
}

export default function ItineraryPage() {
  return (
    <div className="flex min-h-screen flex-col items-center pt-8 md:justify-center bg-[#f5f4ed] p-4 font-serif">
      <div className="w-full max-w-3xl space-y-6 md:space-y-12 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-medium text-slate-900 tracking-tight">
            Plan your next journey
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-sans max-w-xl mx-auto">
            Tell us about your dream destination, travel style, and interests. We'll craft a personalized itinerary just for you.
          </p>
        </div>

        <ChatInput />
      </div>
    </div>
  )
}
