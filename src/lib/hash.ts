import { scrypt } from "node:crypto"

const SALT = 'sxah0asjkk23uiasdcx98asd78x7auihasx078sad'

export const hashPassword(password: string) {
    return new Promise((resolve, reject) => {
        scrypt(password, SALT, 56)
    })
}

export const verifyHash() {

}