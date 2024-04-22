'use client'
import Sidebar from '@/components/sidebar'
import { Button } from '@/components/ui/button'
import { encodeXor, formatSearch } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import store from 'store2'
import * as Lucide from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface ContentWindow extends Window {
  __uv$location: Location
}

export default function Route({ params }: { params: { route: string[] } }) {
  const ref = useRef<HTMLIFrameElement>(null)
  const [open, setOpen] = useState(false)
  const route = params.route.join('/')

  const [tabIcon, setTabIcon] = useState('')
  const [tabName, setTabName] = useState('')
  const [shortcutted, setShortcutted] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/uv/sw.js', {
          scope: '/uv/service'
        })
        .then(() => {
          if (ref.current) {
            ref.current.src = '/uv/service/' + encodeXor(formatSearch(atob(decodeURIComponent(route))))
          }
        })
    }
  }, [])

  function triggerShortcut() {
    store.set('shortcuts', [], false)
    if (!ref.current || !ref.current.contentWindow) return
    const contentWindow = ref.current.contentWindow as ContentWindow
    if (!('__uv$location' in contentWindow)) return
    const shortcuts: any[] = store('shortcuts')

    if (shortcuts.some((value) => value.url == contentWindow.__uv$location.href)) {
      store(
        'shortcuts',
        shortcuts.filter((value) => value.url !== contentWindow.__uv$location.href)
      )
      setShortcutted(false)
    } else {
      store('shortcuts', [
        ...store('shortcuts'),
        {
          image: (contentWindow.document.querySelector("link[rel*='icon']") as HTMLLinkElement)?.href || `${contentWindow.__uv$location.origin}/favicon.ico`,
          title: contentWindow.document.title,
          url: contentWindow.__uv$location.href
        }
      ])
      setShortcutted(true)
    }
  }

  function handleLoad() {
    if (!ref.current || !ref.current.contentWindow) return
    const contentWindow = ref.current.contentWindow as ContentWindow

    setTabName(contentWindow.document.title)
    setTabIcon((contentWindow.document.querySelector("link[rel*='icon']") as HTMLLinkElement)?.href || `${contentWindow.__uv$location.origin}/favicon.ico`)

    store.set('shortcuts', [], false)
    const shortcuts: any[] = store('shortcuts')
    if (shortcuts.some((value) => value.url == contentWindow.__uv$location.href)) {
      setShortcutted(true)
    }
  }
  return (
    <div>
      <div className="w-screen fixed top-0 h-14 border-b flex items-center justify-between px-4 pr-8">
        <div className="flex items-center gap-3">
          <Button onClick={() => setOpen(true)} size="icon" variant="ghost">
            <Lucide.Menu className="h-7 w-7" />
          </Button>
          <div className="flex items-center gap-2">
            {tabIcon ? <img src={tabIcon} className="h-8 w-8" /> : <Lucide.Radius className="h-8 w-8 rotate-180" />}
            <h1 className="text-xl font-bold">{tabName ? tabName : 'Radius'}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 z-50">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Lucide.ArrowLeft />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Back</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Lucide.RotateCw />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reload</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={triggerShortcut}>
                  <Lucide.Star className={shortcutted ? 'fill-foreground' : 'fill-none'} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Shortcut</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Sidebar open={open} onOpenChange={setOpen} />
      </div>
      <iframe ref={ref} onLoad={handleLoad} className="h-[calc(100vh-3.5rem)] w-full"></iframe>

      <div className="flex items-center justify-center fixed h-full w-full pointer-events-none -z-10">
        <svg aria-hidden="true" className="w-20 h-20 animate-spin text-gray-600 fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
      </div>
    </div>
  )
}
