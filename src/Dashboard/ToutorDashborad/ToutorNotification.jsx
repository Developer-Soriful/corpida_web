import React from "react";
import { FiBell } from "react-icons/fi";

const ToutorNotification = () => {
    return (
        <div className="w-full min-h-screen bg-[#FFFFFF] p-8 rounded-2xl">

            <h2 className="text-[22px] font-semibold bg-gradient-to-r from-[#6657E2] via-[#903CD1] to-[#7e0dd4] text-transparent bg-clip-text mb-5">
                Notification
            </h2>

            <div className="w-full h-px bg-[#C0C0C0] mt-2"></div>
            <div className="space-y-4 mt-5">

               
                <div className="bg-white  rounded p-4 flex gap-4 items-start 
                     shadow-[0px_2px_8px_rgba(0,0,0,0.06)]">

                    <div className="w-7 h-7 flex items-center justify-center rounded-md bg-[#F8F4FF]">
                        <FiBell className="text-[#9B72E9] text-[20px]" />
                    </div>

                    <div>
                        <h3 className="font-semibold text-[#1F1D1D] text-[15px]">Lesson Confirmed</h3>
                        <p className="text-[#606060] text-[13px]">
                            Your lesson with Sarah Johnson has been confirmed for Jan 28
                        </p>
                        <p className="text-[#606060] text-[12px] mt-1">Fri, 12:30pm</p>
                    </div>
                </div>

                <div className="bg-white  rounded p-4 flex gap-4 items-start shadow-[0px_2px_8px_rgba(0,0,0,0.06)]">
                    <div className="w-7 h-7 flex items-center justify-center rounded-md bg-[#F8F4FF]">
                        <FiBell className="text-[#9B72E9] text-[20px]" />
                    </div>

                    <div>
                        <h3 className="font-semibold text-[#1F1D1D] text-[15px]">Payment Successful</h3>
                        <p className="text-[#606060] text-[13px]">
                            Payment of $50 processed successfully
                        </p>
                        <p className="text-[#606060] text-[12px] mt-1">1 Day ago</p>
                    </div>
                </div>

                <div className="bg-white  rounded p-4 flex gap-4 items-start shadow-[0px_2px_8px_rgba(0,0,0,0.06)]">
                    <div className="w-7 h-7 flex items-center justify-center rounded-md bg-[#F8F4FF]">
                        <FiBell className="text-[#9B72E9] text-[20px]" />
                    </div>

                    <div>
                        <h3 className="font-semibold text-[#1F1D1D] text-[15px]">Rate Your Tutor</h3>
                        <p className="text-[#606060] text-[13px]">
                            Please rate your recent lesson with John Smith
                        </p>
                        <p className="text-[#606060] text-[12px] mt-1">Fri, 12:30pm</p>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default ToutorNotification;
