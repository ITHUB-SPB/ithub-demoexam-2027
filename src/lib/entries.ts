import { createServerFn } from "@tanstack/react-start";
import { getPrismaClient } from "#/db";

export const createEntry = createServerFn({ method: "POST" })
    .validator((data: {
        course: string,
        paymentType: string,
        startAt: Date
    }) => data)
    .handler(async ({ data }) => {
        try {
            const prisma = getPrismaClient()

            const user = await prisma.user.findFirstOrThrow({
                where: { login: "testuser" }
            })

            await prisma.entry.create({
                data: {
                    course: data.course,
                    paymentType: data.paymentType,
                    startAt: data.startAt,
                    userId: user.id
                }
            })

            return { success: true }

        } catch (error: unknown) {
            console.error(error)
            return { success: false, message: (error as Error).message }
        }
    })