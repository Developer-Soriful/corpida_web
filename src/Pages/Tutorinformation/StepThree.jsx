import React from "react";
import { Link, useNavigate } from "react-router";
import logo from '../../assets/frame (2).png'
import logo1 from '../../assets/Simplification.png'
const StepThree = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full min-h-screen flex items-center justify-center py-15 bg-[#F3F7F4]">
            <div className="bg-white w-[700px] px-12 py-10 rounded-2xl shadow-sm">


                <div className="w-full mb-8">

                    <div className="flex justify-between items-start gap-5">


                        <div className="flex flex-col items-start w-1/3">
                            <div className="w-full h-[3px] bg-[#585858] mb-2l"></div>
                            <span className="text-[#585858] text-md ">Step 1</span>
                            <span className="text-[#585858] text-1xl font-semibold">Personal Information</span>
                        </div>


                        <div className="flex flex-col items-start w-1/3">
                            <div className="w-full h-[3px] bg-[#585858] mb-2l"></div>
                            <span className="text-[#585858]">Step 2</span>
                            <span className="text-[#585858] text-1xl font-semibold">Qualifications</span>
                        </div>


                        <div className="flex flex-col items-start w-1/3">
                            <div className="w-full h-[3px] bg-[#6657E2] mb-2 rounded-full"></div>
                            <span className="text-[#6657E2]">Step 3</span>
                            <span className="text-[#6657E2] ttext-1xl font-semibold">Set price and Verification</span>
                        </div>

                    </div>

                </div>

                
                <label className="text-[#6657E2] text-1xl font-semibold">Hourly Rate</label>
                <div className="flex items-center border rounded-lg p-3 mt-2 text-gray-600">
                    <span className="mr-2">$</span>
                    <input
                        type="number"
                        placeholder="50"
                        className="w-full outline-none"
                    />
                </div>

              
                <div className="mt-6">
                    <label className="text-[#6657E2] text-1xl font-semibold">Available time</label>
                    <input
                        type="text"
                        placeholder="06:00am to 09:00pm"
                        className="w-full border rounded-lg p-3 mt-2 text-gray-700"
                    />
                </div>

             
                <div className="mt-6">
                    <label className="text-[#6657E2] text-1xl font-semibold">Available date</label>
                    <input
                        type="text"
                        placeholder="Sunday to Monday"
                        className="w-full border rounded-lg p-3 mt-2 text-gray-700"
                    />
                </div>

               
                <p className="text-[#6657E2]  font-semibold mt-6">Add subject Intro video</p>
                <img
                    src={logo}
                    alt="Intro"
                    className="rounded-2xl w-40  h-40 mt-2 object-cover"
                />

               
                <h2 className="text-[#6657E2] font-semibold text-1xl mt-8">
                    Verification Documents
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                    Please provide details about your educational background and qualifications.
                </p>

               
                <label className="text-[#6657E2] text-1xl font-semibold">Government-issued ID*</label>
                <p className="text-gray-500 text-sm">
                    Upload a clear, professional photo of yourself. This will be used for identification purposes.
                </p>

                <div className="grid grid-cols-2 gap-4 mt-4">

                   
                    <div className="flex flex-col items-center">
                        <div className="border-2 border-dashed rounded-xl h-36 w-full flex items-center justify-center text-gray-500">
                            <img src={logo1} alt="" className="w-8 h-8" />
                        </div>
                        <p className="text-md mt-2 text-[#4D4D4D]">ID Card Front</p>
                    </div>

                
                    <div className="flex flex-col items-center">
                        <div className="border-2 border-dashed rounded-xl h-36 w-full flex items-center justify-center text-gray-500">
                            <img src={logo1} alt="" className="w-8 h-8" />
                        </div>
                        <p className="text-md mt-2 text-[#4D4D4D]">ID Card Back</p>
                    </div>

                </div>


         
                <div className="flex justify-between mt-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 rounded-md bg-gradient-to-r from-[#FFC30B] via-[#903CD1] to-[#8113B5] text-white"
                    >
                        Previous
                    </button>
                    <Link to='/toturdashbord'>
                    <button className="px-6 py-2 rounded-md bg-gradient-to-r from-[#614EFE] to-[#7D359F] text-white">
                        Next Step
                    </button>
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default StepThree;
