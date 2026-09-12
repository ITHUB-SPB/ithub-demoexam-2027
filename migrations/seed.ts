import { db } from "#/prisma/db";

async function seed() {
    const courses = [
        'Основы алгоритмизации и программирования',
        'Основы веб-дизайна',
        'Основы проектирования баз данных'
    ]

    const users = [
        {email: 'admin@example.com', name: 'Admin', phone: '79992223311', username: 'Admin', password: 'KorokNET'},
        {email: 'user1@example.com', name: 'Иванов Максим Павлович', phone: '79992223322', username: 'user1', password: 'user1password'},
    ]

    for (const title of courses) {
        await db.orm.public.Course.upsert({
            create: { title },
            update: {}
        })
    }

    for (const title of ['наличные', 'перевод по номеру']) {
        await db.orm.public.PaymentType.upsert({
            create: { title },
            update: {}
        })
    }

    for (const { email, name, phone, username, password } of users) {
        await db.orm.public.User.upsert({
            create: { email, name, phone, username, password },
            update: {}
        })
    }
}