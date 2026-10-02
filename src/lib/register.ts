import { createServerFn } from "@tanstack/react-start";
import { getPrismaClient } from "#/db";
import { hashPassword } from "../../primer/hash";

type Result = {
    success: true
} | {
    success: false,
    message: string
}

export const register = createServerFn({ method: 'POST'})
    .validator((data: {
        login: string,
        password: string,
        fullname: string,
        phone: string,
        email: string
    }) => data)
    .handler(async ({data}): Promise<Result> => {
        try {
            const prisma = getPrismaClient()
            const hashedPassword = await hashPassword(data.password)

            await prisma.user.create({
                data: {...data, password: hashPassword}
            })

            return {success: true}
        } catch (error: unknown) {
            return {success: false, message: (error as Error).message}
        }
    })