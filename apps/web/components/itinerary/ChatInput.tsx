'use client'

import { useState } from 'react'
import { SendHorizontal, Save, Loader2, Check, BookmarkPlus } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Textarea } from '@workspace/ui/components/textarea'
import { Checkbox } from '@workspace/ui/components/checkbox'
import { PromptChips } from './PromptChips'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

import { experimental_useObject as useObject } from '@ai-sdk/react'
import { z } from 'zod'

const itinerarySchema = z.object({
  itinerary: z.array(
    z.object({
      day: z.number(),
      title: z.string(),
      description: z.string(),
      activities: z.array(z.string()),
      imageSearchQuery: z.string().optional(),
    })
  ),
  checklist: z.array(z.string()).optional(),
})

import { Timeline } from './Timeline'

export function ChatInput() {
  const [input, setInput] = useState('')
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const router = useRouter()
  
  const { submit, isLoading, object } = useObject({
    api: '/api/chat',
    schema: itinerarySchema,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    submit({ prompt: input, locale: typeof navigator !== 'undefined' ? navigator.language : 'en' })
    setCheckedItems({})
    setSaveSuccess(false)
  }

  const handleSavePlan = async () => {
    if (!object?.itinerary || isSaving) return

    setIsSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      // Build a title from the first day or the prompt
      const firstDay = object.itinerary.find(d => d !== undefined)
      const planTitle = firstDay?.title 
        ? `Trip Plan: ${firstDay.title}` 
        : input.trim().slice(0, 80) || 'My Trip Plan'

      const { error } = await supabase.from('plans').insert({
        user_id: user.id,
        title: planTitle,
        prompt: input.trim(),
        itinerary: object.itinerary.filter(d => d !== undefined),
        checklist: object.checklist || [],
      })

      if (error) {
        console.error('Failed to save plan:', error)
        alert('Failed to save plan. Please try again.')
      } else {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      }
    } catch (err) {
      console.error('Save plan error:', err)
      alert('Something went wrong.')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleCheck = (index: number) => {
    setCheckedItems(prev => ({ ...prev, [index]: !prev[index] }))
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <form 
        onSubmit={handleSubmit}
        className="w-full relative flex items-end gap-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-2 focus-within:ring-2 focus-within:ring-[#c96442]/20 focus-within:border-[#c96442] transition-all"
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Where would you like to go?"
          className="min-h-[60px] max-h-[200px] w-full resize-none border-0 shadow-none focus-visible:ring-0 text-base font-sans py-3 px-4 text-slate-900 bg-white placeholder:text-slate-400 caret-[#c96442]"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={!input.trim() || isLoading}
          className="h-12 w-12 rounded-xl bg-[#c96442] hover:bg-[#b05537] text-white shrink-0 mb-0.5 mr-0.5"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <SendHorizontal className="h-5 w-5" />
          )}
          <span className="sr-only">Send</span>
        </Button>
      </form>
      
      <PromptChips onSelect={setInput} />

      {isLoading && <p className="mt-4 text-sm text-slate-500 animate-pulse font-sans">Generating your itinerary...</p>}
      
      {object?.checklist && object.checklist.length > 0 && (
        <div className="w-full mt-8 bg-[#fdfcf8] p-6 rounded-2xl border border-[#c96442]/20 shadow-sm text-left">
          <h3 className="font-serif text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-[#c96442]">✓</span> Trip Checklist
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {object.checklist.map((item, index) => (
              <li 
                key={index} 
                className={`flex items-start gap-3 transition-colors ${checkedItems[index] ? 'text-slate-400 line-through' : 'text-slate-700'}`}
                onClick={() => toggleCheck(index)}
              >
                <Checkbox 
                  checked={checkedItems[index] || false}
                  className="mt-1 border-[#c96442]/40 data-[state=checked]:bg-[#c96442] data-[state=checked]:border-[#c96442] cursor-pointer" 
                />
                <span className="leading-snug cursor-pointer select-none">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Timeline itinerary={object?.itinerary || []} />

      {!isLoading && object?.itinerary && object.itinerary.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Button 
            onClick={handleSavePlan}
            disabled={isSaving || saveSuccess}
            className={`rounded-full px-8 py-6 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 text-base ${
              saveSuccess 
                ? 'bg-emerald-600 hover:bg-emerald-600' 
                : 'bg-slate-900 hover:bg-slate-800'
            } text-white`}
          >
            {isSaving ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving...</>
            ) : saveSuccess ? (
              <><Check className="w-5 h-5 mr-2" /> Saved!</>
            ) : (
              <><BookmarkPlus className="w-5 h-5 mr-2" /> Save Plan</>
            )}
          </Button>
          
          {saveSuccess && (
            <Button
              onClick={() => router.push('/my-plans')}
              variant="outline"
              className="rounded-full px-8 py-6 text-base border-slate-300 hover:bg-slate-50"
            >
              View My Plans
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
