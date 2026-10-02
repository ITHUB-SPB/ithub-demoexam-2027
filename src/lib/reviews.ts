import { createServerFn } from "@tanstack/react-start";
import { getPrismaClient } from "#/db";

type Result =
    | { success: true }
    | { success: false; message: string };

export const getReviews = createServerFn({ method: "POST" })
    .validator((data: { username: string | null }) => data)
    .handler(async ({ data }) => {
        const prisma = getPrismaClient();

        const reviews = await prisma.review.findMany({
            where: data.username
                ? { user: { login: data.username } }
                : undefined,
            include: { user: true },
            orderBy: { id: "desc" },
        });

        return { reviews };
    });

export const createReview = createServerFn({ method: "POST" })
    .validator((data: { login: string; text: string }) => data)
    .handler(async ({ data }): Promise<Result> => {
        if (!data.text.trim())
            return { success: false, message: "Текст отзыва не может быть пустым" };

        const prisma = getPrismaClient();

        try {
            await prisma.review.create({
                data: {
                    text: data.text.trim(),
                    user: { connect: { login: data.login } },
                },
            });

            return { success: true };
        } catch (error) {
            console.error("[createReview]", error);
            return { success: false, message: (error as Error).message };
        }
    });