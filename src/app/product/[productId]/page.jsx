'use client';

import Header from '@/components/header/header'
import { Loader } from '@/components/loader/loader';
import { fetchAllCourse } from '@/store/slice/courseSlice';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MdKeyboardArrowRight } from "react-icons/md";
import CourseCard from '@/components/cards/courseCard';

const page = () => {

    const [description, setDescription] = useState(null)
    const [courseList, setCourseList] = useState([])

    const dispatch = useDispatch()
    const {productId} = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()
    const { allCourseData, allCourseLoading, allCourseError } = useSelector(state => state?.courses)


    useEffect(() => {
        const payload = {
            cat_id: "1",
            page: "1",
            view_type: "0",
        }
        dispatch(fetchAllCourse(payload))
    }, [])

    useEffect(() => {
        if(allCourseData?.responseCode == '3001') {
            setDescription(allCourseData?.data?.find(item => item?.layout_type == "description_layout"))
            setCourseList(allCourseData?.data?.find(item => item?.layout_type == "course_list_layout")?.list)
        }
    }, [allCourseData])
  return (
    <div>
        <Header />
        <div className="mt-17 flex items-start">
            <div className="px-0 pb-2 ml-auto w-full min-h-[calc(100vh-72px)] overflow-y-auto bg-white">
                {allCourseLoading 
                ?
                    <Loader />
                :
                    (allCourseError
                    ?
                        "Error"
                    :
                        <div className="flex flex-col bg-[url('/images/detail_bg.svg')]">
                            <div className='flex flex-row'>
                                <div className="md:px-20 p-5 pt-2">
                                    <nav className="flex items-center space-x-2 mb-4 text-sm">
                                        <button onClick={() => router.push('/')} className="text-[14px] text-gray-800 font-semibold cursor-pointer">
                                            Home
                                        </button>
                                        <span><MdKeyboardArrowRight /></span>
                                        <span className="text-primary font-semibold text-[14px]">{productId}</span>
                                    </nav>
                                    <h1 className="text-[24px] font-bold text-gray-900 mb-2">
                                        {description?.layout_title && <>
                                                {description?.layout_title}
                                            </>
                                        }
                                    </h1>
                                    <div className="flex items-center text-[13px] font-semibold text-black gap-1">
                                        {description?.list?.length > 0 && <>
                                                {description?.list[0]?.description}
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className='w-90 p-5 pt-2'>
                                    <img src='/images/courseRightImg.svg' alt='productImg' className='mr-10' />
                                </div>
                            </div>
                            <div className='bg-white mt-10 md:px-20 p-5 pt-2'>
                                <div className='grid md:grid-cols-4 sm:grid-cols-3 gap-2'>
                                    {courseList?.length > 0 && courseList?.map((item, index) => {
                                        return <CourseCard
                                            data={item}
                                            key={index}
                                            productId={productId}
                                        />
                                    })}
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    </div>
  )
}

export default page