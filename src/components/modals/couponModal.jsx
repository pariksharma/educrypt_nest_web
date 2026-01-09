import React from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { IoIosClose } from 'react-icons/io';

const CouponModal = ({open, closeModal, couponList, handleClick, inputCoupon, setInputCoupon, handleApplyCoupon}) => {
  return (
    <Dialog open={open} onClose={closeModal} className="relative z-[9999]">
        <DialogBackdrop className="fixed inset-0 bg-black/50" />
            <div className="fixed inset-0 flex items-center justify-center">
                <DialogPanel className=" max-w-sm rounded-lg bg-white shadow-xl py-4 w-100">
                    <div className='flex relative px-2 items-center shadow pb-3'>
                        <p className='text-md font-semibold'>Apply Coupon</p>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="absolute z-20 right-1 text-gray-500 hover:text-gray-800"
                        >
                            <IoIosClose className="w-10 h-10" />
                        </button>
                    </div>
                    <div className="flex items-center gap-3 bg-white shadow-sm p-2 rounded-lg">
                        <input
                        type="text"
                        placeholder="Enter Coupon Here"
                        className="h-10 px-2 border border-gray-100 text-gray-800 placeholder:text-gray-600"
                          value={inputCoupon}
                          onChange={(e) => {
                            setInputCoupon(e.target.value)
                          }}
                        />
                        <button
                            type="button"
                            className="uppercase text-sm bg-primary border rounded text-white w-full h-10 hover-bg-white hover-border-primary hover-text-primary cursor-pointer"
                            onClick={() => {
                                handleApplyCoupon();
                                closeModal();
                            }}
                        >
                            Apply
                        </button>
                    </div>
                    <div className='flex flex-col'>
                        {couponList?.map((coupon, index) => {

                        })}
                    </div>
                </DialogPanel>
            </div>
    </Dialog>
  )
}

export default CouponModal