import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import reviews from "../ui/review";

function Testimonial() {
    return(
        <>  
        <div className='max-w-6xl mx-auto space-y-4 py-4 px-6 text-center'>      
            <h2 className="pb-3 text-center text-[clamp(1.1rem,2.8vw+1rem,2.2rem)] text-[#232946] font-semibold">
                Here is what our <span className="text-[#1c73ba]">Customers</span> have to say
            </h2>
        </div>

        <Swiper
            modules={[Autoplay, FreeMode]}
            autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
                waitForTransition: true,
            }}
            freeMode={{
                enabled: true,
                momentum: true,
                sticky: true,
            }}
            speed={3000}
            loop={true}
            slidesPerView={1.1}
            spaceBetween={20}
            centeredSlides={true}
            breakpoints={{
                640: { 
                    slidesPerView: 2, 
                    spaceBetween: 30, 
                    centeredSlides: false 
                },
                1024: { 
                    slidesPerView: 3, 
                    spaceBetween: 40, 
                    centeredSlides: false 
                },
            }}
            className="!overflow-visible"
        >
            {reviews.map((review, index) => (
                <SwiperSlide key={index}>
                    <div className='bg-slate-100 min-h-[33rem] lg:min-h-[27rem] flex flex-col items-center py-4 px-2 space-y-4 text-center shadow-lg transition-transform duration-300 hover:scale-105'>
                        <img 
                            className="rounded-full w-24 h-24 object-cover"
                            alt={review.name} 
                            src={review.image}
                        />
                        <div className='flex flex-row'>
                            {Array.from({ length: 5 }, (_, i) => (
                                <svg 
                                    key={i}
                                    className={`${i < review.rating ? 'fill-amber-500' : 'fill-gray-200'} h-5`}
                                    viewBox='0 0 20 20'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path d="M9.5 14.25l-5.584 2.936 1.066-6.218L.465 6.564l6.243-.907L9.5 0l2.792 5.657 6.243.907-4.517 4.404 1.066 6.218" />
                                </svg>
                            ))}
                        </div>
                        <div className='flex flex-col gap-3 px-4'>
                            <p className='text-gray-600 italic'>{review.review}</p>
                            <h2 className='font-semibold text-lg'>{review.name}</h2>
                            <p className="text-gray-500 text-sm">{review.position}</p>
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>

        <style jsx global>{`
            .swiper-wrapper {
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;
            }
            .swiper-slide {
                opacity: 0.7;
                transform: scale(0.95);
                transition: all 0.8s ease-in-out;
            }
            .swiper-slide-active {
                opacity: 1;
                transform: scale(1);
            }
        `}</style>
        </>
    );
}

export default Testimonial;