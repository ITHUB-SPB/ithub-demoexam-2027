import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

const slides = [
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop'
]

function LoginPage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Автоматическая смена каждые 3 секунды
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <div>
      {/* Слайдер */}
      <div className="slider-container">
        {slides.map((src, idx) => (
          <img 
            key={idx} 
            src={src} 
            alt={`Слайд ${idx + 1}`} 
            className={`slider-image ${idx === currentSlide ? 'active' : ''}`} 
          />
        ))}
        <button className="slider-btn prev" onClick={prevSlide}>&#10094;</button>
        <button className="slider-btn next" onClick={nextSlide}>&#10095;</button>
      </div>

      <h1>Вход в систему</h1>
      
      <form>
        <div className="form-group">
          <label>Логин</label>
          <input type="text" className="form-control" placeholder="Введите логин" />
        </div>
        <div className="form-group">
          <label>Пароль</label>
          <input type="password" className="form-control" placeholder="Введите пароль" />
        </div>
        <button type="submit" className="btn">Войти</button>
      </form>

      <Link to="/register" className="link-text">
        Еще не зарегистрированы? Регистрация
      </Link>
    </div>
  )
}