import { Item } from '@/lib/types'
import { Ellipsis, Pen, Pencil, SquarePen, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import store from 'store2'

export default function Shortcut({ image, title, url }: Item) {
  function removeShortcut() {
    const shortcuts: Item[] = store('shortcuts')
    store(
      'shortcuts',
      shortcuts.filter((value) => value.url !== url)
    )
    location.reload()
  }
  const router = useRouter()
  return (
    <div
      className="group flex flex-col relative items-center justify-center gap-3 border h-32 w-32 rounded-md bg-card hover:bg-accent duration-200 cursor-pointer"
      onClick={() => {
        router.push(`/go/${btoa(url)}`)
      }}
    >
      <img src={image} className="h-8 w-8" />
      {title && <p className="truncate w-full px-2">{title}</p>}

      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 duration-200 transition-opacity">
        <X size={16} onClick={removeShortcut} />
      </div>
    </div>
  )
}
