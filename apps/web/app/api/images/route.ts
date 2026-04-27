import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 })
  }

  const countParam = searchParams.get('count')
  const count = countParam ? parseInt(countParam, 10) : 3
  const num = Math.min(Math.max(count, 1), 10)

  try {
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
    const GOOGLE_CX = process.env.GOOGLE_CX || 'd01840e848e32406a'

    // If Google API Key is provided, use Google Custom Search API
    if (GOOGLE_API_KEY) {
      const response = await fetch(
        `https://customsearch.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(query)}&searchType=image&num=${num}`
      )
      
      const data = await response.json()
      
      if (data.items && data.items.length > 0) {
        const urls = data.items.map((item: any) => item.link)
        return NextResponse.json({ urls, url: urls[0] })
      }
    }

    // Fallback to Wikipedia if Google API Key is missing or no results found
    const fallbackResponse = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
        query
      )}&gsrlimit=${num}&prop=pageimages&format=json&pithumbsize=1000&origin=*`
    )

    const fallbackData = await fallbackResponse.json()
    const pages = fallbackData.query?.pages

    if (pages) {
      const urls = Object.values(pages)
        .map((p: any) => p.thumbnail?.source)
        .filter(Boolean) as string[]

      if (urls.length > 0) {
        return NextResponse.json({ urls, url: urls[0] })
      }
    }

    // Final fallback to pollinations.ai which generates a highly accurate photo of the location
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(query + ' travel photography landscape beautiful high quality')}?width=1000&height=600&nologo=true`
    return NextResponse.json({ 
      urls: [pollinationsUrl],
      url: pollinationsUrl 
    })

  } catch (error) {
    console.error('Image search error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    )
  }
}
