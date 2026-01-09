"use client";

import Header from "@/components/header/header";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCompletePayment,
  fetchCourseCoupon,
  fetchInitializePayment,
  fetchVerifyCoupon,
} from "@/store/slice/paymentSlice";
import { Loader } from "@/components/loader/loader";
import { fetchCourseDetail } from "@/store/slice/courseSlice";
import { toast, ToastContainer } from "react-toastify";
import { getUserData } from "@/utils/loginUserData";
import Script from "next/script";
import ThankyouModal from "@/components/modals/thankyouModal";
import CouponModal from "@/components/modals/couponModal";

const page = () => {
  const router = useRouter();
  const { checkoutId } = useParams();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const isMountedRef = useRef(false);

  const [detail, setDetail] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [couponDetail, setCouponDetail] = useState(null);
  const [couponId, setCouponId] = useState(0);
  const [inputCoupon, setInputCoupon] = useState("");
  const [razorpayData, setRazorpayData] = useState("");
  const [easebuzzData, setEaseBuzzData] = useState("");
  const [showThankyouModal, setShowThankyouModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [open, setOpen] = useState(false);
  const [couponList, setCouponList] = useState([]);
  const [viewCouponModal, setViewCouponModal] = useState(false);

  const {
    couponData,
    couponLoading,
    couponError,
    paymentInitializeData,
    paymentCompleteData,
    verifyCouponData,
    verifyCouponLoading,
    verifyCouponError,
  } = useSelector((state) => state?.payment);
  const { courseDetailData, courseDetailLoading, courseDetailError } =
    useSelector((state) => state?.courses);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (checkoutId) {
      const parts = checkoutId.split("-");
      const courseId = parts.pop();
      // const courseId = parts.pop();
      const payload = {
        course_id: courseId,
      };
      dispatch(fetchCourseCoupon(payload));
      dispatch(fetchCourseDetail(payload));
    }
  }, [checkoutId]);

  useEffect(() => {
    if (
      isMountedRef.current &&
      (courseDetailData?.responseCode == "3001" ||
        courseDetailData?.responseCode == "3002")
    ) {
      const data = courseDetailData?.data
        ?.find((item) => item?.type == "overview")
        ?.data?.find((item) => item?.layout_type == "details");
      setDetail(data?.layout_data[0]);
    }
  }, [courseDetailData]);

  useEffect(() => {
    if (isMountedRef.current && couponData?.responseCode == "4004") {
      if (couponData?.data?.coupons?.length == 1) {
        setCouponDetail(couponData?.data?.coupons[0]);
      } else if (couponData?.data?.coupons?.length > 1) {
        setCouponDetail(couponData?.data);
        setCouponList(couponData?.data?.coupons);
      } else {
        setCouponDetail(couponData?.data);
      }
      if (couponData?.data?.razorpay_detail?.status == "1") {
        setRazorpayData(couponData?.data);
      } else if (couponData?.data?.easebuzz_detail?.status == "1") {
        setEaseBuzzData(couponData?.data);
      }
    }
  }, [couponData]);

  const handleClick = () => {
    if (searchParams.get("from") === "home") {
      router.push("/");
    } else {
      router.back();
    }
  };

  const handleBuyNow = () => {
    if (!isChecked) {
      toast.error(
        "Before, making the payment, Please, Accept terms and condition",
        { autoClose: 1500 }
      );
    } else {
      if (couponData?.data?.razorpay_detail?.status == "1") {
        const parts = checkoutId.split("-");
        const courseId = parts.pop();
        const payload = {
          course_id: courseId,
          course_price: couponDetail?.base_amount,
          tax: couponDetail?.gst_amount,
          pay_via: razorpayData?.razorpay_detail?.pay_via,
          payment_mode: "0",
          coupon_id: couponId ? couponId.toString() : "0",
        };
        dispatch(fetchInitializePayment(payload));
      }
    }
  };

  useEffect(() => {
    if (paymentInitializeData?.responseCode == "8009") {
      if (couponData?.data?.razorpay_detail?.status == "1") {
        handleRazorPayModal();
      }
    }
  }, [paymentInitializeData]);

  const handleRazorPayModal = () => {
    const razoparPayDetail = razorpayData?.razorpay_detail;
    try {
      const options = {
        key: razoparPayDetail?.rzp_access_key,
        order_id: paymentInitializeData?.data[0]?.pre_txn_id,
        description: `${detail?.title} #(${detail?.id})`,
        amount: parseFloat(couponDetail?.final_price).toFixed(2) * 100,
        currency: "INR",
        prefill: {
          contact: getUserData()?.mobile,
        },
        method: {
          emi: false,
        },
        handler: function (response) {
          // Payment was successful
          const orderDetails = {
            txnid: paymentInitializeData?.data[0]?.pre_txn_id,
            payid: response.razorpay_payment_id,
            pay_via: 3,
          };
          let status = 1;
          paymentConfirmation(status, orderDetails);
        },
      };
      const instance = new Razorpay(options);
      instance.on("payment.failed", function (response) {
        showErrorToast("Payment failed!");
      });
      instance.open();
    } catch (error) {
      console.log("error found: ", error);
    }
  };

  const paymentConfirmation = async (status, data) => {
    try {
      setOpen(true);
      setIsProcessing(true);
      const payload = {
        course_id: (detail?.id).toString(),
        pre_txn_id: data.txnid,
        post_txn_id: data.payid,
        payment_mode: "0",
        transaction_status: status.toString(),
      };
      dispatch(fetchCompletePayment(payload));
    } catch (error) {
      setOpen(false);
      setIsProcessing(false);
      console.log("error found: ", error);
      // router.push('/')
    }
  };

  useEffect(() => {
    if (showThankyouModal) {
      setTimeout(() => {
        setOpen(false);
        router.push("/private/my-course");
      }, 3000);
    }
  }, [showThankyouModal]);

  useEffect(() => {
    if (paymentCompleteData?.responseCode == "8014") {
      setShowThankyouModal(true);
      setIsProcessing(false);
    }
  }, [paymentCompleteData]);

  const handleApplyCoupon = () => {
    if (!inputCoupon) {
      toast.error("Please, Enter the coupon code", { autoClose: 1500 });
    } else {
      const parts = checkoutId.split("-");
      const courseId = parts.pop();
      const payload = {
        course_id: courseId.toString(),
        coupon_code: inputCoupon.toString(),
      };
      dispatch(fetchVerifyCoupon(payload));
    }
  };

  useEffect(() => {
    if (verifyCouponData?.data) {
      if (verifyCouponData?.data?.coupons?.length > 0) {
        setCouponDetail(verifyCouponData?.data?.coupons[0]?.pricing);
        setCouponId(verifyCouponData?.data?.coupons[0]?.coupon_id);
      } else {
        toast.error("Coupon is not valid!", { autoClose: 1500 });
        setCouponId(0);
      }
    }
  }, [verifyCouponData]);

  const handleSelectCoupon = (data) => {
    console.log("couponSelected", data);
  };

  console.log("date", courseDetailData);

  return (
    <>
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
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <Header />
      <ThankyouModal
        closeModal={() => setOpen(false)}
        open={open}
        isProcessing={isProcessing}
      />
      <CouponModal
        closeModal={() => setViewCouponModal(false)}
        open={viewCouponModal}
        couponList={couponList}
        handleClick={handleSelectCoupon}
        inputCoupon = {inputCoupon}
        setInputCoupon = {setInputCoupon}
        handleApplyCoupon = {handleApplyCoupon}
      />
      <div className="mt-17 flex">
        <div className="flex flex-col w-full">
          {couponLoading ? (
            <Loader />
          ) : couponError ? (
            "Error"
          ) : (
            <>
              <nav className="flex items-center space-x-2 mb-4 text-sm pt-4 italic w-70/100 mx-auto">
                <button
                  onClick={handleClick}
                  className="text-[14px] text-gray-800 font-semibold cursor-pointer"
                >
                  {searchParams.get("from")}
                </button>
                <span>
                  <MdKeyboardArrowRight />
                </span>
                <span className="text-primary font-semibold text-[14px]">
                  Buy Now
                </span>
                <span>
                  <MdKeyboardArrowRight />
                </span>
              </nav>
              <div className="flex gap-4 flex-col lg:flex-row lg:w-70/100 w-90/100 mx-auto">
                <div className="lg:w-65/100 w-full">
                  <div className="bg-white border rounded-md border-gray-200 shadow-sm">
                    <h1 className="text-black font-bold text-sm p-4">Order</h1>
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-200 border border-gray-200">
                          <th className="w-70/100 text-left font-normal text-sm">
                            <span className="px-6 py-1.5 block">Product</span>
                          </th>
                          <th className="w-30/100 text-left font-normal text-sm">
                            <span className="py-1.5 block">Price</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="pt-10">
                          <td className="w-80/100">
                            <div className="px-6 py-1 flex gap-2 items-center">
                              <img
                                src={detail?.thumbnail && detail?.thumbnail}
                                alt=""
                                className="w-10 border border-gray-300 p-2 rounded-md"
                              />
                              <p className="text-sm font-bold">
                                {detail?.title}
                              </p>
                            </div>
                          </td>
                          <td className="w-20/100">
                            <div className="py-1">
                              <h4 className="text-sm font-semibold">
                                {couponDetail?.offer_price &&
                                  `₹${couponDetail?.offer_price}`}
                              </h4>
                              <del className="text-sm text-gray-500">
                                {couponDetail?.mrp && `₹${couponDetail?.mrp}`}
                              </del>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="lg:w-35/100 md: w-full flex flex-col gap-2">
                  <div className="text-center py-1.5 text-sm bg-primary border-lg rounded text-white">
                    One Time Payment
                  </div>
                  <div className="flex items-center gap-3 bg-white shadow-sm p-2 rounded-lg">
                    <input
                      type="text"
                      placeholder="Enter Coupon Here"
                      className="h-10 px-2 border border-gray-100 text-gray-800 placeholder:text-gray-600"
                      value={inputCoupon}
                      onChange={(e) => {
                        setInputCoupon(e.target.value);
                      }}
                    />
                    {couponList?.length > 1 ? (
                      <button
                        type="button"
                        className="uppercase text-sm bg-primary border rounded text-white w-full h-10 hover-bg-white hover-border-primary hover-text-primary cursor-pointer"
                        onClick={() => setViewCouponModal(true)}
                      >
                        View
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="uppercase text-sm bg-primary border rounded text-white w-full h-10 hover-bg-white hover-border-primary hover-text-primary cursor-pointer"
                        onClick={handleApplyCoupon}
                      >
                        Apply
                      </button>
                    )}
                  </div>
                  <div className="bg-white shadow-sm p-2 rounded-lg">
                    <h1 className="text-sm font-semibold">Payment Detail</h1>
                    <ul className="flex flex-col gap-2 mt-2">
                      <li className="flex justify-between text-xs text-gray-500 font-semibold">
                        <p>Total Price</p>
                        <p>
                          {couponDetail?.base_amount &&
                            `₹${couponDetail?.base_amount}`}
                        </p>
                      </li>
                      <li className="flex justify-between text-xs text-gray-500 font-semibold">
                        <p>GST</p>
                        <p>
                          {couponDetail?.gst_amount &&
                            `₹${couponDetail?.gst_amount}`}
                        </p>
                      </li>
                      <hr className="border-t-1 border border-gray-300 my-2 " />
                      <li className="flex justify-between text-xs text-gray-500 font-semibold">
                        <p>To Pay</p>
                        <p>
                          {couponDetail?.final_price &&
                            `₹${couponDetail?.final_price}`}
                        </p>
                      </li>
                      <p className="text-gray-700 text-xs">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          className="cursor-pointer"
                          onChange={(e) => setIsChecked(e.target.checked)}
                        />{" "}
                        Before making payment you agree to our{" "}
                        <a href="#" className="text-gray-800 font-semibold">
                          Term & Conditions
                        </a>
                      </p>
                      <button
                        className="flex items-center mt-4 justify-center p-2 border rounded lg bg-primary text-sm text-white hover-bg-white hover-border-primary hover-text-primary cursor-pointer"
                        onClick={handleBuyNow}
                      >
                        Proceed To Checkout <FaArrowRightLong />
                      </button>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default page;
