import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'

import slide1 from '../assets/slider/image08.webp'
import slide2 from '../assets/slider/image09.webp'
import slide3 from '../assets/slider/image12.webp'
import slide4 from '../assets/slider/image13.webp'

import 'swiper/css/bundle'

export default function Slider() {
    return (
        <Swiper modules={[Autoplay, Navigation]} navigation autoplay={{ delay: 3_000 }} className='slider'>
            <SwiperSlide><img src={slide1} className='slider-image' /></SwiperSlide>
            <SwiperSlide><img src={slide2} className='slider-image' /></SwiperSlide>
            <SwiperSlide><img src={slide3} className='slider-image' /></SwiperSlide>
            <SwiperSlide><img src={slide4} className='slider-image' /></SwiperSlide>
        </Swiper>
    )
}