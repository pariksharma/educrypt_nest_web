'use client';
import React from "react";
import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import VideoPlayer from "@/components/videoPlayer/videoPlayer";
import Header from "@/components/header/header";
import { useState } from "react";
import Bookmark from "@/components/icon/Bookmark";
import Index from "@/components/icon/Index";
import Pdf from "@/components/icon/Pdf";
import { useParams } from "next/navigation";
import { file } from "zod";

export default function CoursePlayPage() {

  const [activeTab, setActiveTab] = useState('bookmark');

  const params = useParams();
  const fileTitle = decodeURIComponent(params.playId);


  const searchParams = useSearchParams();
  const fileUrl = searchParams.get("file_url");
  const fileType = searchParams.get("file_type");
  const videoType = searchParams.get("video_type");
  // const videoType = '1';
  const isDrm = searchParams.get("is_drm") === "1";
  // const isDrm = true;

  if (!fileUrl || fileType != "2") {
    return <div className="text-center text-red-600">Invalid video</div>;
  }

  console.log('file title', fileTitle)
  let videoSrc = "";
  if (videoType === "2") {
    // YouTube
    videoSrc = `https://www.youtube.com/watch?v=${fileUrl}`;
  } else if (isDrm) {
    videoSrc = `https://cdn.bitmovin.com/content/assets/art-of-motion_drm/mpds/11331.mpd`;
    // videoSrc = fileUrl;
  } else {
      videoSrc = `https://d1hjka9tp6y5n4.cloudfront.net/file_library/migration/non_drm/2408476_251213_082346/20230519130751-8725-1247584-gsehl-ml/test.master.m3u8`;
      // videoSrc = fileUrl;
    }

  return (
    <>
    <Header />
      <div className="w-ful flex items-start px-3 py-2 gap-6 mt-[70px] player_container">
        <div className="w-63/100 lft_side">
          <VideoPlayer
            fileUrl={videoSrc}
            fileType={fileType}
            videoType={videoType}
            isDrm={isDrm === "1"}
            poster={`https://i.ytimg.com/vi/${fileUrl}/hqdefault.jpg`}
            drmLicense="https://api.videocrypt.com/getVideoDetailsDrm"
            // drmHeaders={{
            //   "device-name": "1",
            //   "device-id": "71d3548555586126ed7071102e663619",
            //   "device-type": device_id,
            //   "version": "1",
            //   'user-id': user_id,
            //   'account-id':'10002937',           
            //   'secretKey':'1CbJfseVF8gu0tWh+DjL7GRPUExXrO3S69nQdHlZ',
            //   'accessKey':'EM3G7PL0WXZ4KRAT8UVI',
            // }}
          />
          <h3 className="mt-2">{fileTitle}</h3>
        </div>
        <div className="flex flex-col gap-3 w-35/100 rgt_side border border-gray-200 px-6 py-3 rounded-xl relative">
          <ul className="flex items-center justify-between border-b border-gray-200 pb-3 tab_list gap-5">
            <li className="w-33/100">
              <button className={`flex flex-col gap-1 justify-center items-center border border-gray-300 py-2 w-full rounded-xl ${activeTab == 'bookmark' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('bookmark')
                }}
              >
                <Bookmark />
                <span className="text-xs font-bold text-black">Bookmark</span>
              </button>
            </li>
            <li className="w-33/100">
              <button className={`flex flex-col gap-1 justify-center items-center border border-gray-300 py-2 w-full rounded-xl ${activeTab == 'index' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('index')
                }}
              >
                <Index />
                <span className="text-xs font-bold text-black">Index</span>
              </button>
            </li>
            <li className="w-33/100">
              <button className={`flex flex-col gap-1 justify-center items-center border border-gray-300 py-2 w-full rounded-xl ${activeTab == 'pdf' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('pdf')
                }}
              >
                <Pdf />
                <span className="text-xs font-bold text-black">Pdf</span>
              </button>
            </li>
          </ul>
          <div className="min-h-[64vh] overflow-hidden overflow-y-auto no-scrollbar">
            {activeTab == 'bookmark' && (
              <div>Bookmark</div>
            )}
            {activeTab == 'index' && (
              <div>Index</div>
            )}
            {activeTab == 'pdf' && (
              <div>PDF</div>
            )}
          </div>
          <div className="absolute bottom-3 w-full left-0 text-center">
            <button className="border border-primary rounded-lg py-3 text-center w-[calc(100%-40px)] text-sm text-primary font-bold hover-bg-primary hover-text-white">Add Bookmark</button>
          </div>
        </div>
      </div>
    </>
  );
}