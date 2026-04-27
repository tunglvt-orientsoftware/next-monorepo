import { openai } from '@ai-sdk/openai'
import { streamObject } from 'ai'
import { z } from 'zod'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { prompt, locale } = await req.json()

  // Determine the response language instruction
  const languageInstruction = locale
    ? `IMPORTANT: You MUST respond entirely in the language matching the locale "${locale}". All titles, descriptions, activities, and checklist items must be written in that language. If the user's message is in a specific language, respond in that same language.`
    : `Respond in the same language as the user's prompt. If the user writes in Vietnamese, respond in Vietnamese. If in English, respond in English. Match the user's language exactly.`

  const result = await streamObject({
    model: openai('gpt-4o'),
    system: `You are a world-class travel planner. Generate a highly curated, day-by-day itinerary based on the user's prompt. Provide engaging descriptions for each day and list specific activities. Also provide a practical checklist of items to pack or things to prepare before the trip. Keep the tone warm, literary, and inspiring. For each day, provide a highly specific Wikipedia page title (e.g. "Eiffel Tower", "Kyoto Imperial Palace") in 'imageSearchQuery' that best represents the location to fetch a hero image. The imageSearchQuery should always be in English for best image results.

${languageInstruction}`,
    prompt,
    schema: z.object({
      itinerary: z.array(
        z.object({
          day: z.number().describe('The day number of the trip (e.g. 1)'),
          title: z.string().describe('A catchy, inspiring title for the day'),
          description: z.string().describe('A short paragraph describing the vibe of the day'),
          activities: z.array(z.string()).describe('List of specific activities or places to visit'),
          imageSearchQuery: z.string().describe('A specific Wikipedia article title for the main location of this day (e.g., "Eiffel Tower"). Always in English.'),
        })
      ),
      checklist: z.array(z.string()).describe('A practical checklist of items to pack or things to prepare before the trip'),
    }),
  })

  return result.toTextStreamResponse()
}
