import { createServerFn } from "@tanstack/react-start";
import { getPrismaClient } from "#/db";

export const updateStatus = createServerFn({ method: "POST" })
    .validator((data: {
        id: number,
        status: string
    }) => data)
    .handler(async ({ data }) => {
        const prisma = getPrismaClient()

        try {
            await prisma.entry.update({
                where: {
                    id: data.id
                },
                data: {
                    status: data.status
                }
            })

            return { success: true }
        } catch (error: unknown) {
            console.error(error)
            return { success: false, message: (error as Error).message }
        }
    })

export const getEntries = createServerFn({ method: "POST" })
    .validator((data: {
        username: string | null,
    }) => data)
    .handler(async ({ data }) => {
        const prisma = getPrismaClient()

        if (!data.username) {
            return {
                entries: await prisma.entry.findMany({
                    include: {
                        user: true
                    }
                })
            }
        }

        const entries = await prisma.entry.findMany({
            where: {
                user: {
                    login: data.username
                },
            },
            include: {
                user: true
            }
        })

        return { entries }
    })

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