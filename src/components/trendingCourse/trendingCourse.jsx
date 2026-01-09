'use client';

import React, { useEffect, useMemo, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
 
const TrendingCourse = () => {
 
    const dispatch = useDispatch()
    const { homeData, homeloading, homeError } = useSelector((state) => state.home || {});
    const trendingCourse = useMemo(() => homeData?.data?.find((item) => item.layout_type === 'layout_trending_course'), [homeData]);
    const router = useRouter();
    const nextRef = useRef(null)
    const prevRef = useRef(null)
    // console.log('homeData', homeData)
 
    // if (homeloading) return <p>Loading...</p>;
    // if (homeError) return <p className="text-red-500">{homeError}</p>;

    // console.log('trendingCourse', trendingCourse)
 
    return (
        <>
            {trendingCourse?.list?.length > 0 &&
                (
                    <div className='w-full flex flex-col items-center mt-10 mb-5'>
                        <h1 className='text-center text-2xl font-bold mb-4'>Trending Course</h1>
                        <div className="w-full max-w-8/12 px-6 relative">
                            <button
                                ref={prevRef}
                                className="absolute left-[-15px] top-1/2 -translate-y-1/2 z-10 swiper_nav_cutom_btn"
                                aria-label="Previous slide"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
        
                            <button
                                ref={nextRef}
                                className="absolute right-[-15px] top-1/2 -translate-y-1/2 z-10 swiper_nav_cutom_btn"
                                aria-label="Next slide"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                            <Swiper
                                slidesPerView={4}
                                spaceBetween={20}
                                loop={true}
                                centeredSlides={false}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: true,
                                }}
                                // pagination={{
                                //     clickable: true,
                                //     dynamicBullets: true,
                                // }}
                                breakpoints={{
                                    320: {
                                        slidesPerView: 1,
                                    },
                                    640: {
                                        slidesPerView: 2,
                                    },
                                    768: {
                                        slidesPerView: 3,
                                    },
                                    1024: {
                                        slidesPerView: 4,
                                    },
                                }}
                                navigation={{
                                    prevEl: prevRef.current,
                                    nextEl: nextRef.current,
                                }}
                                onInit={(swiper) => {
                                    swiper.params.navigation.prevEl = prevRef.current;
                                    swiper.params.navigation.nextEl = nextRef.current;
                                    swiper.navigation.init();
                                    swiper.navigation.update();
                                }}
                                modules={[Autoplay, Navigation]}
                                className="mySwiper"
                                style={{ padding: "10px 0" }}
                            >
                                {trendingCourse.list.map((item, idx) => (
                                    <SwiperSlide key={idx}>
                                        <div className='tranding_course_explore relative rounded-lg flex flex-col gap-1'>
                                            <img src={item.thumbnail} alt={`trend-${idx}`} className='h-30 object-fill w-full rounded-xl' />
                                            <div className='hidden w-full gap-1 items-center justify-between trending_explore_btn'>
                                                <button
                                                    onClick={() => 
                                                        router.push(`/private/course/${item.title.replaceAll(' ','-').toLowerCase()}-${item?.id}?from=home`)
                                                    }
                                                    className="hover-bg-primary text-[11px] hover-text-white bg-white text-primary border border-primary cursor-pointer py-1 w-full rounded-md font-semibold"
                                                >
                                                    Explore
                                                </button>
                                                {item?.is_purchased == '0' &&
                                                    <button
                                                        className="bg-primary text-[11px] text-white hover-bg-white hover-text-primary border border-primary cursor-pointer py-1 w-full rounded-md font-semibold"
                                                        onClick={() => 
                                                        router.push(`/checkout/${item.title.replaceAll(' ','-').toLowerCase()}-${item?.id}?from=home`)
                                                    }
                                                    >
                                                        Buy Now
                                                    </button>
                                                }
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                )
            } 
        </>
    )
}

export default TrendingCourse;