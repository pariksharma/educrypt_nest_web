'use client';

import React from 'react'
import { useSelector } from 'react-redux'
 
function OurAchivement() {
    const homeState = useSelector((state) => state.home) || {};
    
    if(homeState) {
        return (
            <div className='our_achivement w-11/12 md:mr-auto mt-15 mb-15 gap-10 flex items-center justify-between'>
                <img src="/images/our_achie.svg" alt="Our Achivement" className='w-6/12 object-cover hidden md:block' />
                <div className='flex flex-col gap-3 ml-20'>
                    <h1 className='text-2xl font-bold'>Our Achivement</h1>
                    <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, obcaecati eligendi asperiores facilis ea quaerat facere incidunt voluptatem eum enim labore quisquam officia velit voluptates aut voluptate pariatur aliquam repudiandae illo modi accusamus. Autem excepturi blanditiis nisi magnam praesentium est.</p>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='relative rounded-md border border-gray-300 bg-blue-50 flex flex-col gap-2 items-center justify-center p-5'>
                            <img src="/images/instructor.svg" alt="Instructor" className='absolute top-2 left-2 w-[30px]' />
                            <h1 className='text-3xl font-bold text-blue-800'>100+</h1>
                            <h2 className='text-xl font-bold text-gray-700'>Instructor's</h2>
                        </div>
                        <div className='relative rounded-md border border-gray-300 bg-green-50 flex flex-col gap-2 items-center justify-center p-5'>
                            <img src="/images/Videos.svg" alt="Instructor" className='absolute top-2 left-2 w-[30px]' />
                            <h1 className='text-3xl font-bold text-blue-800'>1L+</h1>
                            <h2 className='text-xl font-bold text-gray-700'>Video's</h2>
                        </div>
                        <div className='relative rounded-md border border-gray-300 bg-red-50 flex flex-col gap-2 items-center justify-center p-5'>
                            <img src="/images/user.svg" alt="Instructor" className='absolute top-2 left-2 w-[30px]' />
                            <h1 className='text-3xl font-bold text-blue-800'>50L</h1>
                            <h2 className='text-xl font-bold text-gray-700'>Students</h2>
                        </div>
                        <div className='relative rounded-md border border-gray-300 bg-sky-100 flex flex-col gap-2 items-center justify-center p-5'>
                            <img src="/images/student.svg" alt="Instructor" className='absolute top-2 left-2 w-[30px]' />
                            <h1 className='text-3xl font-bold text-blue-800'>50K+</h1>
                            <h2 className='text-xl font-bold text-gray-700'>Test Series</h2>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
 
export default OurAchivement