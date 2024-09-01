'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { getSetting, setSetting } from '@/lib/settings'
import { Loader2, Save } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface FormValues {
  backgroundUrl: string;
}

export default function Settings() {
  const [submitting, setSubmitting] = useState(false)
  const form = useForm<FormValues>({
    defaultValues: {
      backgroundUrl: getSetting("backgroundUrl")
    }
  })

  function onSubmit(event: FormEvent) {
    event.preventDefault()

    setSubmitting(true)

    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const backgroundUrl = formData.get("backgroundUrl") as string ?? ""

    setTimeout(() => {
      setSubmitting(false)
      toast.success(backgroundUrl)
      setSetting("backgroundUrl", backgroundUrl)
    }, 2500)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-semibold">Appearance</h1>

      <Separator />

      <Form {...form}>
        <form onSubmit={event => onSubmit(event)} className="w-1/2 space-y-4">
          <FormField
            control={form.control}
            name="backgroundUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <Input placeholder="Background Image URL..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={submitting}>
            {!submitting ? <Save className="mr-2 h-5 w-5" /> : <Loader2 className="mr-2 h-5 w-5 loader" />} Save Changes
          </Button>
        </form>
      </Form>
    </div>
  )
}
