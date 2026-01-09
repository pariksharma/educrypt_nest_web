import { fetchAllCourse, fetchMyCourse } from "@/store/slice/courseSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Loader } from "../loader/loader";
import MyCourseCard from "../cards/mycourseCard";
import FreeCourseCard from "../cards/freeCourseCard";
import { useRouter } from "next/navigation";

const MyCourse = () => {
  const [tab, setTab] = useState("paid");
  const [courseList, setCourseList] = useState([]);
  const [freeCourseList, setFreeCourseList] = useState([]);

  const router = useRouter();
  const dispatch = useDispatch();
  const { myCourseData, myCourseLoading, myCourseError, allCourseData } =
    useSelector((state) => state?.courses);

  // console.log('allCourseData', allCourseData)

  useEffect(() => {
    if (!myCourseData) {
      const payload = {
        type: "course",
        page: "1",
        limit: "100",
      };
      dispatch(fetchMyCourse(payload));
    }
  }, [myCourseData, dispatch]);

  useEffect(() => {
    if (myCourseData) {
      // console.log("API Response Received:", myCourseData);

      let coursesArray = [];

      if (
        myCourseData.responseCode === 3012 &&
        Array.isArray(myCourseData.data)
      ) {
        coursesArray = myCourseData.data;
      }
      else if (Array.isArray(myCourseData)) {
        coursesArray = myCourseData;
      }

      if (coursesArray.length > 0) {
        const paidCourses = coursesArray.filter((item) => item?.tag == "Paid");
        const freeCourses = coursesArray.filter((item) => item?.tag == "Free");

        setCourseList(paidCourses);
        setFreeCourseList(freeCourses);

        console.log("Paid Courses:", paidCourses); 
        console.log("Free Courses:", freeCourses);
      } else {
        setCourseList([]);
        setFreeCourseList([]);
      }
    }
  }, [myCourseData]);

  // useEffect(() => {
  //   // console.log('my course:', myCourseData)
  //   // console.log('paid course:', courseList)
  //   // console.log('free course:', freeCourseList)
  // }, [myCourseData, dispatch]);

  const handleClick = (data) => {
    router.push(
      `/private/course/${data?.title?.replaceAll(" ", "-")?.toLowerCase()}-${
        data?.id
      }?from=my-course`
    );
  };

  const renderData = () => {
    if (tab == "paid" && courseList?.length > 0) {
      return courseList?.map((data, index) => {
        return <MyCourseCard key={index} data={data} />;
      });
    } else if (tab == "free" && freeCourseList?.length > 0) {
      return freeCourseList?.map((data, index) => {
        return (
          <FreeCourseCard
            key={index}
            data={data}
            value={"Explore"}
            handleClick={handleClick}
          />
        );
      });
    }

    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-70px)] col-span-full">
        <img className="w-50" src="/images/no-data.svg" alt="no data" />
        <p>No {tab === "paid" ? "Paid" : "Free"} Courses Found</p>
      </div>
    );
  };

  return (
    <>
      {myCourseLoading ? (
        <Loader />
      ) : myCourseError ? (
        "Error"
      ) : (
        <div className="flex w-full justify-center px-4">
          <div className="w-full ">
            <TabGroup>
              <TabList className="flex gap-4 pt-6 pb-2">
                <Tab
                  className={`px-3 py-1.5 text-[12px] font-semibold uppercase text-gray-600 data-selected:activeTab rounded-lg data-selected:active-tab focus-visible:outline-none cursor-pointer ${
                    tab == "paid" ? "activeTab bg-primary-light" : ""
                  }`}
                  onClick={() => setTab("paid")}
                >
                  {"Paid Courses"}
                </Tab>
                <Tab
                  className={`px-3 py-1.5 text-[12px] font-semibold uppercase text-gray-600 data-selected:data-hover:border data-selected:border rounded-lg data-selected:text-primary data-selected:data-hover:bg-black/3 data-selected:bg-black/3 cursor-pointer focus-visible:outline-none ${
                    tab == "free" ? "activeTab bg-primary-light" : ""
                  }`}
                  onClick={() => setTab("free")}
                >
                  {"Free Courses"}
                </Tab>
              </TabList>
              <TabPanels className="mt-3">
                <div className="grid md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 grid-cols-1 gap-2">
                  {renderData()}
                </div>
              </TabPanels>
            </TabGroup>
          </div>
        </div>
      )}
    </>
  );
};

export default MyCourse;
