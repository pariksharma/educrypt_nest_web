'use client';

import Header from "@/components/header/header";
import Sidebar from "@/components/sidebar/sidebar";
import withAuth from "@/utils/withAuth";
import { ToastContainer } from "react-toastify";

function PrivateLayout({ children }) {
    return (
        <>
            {/* <ToastContainer
                position="top-right"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            /> */}
            <Header />
            <div className="mt-17 flex">
                <Sidebar addClass={'md:w-17/100 w-70/100'} />
                
                <div className="md:w-83/100 w-full ml-auto">
                    {children}
                </div>
            </div>
        </>
    );
}

export default withAuth(PrivateLayout);
