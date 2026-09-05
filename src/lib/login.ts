import { createServerFn } from '@tanstack/react-start'

export const loginFn = createServerFn({ method: "POST" })
    .validator((data: { 
        login: string, 
        password: string,
    }) => data)
    .handler(({ data }) => {
        console.log(data)
    })
