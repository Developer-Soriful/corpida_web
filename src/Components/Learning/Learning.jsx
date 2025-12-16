import React from 'react';
import { Link } from 'react-router';

const Learning = () => {
  return (
    <div className="w-full  bg-[#E3E6F0] py-20 mt-20 text-center ">

      <h2 className="text-3xl font-semibold text-[#8113B5]">
        Ready to start learning?
      </h2>

      <p className="text-gray-600 mt-4 max-w-xl mx-auto">
        Join thousands of students and tutors on our platform today. Find the
        perfect tutor and take your learning to the next level.
      </p>

      <div className="flex items-center justify-center gap-4 mt-8">
        <Link to='/selectrole'>
          <button
            className="px-8 py-3 rounded-full font-medium text-white 
      bg-gradient-to-r from-[#FFC30B] via-[#8113B5]  to-[#8113B5] 
      shadow-md ">
            Sign Up Now
          </button>
        </Link>
        <button
          className="px-8 py-3 rounded-full font-medium text-white 
      bg-gradient-to-r from-[#6657E2] via-[#8113B5]  to-[#903CD1] 
      shadow-md">
          Browse Tutors
        </button>

      </div>
    </div>

  );
};

export default Learning;