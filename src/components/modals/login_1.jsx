'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, checkuser, verifyOtp, signupUser, getSignupForm, appSetting, fetchCountries, fetchStates, fetchCities, resetCities } from '@/store/slice/authSlice';
import { IoIosClose } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from 'react-toastify';

export default function Login({ closeLoginModal }) {
  const dispatch = useDispatch();
  const { loginLoading, error, exitUser, signupUsers, appSettings, signupForms, countries, states, cities, existUserLoading, otpVerifyLoading, signupuserLoading } = useSelector((state) => state?.auth);
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0);
  const [password, setPassword] = useState('');
  const [passwordType, setPasswordType] = useState(true);
  const [passwordError, setPasswordError] = useState('');
  const [userExists, setUserExists] = useState(false);
  const otpInputRefs = useRef([]);
  const [signupData, setSignupData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);


  const STATIC_COUNTRY_ID = '1';
  const STATIC_COUNTRY_CODE = '+91';
  const STATIC_COUNTRY_LABEL = 'India';

  useEffect(() => {
    if (!appSettings?.data) dispatch(appSetting());
  }, []);

  const loginMobileOtp = appSettings?.data?.featureFlags?.mobile_otp_login || null;

  const loginMobilePassword = appSettings?.data?.featureFlags?.mobile_password_login || null;

  const loginEmailPassword = appSettings?.data?.featureFlags?.email_password_login || null;

  const loginEmailOtp = appSettings?.data?.featureFlags?.email_otp_login || null;

  const numericMode = (loginMobileOtp!='0' || loginMobilePassword!='0');

  const isValidEmail = (v = '') => {
    const email = v.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // useEffect(() => {
  //   console.log('login with OTP:', loginOtp);
  //   console.log('login with mobile password:', loginMobilePassword);
  //   console.log('login with email password:', loginEmailPassword);

  // }, [appSettings])

  // Load Signup Form when Step = 4
  useEffect(() => {
    if (step !== 4) return;

    dispatch(getSignupForm());

    dispatch(fetchCountries());

    dispatch(fetchStates({ country_id: STATIC_COUNTRY_ID }));

  }, [step]);

  // get signup form field
  useEffect(() => {
    if (step === 4 && signupForms?.data?.form_json) {
      setSignupData((prev) => {
        if (Object.keys(prev).length > 0) return prev;
        const initial = {};
        signupForms.data.form_json.forEach((f) => {
          initial[f.field_name] = '';
        });

        initial.country = STATIC_COUNTRY_ID;
        initial.c_code = STATIC_COUNTRY_CODE;

        return initial;
      });
    }
  }, [step, signupForms]);

  // Timer for resend OTP
  useEffect(() => {
    if (timer > 0) {
      const id = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(id);
    }
  }, [timer]);

  // handle login
  const handleLoginMethod = async (e) => {
    e.preventDefault();

    if (!mobile.trim() || mobile.length < 10) {
      toast.error('Enter valid 10-digit mobile number');
      return;
    }
    // otp method
    if(loginMobileOtp == '1'){
      const payload = {
        mobile: mobile.trim(),
        mobile_otp_login: 1,
        otp: '',
      };

      try {
        const res = await dispatch(checkuser(payload)).unwrap();
        // console.log('Check User Response:', res);
        const exists = res?.data?.exists ?? false;
        setUserExists(exists);
        setStep(2);
        setTimer(60);
        setOtp('');
        toast.success('OTP send successfully.');
      } catch (err) {
        toast.error('Something went wrong' || err);
      }
      return;
    }
    // mobile password methode
    if(loginMobilePassword == '1'){
      const payload = {
        mobile: mobile.trim(),
        mobile_password_login: 1,
      };
      try {
        const res = await dispatch(checkuser(payload)).unwrap();
        // console.log('user Exist resp:', res);
        const exists = res?.data?.exists ?? false;
        setUserExists(exists);
        if(exists){
          setStep(3);
          setTimer(60);
          setPassword('');
        } else {
          setStep(4);
          toast.success('User not found — please signup')
        }
        
        // toast.success('OTP send successfully.');
      } catch (err) {
        toast.error(err || 'Something went wrong');
      }
      return;
    }

    // email password 
    if (loginEmailPassword == '1') {
      const payload = {
        mobile: mobile.trim(),
        email_password_login: 1,
      };
      try {
        const res = await dispatch(checkuser(payload)).unwrap();
        // console.log('email login:', res);
        const exists = res?.data?.exists ?? false;
        setUserExists(exists);
        if (exists) {
          setStep(3);
          setTimer(60);
          setPassword('');
        } else {
          setStep(4);
          toast.success('User not found — please signup');
        }
      } catch (err) {
        toast.error(err || 'Something went wrong');
      }
      return;
    }

    // email otp 
    if (loginEmailOtp == '1') {
      const payload = {
        mobile: mobile.trim(),
        email_otp_login: 1,
      };
      try {
        const res = await dispatch(checkuser(payload)).unwrap();
        console.log('email login:', res);
        const exists = res?.data?.exists ?? false;
        setUserExists(exists);
        if (exists) {
          setStep(2);
          setTimer(60);
          setOtp('');
          toast.success('OTP send successfully.');
        } else {
          setStep(4);
          toast.success('User not found — please signup');
        }
      } catch (err) {
        toast.error(err || 'Something went wrong');
      }
      return;
    }
  };

  // VERIFY OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error('Enter 6-digit OTP');
      return;
    }

    if (!appSettings?.data?.featureFlags) {
      toast.error('App settings not loaded yet, please try again.');
      return;
    }

    const signupNeeded = String(appSettings?.data?.featureFlags?.signup_needed || '0') === '1';

    const payload = {
      mobile: mobile.trim(),
      mobile_otp_login: 1,
      otp: otp.trim(),
    };

    try {
      const res = await dispatch(verifyOtp(payload)).unwrap();
      // console.log("OTP Verified:", res);
      toast.success('OTP Verified.');

      const token = res?.data?.accessToken;
      if (token) localStorage.setItem('token', token);

      //CASE 1: Existing user 
      if (userExists) {
        toast.success('login success.');
        closeLoginModal?.();
        window.location.replace('/');
        return;
      }

      //CASE 2: New user signup needed
      if (!userExists && signupNeeded) {
        toast.success('Signup Form Open.');
        await dispatch(getSignupForm()).unwrap();
        setStep(4);
        return;
      }

      //CASE 3: New user but login without signup
      if (!userExists && !signupNeeded) {
        toast.success('Login Successfully.');
        closeLoginModal?.();
        window.location.replace('/');
        return;
      }
    } catch (err) {
      toast.error('OTP Verify Failed.' || err);
    }
  };

  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    if (password.trim() == '') {
      setPasswordError('Enter your password');
      return;
    }

    const payload = {
      mobile: mobile.trim(),
      mobile_password_login: 1,
      password: password.trim(),
    }

    try {
      const res = await dispatch(loginUser(payload)).unwrap();
      // toast.success('Login Successfully.');
      console.log('login verify res:', res);
      const token = res?.data?.accessToken;
      if (token) localStorage.setItem('token', token);

      const response = res?.responseCode;

      if(response == 1002){
        toast.success('login success.');
        closeLoginModal?.();
        window.location.replace('/');
        return;
      } else {
        const msg = res?.message;
        setPasswordError(msg);
        toast.error(msg);
        return;
      }
    } catch (err) {
      const msg = (typeof err === 'string' && err) || err?.message || 'Login failed';
      setPasswordError(msg);
      toast.error(msg);
    }

  }

  // Handle Input
  const handleInputChange = (e, field) => {
    const { type, value, checked, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setSignupData((d) => ({ ...d, [field.field_name]: file }));
      if (file) setImagePreview(URL.createObjectURL(file));
      else setImagePreview(null);
    } else if (type === 'checkbox') {
      setSignupData((d) => ({ ...d, [field.field_name]: checked }));
    } else {
      setSignupData((d) => ({ ...d, [field.field_name]: value }));
    }
  };

  // Signup Submit
  const handleSignup = async (e) => {
    e.preventDefault();

    if (signupData.password && signupData.confirmPassword && signupData.password !== signupData.confirmPassword) {
      // alert('Password and Confirm Password do not match');
      toast.error('Password and Confirm Password do not match.');
      return;
    }

    const payload = {
      ...signupData,
      state: signupData.state || "",
      city: signupData.city || "",
      mobile: mobile.trim(),
      c_code: STATIC_COUNTRY_CODE,
      device_token: "",
    };

    try {
      await dispatch(signupUser(payload)).unwrap();
      toast.success('Signup Success.');
      closeLoginModal?.();
      const token = localStorage.getItem('token');
      if(token){
        window.location.replace('/');
      }
    } catch (err) {
      // console.error('Signup Failed:', err);
      toast.error('Signup Failed.');
      // alert(err || 'Signup Failed');
    }
  };

  // Auto-focus OTP boxes
  const handleOtpChange = (e, idx) => {
    const v = e.target.value;
    if (!/^\d*$/.test(v)) return;
    const arr = otp.split('');
    arr[idx] = v;
    const newOtp = arr.join('').slice(0, 6);
    setOtp(newOtp);
    if (v && idx < 5) otpInputRefs.current[idx + 1]?.focus();
  };

  // RESEND OTP
  const handleResend = () => {
    const payload = {
      mobile: mobile.trim(),
      mobile_otp_login: 1,
    };
    dispatch(checkuser(payload));
    setTimer(60);
    setOtp('');
    otpInputRefs.current[0]?.focus();
  };

  // State select change (React Select)
  const onStateChange = (opt) => {
    const id = opt?.value ?? '';
    setSignupData((d) => ({ ...d, state: String(id), city: '' }));
    // clear previous cities
    dispatch(resetCities());
    if (id) {
      dispatch(fetchCities({ state_id: id }));
    }
  };

  // City change
  const onCityChange = (opt) => {
    const id = opt?.value ?? '';
    setSignupData((d) => ({ ...d, city: String(id) }));
  };

  // build react-select options
  const stateOptions = (states || []).filter(Boolean).map((s) => ({ value: s.id, label: s.state_name }));
  const cityOptions = (cities || []).filter(Boolean).map((c) => ({ value: c.id, label: c.city_name }));

  return (<>
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
    <div className="flex flex-col gap-4 bg-white rounded-lg relative p-6 min-w-[320px]">
      {/* Close Button */}
      <button
        type="button"
        onClick={closeLoginModal}
        className="absolute top-1 right-1 w-10 h-10 text-gray-500 hover:text-gray-800"
      >
        <IoIosClose className="w-10 h-10" />
      </button>

      {/* Step 1: Mobile */}
      {step === 1 && (
        <form onSubmit={handleLoginMethod} className="space-y-4">
          <h2 className="text-lg font-semibold text-center">
            {`${numericMode ? 'Login with Mobile' : 'Login with Email'}`}
            
          </h2>
          <div className="flex items-center gap-2">
            {numericMode && 
              <div className="px-3 py-2 border border-gray-300 rounded-l text-sm bg-gray-50">
                {STATIC_COUNTRY_CODE}
              </div>
            }     
            {/* {console.log('login method:', numericMode)} */}
            <input
              type="text"
              inputMode={numericMode ? "numeric" : "text"}
              placeholder={`${numericMode ? 'Enter Mobile' : 'Enter Email'}`}
              value={mobile}
              onChange={(e) => {
                const v = e.target.value;
                if (numericMode) {
                  setMobile(v.replace(/\D/g, "").slice(0, 10));
                } else {
                  setMobile(v);
                }
              }}
              className="flex-1 border border-gray-300 rounded-r px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={`${numericMode ? 10 : null}`}
              required
            />
          </div>
          {loginMobileOtp == '1' || loginEmailOtp == '1' && 
            <button
              type="submit"
              disabled={
                existUserLoading || (numericMode ? mobile.length < 10 : !isValidEmail(mobile))
              }
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {existUserLoading ? 'Sending...' : 'Send OTP'}
            </button> 
          }
             
          {loginMobilePassword == '1' && 
            <button
              type="submit"
              disabled={existUserLoading || mobile.length < 10}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {existUserLoading ? 'Sending...' : 'Submit'}
            </button>
          }

          {loginEmailPassword == '1' && 
            <button
              type="submit"
              disabled={existUserLoading || !isValidEmail(mobile)}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {existUserLoading ? 'Sending...' : 'Submit'}
            </button>
          }
          
        </form>
      )}

      {/* Step 2: OTP */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <h2 className="text-lg font-semibold text-center">
            Enter Otp
          </h2>
          <p className="text-xs text-gray-600 text-center">
            OTP sent to <span className="font-medium">{loginMobileOtp == '1' ? '+91' : ''} {mobile}</span>
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
                onClick={handleResend}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Resend OTP
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={otpVerifyLoading || otp.length !== 6}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {otpVerifyLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      )}

      {/* Step 3: mobile or email password */}
      {step === 3 && (
        <form onSubmit={handleVerifyPassword} className="space-y-4">
          <h2 className="text-lg font-semibold text-center">
            Enter Password
          </h2>
          <p className="text-xs text-gray-600 text-center">
            Mobile: <span className="font-medium">+91 {mobile}</span>
          </p>

          {/* OTP Inputs */}
          <div className="flex items-center border justify-between border-gray-300 rounded-r px-3 py-2 text-sm gap-2">
            <input 
              type={`${passwordType ? 'password' : 'text'}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
              }}
              className='w-full'
              aria-label="Password"
            />
            <button className='cursor-pointer' type='button' onClick={() => setPasswordType(prev => !prev)}>
              {passwordType ? <FaEye/> : <FaEyeSlash />}
            </button>

          </div>

          {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}

          <button
            type="submit"
            disabled={loginLoading || password.trim() == ''}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loginLoading ? 'Verifying...' : 'Verify Password'}
          </button>
        </form>
      )}

      {/* step 3: signup form */}
      {step === 4 && (
        <form onSubmit={handleSignup} className="space-y-4">
          <h1 className="text-lg font-semibold text-center">SignUp Form</h1>

          {signupForms?.data?.form_json?.map((field, idx) => {
            if (field.field_name === 'button') return null;

            // Special handling by field_name (as you requested)
            if (field.field_name === 'state') {
              return (
                <div key={idx} className="flex flex-col">
                  <label className="text-sm font-medium mb-1">{field.label}</label>
                  <Select
                    options={stateOptions}
                    onChange={onStateChange}
                    value={stateOptions.find(o => String(o.value) === String(signupData.state)) || null}
                    placeholder={field.placeholder || 'Select State'}
                    isClearable
                  />
                </div>
              );
            }

            if (field.field_name === 'city') {
              return (
                <div key={idx} className="flex flex-col">
                  <label className="text-sm font-medium mb-1">{field.label}</label>
                  <Select
                    options={cityOptions}
                    onChange={onCityChange}
                    value={cityOptions.find(o => String(o.value) === String(signupData.city)) || null}
                    placeholder={field.placeholder || 'Select City'}
                    isClearable
                  />
                </div>
              );
            }

            if (field.field_name === 'mobile') {
              // show disabled mobile with prefix
              return (
                <div key={idx} className="flex flex-col">
                  <label className="text-sm font-medium mb-1">{field.label}</label>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-2 border border-gray-300 rounded-l text-sm bg-gray-50">{STATIC_COUNTRY_CODE}</div>
                    <input type="text" className="flex-1 border border-gray-300 rounded-r px-3 py-2 text-sm" value={mobile} disabled />
                  </div>
                </div>
              );
            }

            if (field.field_name === 'image') {
              return (
                <div key={idx} className="flex flex-col">
                  <label className="text-sm font-medium mb-1">{field.label}</label>
                  <input type="file" accept="image/*" onChange={(e) => handleInputChange(e, field)} />
                  {imagePreview && <img src={imagePreview} alt="preview" className="mt-2 w-32 h-32 object-cover rounded" />}
                </div>
              );
            }

            // generic mapping by type (fallback)
            switch (field.type) {
              case 'text':
              case 'email':
              case 'password':
              case 'pin_code':
                return (
                  <div key={idx} className="flex flex-col">
                    <label className="text-sm font-medium mb-1">{field.label}</label>
                    <input
                      type={field.type === 'pin_code' ? 'number' : field.type}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={signupData[field.field_name] || ''}
                      onChange={(e) => handleInputChange(e, field)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                );

              case 'textarea':
                return (
                  <div key={idx} className="flex flex-col">
                    <label className="text-sm font-medium mb-1">{field.label}</label>
                    <textarea
                      placeholder={field.placeholder}
                      required={field.required}
                      value={signupData[field.field_name] || ''}
                      onChange={(e) => handleInputChange(e, field)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                );

              case 'radio':
                // use radio for gender or other regular radios (but we already handled state/city)
                return (
                  <div key={idx}>
                    <label className="font-medium">{field.label}</label>
                    <div className="flex gap-4 mt-1">
                      {field.dropDownOption?.map((opt, i) => (
                        <label key={i} className="flex items-center gap-1 text-sm">
                          <input
                            type="radio"
                            name={field.field_name}
                            value={opt.value}
                            checked={signupData[field.field_name] === opt.value}
                            onChange={(e) => handleInputChange(e, field)}
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>
                );

              case 'number':
                return (
                  <div key={idx} className="flex flex-col">
                    <label className="text-sm font-medium mb-1">{field.label}</label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      required={field.required}
                      value={signupData[field.field_name] || ''}
                      onChange={(e) => handleInputChange(e, field)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                );

              case 'checkbox':
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <input type="checkbox" checked={!!signupData[field.field_name]} onChange={(e) => handleInputChange(e, field)} />
                    <label className="text-sm">{field.label}</label>
                  </div>
                );

              default:
                return null;
            }
          })}

          <button type="submit" disabled={signupuserLoading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {signupuserLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      )}

      {/* Error */}
      {error && <p className="text-red-500 text-xs text-center">{error}</p>}
    </div>
  </>);
}