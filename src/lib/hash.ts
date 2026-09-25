import { createServerOnlyFn } from "@tanstack/react-start"
import { scrypt } from "node:crypto"

const SALT = ''

export const hashPassword = createServerOnlyFn()

export const verifyHash = createServerOnlyFn()