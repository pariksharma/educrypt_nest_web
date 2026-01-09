'use client';

import React from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'

const Footer = () => {

    const {appSettings} = useSelector(state => state?.auth) || {};
    const homeState = useSelector((state) => state.home) || {};
    const appDetail = appSettings?.data?.appSettings;
    // console.log('appSettings', appSettings)

    if(homeState) {
        return (
            <div className='bg-gray-800 py-12'>
                <div className='w-11/12 mx-auto grid md:grid-cols-5 gap-20 grid-cols-2'>
                    <div>
                        <img src={appDetail?.logo_url ? '/images/eduLogo.png' : "/images/eduLogo.png"} alt="" className='md:w-[120px] w-[60px] mb-3'/>
                        <div className='flex flex-col gap-4 text-sm'>
                            <h1 className='text-white'>{appDetail?.app_name && appDetail?.app_name}</h1>
                            <div className='text-white'>
                                <p>Address:</p>
                                <address className='text-xs'>
                                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vel, non distinctio! Maiores laboriosam iure nulla.
                                </address>
                            </div>
                            <div className='text-white'>
                                <p>Phone:</p>
                                <p className='text-xs'>9876543210</p>
                            </div>
                            <div className='text-white'>
                                <p>Email:</p>
                                <p className='text-xs'>email@gmail.com</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1 className='text-white text-md font-semibold mb-4'>Company</h1>
                        <div className='text-white text-xs flex flex-col gap-3'>
                            <Link href="/aboutus">About</Link>
                            <Link href="/">Contact Us</Link>
                        </div>
                    </div>
                    <div>
                        <h1 className='text-white text-md font-semibold mb-4'>Products</h1>
                        <div className='text-white text-xs flex flex-col gap-3'>
                            <Link href="/">Paid Courses</Link>
                            <Link href="/">Book Store</Link>
                            <Link href="/">99Rs Store</Link>
                            <Link href="/">Free Test</Link>
                            <Link href="/">Free Courses</Link>
                        </div>
                    </div>
                    <div>
                        <h1 className='text-white text-md font-semibold mb-4'>Help & Support</h1>
                        <div className='text-white text-xs flex flex-col gap-3'>
                            <Link href="/">FAQ's</Link>
                            <Link href="/">Privacy Policy</Link>
                            <Link href="/">Terms & Conditions</Link>
                            <Link href="/">Refund/Cancellation Policy</Link>
                        </div>
                    </div>
                    <div>
                        <h1 className='text-white text-md font-semibold mb-4'>Download App</h1>
                        <div className='text-white text-xs flex flex-col gap-3'>
                            <Link href="/"><img src="/images/googleStore.png" alt="Google Download" className='w-[120px]' /></Link>
                            <Link href="/"><img src="/images/appleStore.png" alt="apple Download" className='w-[120px]' /></Link>
                            <Link href="/"><img src="/images/windows.png" alt="Window Download" className='w-[120px]' /></Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Footer