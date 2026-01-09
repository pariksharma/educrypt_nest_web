'use client';

import React, { useEffect, useState, useMemo } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchHome } from '@/store/slice/homeSlice';
 
const Banner = ({className}) => {
 
    const dispatch = useDispatch()
    const homeState = useSelector((state) => state.home) || {};
    const { homeData, homeError, homeloading } = homeState;
 
    const bannerData = useMemo(() => homeData?.data?.find((item) => item.layout_type === 'layout_banner'), [homeData]);
    // console.log('bannerData', bannerData, homeData)
 
    // const handleBannerClick = (item) => {
    //     if (bannerData.list?.action_item_id) {
    //         router.push(`/courses/${item.action_item_id}`);
    //     }
    // };
 
    // if (homeloading) return <p>Loading...</p>;
    if (homeError) return <p className="text-red-500">{homeError}</p>;
 
    return (
        <>
        {bannerData?.list?.length > 0 ?
            (
                <div className={`mx-auto ${className}`}>
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={0}
                        centeredSlides={true}
                        loop={true}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        navigation={false}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="mySwiper"
                        style={{paddingBottom: '30px'}}
                    >
                        {[1, 2, 3]?.map((item, index) =>(
                            <SwiperSlide key={index}>
                                {/* <div
                                    onClick={() => handleBannerClick(item)}
                                    className="cursor-pointer relative"
                                >
                                    <img src={item.image_url} alt="banner" className='h-60 object-fill w-full rounded-xl' />
                                </div> */}
                                <img src={"https://media.istockphoto.com/id/517188688/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=A63koPKaCyIwQWOTFBRWXj_PwCrR4cEoOw2S9Q7yVl8="} alt={`banner-${index}`} className='h-70 object-fill w-full rounded-xl' />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            ) : (
                <div className="w-10/12 mx-auto mt-20">
                    <p className="text-center text-gray-500"></p>
                </div>
            )
        }
        </>
    )
}

export default Banner;