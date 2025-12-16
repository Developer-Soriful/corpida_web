import React from 'react';
import { Link } from 'react-router';

const Tutorinformation = () => {
  return (
    <div className="w-full min-h-screen  flex items-center justify-center py-12">
      <div className="bg-white w-[750px] px-12 py-10 rounded-xl shadow-sm">

        <div className="w-full mb-8">

          <div className="flex justify-between items-start gap-5">


            <div className="flex flex-col items-start w-1/3">
              <div className="w-full h-[3px] bg-[#6657E2] mb-2 rounded-full"></div>
              <span className="text-[#6657E2] text-md ">Step 1</span>
              <span className="text-[#6657E2] text-1xl font-semibold">Personal Information</span>
            </div>


            <div className="flex flex-col items-start w-1/3">
              <div className="w-full h-[3px] bg-[#585858] mb-2"></div>
              <span className="text-[#585858]">Step 2</span>
              <span className="text-[#585858] text-1xl font-semibold">Qualifications</span>
            </div>


            <div className="flex flex-col items-start w-1/3">
              <div className="w-full h-[3px] bg-[#585858] mb-2"></div>
              <span className="text-[#585858]">Step 3</span>
              <span className="text-[#585858] ttext-1xl font-semibold">Set price and Verification</span>
            </div>

          </div>

        </div>



        <h1 className="text-2xl font-semibold bg-gradient-to-r from-[#614EFE] to-[#7D359F] bg-clip-text text-transparent">
          Personal Information
        </h1>
        <p className="text-gray-600 mt-1 text-sm">
          Please provide your basic personal information to begin the verification process.
        </p>


        <div className="mt-6">
          <label className="text-1xl font-semibold bg-gradient-to-r from-[#614EFE] to-[#7D359F] bg-clip-text text-transparent">Profile Picture*</label>

          <div className="border-2 border-dashed border-gray-300 rounded-lg h-40 mt-2
                          flex items-center justify-center text-gray-500 text-md">
            Upload a file  or drag and drop
          </div>

          <p className="text-[#101010] text-sm mt-1">
            Upload a clear, professional photo of yourself. This will be used for identification purposes.
          </p>
        </div>


        <div className="mt-6">
          <label className="text-1xl font-semibold bg-gradient-to-r from-[#614EFE] to-[#7D359F] bg-clip-text text-transparent">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Username or Name"
            className="w-full border border-gray-300 rounded-lg p-3 mt-1 text-sm focus:ring-purple-400 focus:border-purple-400"
          />
        </div>

        <div className="mt-6">
          <label className="text-1xl font-semibold bg-gradient-to-r from-[#614EFE] to-[#7D359F] bg-clip-text text-transparent">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Username or Phone"
            className="w-full border border-gray-300 rounded-lg p-3 mt-1 text-sm focus:ring-purple-400 focus:border-purple-400"
          />
        </div>


        <div className="mt-6">
          <label className="text-1xl font-semibold bg-gradient-to-r from-[#614EFE] to-[#7D359F] bg-clip-text text-transparent">Bio</label>
          <textarea
            placeholder="Upload a file  or drag and drop"
            className="w-full border border-gray-300 rounded-lg p-3 mt-2 h-24 text-sm focus:ring-purple-400 focus:border-purple-400"
          ></textarea>
        </div>

        <div className="flex justify-end mt-8">
          <Link to="/toutorstap2">
            <button
              className="bg-gradient-to-r from-[#6657E2] via-[#8113B5] to-[#903CD1] text-[#FFFFFF] px-4 py-2 rounded-2xl"
            >
              Next Step
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Tutorinformation;