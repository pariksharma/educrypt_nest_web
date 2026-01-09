import React from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Loader } from '../loader/loader';

const ThankyouModal = ({ open, closeModal, isProcessing }) => {
  return (
    <Dialog open={open} onClose={closeModal} className="relative z-[9999]">
        <DialogBackdrop className="fixed inset-0 bg-black/50" />
            <div className="fixed inset-0 flex items-center justify-center">
                <DialogPanel className=" max-w-sm rounded-lg bg-white shadow-xl py-8 w-100">
                    {isProcessing
                    ?
                        <Loader />
                    :
                        <div className='flex flex-col items-center'>
                            <img src='/images/Success.svg' alt='' className='w-20 mb-5' />
                            <h4 className="m-0 font-semibold">Thank You!</h4>
                            <p className="m-0 font-semibold">Your payment is successful!</p>
                        </div>
                    }
                </DialogPanel>
            </div>
    </Dialog>
  )
}

export default ThankyouModal