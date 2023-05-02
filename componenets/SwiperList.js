import { useRef } from 'react';
import { register } from 'swiper/element/bundle';

register();

export default function SwiperList({ children }) {
  const swiperElRef = useRef(null);

  return (
    <swiper-container
      ref={swiperElRef}
      slides-per-view="2.2"
      space-between="20"
      navigation="false"
      pagination="false"
    >
      {children.map((child, index) => <swiper-slide key={index}>{child}</swiper-slide>)}
    </swiper-container>
  );
};
