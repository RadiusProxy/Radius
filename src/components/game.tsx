'use client'
import { useRouter } from 'next/navigation'
import { Item } from '@/lib/types'

export default function Game({ title, image, url }: Item) {
  const router = useRouter()
  return (
    <div
      className="relative group cursor-pointer hover:scale-105 duration-100 transition-all"
      onClick={() => {
        router.push(`/go/${btoa(url)}`)
      }}
    >
      <img src={image} className="h-36 aspect-square object-cover rounded-md" />
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover:opacity-100 bg-gradient-to-t from-accent to-transparent rounded-b-md duration-100 flex items-end p-2 px-4 font-semibold">
        <p>{title}</p>
      </div>
    </div>
  )
}
