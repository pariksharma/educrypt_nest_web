"use client";

import React, { useMemo, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useSelector } from "react-redux";
import { FaCircleUser, FaQuoteRight } from "react-icons/fa6";

const Testimonial = () => {
  const { homeData } = useSelector((state) => state.home) || {};

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  const testimonials = useMemo(
    () => homeData?.data?.find((i) => i.layout_type === "layout_review"),
    [homeData]
  );

  const enableSlider = testimonials?.list?.length > 3;

  useEffect(() => {
    if (!enableSlider) return;
    if (!swiperRef.current) return;
    if (!prevRef.current || !nextRef.current) return;

    const swiper = swiperRef.current;

    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;

    swiper.navigation.destroy();
    swiper.navigation.init();
    swiper.navigation.update();
  }, [enableSlider]);

  if (!testimonials?.list?.length) return null;

  return (
    <div className="w-10/12 mx-auto mt-10 mb-10 testimonials">
      <h1 className="text-center text-2xl font-bold mb-4">Testimonial</h1>

      <div className="relative">
        {enableSlider && (
          <>
            <button
              ref={prevRef}
              className="absolute left-[-35px] top-1/2 -translate-y-1/2 z-10 swiper_nav_cutom_btn"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              ref={nextRef}
              className="absolute right-[-35px] top-1/2 -translate-y-1/2 z-10 swiper_nav_cutom_btn"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          slidesPerView={3}
          spaceBetween={25}
          loop={enableSlider}
          autoplay={
            enableSlider
              ? { delay: 3000, disableOnInteraction: false }
              : false
          }
          pagination={{ clickable: true, dynamicBullets: true }}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          modules={enableSlider ? [Autoplay, Pagination, Navigation] : [Pagination]}
          className="mySwiper"
          style={{ padding: "15px 0 10px" }}
        >
          {testimonials.list.map((item, index) => (
            <SwiperSlide key={item.id || item.name || index}>
              <div className="flex flex-col gap-3 shadow-lg p-5 rounded-lg bg-white h-full hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3 items-start">
                    <FaCircleUser className="w-12 h-12 text-gray-400" />
                    <div>
                      <h4 className="text-lg font-semibold">{item.name}</h4>
                      <p className="text-xs text-gray-500">Student</p>
                    </div>
                  </div>
                  <FaQuoteRight className="w-10 h-10 text-amber-400 -mt-2" />
                </div>

                <p className="text-sm text-gray-700 h-16 overflow-y-auto no-scrollbar">
                  {item.review}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Testimonial;
