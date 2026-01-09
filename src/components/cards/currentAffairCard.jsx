import { useRouter } from 'next/navigation';
import React from 'react'
import { BsArrowRight } from "react-icons/bs";



const CurrentAffairCard = ({list}) => {

    const router = useRouter()

    const formatDate = () => {
        return new Date(list?.publish_date * 1000).toString().split(" GMT")[0];
    };

  return (
    <div key={list?.id} className="p-2 rounded-lg bg-white shadow hover:shadow-md transition-shadow">
        <img src={list?.image_url} alt={list?.title} className="w-full h-30 object-cover rounded" />
        <h2 className="mt-2 mb-1 font-bold text-[14px] line-clamp-2 h-10 uppercase">{list?.title}</h2>
        <p className='h-15 overflow-y-auto no-scrollbar text-sm line-clamp-3'>{list.summary}</p>
        <div className='flex items-center gap-1 text-[12px] mt-4'>
            <span className='text-gray-600 font-semibold'>{formatDate()}</span>
        </div>
        <div className="flex gap-2 items-center justify-between my-1">
            <button 
                onClick={() => router.push(`/private/current-affairs/${list?.id}`)}
                className="bg-primary text-[11px] flex items-center gap-2 justify-center text-white hover-bg-white hover-text-primary border border-primary cursor-pointer py-2 w-full rounded-md font-semibold"
            >
                View Content <BsArrowRight />
            </button>
        </div>
    </div>
  )
}

export default CurrentAffairCard