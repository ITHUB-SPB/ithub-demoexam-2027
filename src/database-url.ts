import { readFileSync } from 'node:fs'

export function getDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }

  // fallback: dev-сервер не подхватывает .env в process.env автоматически
  try {
    const content = readFileSync('.env', 'utf8')
    const match = content.match(/^DATABASE_URL=["']?([^"'\r\n]+)["']?/m)
    if (match) {
      return match[1]
    }
  } catch {
    // .env отсутствует
  }

  throw new Error('DATABASE_URL is required')
}
