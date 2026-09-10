import { createServerFn } from '@tanstack/react-start'
import { useAppSession } from './sessions'


export const loginFn = createServerFn({ method: "POST" })
    .validator((data: { 
        login: string, 
        password: string,
    }) => data)
    .handler(async ({ data }) => {
        const correct = true
        
        if (!correct) {
            return { error: 'Некорректные данные'}
        }

        const session = await useAppSession()
        
        await session.update({
            user: data.login
        })

        return { success: true }
    })

