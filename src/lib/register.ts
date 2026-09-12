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
        const hashedPassword = await getPasswordHash(data.password)
        
        try {
            await db.orm.public.User.create({
                username: data.login,
                password: hashedPassword,
                email: data.email,
                phone: data.phone,
                name: data.fullname
            })
            return { success: true }
        } catch (error) {
            console.error(error)
            return { error: 'Не удалось создать аккаунт' }
        } 
    })
