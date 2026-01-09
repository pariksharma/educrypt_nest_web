import React from "react";
import { useSelector } from "react-redux";
import { LuFileSpreadsheet } from "react-icons/lu";
import { useRouter } from "next/navigation";

const MyCourseCard = ({ data }) => {
  const router = useRouter();
  const { appSettings } = useSelector((state) => state?.auth);

  const handleClick = () => {
    router.push(
      `/private/course/${data?.item_name
        ?.replaceAll(" ", "-")
        ?.toLowerCase()}-${data?.item_id}?from=my-course`
    );
  };

  const validity = (timestamp) => {
    const date = new Date(timestamp);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, " ")
      .replace(" ", " ")
      .replace(" ", ", ");
  };

  return (
    <div className="shadow p-2 rounded-lg">
      <img
        src={data?.thumbnail || appSettings?.data?.appSettings?.logo_url}
        alt={data?.title}
        className="w-full object-cover rounded aspect-video"
      />
      <h2 className="mt-2 mb-1 font-semibold text-sm line-clamp-2 h-11 uppercase">
        {data?.item_name}
      </h2>
      {/* <div className='bg-green-600 inline text-[10px] text-white px-3 py-0.5 uppercase rounded-xl'>free</div> */}
      <div className="flex items-center text-[12px] font-semibold text-gray-600 gap-1">
        <LuFileSpreadsheet /> Validity: {validity(data?.valid_to)}
      </div>
      <div className="flex items-center text-[12px] font-semibold text-primary gap-1">
        <LuFileSpreadsheet /> Remaining: {0} days
      </div>
      <hr className="border-t-2 border-dotted border-gray-300 my-2 " />
      <div className="flex gap-2 items-center justify-between my-1">
        <button
          onClick={handleClick}
          className="bg-primary text-[11px] text-white hover-bg-white hover-text-primary border border-primary cursor-pointer py-2 w-full rounded-md font-semibold"
        >
          {"Explore"}
        </button>
      </div>
    </div>
  );
};

export default MyCourseCard;
