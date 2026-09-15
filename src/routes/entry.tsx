import { type SubmitEvent, useState } from 'react'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { Button, Select } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'

import { getInitialData, createEntry } from '#/lib/entries'
import { getUserFn } from '#/lib/getUser'

export const Route = createFileRoute('/entry')({
    beforeLoad: async () => {
        const user = await getUserFn()

        if (!user) {
            throw redirect({ to: '/login' })
        }

        return { user }
    },
    loader: async ({ context }) => {
        return { ...await getInitialData(), ...context }
    },
    component: EntryPage,
})

function EntryPage() {
    const { courses, paymentTypes, user } = Route.useLoaderData()
    const navigate = Route.useNavigate()
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (event: SubmitEvent) => {
        event.preventDefault()
        event.stopPropagation()

        const form = new FormData(event.target)

        const startDate = form.get('startDate')!.toString()
        const courseId = form.get('course')!.toString()
        const paymentTypeId = form.get('paymentType')!.toString()

        const result = await createEntry({
            data: {
                username: user,
                courseId,
                startDate,
                paymentTypeId
            }
        })

        if (result.error) {
            setError(result.error)
        } else {
            navigate({ to: '/profile' })
        }
    }


    return (
        <div className="min-h-screen">
            <div className="relative py-16 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="font-display text-center text-5xl md:text-6xl font-bold text-cream mb-4">
                        Создание заявки
                    </h1>

                    <p className='text-red-700 text-md text-center'>
                        {error}
                    </p>

                    <form className='max-w-xl mx-auto' action="" method="post" onSubmit={handleSubmit}>
                        <Select
                            label="Курс"
                            name="course"
                            data={courses.map(({ id, title }) => ({ value: id, label: title }))}
                            required
                        />

                        <DatePickerInput label="Желаемая дата начала" name="startDate" required />

                        <Select
                            label="Тип оплаты"
                            name="paymentType"
                            data={paymentTypes.map(({ id, title }) => ({ value: id, label: title }))}
                            required
                        />

                        <Button type="submit" fullWidth>Отправить</Button>
                    </form>

                    <Link to="/profile">Вернуться к списку заявок</Link>
                </div>
            </div>
        </div>
    )
}
