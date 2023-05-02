import { useEffect, useRef } from 'react';
import { register } from 'swiper/element/bundle';

register();

export default function SwiperList({ children, slidesPerView, spaceBetween, breakpoints = {} }) {
  const swiperElRef = useRef(null);

  useEffect(() => {
    const swiperParams = {
      slidesPerView,
      spaceBetween,
      breakpoints,
    };

    Object.assign(swiperElRef.current, swiperParams);

    swiperElRef.current.initialize();
  }, []);

  return (
    <swiper-container
      ref={swiperElRef}
      init="false"
      navigation="false"
      pagination="false"
    >
      {children.map((child, index) => <swiper-slide key={index}>{child}</swiper-slide>)}
    </swiper-container>
  );
};
