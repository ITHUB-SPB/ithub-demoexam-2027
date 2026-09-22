import { createServerFn } from "@tanstack/react-start";
import { prisma } from "#/db";
import { verifyHash } from "./hash";

type Result = {
    success: true
} | {
    success: false,
    message: string
}

export const login = createServerFn({ method: 'POST' })
    .validator((data: {
        login: string,
        password: string,
    }) => data)
    .handler(async ({ data }): Promise<Result> => {
        try {
            const user = await prisma.user.findUniqueOrThrow({
                where: {
                    login: data.login
                }
            })

            const isCorrect = await verifyHash(data.password, user.password)

            if (!isCorrect) {
                throw new Error('Не удалось войти')
            }

            return { success: true }
        } catch (error: unknown) {
            return { success: false, message: (error as Error).message }
        }
    })