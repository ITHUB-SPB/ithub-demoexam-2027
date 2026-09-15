import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { Table } from '@mantine/core'
import { getUserFn } from '#/lib/getUser'
import { logoutFn } from '#/lib/logout'
import { getEntries } from '#/lib/entries'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const user = await getUserFn()

    if (!user) {
      throw redirect({ to: '/login' })
    }

    return { user }
  },
  loader: async ({ context }) => {
    const username = context.user

    if (username === "Admin") {
      return await getEntries({ data: {} })
    }

    return await getEntries({ data: { username } })
  },
  component: ProfilePage,
})

function ProfilePage() {
  const { user } = Route.useRouteContext()
  const entries = Route.useLoaderData()
  const navigate = Route.useNavigate()

  async function handleClick() {
    await logoutFn()
    navigate({ to: '/login' })
  }

  return (
    <>
      <div>
        Hello {user}
        <button onClick={handleClick}>Выйти</button>
      </div>

      {!("error" in entries) && entries.length && (
        <Table>
          <Table.Thead>
            <Table.Tr>
              {user === "Admin" && <Table.Th>ФИО</Table.Th>}
              <Table.Th>Название курса</Table.Th>
              <Table.Th>Способ оплаты</Table.Th>
              <Table.Th>Дата начала</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {entries.map((entry) => (
              <Table.Tr key={entry.id}>
                {entry.author && <Table.Td>{entry.author.name}</Table.Td>}
                <Table.Td>{entry.course.title}</Table.Td>
                <Table.Td>{entry.paymentType.title}</Table.Td>
                <Table.Td>{entry.status.title}</Table.Td>
                {/* <Table.Td>{entry.startDate}</Table.Td> */}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      {user !== "Admin" && <Link to="/entry">Добавить заявку</Link>}
    </>
  )
}
