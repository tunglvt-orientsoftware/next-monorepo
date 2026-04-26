'use client'

import { motion } from 'framer-motion'
import { Button } from '@workspace/ui/components/button'

const prompts = [
  "A weekend getaway to Paris",
  "3 days in Tokyo for foodies",
  "Relaxing week in Bali",
  "Adventure trip to Patagonia"
]

export function PromptChips({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 mt-4 justify-center">
      {prompts.map((prompt, index) => (
        <motion.div
          key={prompt}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelect(prompt)}
            className="rounded-full border-slate-300 text-slate-600 hover:text-[#c96442] hover:border-[#c96442] bg-white/50 backdrop-blur-sm"
          >
            {prompt}
          </Button>
        </motion.div>
      ))}
    </div>
  )
}
