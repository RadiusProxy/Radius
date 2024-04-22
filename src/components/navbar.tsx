'use client'
import * as Lucide from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import { useState } from 'react'
import Sidebar from './sidebar'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  if (pathname && pathname.includes('/go/')) return null

  return (
    <div className="w-screen fixed h-14 border-b flex items-center px-4">
      <div className="flex items-center gap-3">
        <Button onClick={() => setOpen(true)} size="icon" variant="ghost">
          <Lucide.Menu className="h-7 w-7" />
        </Button>
        <div className="flex items-center gap-2">
          <Lucide.Radius className="h-8 w-8 rotate-180" />
          <h1 className="text-xl font-bold">Radius</h1>
        </div>
      </div>

      <Sidebar open={open} onOpenChange={setOpen} />
    </div>
  )
}
