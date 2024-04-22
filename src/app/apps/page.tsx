'use client'
import { useState, useEffect } from 'react'
import App from '@/components/game'

interface AppData {
  title: string
  image: string
  url: string
}

export default function Apps() {
  const [Apps, setApps] = useState<AppData[]>([])

  useEffect(() => {
    async function fetchApps() {
      try {
        const response = await fetch('/apps.json')
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const data: AppData[] = await response.json()
        setApps(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchApps()
  }, [])

  return (
    <div>
      <h1 className="text-6xl font-semibold py-8 text-center">Apps</h1>
      <div className="flex flex-wrap justify-center px-24">
        {Apps.map((app, index) => (
          <div className="p-2" key={index}>
            <App title={app.title} image={app.image} url={app.url} />
          </div>
        ))}
      </div>
    </div>
  )
}
