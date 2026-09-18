import { scrypt } from "node:crypto"

const SALT = 'sxah0asjkk23uiasdcx98asd78x7auihasx078sad'

export const hashPassword = (password: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        scrypt(password, SALT, 56, (error, result) => {
            if (error) {
                reject(error)
            }
            resolve(result.toString('hex'))
        })
    })
}

export const verifyHash = async (inputPassword: string, hashedPassword: string) =>
    await hashPassword(inputPassword) === hashedPassword