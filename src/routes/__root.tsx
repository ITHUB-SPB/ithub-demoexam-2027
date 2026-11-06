import { createRootRoute, Outlet, Link } from '@tanstack/react-router'
import '../styles.css' // Подключаем стили

export const Route = createRootRoute({
  component: () => (
    <div className="app-container">
      <header className="header">
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          Корочки.есть
        </Link>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  ),
})