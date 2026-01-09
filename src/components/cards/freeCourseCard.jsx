"use client";

import React from "react";
import { useSelector } from "react-redux";
import { daysBetween } from "@/utils/helper";
import { LuFileSpreadsheet } from "react-icons/lu";

const FreeCourseCard = ({ handleClick, data, value }) => {
  const { appSettings } = useSelector((state) => state?.auth);

  // console.log('appSettings', appSettings)
  console.log("free course Data:", data);
  return (
    <div className="shadow p-2 rounded-lg">
      <img
        src={data?.thumbnail || appSettings?.data?.appSettings?.logo_url}
        alt={data?.title}
        className="w-full object-cover rounded aspect-video"
      />
      <h2 className="mt-2 mb-1 font-semibold text-xs line-clamp-2 h-8 uppercase">
        {data?.item_name}
      </h2>
      <div className="flex items-center text-[12px] font-semibold text-gray-600 gap-1">
        {/* <LuFileSpreadsheet /> Validity: {daysBetween( data?.valid_from, data?.valid_to)} days */}
        <LuFileSpreadsheet /> Validity: {data?.validity}
      </div>
      <div className="flex items-center text-[12px] font-semibold text-primary gap-1">
        <LuFileSpreadsheet /> Remaining: {data?.remaining_days} Days
      </div>
      <div className="bg-green-600 inline text-[10px] text-white px-3 py-0.5 uppercase rounded-xl">
        free
      </div>
      <hr className="border-t-2 border-dotted border-gray-300 my-2 " />
      <div className="flex gap-2 items-center justify-between my-1">
        <button
          onClick={() => handleClick(data)}
          className="bg-primary text-[11px] text-white hover-bg-white hover-text-primary border border-primary cursor-pointer py-2 w-full rounded-md font-semibold"
        >
          {value}
        </button>
      </div>
    </div>
  );
};

export default FreeCourseCard;
