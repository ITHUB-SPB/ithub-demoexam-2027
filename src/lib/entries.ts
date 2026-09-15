import { createServerFn } from "@tanstack/react-start";
import { Temporal } from '@js-temporal/polyfill'
import type { Char } from "@prisma/orm-postgres/target/codec-types";

import { db } from "#/prisma/db";

export const getEntries = createServerFn()
    .validator((data: {
        username?: string
    }) => data)
    .handler(async ({ data }) => {
        if (data.username) {
            const author = await db.orm.public.User
                .where(user => user.username.eq(data.username))
                .first()
            
            if (!author) {
                return { error: "Пользователь не найден" }
            }
                
            return await db.orm.public.Entry
                .where(entry => entry.authorId.eq(author.id))
                .include('course')
                .include("paymentType")
                .include("status")
                .all()
        }

        return await db.orm.public.Entry
            .include('course')
            .include("paymentType")
            .include("status")
            .include("author")
            .all()
    })

export const createEntry = createServerFn()
    .validator((data: {
        username: string,
        courseId: Char<36>,
        statusId: Char<36>,
        paymentTypeId: Char<36>,
        startDate: string
    }) => data)
    .handler(async ({ data }) => {
        const author = await db.orm.public.User
            .where(u => u.username.eq(data.username))
            .first()
        
        if (!author) {
            throw new Error('User not found')
        }
        
        try {
            await db.orm.public.Entry.create({
                courseId: data.courseId,
                statusId: data.statusId,
                paymentTypeId: data.paymentTypeId,
                startDate: Temporal.Now.instant(), // TODO convert data.startDate
                authorId: author.id
            })
            return { success: true }
        } catch (error) {
            console.error(error)
            return { error : 'Не удалось создать заявку' }
        }
    })

export const getInitialData = createServerFn()
    .handler(async () => {
        const courses = await db.orm.public.Course.all()
        const statuses = await db.orm.public.Status.all()
        const paymentTypes = await db.orm.public.PaymentType.all()
        return { courses, statuses, paymentTypes }
    })