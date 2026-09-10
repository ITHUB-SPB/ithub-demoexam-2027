import { useSession } from '@tanstack/react-start/server'

export type Session = {
    user: string
}

export const useAppSession = async () => {
    return useSession<Session>({ password: process.env.SESSION_SECRET! })
}