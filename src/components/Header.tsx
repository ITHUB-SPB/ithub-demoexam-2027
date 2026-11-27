import { Link, useNavigate, useRouter } from '@tanstack/react-router'
import logo from '../assets/branding/image01.webp'
import { logout } from '#/lib/auth'

type HeaderProps = {
  fullname: string
  isAdmin: boolean
}

export function Header({ fullname, isAdmin }: HeaderProps) {
  const navigate = useNavigate()
  const router = useRouter()

  async function handleLogout() {
    await logout()
    await router.invalidate()
    await navigate({ to: '/login' })
  }

  return (
    <header className="header">
      <Link to={isAdmin ? '/admin' : '/'} className="brand">
        <img src={logo} alt="Корочки.есть" className="brand-logo" />
        <span className="brand-name">
          Корочки<span className="brand-accent">.есть</span>
        </span>
      </Link>
      <nav className="header-nav">
        {!isAdmin && (
          <>
            <Link to="/" className="header-link">
              Мои заявки
            </Link>
            <Link to="/new-entry" className="header-link">
              Новая заявка
            </Link>
          </>
        )}
        <span className="header-user">{fullname}</span>
        <button type="button" className="button-outline" onClick={handleLogout}>
          Выйти
        </button>
      </nav>
    </header>
  )
}
