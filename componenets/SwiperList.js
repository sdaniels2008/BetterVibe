import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

export default function SwiperList({ children, slidesPerView, spaceBetween, breakpoints = {} }) {
  return (
    <Swiper
    slidesPerView={slidesPerView}
    spaceBetween={spaceBetween}
    breakpoints={breakpoints}
    >
      {children.map((child, index) => <SwiperSlide key={index}>{child}</SwiperSlide>)}
    </Swiper>
  );
};
