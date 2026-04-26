'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@workspace/ui/components/button'
import { Loader2 } from 'lucide-react'
import { ComponentProps } from 'react'

interface SubmitButtonProps extends ComponentProps<typeof Button> {
  pendingText?: string
}

export function SubmitButton({ pendingText, children, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button disabled={pending} {...props}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {pendingText || 'Please wait...'}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
