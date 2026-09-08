import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { useAppSession } from './sessions'


export const loginFn = createServerFn({ method: "POST" })
    .validator((data: { 
        login: string, 
        password: string,
    }) => data)
    .handler(async ({ data }) => {
        const session = await useAppSession()
        
        await session.update({
            user: data.login
        })

        throw redirect({ to: '/profile' })
    })

