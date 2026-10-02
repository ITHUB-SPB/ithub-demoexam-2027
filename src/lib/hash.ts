import { createServerOnlyFn } from "@tanstack/react-start"
import { scrypt } from "node:crypto"

export const hashPassword = createServerOnlyFn((password: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        scrypt(password, process.env.SALT, 56, (error, result) => {
            if (error) {
                reject(error)
            }
            resolve(result.toString('hex'))
        })
    })
})

export const verifyHash = createServerOnlyFn(async (inputPassword: string, hashedPassword: string) =>
    await hashPassword(inputPassword) === hashedPassword
)