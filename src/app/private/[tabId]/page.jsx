'use client';

import Blogs from '@/components/blogs/blogs';
import CurrentAffairs from '@/components/currentAffairs/currentAffairs';
import Header from '@/components/header/header'
import LiveClass from '@/components/liveClass/liveClass';
import MyCourse from '@/components/myCourse/myCourse';
import MyProfile from '@/components/myProfile/myProfile';
import OurCourse from '@/components/ourCourse/ourCourse';
import Sidebar from '@/components/sidebar/sidebar'
import { useParams } from 'next/navigation';
import React from 'react'

const page = () => {

    const { tabId } = useParams();

    // const renderContent = () => {
    //     switch (tabId) {
    //         case "my-profile": 
    //             return <MyProfile />
    //         case "my-course":
    //             return <MyCourse />
    //         case "current-affairs":
    //             return <CurrentAffairs />
    //     }
    // }
    
//   return (
//     <>
//         <Header />
//         <div className='mt-17 flex'>
//             <Sidebar addClass={'md:w-17/100 w-70/100'} />
//             <div className='md:w-83/100 w-full ml-auto'>
//                 {renderContent()}
//             </div>
//         </div>
//     </>
//   )

    switch (tabId) {
        case "my-profile": 
            return <MyProfile />;
        case "my-course": 
            return <MyCourse />;
        case "current-affairs": 
            return <CurrentAffairs />;
        case "live-classes":
            return <LiveClass />
        case "our-courses":
            return <OurCourse />
        case "blogs":
            return <Blogs />
        default: 
            return <div>Invalid Tab</div>;
    }

}

export default page