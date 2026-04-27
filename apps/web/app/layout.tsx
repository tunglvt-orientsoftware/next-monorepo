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
    template: '%s | WanderLog',
    default: 'WanderLog - Your stories, beautifully crafted.',
  },
  description: 'Your stories, beautifully crafted. Your journeys, perfectly planned. AI-powered travel planning and memory sharing platform.',
  openGraph: {
    title: 'WanderLog',
    description: 'Your stories, beautifully crafted. Your journeys, perfectly planned.',
    url: 'https://wanderlog.app', // placeholder for actual url
    siteName: 'WanderLog',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
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
