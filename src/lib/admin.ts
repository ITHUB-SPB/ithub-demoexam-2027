import { createServerFn } from "@tanstack/react-start";
import { getPrismaClient } from "../db";
import { getSessionUser } from "./session";

async function requireAdmin() {
    const userId = await getSessionUser();
    if (!userId) throw new Error("Не авторизован");

    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
    });
    if (!user || user.role !== "admin") throw new Error("Доступ запрещён");

    return user;
}

export const getAllEntries = createServerFn({ method: "POST" })
    .validator(
        (data: { status?: string; page?: number; perPage?: number } | undefined) =>
            data ?? {},
    )
    .handler(async ({ data }) => {
        await requireAdmin();
        const prisma = getPrismaClient();

        const perPage = data.perPage ?? 5;
        const page = data.page ?? 1;
        const where = data.status ? { status: data.status } : {};

        const [items, total] = await Promise.all([
            prisma.entry.findMany({
                where,
                include: {
                    user: { select: { login: true, fullname: true } },
                },
                orderBy: { id: "desc" },
                skip: (page - 1) * perPage,
                take: perPage,
            }),
            prisma.entry.count({ where }),
        ]);

        return {
            items,
            total,
            page,
            perPage,
            totalPages: Math.max(1, Math.ceil(total / perPage)),
        };
    });