import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaAngleRight } from "react-icons/fa6";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const OurProduct = () => {

  const router = useRouter();
  const break_Points = {
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
  };

  const homeState = useSelector((state) => state.home) || {};
  const { homeData, homeError, homeloading } = homeState;

  const nextRef = useRef(null);
  const prevRef = useRef(null);

  const productList =
    homeData?.data?.length > 0 &&
    homeData?.data?.filter((item) => item?.layout_type == "layout_feature")[0]
      ?.list;
  //   console.log("productList", productList);

  return (
    <>
      {productList?.length > 0 && (
        <div className="w-10/12 mx-auto mt-10 mb-5">
          <h1 className="text-center text-2xl font-bold mb-4">Our Product</h1>
          <div className="relative">
            <button
              ref={prevRef}
              className="absolute left-[-35px] top-1/2 -translate-y-1/2 z-10 swiper_nav_cutom_btn"
              aria-label="Previous slide"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              ref={nextRef}
              className="absolute right-[-35px] top-1/2 -translate-y-1/2 z-10 swiper_nav_cutom_btn"
              aria-label="Next slide"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <Swiper
              slidesPerView={4}
              spaceBetween={22}
              loop={true}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
              }}
              // pagination={{
              //     clickable: true,
              //     dynamicBullets: true,
              // }}
              breakpoints={break_Points}
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
               style={{ padding: "15px 0 10px" }}  
            >
              {productList?.map((item, index) => {
                return (
                  <SwiperSlide>
                    <button
                      className={`h-42 object-fill w-full rounded-xl bg-no-repeat bg-gray-200 relative bg-center bg-contain`}
                      style={{
                        backgroundImage: `url(${item?.thumbnail || ""})`,
                      }}
                      onClick={() => {
                        const title = item?.title || "course";
                        const id = item?.id || "";
                        const viewType = item?.view_type || "";

                        router.push(
                          `/private/product/142`
                        );
                      }}
                    >
                      <div
                        className="w-full h-40 absolute bottom-0 rounded-b-xl"
                        style={{
                          background:
                            "linear-gradient(180deg, transparent 80%, rgba(0,0,0,.8))",
                        }}
                      ></div>
                      <div className="flex items-center justify-between w-full px-3 absolute bottom-1">
                        <h1 className="text-xs font-semibold text-white">
                          {item?.title}
                        </h1>
                        <span className="h-4.5 w-4.5 bg-white rounded-full flex items-center justify-center">
                          <FaAngleRight className="h-2.5 w-2.5" />
                        </span>
                      </div>
                    </button>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      )}
    </>
  );
};

export default OurProduct;
