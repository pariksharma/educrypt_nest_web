"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { Provider } from "react-redux";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { store } from "@/store/store";

const queryClient = new QueryClient();

export default function ReduxProvider({ children }) {
  const router = useRouter();
  const [GA_ID, setGA_ID] = useState(null);

  // Dynamically determine GA ID based on host
  useEffect(() => {
    if (typeof window === "undefined") return;

    const host = window.location.host;

    if (host === "online.sriramsias.com") {
      setGA_ID("G-JGG3JY1S1E");
    } else if (host === "eduteria.live") {
      setGA_ID("GTM-58X4PK4D");
    } else {
      setGA_ID(null);
    }
  }, []);

  // Listen for route changes to send page views
  useEffect(() => {
    if (!GA_ID) return;

    const handleRouteChange = (url) => {
      if (window.gtag) {
        window.gtag("config", GA_ID, { page_path: url });
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events, GA_ID]);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {/* Google Analytics setup */}
        {/* {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )} */}

        {/* App children */}
        {children}
      </QueryClientProvider>
    </Provider>
  );
}
