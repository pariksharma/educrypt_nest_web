'use client';

import React, { lazy, Suspense, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { Loader } from '../loader/loader';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppSettings } from '@/store/slice/authSlice';

const Header = lazy(() => import("@/components/header/header"))
const Banner = lazy(() => import("@/components/banner/banner"))
const TrendingCourse = lazy(() => import("@/components/trendingCourse/trendingCourse"))
const OurProduct = lazy(() => import("@/components/ourProducts/ourProducts"))
const FreeContent = lazy(() => import("@/components/freeContent/freeContent"))
const OurAchivement = lazy(() => import("@/components/ourAchievements/ourAchievements"))
const Testimonial = lazy(() => import("@/components/testimonial/testimonial"))
const GetinTouch = lazy(() => import("@/components/getInTouch/getInTouch"))
const Footer = lazy(() => import("@/components/footer/footer"))

const Main = () => {

  const dispatch = useDispatch();
  const {appSettings, appsettingloading} = useSelector(state => state.auth)
      
  useEffect(() => {
      if(appSettings?.data?.responseCode != '1008') {
        dispatch(fetchAppSettings());
        }
      }, [])
      // console.log('appSettings', appSettings?.responseCode)

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {appSettings?.responseCode != '1008' 
      ? 
        <Loader /> 
      : 
      <>
        <Suspense fallback = {<Loader />}>
          <Header />
          <Banner className = {"home mt-20 w-10/12"} />
          <TrendingCourse />
          <OurProduct />
          <FreeContent />
          <OurAchivement />
          <Testimonial />
          <GetinTouch />
          <Footer />
        </Suspense>
      </>
      }
    </>
  )
}

export default Main