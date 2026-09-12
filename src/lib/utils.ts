import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { scrypt } from 'node:crypto'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPasswordHash(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    scrypt(password, process.env.SALT!, 64, (error, derived) => {
      if (error) {
        reject(error)
      }
      resolve(derived.toString())
    })
  })
}
