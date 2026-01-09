'use client';

import React, { useState } from "react";

const Faq = ({ faqList }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <h2 className="text-xl font-[600] my-6">Faq's</h2>
      <div className="w-full flex justify-center mt-10">
        <div className="w-full max-w-4xl bg-white border border-[#f5e8de] rounded-md shadow-sm">

            {faqList?.map((faq, i) => {
            const isOpen = openIndex === i;

            return (
                <div
                key={i}
                className="border-b border-[#f5e8de] last:border-none"
                >
                {/* HEADER */}
                <button
                    onClick={() => toggleAccordion(i)}
                    className="w-full flex justify-between items-center py-5 px-6 text-base font-semibold text-gray-900"
                    style={{background: '#fffaf8'}}
                >
                    {faq?.question}

                    <svg
                    className={`w-5 h-5 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* BODY */}
                <div
                    className={`overflow-hidden transition-all duration-100 ${
                    isOpen ? "max-h-[400px] py-4 px-6" : "max-h-0"
                    }`}
                >
                    <p className="text-sm text-gray-700 leading-relaxed">
                    {faq?.answer}
                    </p>
                </div>
                </div>
            );
            })}

        </div>
      </div>
    </>
  );
};

export default Faq;
