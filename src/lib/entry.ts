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
    }
    )