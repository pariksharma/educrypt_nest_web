"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import LoginButton from "../buttons/loginButton";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppSettings, logoutUser } from "@/store/slice/authSlice";
import { fetchHome, clearHeadSearchResult, fetchGlobalSearch } from "@/store/slice/homeSlice";
import { fetchAllCourse } from "@/store/slice/courseSlice";
import { usePathname, useRouter } from "next/navigation";
import { FaBars } from "react-icons/fa6";
import { getMyProfile } from "@/store/slice/userSlice";
import { GoChevronDown } from "react-icons/go";
import { FaCircleUser } from "react-icons/fa6";
import { CiUser, CiLogout } from "react-icons/ci";
import Logout from "@/components/modals/logout";
import { CiSearch } from "react-icons/ci";
import { VscLinkExternal } from "react-icons/vsc";
import Login from "@/components/modals/login.jsx";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headSearch, setHeadSearch] = useState([]);
  const [keyword, setKeyword] = useState("");

  const { appSettings } = useSelector((state) => state?.auth);
  const { homeData, headerSearchData } = useSelector((state) => state?.home);
  const { allCourseData } = useSelector((state) => state?.courses);
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const pathName = usePathname();

  const router = useRouter();

  useEffect(() => {
    if (appSettings?.responseCode != "1008") {
      dispatch(fetchAppSettings());
    }
  }, [appSettings]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLogin(!!token);
    }
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    const feat = appSettings?.data?.appSettings;

    if (!feat) return;

    const root = document.documentElement;
    root.style.setProperty("--primary-color", feat?.color_primary || "#973c00");
    root.style.setProperty("--toolbar-color", feat?.color_toolbar || "#10B981");
    root.style.setProperty(
      "--statusbar-color",
      feat?.color_statusbar || "#eee"
    );
  }, [appSettings]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !userData?.data) {
      dispatch(getMyProfile());
    }
  }, [userData?.data]);

  useEffect(() => {
    if (!homeData?.success) {
      dispatch(fetchHome());
    }
  }, [homeData]);

  useEffect(() => {
    if(typeof window !== "undefined") {
        const path = window.location.pathname;
        if ((!allCourseData?.success) && (!path.includes('view-course'))) {
            const payload = {
                cat_id: "1",
                page: "1",
                view_type: "0",
            };
            dispatch(fetchAllCourse(payload));
        }
    }
  }, []);

  const openAuth = () => {
    setOpen(true);
  };

  const handleLogout = () => {
    setOpenLogout(true)
  };

  //header search logic
  useEffect(() => {
    const trimmed = keyword.trim();

    if (trimmed === "") {
      dispatch(clearHeadSearchResult());
      return;
    }
    
    const delay = setTimeout(() => {
      const payload = {
        keyword: trimmed,
        page: '1',
        limit: '10',
      };
      dispatch(fetchGlobalSearch(payload));
    }, 1000);

    return () => clearTimeout(delay);
  }, [keyword, dispatch]);

  useEffect(() => {
    const result = headerSearchData?.data || [];
    setHeadSearch(result)
    // console.log('Global search:', headSearch)
  }, [headerSearchData])

  return (
    <>
      <div className="flex items-center justify-between sm:px-8 h-[65px] shadow w-screen fixed top-0 z-100 bg-white">
        <div className="flex md:gap-10 gap-5 items-center h-[65px]">
          <div
            className="md:hidden ml-2 h-7 w-7 border border-gray-400 flex items-center justify-center rounded cursor-pointer"
            // onClick={() => dispatch(toggleSidebar())}
          >
            <FaBars />
          </div>
          <Link href="/" className="w-max">
            {/* <img src={`${appSettings?.data?.appSettings?.logo_url}`} alt="logo" className='md:w-[90px] w-[60px]' /> */}
            <img
              src="/images/eduLogo.png"
              alt="logo"
              className="md:w-[90px] w-[60px]"
            />
          </Link>
          {(pathName == "/" || pathName == "/view-courses") && (
            <div className="flex flex-col relative">
              <div className="items-center gap-3 border hidden md:flex h-9 md:min-w-[300px] lg:min-w-[350px] border-gray-200 bg-gray-100 px-2 shadow-xs rounded focus-visible:outline-0 overflow-hidden">
                <CiSearch className="w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="What are you looking for..."
                  className="placeholder:text-gray-400 text-sm w-full text-gray-700 placeholder:text-[12px]"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              {keyword.trim().length > 0 && headSearch.length > 0 && <div className="md:min-w-[300px] lg:min-w-[350px] max-h-[250px] overflow-hidden overflow-y-auto no-scrollbar hidden md:flex flex-col gap-3 absolute top-[38px] px-6 py-3 bg-white rounded shadow">
                {headSearch?.map((item, idx) => (
                  <button key={idx} className="flex items-start gap-2 relative"
                    onClick={() => {
                      router.push(`/private/course/${item.title.replaceAll(' ','-').toLowerCase()}-${item?.id}?from=home`)
                    }}
                  >
                    <img src={item.thumbnail} alt="course thumb" className="h-8 min-w-[60px] max-w-[60px] block rounded" />
                    <div className="text-left text-xs text-gray-600 font-semibold pr-5">{item.title}</div>
                    <VscLinkExternal className="fill-gray-400 h-3 w-3 absolute right-1 top-1" />
                  </button>
                ))}  
              </div>}
            </div>
          )}
        </div>
        <div className="flex items-center">
          {isLogin && userData ? (
            <div className="relative inline-block text-left" ref={dropdownRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="border-0 bg-none cursor-pointer flex items-center gap-1"
              >
                <span className="text-sm text-gray-600">
                  Hi, {userData?.data[0]?.name || "user"}
                </span>
                <FaCircleUser className="ml-1 h-auto w-5" />
                <GoChevronDown
                  className={`ml-0 h-auto w-5 transition-transform ${
                    isMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isMenuOpen && (
                <ul className="absolute top-10 right-0 bg-white p-3 rounded shadow w-fit z-10">
                  <li>
                    <Link
                      href="/private/my-profile"
                      className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors`}
                      role="menuitem"
                    >
                      <span className="mr-2">
                        <CiUser />
                      </span>
                      myProfile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
                    >
                      {" "}
                      <span>
                        <CiLogout className="mr-2" />
                      </span>{" "}
                      logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <LoginButton btntext="Login / Register" loginEvent={openAuth} />
          )}
        </div>
      </div>
      {open && (
        <div
          className="fixed inset-0 bg-gray-600/50 z-99 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-2xl p-0 opacity-100 max-h-[calc(100vh-100px)] overflow-hidden overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {<Login closeLoginModal={() => setOpen(false)} open={open} />}
          </div>
        </div>
      )}
      {openLogout && (
            <Logout closeLoginModal={() => setOpenLogout(false)} open={openLogout} />
      )}
    </>
  );
};

export default Header;
