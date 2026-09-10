import { createServerFn } from '@tanstack/react-start'
import { useAppSession } from './sessions'


export const getUserFn = createServerFn()
    .handler(async () => {
        const session = await useAppSession()
        return session?.data?.user ?? null
    })