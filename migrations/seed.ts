import { db } from "#/prisma/db.ts";
import { getPasswordHash } from "#/lib/hash";

async function seed() {
    const connection = await db.connect()

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
            update: { },
            conflictOn: { title }
        })
    }

    for (const title of ['наличные', 'перевод по номеру']) {
        await db.orm.public.PaymentType.upsert({
            create: { title },
            update: {},
            conflictOn: { title }
        })
    }

    for (const { email, name, phone, username, password } of users) {
        const hashedPassword = await getPasswordHash(password)

        await db.orm.public.User.upsert({
            create: { email, name, phone, username, password: hashedPassword },
            update: {},
            conflictOn: { email }
        })
    }

    await connection.close()
}

seed().catch(error => { console.error(error) })