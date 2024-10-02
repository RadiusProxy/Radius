'use client'

import { Separator } from '@/components/ui/separator'

export default function Credits() {
  return (
    <div>
      <h1 className="text-4xl font-semibold">Credits</h1>
      <Separator />
      <div className="mt-4">
        <p>Radius contributors!</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Owskio09</li>
          <li>proudparrot2</li>
          <li>Sparkzil</li>
          <li>Scaratek</li>
        </ul>
      </div>
    </div>
  )
}
