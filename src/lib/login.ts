import { createServerFn } from '@tanstack/react-start'
import { useAppSession } from './sessions'
import { getPasswordHash } from './hash'
import { db } from '#/prisma/db'

export const loginFn = createServerFn({ method: "POST" })
    .validator((data: { 
        login: string, 
        password: string,
    }) => data)
    .handler(async ({ data }) => {      
        const user = await db.orm.public.User.first({
            username: data.login
        })

        if (!user) {
            return { error: 'Некорректные данные'}
        }

        const hashedPassword = await getPasswordHash(data.password)
        
        if (user.password !== hashedPassword) {
            return { error: 'Некорректные данные'}
        }

        const session = await useAppSession()
        
        await session.update({
            user: data.login
        })

        return { success: true }
    })
