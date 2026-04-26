import { Geist, Geist_Mono, Inter } from "next/font/google"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  title: {
    template: '%s | Travel AI',
    default: 'Travel AI - Plan Your Next Trip',
  },
  description: 'AI-powered travel planning and memory sharing platform. Create itineraries, share trip memories, and explore public feeds.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <ThemeProvider>
          <Navigation />
          <main className="pt-0 md:pt-16 min-h-[calc(100vh-64px)]">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
