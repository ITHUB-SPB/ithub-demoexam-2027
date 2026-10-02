import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  useRouter,
} from '@tanstack/react-router'
import { getCurrentUserFn, logoutFn } from '#/lib/auth'
import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Корочки.есть' },
    ],
  }),
  loader: async () => {
    console.log('[root loader] started')
    const user = await getCurrentUserFn()
    console.log('[root loader] user =', user)
    return { user }
  },
  shellComponent: RootShell,
  component: RootComponent,
})

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-800">
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </>
  )
}

function Header() {
  const loaderData = Route.useLoaderData()
  const user = loaderData?.user ?? null
  const router = useRouter()

  async function handleLogout() {
    await logoutFn()
    await router.invalidate()
    router.navigate({ to: '/' })
  }

  return (
    <header className="bg-blue-700 text-white">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
        <Link to="/" className="mr-auto text-lg font-semibold">
          Корочки.есть
        </Link>
        {user ? (
          <>
            <Link to="/applications">Мои заявки</Link>
            <Link to="/applications/new">Новая заявка</Link>
            {user.role === 'admin' && <Link to="/admin">Админ-панель</Link>}
            <button onClick={handleLogout} className="underline">
              Выйти ({user.login})
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Вход</Link>
            <Link to="/register">Регистрация</Link>
          </>
        )}
      </nav>
    </header>
  )
}