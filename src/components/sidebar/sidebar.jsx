"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Sidebar = ({addClass}) => {
  const [sidebarData, setSidebarData] = useState([]);

  const dispatch = useDispatch();
  const { appSettings, appsettingError, appsettingloading } = useSelector(
    (state) => state?.auth
  );

  useEffect(() => {
    if (appSettings?.responseCode == "1008") {
      setSidebarData(appSettings?.data?.menus?.sidebar);
    }
  }, [appSettings]);

  // console.log('sidebarData', sidebarData)

  return (
    <div
      className={`fixed md:top-[67px] top-0 left-0 bg-white h-full shadow-xl z-50 
        transform transition-transform duration-300
        md:translate-x-0
        ${false ? "translate-x-0" : "-translate-x-full"}
        ${addClass}`}
    >
      <ul className="flex flex-col gap-1 md:pt-2 pt-10 px-4 py-2 h-[calc(100vh-80px)] overflow-y-auto thin-scrollbar relative">
        {/* <div className='absolute top-4 right-5 block md:hidden' onClick={() => dispatch(closeSidebar())}>
                <IoCloseOutline className='h-6 w-6' />
            </div> */}

        {sidebarData.length > 0 && (
          <>
            <h1 className="text-xs text-gray-400 capitalize mt-1 mb-1">
              Study Material
            </h1>

            <li className="w-full">
              <Link
                href="/private/our-courses"
                className={`text-xs block w-full px-2 py-1.5 `}
                // onClick={() => router.push("/private/our-courses")}
              >
                Our Courses
              </Link>
            </li>

            {sidebarData
              .filter((item) =>
                [
                  "current_affairs",
                  // "inquiries_doubt_section",
                  "live_class",
                  "blogs"
                ].includes(item.route)
              )
              .map((item, idx) => {
                if(item?.route == "current_affairs") {
                  return (
                    <li key={idx}>
                      <Link
                        href={'/private/current-affairs'}
                        className={`text-xs block w-full px-2 py-1.5 `}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                } else if(item?.route == "live_class") {
                  return (
                    <li key={idx}>
                      <Link
                        href={'/private/live-classes'}
                        className={`text-xs block w-full px-2 py-1.5 `}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                } else if(item?.route == "blogs") {
                  return (
                    <li key={idx}>
                      <Link
                        href={'/private/blogs'}
                        className={`text-xs block w-full px-2 py-1.5 `}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                else {
                  return (
                    <li key={idx}>
                      <Link
                        href={"link"}
                        className={`text-xs block w-full px-2 py-1.5 `}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }
              })}

            <Link
              href={"link"}
              className={`text-xs block w-full px-2 py-1.5 `}
              // onClick={() => dispatch(closeSidebar())}
            >
              {'Notification'}
            </Link>

            <h1 className="text-xs text-gray-400 capitalize mt-3 mb-1">
              My Stuff
            </h1>

            <li>
              <Link
                href="/private/my-course"
                className={`text-xs block w-full px-2 py-1.5 `}
                // onClick={() => dispatch(closeSidebar())}
              >
                My Course
              </Link>
            </li>

            {sidebarData
              .filter((item) =>
                ["purchase_history"].includes(
                  item.route
                )
              )
              .map((item, idx) => {
                // const link = `/private${toHref(item.route)}`;

                return (
                  <li key={idx}>
                    <Link
                      href={"link"}
                      className={`text-xs block w-full px-2 py-1.5 `}
                      // onClick={() => dispatch(closeSidebar())}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  href={"/private/my-profile"}
                  className={`text-xs block w-full px-2 py-1.5 `}
                  // onClick={() => dispatch(closeSidebar())}
                >
                  {'My Profile'}
                </Link>
              </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
