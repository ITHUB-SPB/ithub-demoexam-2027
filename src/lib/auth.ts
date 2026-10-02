import { createServerFn } from "@tanstack/react-start";
import { getPrismaClient } from "../db";
import { verifyHash } from "./hash";
import {
    clearSession,
    getSessionUser,
    setSession,
} from "./session";

export const login = createServerFn({ method: "POST" })
    .validator((data: { login: string; password: string }) => data)
    .handler(async ({ data }) => {
        const prisma = getPrismaClient();

        const user = await prisma.user.findUnique({
            where: { login: data.login },
        });
        if (!user)
            return { success: false as const, message: "Неверный логин или пароль" };

        const ok = await verifyHash(data.password, user.password);
        if (!ok)
            return { success: false as const, message: "Неверный логин или пароль" };

        await setSession(user.id);
        return { success: true as const, role: user.role };
    });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
    await clearSession();
    return { success: true };
});

export const getCurrentUserFn = createServerFn({ method: "GET" }).handler(
    async () => {
        const id = await getSessionUser();
        if (!id) return null;

        const prisma = getPrismaClient();
        return prisma.user.findUnique({
            where: { id },
            select: { id: true, login: true, role: true },
        });
    },
);