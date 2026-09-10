// import "dotenv/config"

import crypto from 'node:crypto'
import { createServerFn } from '@tanstack/react-start'
import { db } from "#/prisma/db"


type Result = { error: string } | { success: true }

export const registerFn = createServerFn({ method: "POST" })
    .validator((data: { 
        login: string, 
        password: string,
        email: string,
        phone: string,
        fullname: string,
    }) => data)
    .handler(async ({ data }) => {
        const runtime = await db.connect({ url: process.env.DATABASE_URL! })

        const hashedPassword = crypto
            .createHash('sha256')
            .update(data.password)
            .digest('hex')
        
        await db.orm.public.User.create({
            username: data.login,
            password: hashedPassword,
            email: data.email,
            phone: data.phone,
            name: data.fullname
        })
        
        await runtime.close()
        return { success: true }
    })
