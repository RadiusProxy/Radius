import fs from 'fs'
import { notFound } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(_req: NextRequest, { params }: { params: { aero: string } }) {
  const requestedFile = params.aero
  if (requestedFile === 'aero.config.js') {
    const file = fs.readFileSync(process.cwd() + `/src/lib/aero/${requestedFile}`)
    const fileBlob = new Blob([file])
    return new Response(fileBlob, {
      headers: {
        'Content-Type': 'application/javascript'
      }
    })
  } else {
    try {
      const res = await fetch(`https://unpkg.com/browse/aero-proxy@0.0.3/dist/${requestedFile}`)
      const file = await res.text()
      const fileBlob = new Blob([file])
      return new Response(fileBlob, {
        headers: {
          'Content-Type': 'application/javascript'
        }
      })
    } catch {
      notFound()
    }
  }
}
