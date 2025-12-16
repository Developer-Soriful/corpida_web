import React from 'react';
import { Link, useNavigate } from 'react-router';

const Toutorstap2 = () => {
    const navigate = useNavigate();
    return (
       <div className="w-full bg-white rounded-xl shadow-md p-8 max-w-3xl mx-auto mt-10">


     <div className="w-full mb-8">

  <div className="flex justify-between items-start gap-5">

   
    <div className="flex flex-col items-start w-1/3">
      <div className="w-full h-[3px] bg-[#585858] mb-2l"></div>
      <span className="text-[#585858] text-md ">Step 1</span>
      <span className="text-[#585858] text-1xl font-semibold">Personal Information</span>
    </div>


    <div className="flex flex-col items-start w-1/3">
      <div className="w-full h-[3px] bg-[#6657E2] mb-2 rounded-full"></div>
      <span className="text-[#6657E2]">Step 2</span>
      <span className="text-[#6657E2] text-1xl font-semibold">Qualifications</span>
    </div>

    
    <div className="flex flex-col items-start w-1/3">
      <div className="w-full h-[3px] bg-[#585858] mb-2"></div>
      <span className="text-[#585858]">Step 3</span>
      <span className="text-[#585858] ttext-1xl font-semibold">Set price and Verification</span>
    </div>

  </div>

</div>


  <div>
    <label className="text-1xl font-semibold bg-gradient-to-r from-[#614EFE] to-[#7D359F] bg-clip-text text-transparent">
      Years of Teaching Experience<span className="text-red-500">*</span>
    </label>

    <div className="mt-2 border rounded-lg px-4 py-3 flex justify-between items-center">
      <span className="text-gray-500">Select years</span>
      <span>⌄</span>
    </div>
  </div>


  <div className="mt-6">
    <label className="text-1xl font-semibold bg-gradient-to-r from-[#614EFE] to-[#7D359F] bg-clip-text text-transparent">
      Subjects Taught<span className="text-red-500">*</span>
    </label>

    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 mt-4 text-sm text-gray-700">
  {[
    "English", "Science", "Geography", "Biology", "Music", "Social Studies",
    "Mathematics", "History", "Chemistry", "Art", "Foreign Languages", "Business Studies",
    "Physics", "Computer Science", "Physical Education", "Economics", "Special Education", "Religious Studies"
  ].map((sub, index) => (
    <label
      key={index}
      className="flex items-center gap-2 text-[#101010]  cursor-pointer"
    >
      <input
        type="checkbox"
        className="w-4 h-4 accent-[#6657E2] cursor-pointer"
      />
      {sub}
    </label>
  ))}
</div>

  </div>

 
  <div className="flex justify-between mt-8">
     <button
      onClick={() => navigate(-1)}
      className="px-6 py-2 rounded-md bg-gradient-to-r from-[#FFC30B] via-[#903CD1] to-[#8113B5] text-white"
    >
      Previous
    </button>
    <Link to="/stepthree">
    <button className="px-6 py-2 rounded-md bg-gradient-to-r from-[#614EFE] to-[#7D359F] text-white">
      Next Step
    </button>
     </Link>
  </div>
</div>

    );
};

export default Toutorstap2;