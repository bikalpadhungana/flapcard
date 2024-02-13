import {Swiper,SwiperSlide} from 'swiper/react';
// import {Autoplay,Navigation} from 'swiper';
import 'swiper/css'
import reviews from "../ui/review";


function Testimonial() {

    return(
       <>  
       <div className='max-w-6xl mx-auto space-y-4 py-4 px-6 text-center'>      
        <h2 className="pb-3 text-center text-[clamp(1.1rem,2.8vw+1rem,2.2rem)] text-[#232946] font-semibold">
          Here is what our <span className="text-[#143385]">Customers</span> have to say
        </h2>
        <p className="text-gray-500 text-center">Discover what people have to say about us.</p>
        </div>

        <Swiper


        slidesPerView={1.1}
        spaceBetween={10}
        centeredSlides={true}
         breakpoints={{
            640:{slidesPerView:2,spaceBetween:10,centeredSlides:false},
            1024:{slidesPerView:3,spaceBetween:20,centeredSlides:false}
         }}
        >
            {
                reviews.map((review,index)=>{
                    return(
                        <SwiperSlide key={index}>
                            <div className='bg-slate-100 min-h-[33rem] lg:min-h-[27rem]  flex flex-col items-center py-4 px-2 space-y-4 text-center shadow-lg '>
                                <img  className="rounded-full" alt='icon' width={100} height={100} src={review.image}></img>

                                 <div className='flex flex-row'>
                                    {Array.from({length:5},(_,index)=>
                                        (
                                            <svg key={index}
                                            className={`${index<=review.rating-1 ?'fill-amber-500':'fill-gray-200'} h-4`}
                                                viewBox='0 0 20 20'
                                                id="star"
                                                xmlns='http://www.w3.org/2000/svg'
                                            >
                                                <path
                                                    id='path4749-2-8-2'
                                                    d="M9.5 14.25l-5.584 2.936 1.066-6.218L.465 6.564l6.243-.907L9.5 0l2.792 5.657 6.243.907-4.517 4.404 1.066 6.218"
                                                />
                                                </svg>



                                        )
                                    )}
                                </div>

                                <div className='flex flex-col gap-3'>
                                <p>{review.review}</p>
                                <h2 className='font-semibold p-0'>{review.name}</h2>
                                <p className="py--10">{review.position}</p>
                                </div>
                            </div>

                        </SwiperSlide>
                    )
                })
            }
        </Swiper>

        </>

    )
}

export default Testimonial;