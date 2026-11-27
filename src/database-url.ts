import { readFileSync } from 'node:fs'

export function getDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }

  try {
    const content = readFileSync('.env', 'utf8')
    const match = content.match(/^DATABASE_URL=["']?([^"'\r\n]+)["']?/m)
    if (match) {
      return match[1]
    }
  } catch {
  }

  throw new Error('DATABASE_URL is required')
}
