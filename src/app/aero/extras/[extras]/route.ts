import fs from 'fs'
import { notFound } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(_req: NextRequest, { params }: { params: { aero: string } }) {
  const requestedFile = params.aero
  try {
    const res = await fetch(`https://unpkg.com/browse/aero-proxy/extras/${requestedFile}`)
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
