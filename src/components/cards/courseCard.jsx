import React from 'react'
import { useSelector } from 'react-redux'
import { LuFileSpreadsheet } from "react-icons/lu";
import { useRouter } from 'next/navigation';

const CourseCard = ({data, productId}) => {

    const router = useRouter();
    const { appSettings } = useSelector(state => state?.auth)

    const handleClick = () => {
        router.push(`/private/course/${data?.title?.replaceAll(' ', '-')?.toLowerCase()}-${data?.id}?from=${productId}`)
    }

    const handleCheckout = () => {
        router.push(`/checkout/${data?.title?.replaceAll(' ', '-')?.toLowerCase()}-${data?.id}?from=${productId}`)
    }

  return (
    <div className='shadow p-2 rounded-lg'>
        <img src={data?.thumbnail || appSettings?.data?.appSettings?.logo_url} alt={data?.title} className="w-full h-30 object-cover rounded" />
        <h2 className="mt-2 mb-1 font-semibold text-sm line-clamp-2 h-11 uppercase">{data?.title}</h2>
        {/* <div className='bg-green-600 inline text-[10px] text-white px-3 py-0.5 uppercase rounded-xl'>free</div> */}
        <div className="flex items-center text-[12px] font-semibold text-gray-600 gap-1">
            {data?.days && <>
                    <LuFileSpreadsheet /> Validity: {data?.days} days
                </>
            }
        </div>
        <hr className='border-t-2 border-dotted border-gray-300 my-2 ' />
        <div>
            <div>
                <div className="text-sm font-bold flex gap-2">
                    <span>
                        ₹{data?.offer_price}
                    </span>
                    <del className="text-gray-500">₹{data?.mrp}</del>
                </div>
                {/* <p className="text-xs text-green-600">Inclusive of GST</p> */}
            </div>
        </div>
        <div className="flex gap-2 items-center justify-between my-1">
            <button
            onClick={handleClick}
            className="bg-white text-[11px] text-primary hover-bg-primary hover-text-white border border-primary cursor-pointer py-2 w-full rounded-md font-semibold"
            >
                {'Explore'}
            </button>
            <button
            onClick={handleCheckout}
            className="bg-primary text-[11px] text-white hover-bg-white hover-text-primary border border-primary cursor-pointer py-2 w-full rounded-md font-semibold"
            >
                {'Buy Now'}
            </button>
        </div>
    </div>
  )
}

export default CourseCard