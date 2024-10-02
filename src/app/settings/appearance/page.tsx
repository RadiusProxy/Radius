'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Save, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

const formSchema = z.object({
  backgroundImage: z.string().url('Please provide a valid URL'),
  description: z.string().optional(),
})

export default function Settings() {
  const [submitting, setSubmitting] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      backgroundImage: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true)

    document.body.style.backgroundImage = `url(${values.backgroundImage})`
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundPosition = 'center'

    setTimeout(() => {
      setSubmitting(false)
      toast.success('Settings saved')
    }, 1000)

    console.log(values)
  }

  function onReset() {
    form.reset()
    document.body.style.backgroundImage = ''
    toast('Settings reset')
  }

  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-semibold">Appearance</h1>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/2 space-y-4">
          <FormField
            control={form.control}
            name="backgroundImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <Input placeholder="Background Image URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {}
          <div className="flex space-x-4">
            <Button type="submit" disabled={submitting}>
              <Save className="mr-2 h-5 w-5" /> Save Changes
            </Button>
            <Button type="button" onClick={onReset}>
              <RotateCcw className="mr-2 h-5 w-5" /> Reset
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
