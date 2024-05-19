'use client'
import Shortcut from '@/components/shortcut'
import { Input } from '@/components/ui/input'
import { Flame, Radius, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Item } from '@/lib/types'
import store from 'store2'

export default function Home() {
  const router = useRouter()
  const [shortcuts, setShortcuts] = useState<Item[]>([])
  const [splashText, setSplashText] = useState<string>('')

  useEffect(() => {

    fetch('/splash.json')
      .then(response => response.json())
      .then(data => {
        const randomIndex = Math.floor(Math.random() * data.length);
        setSplashText(data[randomIndex].splash);
      })
      .catch(error => console.error('Error fetching splash text:', error));

    store.set('shortcuts', [], false)
    const data: Item[] = store('shortcuts')
    setShortcuts(data)
  }, [])

  return (
    <div>
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          <Radius className="h-16 w-16 rotate-180" />
          <h1 className="text-6xl font-semibold">Radius</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Input
              className="w-[26rem] px-9 h-12 rounded-lg"
              placeholder="Search the web"
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return
                router.push(`/go/${btoa(e.currentTarget.value)}`)
              }}
            />
            <Search className="h-4 w-4 text-muted-foreground absolute top-1/2 -translate-y-1/2 left-3" />
          </div>
        </div>
         <p style={{ fontSize: '1rem', fontWeight: 'normal', marginTop: '0.4rem' }}>{splashText}</p>
        {shortcuts.length > 0 && (
          <div className="py-2 flex flex-wrap gap-2 justify-center">
            {shortcuts.map((shortcut: Item) => {
              return <Shortcut key={shortcut.title} image={shortcut.image} title={shortcut.title} url={shortcut.url} />
            })}
          </div>
        )}
      </div>
    </div>
  )
}
