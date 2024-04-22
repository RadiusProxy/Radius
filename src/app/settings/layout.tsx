'use client'

import { Button } from '@/components/ui/button'
import { Images, Link, Palette } from 'lucide-react'
import NextLink from 'next/link'

import { usePathname } from 'next/navigation'

export default function SettingsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname()
  return (
    <div className="flex">
      <div className="flex w-1/4 flex-col gap-2 p-4 pl-8 pt-8">
        <NextLink href="/settings/apperance/">
          <Button variant={pathname?.includes('/settings/appearance') ? 'secondary' : 'ghost'} className="w-full items-center justify-start gap-2">
            <Palette className="h-5 w-5" /> Appearance
          </Button>
        </NextLink>
        <Button variant={pathname?.includes('/settings/search') ? 'secondary' : 'ghost'} className="w-full items-center justify-start gap-2">
          <Images className="h-5 w-5" /> Images
        </Button>
        <Button variant={pathname?.includes('/settings/account') ? 'secondary' : 'ghost'} className="w-full items-center justify-start gap-2">
          <Link className="h-5 w-5" /> Social Links
        </Button>
      </div>
      <div className="w-3/4 px-12 py-8">{children}</div>
    </div>
  )
}
