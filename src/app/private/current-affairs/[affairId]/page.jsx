'use client';

import { Loader } from '@/components/loader/loader';
import { fetchCurrentAffairDetail } from '@/store/slice/currentAffairSlice';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const AffairId = () => {

  const [data, setData] = useState(null)

  const { affairId } = useParams()
  const router = useRouter()
  const dispatch = useDispatch()
  const { currentAffairDetail, currentAffairLoading, currentAffairError } = useSelector(state => state?.currentAffair)

  useEffect(() => {
    const payload = {
      'current_affair_id': affairId.toString()
    }
    dispatch(fetchCurrentAffairDetail(payload))
  }, [affairId])

  useEffect(() => {
    if(currentAffairDetail?.responseCode == "3016") {
      setData(currentAffairDetail?.data)
    }
  }, [currentAffairDetail])

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp * 1000);

    const day = date.toLocaleString("en-US", { weekday: "short" });
    const dayNum = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    const time = date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    return `${day} ${dayNum} ${month}, ${year} | ${time}`;
};

  return (<>
    {currentAffairLoading 
    ?
      <Loader />
    :
      ((currentAffairError || (!data))
      ?
        "Error"
      :
        <div className='px-6 pt-2 pb-6 bg-gray-50 rounded shadow min-h-[calc(100vh-80px)] overflow-hidden overflow-y-auto'>
            <nav className="flex items-center mt-1 space-x-2 mb-4 text-sm">
                <button onClick={() => router.back()} className="text-[13px] text-gray-800 font-semibold cursor-pointer">
                    Current Affair
                </button>
                <span>/</span>
                <span className="text-primary font-semibold">Details</span>
            </nav>
            {data &&
                <div className="flex flex-col">
                    <h1 className='text-lg font-bold'>{data?.title}</h1>
                    <p className="text-gray-600 text-xs mt-2">{formatDateTime(data?.publish_date)}</p>
                    <img src={data.image_url} alt={data.title} className="h-[350px] w-[700px] object-fill rounded-xl mt-3" />
                    <div className="text-md text-gray-700 p-2" dangerouslySetInnerHTML={{__html: data?.content}}>
                        {/* {renderContent(data?.content)} */}
                    </div>
                </div>
            }
        </div>
      )
    }
  </>)
}

export default AffairId