import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import api from '../services/api';

export default function CategoriesSlider() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/categories')
      .then(({ data }) => setCategories(data.data || []))
      .catch(() => {});
  }, []);

  if (categories.length === 0) return null;

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Shop Popular Categories</h2>
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 2500, pauseOnMouseEnter: true }}
        loop={true}
        spaceBetween={16}
        breakpoints={{
          320: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 6 },
        }}
        className="py-2"
      >
        {categories.map((cat) => (
          <SwiperSlide key={cat._id || cat.id}>
            <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center hover:shadow-md transition group cursor-pointer">
              <div className="h-28 w-full overflow-hidden rounded-lg mb-2 bg-gray-50 flex items-center justify-center">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover group-hover:scale-110 transition duration-300"
                />
              </div>
              <h3 className="text-xs font-semibold text-gray-700 truncate">{cat.name}</h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
