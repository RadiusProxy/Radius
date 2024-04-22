'use client'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import * as Lucide from 'lucide-react'
import { Button } from './ui/button'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Separator } from './ui/separator'

export default function Sidebar({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const pathname = usePathname()
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>
            <Lucide.Radius className="rotate-180 h-10 w-10 ml-2"></Lucide.Radius>
          </SheetTitle>
        </SheetHeader>

        <div className="py-6 flex flex-col gap-2">
          <Link href="/" onClick={() => onOpenChange(false)}>
            <Button variant={pathname == '/' ? 'secondary' : 'ghost'} className="justify-start gap-2 w-full hover:scale-105 duration-200 transition-all">
              <Lucide.Home /> Home
            </Button>
          </Link>

          <Link href="/games" onClick={() => onOpenChange(false)}>
            <Button variant={pathname?.includes('/games') ? 'secondary' : 'ghost'} className="justify-start gap-2 w-full hover:scale-105 duration-200 transition-all">
              <Lucide.Gamepad /> Games
            </Button>
          </Link>
          <Link href="/apps" onClick={() => onOpenChange(false)}>
            <Button variant={pathname?.includes('/apps') ? 'secondary' : 'ghost'} className="justify-start gap-2 w-full hover:scale-105 duration-200 transition-all">
              <Lucide.LayoutGrid /> Apps
            </Button>
          </Link>
          <Separator />

          <Link href="/settings" onClick={() => onOpenChange(false)}>
            <Button variant={pathname?.includes('/settings') ? 'secondary' : 'ghost'} className="justify-start gap-2 w-full hover:scale-105 duration-200 transition-all">
              <Lucide.Settings2 /> Settings
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
