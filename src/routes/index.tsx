import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => (
    <div>
      <h1>Добро пожаловать!</h1>
      <p style={{ marginBottom: '20px', color: '#555' }}>Выберите действие:</p>
              <Link to="/admin" className="btn" style={{ textDecoration: 'none', textAlign: 'center', background: '#dc3545', marginTop: '20px' }}>
          Панель администратора
        </Link> 
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <Link to="/create" className="btn" style={{ textDecoration: 'none', textAlign: 'center' }}>
          Подать заявку на курс
        </Link>
        <Link to="/applications" className="btn" style={{ textDecoration: 'none', textAlign: 'center', background: '#28a745' }}>
          Мои заявки
        </Link>
        <Link to="/login" className="btn" style={{ textDecoration: 'none', textAlign: 'center', background: '#6c757d' }}>
          Войти в систему
        </Link>
        <Link to="/register" className="btn" style={{ textDecoration: 'none', textAlign: 'center', background: '#17a2b8' }}>
          Зарегистрироваться
        </Link>
      </div>
    </div>
  ),
})