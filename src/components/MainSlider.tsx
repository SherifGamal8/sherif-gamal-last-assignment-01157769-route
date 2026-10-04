import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import slider1 from '../assets/slider-1.png';

export default function MainSlider() {
  const slides = [
    slider1,
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80',
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Main Swiper Carousel (2 cols) */}
      <div className="md:col-span-2 rounded-2xl overflow-hidden shadow-sm h-64 md:h-80">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="w-full h-full"
        >
          {slides.map((src, index) => (
            <SwiperSlide key={index}>
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Side Promotion Banners (1 col) */}
      <div className="hidden md:flex flex-col gap-4 h-80">
        <div className="flex-1 rounded-2xl overflow-hidden relative shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1506617420156-8e4536971650?w=600&auto=format&fit=crop&q=80"
            alt="Promo 1"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent p-4 flex flex-col justify-end text-white">
            <span className="text-xs uppercase font-bold text-yellow-300">Fresh Deals</span>
            <h4 className="text-base font-bold">Organic Vegetables</h4>
          </div>
        </div>

        <div className="flex-1 rounded-2xl overflow-hidden relative shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80"
            alt="Promo 2"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent p-4 flex flex-col justify-end text-white">
            <span className="text-xs uppercase font-bold text-yellow-300">Daily Discount</span>
            <h4 className="text-base font-bold">Fresh Bakery Items</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
