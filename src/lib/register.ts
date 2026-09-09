import { createServerFn } from '@tanstack/react-start'

type Result = { error: string } | { success: true }

export const registerFn = createServerFn({ method: "POST" })
    .validator((data: { 
        login: string, 
        password: string,
        email: string,
        phone: string,
        fullname: string,
    }) => data)
    .handler(({ data }): Result => {
        if (data.login === "test123") {
            return { error: "Аккаунт уже существует" }
        }

        return { success: true }
    })
