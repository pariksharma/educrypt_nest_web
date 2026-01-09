'use client';

import React, {useState} from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';


const GetinTouch = () => {
 
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState({})

    const homeState = useSelector((state) => state.home) || {};
 
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
 
    if(homeState) {
        return (
            <div className='getin_touch w-10/12 md:mr-auto mx-auto mt-15 mb-15 gap-10 flex flex-col md:flex-row items-center justify-center'>
                <div className='md:w-6/12'>
                    <h1 className='text-xl mb-2 font-bold'>Get In Touch</h1>
                    <p className='text-gray-600 text-sm mb-5'>Feel free to share any queries, feedback, complaints, or concerns you have about our courses and programs. We're here to help and improve your experience!</p>
                    <form
                    // onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4">
                        {/* Name Field */}
                        <div>
                            <input
                                {...register('name')}
                                type="text"
                                className={`w-full px-4 py-2 border rounded-md focus-visible:outline-none ${
                                errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Name"
                            />
                            {/* {errors.name && (
                                <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                            )} */}
                        </div>
        
                        {/* Mobile field */}
                        <div>
                            <input
                                {...register('mobile')}
                                type="text"
                                className={`w-full px-4 py-2 border rounded-md focus-visible:outline-none ${
                                errors.mobile ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Mobile"
                            />
                            {/* {errors.mobile && (
                                <p className="mt-1 text-xs text-red-600">{errors.mobile.message}</p>
                            )} */}
                        </div>
        
                        {/* Email Field */}
                        <div>
                            <input
                                {...register('email')}
                                type="email"
                                className={`w-full px-4 py-2 border rounded-md focus-visible:outline-none ${
                                errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Email"
                            />
                            {/* {errors.email && (
                                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                            )} */}
                        </div>
        
                        {/* text area */}
                        <div>
                            <textarea
                                {...register('usermessage')}
                                type="email"
                                className={`w-full px-4 py-2 border rounded-md focus-visible:outline-none ${
                                errors.usermessage ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter Text Message"
                                rows={4}
                            />
                            {/* {errors.usermessage && (
                                <p className="mt-1 text-xs text-red-600">{errors.usermessage.message}</p>
                            )} */}
                        </div>
        
                        {/* Submit Button */}
                        <button
                        type="button"
                        disabled={isLoading}
                        className="w-fit bg-red-700 text-white p-2 rounded-md hover:bg-red-800 cursor-pointer text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                        {isLoading ? (
                            <>
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                ></circle>
                                <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Submitting...
                            </>
                        ) : (
                            'Create Account'
                        )}
                        </button>
                        {/* {isSubmitted && <p className="text-green-600 text-sm mt-2">Thanks! We will contact you soon.</p>} */}
                    </form>
                </div>
                <div className='w-6/12 md:block hidden'>
                    <img src="/images/getInTouch.png" className='object-cover w-full' alt="" />
                </div>
            </div>
        )
    }
}
 
export default GetinTouch