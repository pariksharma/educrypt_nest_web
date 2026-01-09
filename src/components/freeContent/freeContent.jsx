import React, { useEffect, useMemo, useRef, useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import FreeCourseCard from "../cards/freeCourseCard";
import { useRouter } from "next/navigation";
import { fetchAllFreeCourse } from "@/store/slice/courseSlice";

const FreeContent = () => {
  const categories = [{ name: "Free Courses" }, { name: "Free Tests" }];
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
    }

    const [allFreecourses, setAllFreecourses] = useState([])

    const nextRef = useRef(null)
    const prevRef = useRef(null)
    const router = useRouter()
    const dispatch = useDispatch()
    const { allCourseData, freeCourseData } = useSelector((state) => state?.courses);
  

  const allFreeTests = useMemo(() => {
    const TestData = allCourseData?.data?.find(
      (item) => item.layout_type === "course_list_layout"
    );
    let freeTests = [];
    if (TestData?.list?.length > 0) {
      freeTests = TestData?.list?.filter(
        (item) => item?.mrp == "0.00" && item.cat_type == 9
      );
    }
    return freeTests;
  }, [allCourseData]);

  useEffect(() => {
    const payload = {
        cat_id: "1",
        page: "1",
        is_free: "1",
        view_type: "0",
    };
    dispatch(fetchAllFreeCourse(payload));
  }, [])

  useEffect(() => {
    if(freeCourseData?.responseCode == "3001") {
      const courseData = freeCourseData?.data?.find(
        (item) => item.layout_type === "course_list_layout"
      );
      let freeCourses = [];
      if (courseData?.list?.length > 0) {
        freeCourses = courseData?.list?.filter(
          (item) => item?.mrp == "0.00" && item.cat_type == 0
        );
      //   console.log("freeCourses", freeCourses);
      }
      setAllFreecourses(freeCourses);
    }
  }, [freeCourseData])

  const handleTabChange = (name) => {
    console.log("key", name);
  };

  const handleClick = (data) => {
      router.push(`/private/course/${data?.title?.replace(' ', '-')?.toLowerCase()}-${data?.id}?from=my-course`)
  }

  if (allFreecourses?.length > 0 || allFreeTests?.length > 0) {
    return (
      <div className="flex w-full justify-center px-4">
        <div className="w-full ">
          <TabGroup>
            <TabList className="flex gap-4 justify-center">
              {categories.map(
                ({ name }) =>
                  name == "Free Courses" &&
                  allFreecourses?.length > 0 && (
                    <Tab
                      key={name}
                      className="px-3 py-1 text-xl font-bold text-black focus-visible:outline-none data-hover:bg-black/3 data-selected:border-b-2 data-selected:data-hover:bg-black/3 cursor-pointer"
                      onClick={() => handleTabChange(name)}
                    >
                      {name}
                    </Tab>
                  )
              )}
              {categories.map(
                ({ name }) =>
                  name == "Free Tests" &&
                  allFreeTests?.length > 0 && (
                    <Tab
                      key={name}
                      className="px-3 py-1 text-xl font-bold text-black focus-visible:outline-none data-hover:bg-black/3 data-selected:border-b-2 data-selected:data-hover:bg-black/3 cursor-pointer"
                      onClick={() => handleTabChange(name)}
                    >
                      {name}
                    </Tab>
                  )
              )}
            </TabList>
            <TabPanels className="mt-3">
              {categories.map(({ name }) => (
                <TabPanel key={name} className="rounded-xl px-3">
                  {name == "Free Courses" && (
                    <div className="w-10/12 mx-auto mt-10 mb-5 relative">
                        <button
                            ref={prevRef}
                            className="absolute left-[-35px] top-1/2 -translate-y-1/2 z-10 swiper_nav_cutom_btn"
                            aria-label="Previous slide"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
    
                        <button
                            ref={nextRef}
                            className="absolute right-[-35px] top-1/2 -translate-y-1/2 z-10 swiper_nav_cutom_btn"
                            aria-label="Next slide"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
                            style={{ paddingLeft: "20px", paddingRight: "20px", paddingBottom: "10px" }}
                        >
                            {allFreecourses?.map((item, index) => {
                            return (
                                <SwiperSlide key={index}>
                                <FreeCourseCard
                                    handleClick={handleClick}
                                    data={item}
                                    value={"Explore"}
                                />
                                </SwiperSlide>
                            );
                            })}
                        </Swiper>
                    </div>
                  )}
                  {name == "Free Tests" && (
                    <div className="md:w-10/12 w-full mx-auto mt-10 mb-5 relative">
                        <button
                            ref={prevRef}
                            className="absolute left-[-35px] top-1/2 -translate-y-1/2 z-10 swiper_nav_cutom_btn"
                            aria-label="Previous slide"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
    
                        <button
                            ref={nextRef}
                            className="absolute right-[-35px] top-1/2 -translate-y-1/2 z-10 swiper_nav_cutom_btn"
                            aria-label="Next slide"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
                        style={{ paddingLeft: "20px", paddingRight: "20px" }}
                      >
                        {allFreecourses?.map((item, index) => {
                          return (
                            <SwiperSlide key={index}>
                              <FreeCourseCard
                                handleClick={handleClick}
                                data={item}
                                value={"Attempt Now"}
                              />
                            </SwiperSlide>
                          );
                        })}
                      </Swiper>
                    </div>
                  )}
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    );
  }
};

export default FreeContent;
