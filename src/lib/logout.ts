import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { useAppSession } from './sessions'


export const logoutFn = createServerFn({ method: "POST" })
    .handler(async () => {
        const session = await useAppSession()
        await session.clear()

        throw redirect({ to: '/login' })
    })