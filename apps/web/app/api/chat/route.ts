import { openai } from '@ai-sdk/openai'
import { streamObject } from 'ai'
import { z } from 'zod'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const result = await streamObject({
    model: openai('gpt-4o'),
    system: `You are a world-class travel planner. Generate a highly curated, day-by-day itinerary based on the user's prompt. Provide engaging descriptions for each day and list specific activities. Also provide a practical checklist of items to pack or things to prepare before the trip. Keep the tone warm, literary, and inspiring. For each day, provide a highly specific Wikipedia page title (e.g. "Eiffel Tower", "Kyoto Imperial Palace") in 'imageSearchQuery' that best represents the location to fetch a hero image.`,
    prompt,
    schema: z.object({
      itinerary: z.array(
        z.object({
          day: z.number().describe('The day number of the trip (e.g. 1)'),
          title: z.string().describe('A catchy, inspiring title for the day'),
          description: z.string().describe('A short paragraph describing the vibe of the day'),
          activities: z.array(z.string()).describe('List of specific activities or places to visit'),
          imageSearchQuery: z.string().describe('A specific Wikipedia article title for the main location of this day (e.g., "Eiffel Tower")'),
        })
      ),
      checklist: z.array(z.string()).describe('A practical checklist of items to pack or things to prepare before the trip'),
    }),
  })

  return result.toTextStreamResponse()
}
