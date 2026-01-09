"use client";

import React from "react";
import VideojsPlayer from "./videojsPlayer";
import ShakaPlayer from "./shakaPlayer";

export default function VideoPlayer({
  fileUrl = "",
  fileType = "",
  videoType = "",
  isDrm = false,
  poster = "",
  drmLicense = "",
  drmHeaders = {},
}) {
  const url = fileUrl?.toLowerCase();

  // ----------------------------
  // YOUTUBE
  // ----------------------------
  if (
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    videoType === "2"
  ) {
    const ytUrl = url.includes("http")
      ? fileUrl
      : `https://www.youtube.com/watch?v=${fileUrl}`;

    return (
      <VideojsPlayer
        videoUrl={ytUrl}
        poster={poster}
        sourceType="youtube"
      />
    );
  }

  // ----------------------------
  // DRM (MPD)
  // ----------------------------
  if (isDrm || url.endsWith(".mpd")) {
    return (
      <ShakaPlayer
        src={fileUrl}
        poster={poster}
        isDrm={true}
        licenseUrl={drmLicense}
        drmHeaders={drmHeaders}
      />
    );
  }

  // ----------------------------
  // HLS (m3u8)
  // ----------------------------
  if (url.includes(".m3u8")) {
    return (
      <VideojsPlayer
        videoUrl={fileUrl}
        poster={poster}
        sourceType="hls"
      />
    );
  }

  // ----------------------------
  // MP4
  // ----------------------------
  if (url.includes(".mp4")) {
    return (
      <VideojsPlayer
        videoUrl={fileUrl}
        poster={poster}
        sourceType="mp4"
      />
    );
  }

  return (
    <div className="text-center p-4">
      <p className="text-sm">Unsupported format</p>
      <a href={fileUrl} target="_blank" className="underline text-blue-600">
        Open Manually
      </a>
    </div>
  );
}
