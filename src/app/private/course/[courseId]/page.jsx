'use client';

import { fetchCourseDetail } from '@/store/slice/courseSlice'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React, { lazy, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Loader } from '@/components/loader/loader';
import { LuFileSpreadsheet } from "react-icons/lu";
import CourseDescription from '@/components/courseDescription/courseDescription';
import Content from '@/components/content/content';
import { isLogin } from '@/utils/helper';

const Header = lazy(() => import('@/components/header/header'))

const CourseDetail = () => {

    const [description, setDescription] = useState([]);
    const [faq, setFaq] = useState([])
    const [content, setContent] = useState([]);
    const [activeTab, setActiveTab] = useState('');
    const [review, setReview] = useState('')
    const [coursId, setCourseId] = useState(null)

    const { courseDetailData, courseDetailLoading, courseDetailError } = useSelector(state => state?.courses)
    const { appSettings } = useSelector((state) => state?.auth);
    const { userData } = useSelector(state => state?.user)
    const router = useRouter()
    const dispatch = useDispatch()
    const {courseId} = useParams()
    const searchParams = useSearchParams()

    useEffect(() => {

        if (!courseId) return;
        
        const id = courseId.match(/\d+$/)?.[0];
        if(id) {
            const payload = {
                course_id: id
            }
            dispatch(fetchCourseDetail(payload));
        }
    }, [courseId])

    useEffect(() => {
        setCourseId(courseId.match(/\d+$/)?.[0])
    })

    useEffect(() => {
        if(courseDetailData?.data?.length > 0) {
            const overviewData = courseDetailData?.data?.find(item => item?.type == "overview");
            setActiveTab(courseDetailData?.data[0]?.type)
            if(overviewData?.data?.length > 0) {
                setDescription(overviewData?.data?.find(item => item?.layout_type == "details"))
                setReview(overviewData?.data?.find(item => item?.layout_type == "reviews"))
                setFaq(overviewData?.data?.find(item => item?.layout_type == "faqs"))
            }
            setContent(courseDetailData?.data?.find(item => item?.type == "content"))
        }
    }, [courseDetailData])

    const handleClick = () => {
        if (searchParams.get("from") === "home") {
        router.push("/");
        } else {
        router.back();
        }
    };

  return (
    <div>
        {!(userData?.data[0]?.id) &&
            <Header />
        }
        <div className={`${userData?.data[0]?.id ? '' : 'mt-17'} flex items-start`}>
            <div className="px-0 pb-2 ml-auto w-full min-h-[calc(100vh-72px)] overflow-y-auto bg-white">
                {courseDetailLoading ? 
                    <Loader />
                :
                    (courseDetailError ? 
                        "Error"
                    :   
                        <div className="flex flex-col bg-[url('/images/detail_bg.svg')]">
                            <div className="md:px-20 px-5 pt-2">
                                <nav className="flex items-center space-x-2 mb-4 text-sm">
                                    <button onClick={handleClick} className="text-[14px] text-gray-800 font-semibold cursor-pointer">
                                        {searchParams.get('from')}
                                    </button>
                                    <span><MdKeyboardArrowRight /></span>
                                    <span className="text-primary font-semibold text-[14px]">Details</span>
                                </nav>
                                <h1 className="text-[24px] font-bold text-gray-900 mb-2">
                                    {description?.layout_data?.length > 0 && <>
                                            {description?.layout_data[0]?.title}
                                        </>
                                    }
                                </h1>
                                <div className="flex items-center text-[13px] font-semibold text-black gap-1">
                                    {description?.layout_data?.length > 0 && <>
                                            <LuFileSpreadsheet /> Validity: {description?.layout_data[0]?.days} days
                                        </>
                                    }
                                </div>
                                {(description?.layout_data?.length > 0 && description?.layout_data[0]?.is_purchased == '0') &&
                                    <div className="flex items-center gap-2 mt-10">
                                        <button className="bg-primary text-white rounded-md hover-bg-white hover-text-primary border border-primary cursor-pointer px-12 py-3">
                                            Buy Now
                                        </button>
                                        {description?.layout_data?.length > 0 && 
                                            <div>
                                                <div className="text-3xl font-semibold flex gap-2">
                                                    <span>
                                                        ₹{description?.layout_data[0]?.offer_price}
                                                    </span>
                                                    <del className="text-gray-500">₹{description?.layout_data[0]?.mrp}</del>
                                                </div>
                                                <p className="text-xs text-green-600">Inclusive of GST</p>
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                            {courseDetailData?.data?.length > 0 &&
                                <div className='bg-white mt-10'>
                                    <ul className="flex items-center gap-5 text-sm md:px-20 px-5 bg-red-100 overflow-x-auto no-scrollbar">
                                        {courseDetailData?.data?.map((tab, index) => (
                                            <li key={index} className={`py-2 ${activeTab == tab.type ? 'border-b-3 text-primary' : 'text-primary'}`}>
                                            <button
                                                onClick={() => setActiveTab(tab.type)}
                                                className={`font-medium cursor-pointer`}
                                            >
                                                {tab.title}
                                            </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            }
                            <div className='bg-white'>
                                <div className="md:px-20 px-5 py-4 md:w-3/4 w-full">
                                    {activeTab == "overview" && 
                                        <CourseDescription
                                            description = {description}
                                            review = {review}
                                            faq = {faq}
                                            id = {coursId}
                                        />
                                    }
                                    {activeTab == "content" && 
                                        <Content 
                                            detail = {description} 
                                        />
                                    }
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

export default CourseDetail