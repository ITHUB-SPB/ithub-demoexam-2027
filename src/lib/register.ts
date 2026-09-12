import { createServerFn } from '@tanstack/react-start'
import { db } from "#/prisma/db"
import { getPasswordHash } from './utils'

type Result = { error: string } | { success: true }

export const registerFn = createServerFn({ method: "POST" })
    .validator((data: { 
        login: string, 
        password: string,
        email: string,
        phone: string,
        fullname: string,
    }) => data)
    .handler(async ({ data }): Promise<Result> => {
        const connection = await db.connect()
        
        const hashedPassword = await getPasswordHash(data.password)
        
        try {
            await db.orm.public.User.create({
                username: data.login,
                password: hashedPassword,
                email: data.email,
                phone: data.phone,
                name: data.fullname
            })
            await connection.close()
            return { success: true }
        } catch (error) {
            await connection.close()
            return { error: 'Не удалось создать аккаунт' }
        } 
    })
