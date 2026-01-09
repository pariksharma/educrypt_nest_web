"use client";

import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-youtube";

export default function VideojsPlayer({
  videoUrl,
  poster,
  autoplay = false,
  controls = true,
  sourceType = "mp4"
}) {
  const elRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current) {
      const v = document.createElement("video");
      v.className = "video-js vjs-big-play-centered";
      elRef.current.appendChild(v);

      let type = "video/mp4";

      if (sourceType === "youtube") type = "video/youtube";
      if (sourceType === "hls") type = "application/x-mpegURL";

      const player = (playerRef.current = videojs(v, {
        autoplay,
        controls,
        poster,
        fluid: true,
        sources: [
          {
            src: videoUrl,
            type: type
          }
        ]
      }));

      player.on("error", () => console.log("Player Error:", player.error()));
    }

    return () => {
      playerRef.current?.dispose();
      playerRef.current = null;
    };
  }, []);

  return <div ref={elRef} />;
}
