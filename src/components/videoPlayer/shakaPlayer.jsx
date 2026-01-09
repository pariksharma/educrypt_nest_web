"use client";

import React, { useEffect, useRef } from "react";
import ShakaPlayerLib from "shaka-player/dist/shaka-player.compiled";

export default function ShakaPlayer({
  src,
  poster = "",
  isDrm = false,
  licenseUrl = "",
  drmHeaders = {},
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    async function init() {
      if (!videoRef.current) return;

      const video = videoRef.current;
      const player = new ShakaPlayerLib.Player(video);

      // ERROR HANDLER
      player.addEventListener("error", (e) => {
        console.error("Shaka Player Error", e.detail);
      });

      // IF DRM — SET LICENSE SERVER
      if (isDrm) {
        player.configure({
          drm: {
            servers: {
              "com.widevine.alpha": licenseUrl,
            },
          },
        });

        // ADD HEADERS using REQUEST FILTER (right way)
        player.getNetworkingEngine().registerRequestFilter((type, request) => {
          if (type === ShakaPlayerLib.net.NetworkingEngine.RequestType.LICENSE) {
            for (const key in drmHeaders) {
              request.headers[key] = drmHeaders[key];
            }
          }
        });
      }

      try {
        await player.load(src);
        console.log("Shaka Loaded Successfully!");
      } catch (err) {
        console.error("Shaka Load Error:", err);
      }
    }

    init();
  }, [src, isDrm, licenseUrl, drmHeaders]);

  return (
    <div className="w-full">
      <video
        ref={videoRef}
        style={{ width: "100%", height: "auto" }}
        poster={poster}
        controls
        autoPlay={false}
      />
    </div>
  );
}
