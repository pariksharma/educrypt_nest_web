import React from 'react'
import { useSelector } from 'react-redux'
import { LuFileSpreadsheet } from "react-icons/lu";
import { FaRegClock } from "react-icons/fa";


const LiveClassCard = ({data, tab}) => {

    const { appSettings} = useSelector(state => state?.auth)

    const formatDateTime = (timestamp) => {
        const date = new Date(timestamp * 1000);

        const day = date.getDate();
        const month = date.toLocaleString("en-US", { month: "short" });
        const year = date.getFullYear();

        const time = date.toLocaleString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

        return `${day} ${month} ${year} | ${time}`;
    };

    const getRemainingTime = (startTimestamp, endTimestamp) => {
        const diffInSeconds = endTimestamp - startTimestamp;

        if (diffInSeconds <= 0) return "0 hr and 0 min";

        const totalMinutes = Math.floor(diffInSeconds / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return `${hours} hr and ${minutes} min`;
    };


  return (
    <div className='shadow p-2 rounded-lg'>
        <img src={data?.thumbnail || appSettings?.data?.appSettings?.logo_url} alt={data?.title} className="w-full h-30 object-cover rounded" />
        <h2 className="mt-2 mb-1 font-semibold text-xs line-clamp-2 h-8 uppercase">{data?.title}</h2>
        {(tab == "0") && <>
            <div className='flex flex-col'>
                <span className='flex items-center text-sm text-gray-600 font-semibold gap-1'><LuFileSpreadsheet /> Start On: 16 Dec 2025 | 5:00 PM </span>            </div>
            <hr className='border-t-2 border-dotted border-gray-300 my-2 ' />
            <div className="flex gap-2 items-center justify-between my-1">
                <button
                className="bg-primary text-[11px] text-white hover-bg-white hover-text-primary border border-primary cursor-pointer py-2 w-full rounded-md font-semibold"
                >
                    Start In- 00:11:56
                </button>
            </div>
        </>}
        {(tab == "1") && <>
            <div className='flex flex-col'>
                <span className='flex items-center text-sm text-gray-600 font-semibold gap-1'><LuFileSpreadsheet /> Start On: 16 Dec 2025 | 5:00 PM </span>
                <span className='flex items-center text-sm text-gray-600 font-semibold gap-1'><FaRegClock /> Class Duration: 6 hr and 54 min </span>
            </div>
            <hr className='border-t-2 border-dotted border-gray-300 my-2 ' />
            <div className="flex gap-2 items-center justify-between my-1">
                <button
                // onClick={() => handleClick(data)}
                className="bg-primary text-[11px] text-white hover-bg-white hover-text-primary border border-primary cursor-pointer py-2 w-full rounded-md font-semibold"
                >
                    Watch
                </button>
            </div>
        </>}
        {(tab == "2") && <>
            <div className='flex flex-col'>
                <span className='flex items-center text-sm text-gray-600 font-semibold gap-1'><LuFileSpreadsheet /> Was Live at: 16 Dec 2025 | 5:00 PM </span>
            </div>
            <hr className='border-t-2 border-dotted border-gray-300 my-2 ' />
            <div className="flex gap-2 items-center justify-between my-1">
                <button
                // onClick={() => handleClick(data)}
                className="bg-primary text-[11px] text-white hover-bg-white hover-text-primary border border-primary cursor-pointer py-2 w-full rounded-md font-semibold"
                >
                    Watch
                </button>
            </div>
        </>}
    </div>
  )
}

export default LiveClassCard