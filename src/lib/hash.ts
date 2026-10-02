import { createServerOnlyFn } from "@tanstack/react-start"
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto"
import { promisify } from "node:util"

const scryptAsync = promisify(scrypt)
const KEYLEN = 56

async function derive(password: string, salt: string): Promise<Buffer> {
    return (await scryptAsync(password, salt, KEYLEN)) as Buffer
}

export const hashPassword = createServerOnlyFn(async (password: string): Promise<string> => {
    const salt = randomBytes(16).toString("hex")
    const hash = await derive(password, salt)
    return `${salt}:${hash.toString("hex")}`
})

export const verifyHash = createServerOnlyFn(
    async (inputPassword: string, stored: string): Promise<boolean> => {
        const [salt, hash] = stored.split(":")
        if (!salt || !hash) return false

        const expected = Buffer.from(hash, "hex")
        const actual = await derive(inputPassword, salt)

        if (expected.length !== actual.length) return false
        return timingSafeEqual(expected, actual)
    }
)