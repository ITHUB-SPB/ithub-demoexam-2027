import { getUser } from '#/lib/login';
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
    beforeLoad: async () => {
        const { login } = await getUser();

        if (login === null) {
            throw redirect({ to: '/login' })
        }
    }
})


function RouteComponent() {
    return (
        <div className='page index-page'>
            <article className='index'>
                <h2>Курсы</h2>
            </article>
        </div>
    )
}
