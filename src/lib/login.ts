import { createServerFn } from '@tanstack/react-start'
import { useAppSession } from './sessions'
import { getPasswordHash } from './utils'
import { db } from '#/prisma/db'

export const loginFn = createServerFn({ method: "POST" })
    .validator((data: { 
        login: string, 
        password: string,
    }) => data)
    .handler(async ({ data }) => {
        const connection = await db.connect()
        
        const user = await db.orm.public.User.first({
            username: data.login
        })

        if (!user) {
            await connection.close()
            return { error: 'Некорректные данные'}
        }

        const hashedPassword = await getPasswordHash(data.password)
        
        if (user.password !== hashedPassword) {
            await connection.close()
            return { error: 'Некорректные данные'}
        }

        const session = await useAppSession()
        
        await session.update({
            user: data.login
        })

        await connection.close()
        return { success: true }
    })
