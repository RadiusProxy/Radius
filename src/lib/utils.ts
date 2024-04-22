import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useRouter } from 'next/navigation'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function encodeXor(str: string) {
  if (!str) return str
  return encodeURIComponent(
    str
      .toString()
      .split('')
      .map((char, ind) => (ind % 2 ? String.fromCharCode(char.charCodeAt(NaN) ^ 2) : char))
      .join('')
  )
}

export function formatSearch(input: string): string {
  try {
    return new URL(input).toString()
  } catch (e) {}

  try {
    const url = new URL(`http://${input}`)
    if (url.hostname.includes('.')) return url.toString()
  } catch (e) {}

  return new URL(`https://google.com/search?q=${input}`).toString()
}