import { useEffect, useState } from 'react'
import slide1 from '../assets/slider/image06.jpg'
import slide2 from '../assets/slider/image07.jpg'
import slide3 from '../assets/slider/image08.webp'
import slide4 from '../assets/slider/image09.webp'

const slides = [
  { src: slide1, alt: 'Онлайн-курсы дополнительного профессионального образования' },
  { src: slide2, alt: 'Обучение из любой точки мира' },
  { src: slide3, alt: 'Удостоверение о повышении квалификации' },
  { src: slide4, alt: 'Практические навыки от экспертов отрасли' },
]

const AUTOPLAY_INTERVAL = 3000

export function Slider() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length)
    }, AUTOPLAY_INTERVAL)
    return () => clearInterval(timer)
  }, [])

  const showPrev = () =>
    setIndex((current) => (current - 1 + slides.length) % slides.length)
  const showNext = () =>
    setIndex((current) => (current + 1) % slides.length)

  return (
    <div className="slider">
      <img
        className="slider-image"
        src={slides[index].src}
        alt={slides[index].alt}
      />
      <button
        type="button"
        className="slider-button slider-button-prev"
        onClick={showPrev}
        aria-label="Предыдущий слайд"
      >
        ‹
      </button>
      <button
        type="button"
        className="slider-button slider-button-next"
        onClick={showNext}
        aria-label="Следующий слайд"
      >
        ›
      </button>
      <div className="slider-dots">
        {slides.map((slide, dotIndex) => (
          <button
            key={slide.src}
            type="button"
            className={
              dotIndex === index ? 'slider-dot slider-dot-active' : 'slider-dot'
            }
            onClick={() => setIndex(dotIndex)}
            aria-label={`Слайд ${dotIndex + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
