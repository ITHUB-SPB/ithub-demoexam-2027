import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";

import { getPrismaClient } from "#/db";
import { verifyHash } from "./hash";


type Result = {
    success: true
} | {
    success: false,
    message: string
}

type User = {
    login: string | null;
}

type Session = {login: User["login"];}

export const useAppSession = createServerOnlyFn(() => {
    return useSession<Session>({password: process.env.SESSION_SECRET!})
})

export const getUser = createServerFn({method: 'GET'}).handler(async (): Promise<Result & User> => {
    const session = await useAppSession()

    return {success: true, login: session.data.login ?? null}
})

export const logout = createServerFn({method: 'GET'}).handler(async (): Promise<Result> => {
    const session = await useAppSession()
    await session.clear()
    return {success: true}
})

export const login = createServerFn({method: 'POST'})
    .validator((data: {
        login: string,
        password: string
    }) => data)
    .handler(async ({data}):Promise<Result> => {
        try{
            const prisma = getPrismaClient()

            const user = await prisma.user.findUniqueOrThrow({
                where: {
                    login: data.login
                }
            })

            const isCorrect = await verifyHash(data.password, user.password)

            if (!isCorrect){
                throw new Error('Не удалось войти')
            }

            const Session = await useAppSession()
            await Session.update({login: data.login})

            return {success: true}
        } catch (error: unknown) {
            console.error(error)
            return {success: false, message: (error as Error).message}
        }
    })