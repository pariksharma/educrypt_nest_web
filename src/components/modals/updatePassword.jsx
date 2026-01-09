import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useSelector, useDispatch } from "react-redux";
import { forgetPassword, resetForgetPasswordData, resetForgetPasswordState, resetPassword, resetPasswordState, resetVerifyOtpData, verifyOtp } from "@/store/slice/authSlice";
import { toast, ToastContainer } from "react-toastify";
import { BiSolidHide } from "react-icons/bi";
import { BiSolidShow } from "react-icons/bi";
import BtnLoader from "../loader/btnLoader";



const UpdatePassword = ({ open, closeModal, mobile }) => {

  const [otp, setOtp] = useState('')
  const [timer, setTimer] = useState(0);
  const [screenShow, setScreenShow] = useState('mobile')
  const [formattedTime, setFormattedTime] = useState("00:00");
  const [showPassword, setShowPassword] = useState(true)
  const [showCnPassword, setShowCnPassword] = useState(true)
  const [password, setPassword] = useState('')
  const [cnPassword, setCnPassword] = useState('')

  const otpInputRefs = useRef([])
  const dispatch = useDispatch()
  const { appSettings, forgetPasswordData, forgetPasswordLoading, verifyOtpData, verifyOtpLoading, resetPasswordData, resetPasswordLoading } = useSelector((state) => state?.auth);

  const handleSentOtp = () => {
    const payload = {
      mobile: mobile
    }
    dispatch(forgetPassword(payload))
    setOtp('')
    setTimer(60);
  }

  useEffect(() => {
    setScreenShow('mobile')
    dispatch(resetForgetPasswordState())
    dispatch(resetVerifyOtpData())
    dispatch(resetPasswordState())
  }, [open])

  useEffect(() => {
    if (timer > 0) {
      const id = setTimeout(() => setTimer(timer - 1), 1000);

      const minutes = Math.floor(timer / 60);
      const seconds = timer % 60;

      setFormattedTime(
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      );

      return () => clearTimeout(id);
    } else {
      setFormattedTime("00:00");
    }
  }, [timer]);

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

  const handleVerifyOtp = () => {
    if(otp?.length == 6) {
      const payload = {
        mobile: mobile,
        otp: otp,
      }
      dispatch(verifyOtp(payload))
    } else {
      toast.error('Please, Enter valid otp', {autoClose: 1500})
    }
  }

  useEffect(() => {
    if(forgetPasswordData?.responseCode == '2001') {
      toast.error(forgetPasswordData?.message, {autoClose: 1500})
      setTimeout(() => {
        dispatch(resetForgetPasswordData())
      }, 1500);
    } else if(forgetPasswordData?.responseCode == '1001') {
      toast.success(verifyOtpData?.message, {autoClose: 1500})
      setScreenShow('otpScreen')
    }
  }, [forgetPasswordData]) 

  useEffect(() => {
    if(verifyOtpData?.responseCode == '1007') {
      toast.error(verifyOtpData?.message, {autoClose: 1500})
      setOtp('')
      setTimeout(() => {
        dispatch(resetVerifyOtpData())
      }, 1500);
    } else if(verifyOtpData?.responseCode == '1011') {
      toast.success(verifyOtpData?.message, {autoClose: 1500})
      setScreenShow('reset')
    }
  }, [verifyOtpData])

  const handleResetPassword = () => {
    if(!password) {
      toast.error('Please, Enter the password!', {autoClose: 1500})
    } else if(!cnPassword) {
      toast.error('Please, Enter the confirm password!', {autoClose: 1500})
    } else if(password != cnPassword) {
      toast.error("Password and confirm password didn't match!", {autoClose: 1500})
    } else {
      const payload = {
        new_password: password
      }
      dispatch(resetForgetPasswordData(payload))
    }
  } 

  useEffect(() => {
    if(resetPasswordData?.responseCode == '2001') {
      toast.error(resetPasswordData?.message, {autoClose: 1500})
      setTimeout(() => {
        dispatch(resetPasswordState())
      }, 1500);
    } else if(resetPasswordData?.responseCode == '1014') {
      setPassword('')
      setCnPassword('')
      toast.success(resetPasswordData?.message, {autoClose: 1500})
      closeModal()
    }
  }, [resetPasswordData])

  const renderData = () => {
    switch (screenShow) {
      case "mobile":
        return (
          <DialogPanel className=" max-w-sm rounded-lg bg-white shadow-xl py-3 w-100">
            <img
              src={"/images/eduLogo.png"}
              alt={"logo"}
              className="w-30 h-10 rounded p-2"
            />
            <p className="text-sm text-gray-600 px-2 pt-2 pb-6 ">
              Enter mobile number to continue
            </p>
            <div className="flex items-center py-2 bg-gray-200 border border-gray-400 mx-3 rounded">
              <span className="px-2 border-r">{"+91 "}</span>
              <input className="pl-2" type="text" disabled value={mobile} />
            </div>
            <div className="flex justify-center gap-3 mt-6 px-4">
              <button
                className="px-4 py-2 rounded bg-primary border border-primary text-white hover-bg-white hover-border hover-text-primary text-sm cursor-pointer w-full btnbg flex justify-center"
                  onClick={() => handleSentOtp()}
              >
                {forgetPasswordLoading ? <BtnLoader /> : "Continue"}
              </button>
            </div>
          </DialogPanel>
        );

      case "otpScreen":
        return (
          <DialogPanel className=" max-w-sm rounded-lg bg-white shadow-xl py-3 w-100">
            <img
              src={"/images/eduLogo.png"}
              alt={"logo"}
              className="w-30 h-10 rounded p-2"
            />
            <p className="text-sm text-gray-600 px-2 pt-2">
              We've sent an OTP to your registered mobile number
            </p>
            <p className="text-sm text-gray-900 px-2 pt-2 pb-6 font-semibold">
              {"+91 "}{mobile}
            </p>
            <div className="flex items-center py-2 mx-3 rounded">
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
            </div>
            {timer > 0 
            ?
              <p className="text-sm text-gray-600 px-2 pt-2">
                Resend in <span className="text-primary">{formattedTime}</span>
              </p>
            :
              <p className="text-sm text-gray-600 px-2 pt-2">
                Didn't recieve code? <span className="text-primary cursor-pointer" onClick={() => handleSentOtp()}>Resend</span>
              </p>
            }
            <div className="flex justify-center gap-3 mt-6 px-4">
              <button
                className="px-4 py-2 rounded bg-primary border border-primary text-white hover-bg-white hover-border hover-text-primary text-sm cursor-pointer w-full btnbg flex justify-center"
                  onClick={() => handleVerifyOtp()}
              >
                {verifyOtpLoading ? <BtnLoader /> : 'Verify'}
              </button>
            </div>
          </DialogPanel>
        )
      case "reset":
        return (
          <DialogPanel className=" max-w-sm rounded-lg bg-white shadow-xl py-3 w-100">
            <img
              src={"/images/eduLogo.png"}
              alt={"logo"}
              className="w-30 h-10 rounded p-2"
            />
            <p className="text-sm text-gray-600 px-2 pt-2 pb-4">
              Create password to continue
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center py-2 mx-3 rounded border border-gray-300 items-between px-3 ">
                <input className="w-full outline-none text-md" type={showPassword ? "password" : "text"}  name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <span
                    className="cursor-pointer"
                    id=""
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {!showPassword ? <BiSolidHide /> : <BiSolidShow />}
                </span>
              </div>
              <div className="flex items-center py-2 mx-3 rounded border border-gray-300 items-between px-3">
                <input className="w-full outline-none text-md" type={showCnPassword ? "password" : "text"} name="cpassword" placeholder="Confirm Password" value={cnPassword} onChange={(e) => setCnPassword(e.target.value)} />
                <span
                    className="cursor-pointer"
                    id=""
                    onClick={() => setShowCnPassword(!showCnPassword)}
                >
                    {!showCnPassword ? <BiSolidHide /> : <BiSolidShow />}
                </span>
              </div>
            </div>
            <div className="flex justify-center gap-3 mt-6 px-4">
              <button
                className="px-4 py-2 rounded bg-primary border border-primary text-white hover-bg-white hover-border hover-text-primary text-sm cursor-pointer w-full btnbg text-center flex justify-center"
                  onClick={() => handleResetPassword()}
              >
                {resetPasswordLoading ? <BtnLoader /> : 'Submit'}
              </button>
            </div>
          </DialogPanel>
        )
    }
  };



  return (<>
    <ToastContainer
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
    />
    <Dialog open={open} onClose={closeModal} className="relative z-[9999]">
      <DialogBackdrop className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex items-center justify-center ">
        {renderData()}
      </div>
    </Dialog>
  </>);
};

export default UpdatePassword;
