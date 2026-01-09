"use client";
 
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { checkExistUser, resetExistData, verifyOtp } from "@/store/slice/authSlice";
import { toast, ToastContainer } from "react-toastify";
import { saveUserData } from "@/utils/loginUserData";
 
export default function CutomHeader({closeLoginModal, open}) {

    const [screenStatus, setScreenStatus] = useState('check_user');
    const [userData, setUserData] = useState({});
    const [timer, setTimer] = useState(0);
    const [otp, setOtp] = useState('')

    const STATIC_COUNTRY_ID = '1';
    const STATIC_COUNTRY_CODE = '+91';

    const {existUserLoading, exitUser, verifyOtpData, verifyOtpLoading} = useSelector(state => state?.auth);
    const otpInputRefs = useRef([])
    const dispatch = useDispatch();


    useEffect(() => {
      setScreenStatus('check_user')
      setUserData({})
      setOtp('')
    }, [open])

    useEffect(() => {
    if (timer > 0) {
        const id = setTimeout(() => setTimer(timer - 1), 1000);
        return () => clearTimeout(id);
      }
    }, [timer]);

    useEffect(() => {
      if(exitUser?.data?.exists){
        setScreenStatus('verify-otp')
      } else {
        toast.error(exitUser?.message, {autoClose: 1500})
        dispatch(resetExistData())
      }
    }, [exitUser])

    const handleInput = (e) => {
        const {name, value} = e.target;
        console.log('name', name, value)
        if(name == "mobile") {
          let num_value = value.replace(/[^0-9]/g, "");
          if (num_value.length > 10) num_value = num_value.slice(0, 10);
          if (num_value && !/^[6-9]/.test(num_value)) {
              num_value = "";
          }
          setUserData((prev) => ({
              ...prev,
              mobile: num_value.replace(/[^0-9]/g, ""),
          }));
        }
    }

    const handleSendOtp = (e) => {
      e.preventDefault();
      if(userData?.mobile?.length != 10) {
        toast.error('Please, Enter your mobile number', {autoClose: 1500})
      }
      const payload = {
        mobile: userData?.mobile,
        mobile_otp_login: 1,
      }
      dispatch(checkExistUser(payload))
      setTimer(60);
      setOtp('');
    }

    const handleOtpChange = (e, index) => {
      const value = e.target.value;
      if (!/^\d*$/.test(value)) return;
  
      const newOtp = otp.split('');
      newOtp[index] = value;
      setOtp(newOtp.join('').slice(0, 6));
  
      if (value && index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }
    };

    const handleVerifyOtp = (e) => {
      e.preventDefault();
      const payload = {
        mobile: userData?.mobile,
        otp: otp,
      }
      dispatch(verifyOtp(payload))
    }

    useEffect(() => {
      if(verifyOtpData) {
        saveUserData(verifyOtpData?.data)
      }
    }, [verifyOtpData])

    const renderedData = () => {
        switch (screenStatus) {
            case "check_user" :
                return <>
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <h2 className="text-lg font-semibold text-center">
                            Login with Mobile
                        </h2>
                        <div className="flex items-center gap-2">
                          <div className="px-3 py-2 border border-gray-300 rounded-l text-sm bg-gray-50">
                            {STATIC_COUNTRY_CODE}
                          </div>
                          <input
                              type="text"
                              inputMode="numeric"
                              placeholder="Enter 10-digit mobile"
                              value={userData?.mobile ?? ""}
                              name="mobile"
                              onChange={(e) => handleInput(e)}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              maxLength={10}
                              required
                          />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {existUserLoading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                </>

            case "verify-otp" :
              return <>
                 <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <h2 className="text-lg font-semibold text-center">
                    Enter Otp
                  </h2>
                  <p className="text-xs text-gray-600 text-center">
                    OTP sent to <span className="font-medium">+91 {userData?.mobile}</span>
                  </p>
        
                  {/* OTP Inputs */}
                  <div className="flex justify-center gap-2">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={otp[index] || ''}
                        onChange={(e) => handleOtpChange(e, index)}
                        ref={(el) => (otpInputRefs.current[index] = el)}
                        className="w-10 h-10 text-center text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !otp[index] && index > 0) {
                            otpInputRefs.current[index - 1]?.focus();
                          }
                        }}
                      />
                    ))}
                  </div>
        
                  {/* Resend Timer */}
                  <div className="text-center text-xs text-gray-500">
                    {timer > 0 ? (
                      <span>Resend in {timer}s</span>
                    ) : (
                      <button
                        type="button"
                        // onClick={handleResend}
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
        
                  <button
                    type="submit"
                    disabled={verifyOtpLoading || otp.length !== 6}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {verifyOtpLoading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </form>
              </>
        }
    }
 
  return (
    <div>
      <Dialog open={open} onClose={closeLoginModal} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-400/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />
 
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {renderedData()}
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
 
 