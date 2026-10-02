import { createServerOnlyFn } from "@tanstack/react-start";
import bcrypt from 'bcrypt'

export const hashPassword = createServerOnlyFn((password):Promise<string> => {
    return bcrypt.hash(password, 10)
})

export const verifyHash = createServerOnlyFn((password, hash):Promise<boolean> => {
    return bcrypt.compare(password, hash)
})