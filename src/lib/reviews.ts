import { createServerFn } from "@tanstack/react-start";
import { getPrismaClient } from "#/db";

export const getReviews = createServerFn({ method: "POST" })
    .validator((data: {
        username?: string,
    }) => data)
    .handler(async ({ data }) => {
        const prisma = getPrismaClient()

        if (!data.username) {
            return {
                reviews: await prisma.review.findMany()
            }
        }

        const reviews = await prisma.review.findMany({
            where: {
                user: {
                    login: data.username
                }
            }
        })

        return { reviews }
    })

export const createReview = createServerFn({ method: "POST" })
    .validator((data: {
        login: string,
        text: string,
    }) => data)
    .handler(async ({ data }) => {
        try {
            const prisma = getPrismaClient()

            await prisma.review.create({
                data: {
                    text: data.text,
                    user: {
                        connect: {
                            login: data.login
                        }
                    }
                }
            })

            return { success: true }

        } catch (error: unknown) {
            console.error(error)
            return { success: false, message: (error as Error).message }
        }
    })