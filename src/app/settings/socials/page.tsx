import { Separator } from "@/components/ui/separator"

export default function Socials() {
  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-semibold">Socials</h1>

      <Separator />

      <p className="text-2xl font-medium">Follow us on other platforms!</p>

      <ul className="list-disc ml-6">
        <li>TikTok: @radiusproxy</li>
        <li>YouTube: @RadiussProxy</li>
        <li>Discord: <a className="underline font-medium" href="https://discord.gg/9YVzaBgjMp">Join Now!</a></li>
      </ul>
    </div>
  )
}