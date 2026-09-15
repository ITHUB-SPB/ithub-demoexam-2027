import { createServerFn } from "@tanstack/react-start";
import { db } from "#/prisma/db";
import type { Char } from "@prisma/orm-postgres/target/codec-types";

const fakeEntries = [
    { 
        id: 1, 
        author: { username: 'testuser1' } ,
        course: { id: 1, title: 'Основы ООП'},
        payment: { id: 1, title: 'Наличные' },
        startDate: new Date().toLocaleDateString('ru')
    },
    { 
        id: 2, 
        author: { username: 'testuser1' } ,
        course: { id: 2, title: 'Алгоритмы'},
        payment: { id: 2, title: 'Перевод' },
        startDate: new Date().toLocaleDateString('ru')
    },
    { 
        id: 3, 
        author: { username: 'testuser2' } ,
        course: { id: 2, title: 'Алгоритмы'},
        payment: { id: 1, title: 'Наличные' },
        startDate: new Date().toLocaleDateString('ru')
    }
]

export const getEntries = createServerFn()
    .validator((data: {
        username?: string
    }) => data)
    .handler(({ data }) => {
        if (data.username) {
            return fakeEntries.filter(({ author }) => author.username === data.username)
        }

        return fakeEntries
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

        await db.orm.public.Entry.create({
            courseId: data.courseId,
            statusId: data.statusId,
            paymentTypeId: data.paymentTypeId,
            startDate: data.startDate,
            authorId: author.id
        })
    })

export const getInitialData = createServerFn()
    .handler(async () => {
        const courses = await db.orm.public.Course.all()
        const statuses = await db.orm.public.Status.all()
        const paymentTypes = await db.orm.public.PaymentType.all()
        return { courses, statuses, paymentTypes }
    })