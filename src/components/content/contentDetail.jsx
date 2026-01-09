import { isLogin } from '@/utils/helper'
import { useRouter } from 'next/navigation'
import React from 'react'

const ContentDetail = ({data, detail}) => {

    const router = useRouter();
    console.log('course data:', data)


  return (<div key={data.id} className="p-3 bg-white rounded shadow">
        <div className="flex justify-between">
            <div className="flex gap-3 items-center">
            <img src={data.thumbnail || "/image/file.png"} className="w-14 h-14 rounded" />
            <div className="flex flex-col">
                <h4 className="font-semibold text-sm">{data.title}</h4>
                <p className="text-xs text-gray-600">
                {data.file_type === 1 && "PDF"}
                {data.file_type === 2 && "Video"}
                {data.file_type === 3 && "Link"}
                {data.file_type === 4 && "Note"}
                {data.file_type === 5 && "Test"}
                </p>
            </div>
            </div>
            {(isLogin() && detail?.layout_data[0]?.is_purchased != '0')
            ?   
                <>
                {
                    data?.file_type == 1 && 
                        <button className="bg-primary text-[10px] text-white hover-bg-white hover-text-primary border border-primary cursor-pointer px-1.5 h-8 text-nowrap rounded-md font-semibold">
                            View
                        </button>
                }
                {
                    data?.file_type == 2 && 
                        <button className="bg-primary text-[10px] text-white hover-bg-white hover-text-primary border border-primary cursor-pointer px-1.5 h-8 text-nowrap rounded-md font-semibold"
                            onClick={() => router.push(`/play/${encodeURIComponent(`${data?.title}`)}?file_url=${data?.file_url}&file_type=${data?.file_type}&video_type=${data?.video_type}&is_drm=${data?.is_drm || 0}&vdc_id=${data?.vdc_id || ""}`)}
                        >
                            Watch
                        </button>
                }
                {
                    data?.file_type == 3 && 
                        <button className="bg-primary text-[10px] text-white hover-bg-white hover-text-primary border border-primary cursor-pointer px-1.5 h-8 text-nowrap rounded-md font-semibold">
                            Open
                        </button>
                }
                {
                    data?.file_type == 4 && 
                        <button className="bg-primary text-[10px] text-white hover-bg-white hover-text-primary border border-primary cursor-pointer px-1.5 h-8 text-nowrap rounded-md font-semibold">
                            open
                        </button>
                }
                {
                    data?.file_type == 5 && 
                        <button className="bg-primary text-[10px] text-white hover-bg-white hover-text-primary border border-primary cursor-pointer px-1.5 h-8 text-nowrap rounded-md font-semibold">
                            Attempt Now
                        </button>
                }
                </>
            :
                <div className='h-10 w-10'>
                    <img src='/images/locked.png' alt='item locked' />
                </div>
            }
        </div>
    </div>
  )
}

export default ContentDetail