import { createServerFn } from "@tanstack/react-start";
import { getPrismaClient } from "../db";
import { hashPassword } from "./hash";

type Result =
    | { success: true }
    | { success: false; message: string };

type RegisterInput = {
    login: string;
    password: string;
    fullname: string;
    phone: string;
    email: string;
};

function validate(data: RegisterInput): string | null {
    if (!/^[A-Za-z0-9]{6,}$/.test(data.login))
        return "Логин: латиница и цифры, не менее 6 символов";
    if (data.password.length < 8)
        return "Пароль: минимум 8 символов";
    if (!/^[А-Яа-яЁё\s]+$/.test(data.fullname))
        return "ФИО: только кириллица и пробелы";
    if (!/^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(data.phone))
        return "Телефон: формат 8(XXX)XXX-XX-XX";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email))
        return "Некорректный email";
    return null;
}

export const register = createServerFn({ method: "POST" })
    .validator((data: RegisterInput) => data)
    .handler(async ({ data }): Promise<Result> => {
        const invalid = validate(data);
        if (invalid) return { success: false, message: invalid };

        const prisma = getPrismaClient();

        try {
            const exists = await prisma.user.findUnique({
                where: { login: data.login },
            });
            if (exists) return { success: false, message: "Логин уже занят" };

            const hashedPassword = await hashPassword(data.password);

            await prisma.user.create({
                data: {
                    login: data.login,
                    password: hashedPassword,
                    fullname: data.fullname,
                    phone: data.phone,
                    email: data.email,
                },
            });

            return { success: true };
        } catch (error) {
            console.error(error);
            return { success: false, message: (error as Error).message };
        }
    });