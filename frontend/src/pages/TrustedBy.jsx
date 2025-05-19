import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import { motion } from 'framer-motion';
import TrustedBy from '../ui/TrustedBy';

function TrustedBySection() {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    setIsVisible(window.scrollY > 300);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className='max-w-6xl mx-auto space-y-4 py-4 px-6 text-center bg-'>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h2 className="pb-3 text-center text-[clamp(1.1rem,2.8vw+1rem,2.2rem)] text-[#232946] font-semibold">
            Chosen <span className="text-[#1c73ba]">By</span>
          </h2>

          <Swiper
            modules={[Autoplay, FreeMode]}
            autoplay={{
              delay: 100,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              waitForTransition: true,
            }}
            speed={3000}
            freeMode={{
              enabled: true,
              momentum: true,
              sticky: true,
            }}
            loop={true}
            slidesPerView={1.2}
            spaceBetween={20}
            centeredSlides={true}
            breakpoints={{
              640: {
                slidesPerView: 3,
                spaceBetween: 30,
                centeredSlides: false,
              },
              1024: {
                slidesPerView: 6,
                spaceBetween: 40,
                centeredSlides: false,
              },
            }}
            className="!overflow-visible"
            role="region"
            aria-label="Trusted by clients carousel"
          >
            {TrustedBy.map((client, index) => (
              <SwiperSlide key={index}>
                <div className='flex justify-center py-4 px-2 text-center bg-slate-100 shadow-lg transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:scale-110 will-change-transform'>
                  <img
                    className="max-h-20 object-contain transition-transform duration-300 ease-in-out"
                    alt={client.name ? `${client.name} logo` : `Client logo ${index + 1}`}
                    src={client.image}
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      )}

      <style jsx global>{`
        .swiper-wrapper {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        .swiper-slide {
          opacity: 0.7;
          transform: scale(0.95);
          transition: all 0.5s ease-in-out;
        }
        .swiper-slide-active {
          opacity: 1;
          transform: scale(1);
        }
      `}</style>
    </div>
  );
}

export default TrustedBySection;