import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'

import slide1 from '../assets/slider/image08.webp'
import slide2 from '../assets/slider/image09.webp'
import slide3 from '../assets/slider/image12.webp'
import slide4 from '../assets/slider/image13.webp'

import 'swiper/css/bundle'

const slides = [slide1, slide2, slide3, slide4]

export default function Slider() {
    return (
        <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            loop
            autoplay={{
                delay: 3000,
                disableOnInteraction: false,
            }}
            className="slider"
        >
            {slides.map((src, i) => (
                <SwiperSlide key={i}>
                    <img src={src} alt={`Слайд ${i + 1}`} className="slider-image" />
                </SwiperSlide>
            ))}
        </Swiper>
    )
}