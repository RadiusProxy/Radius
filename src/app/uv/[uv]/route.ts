import fs from 'fs'
import { notFound } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(_req: NextRequest, { params }: { params: { uv: string } }) {
  const requestedFile = params.uv
  if (requestedFile === 'uv.config.js' || requestedFile === 'sw.js') {
    const file = fs.readFileSync(process.cwd() + `/src/lib/uv/${requestedFile}`)
    const fileBlob = new Blob([file])
    return new Response(fileBlob, {
      headers: {
        'Content-Type': 'application/javascript'
      }
    })
  } else {
    try {
      const res = await fetch(`https://unpkg.com/@titaniumnetwork-dev/ultraviolet@2.0.0/dist/${requestedFile}`)
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
