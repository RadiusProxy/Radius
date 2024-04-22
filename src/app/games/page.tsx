'use client'
import { useState, useEffect } from 'react'
import Game from '@/components/game'

interface GameData {
  title: string
  image: string
  url: string
}

export default function Games() {
  const [games, setGames] = useState<GameData[]>([])

  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch('/games.json')
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const data: GameData[] = await response.json()
        setGames(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGames()
  }, [])

  return (
    <div>
      <h1 className="text-6xl font-semibold py-8 text-center">Games</h1>
      <div className="flex flex-wrap justify-center px-24">
        {games.map((game, index) => (
          <div className="p-2" key={index}>
            <Game title={game.title} image={game.image} url={game.url} />
          </div>
        ))}
      </div>
    </div>
  )
}
