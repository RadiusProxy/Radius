'use client'

import NextLink from 'next/link'
import { Separator } from '@/components/ui/separator'

export default function SocialLinks() {
  return (
    <div>
      <h1 className="text-4xl font-semibold">Socials</h1>
      <Separator />
      <div className="mt-4">
        <p>Follow us on other platforms!</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>TikTok: @radiusproxy</li>
          <li>YouTube: @RadiusProxy</li>
          <li>
            Discord:{' '}
            <NextLink href="https://discord.gg/yourdiscordlink" target="_blank" className="text-blue-500 underline">
              Join Now!
            </NextLink>
          </li>
        </ul>
      </div>
    </div>
  )
}
