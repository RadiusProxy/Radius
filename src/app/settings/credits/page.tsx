"use client"

import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function Credits() {
  const [contributors, setContributors] = useState<{ name: string }[]>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/contributors.json")
      setContributors(await res.json())
    }

    load()
    setLoading(false)
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-semibold">Credits</h1>

      <Separator />

      <p className="text-2xl font-medium">Radius contributors!</p>

      {loading && (
        <div className="flex items-center">
          <Loader2 className="mr-2 h-5 w-5 loader"></Loader2>
          <p>Loading...</p>
        </div>
      )}

      <ul className="list-disc ml-6">
        {contributors?.map((user) => {
          return <li key={user.name}>{user.name}</li>
        })}
      </ul>
    </div>
  )
}