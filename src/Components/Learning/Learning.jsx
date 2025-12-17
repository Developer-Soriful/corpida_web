import React from "react";
import { Link } from "react-router";

const Learning = () => {
  return (
    <section className="w-full bg-[#E3E6F0]  px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 mt-20">
      <div className=" text-center">

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#8113B5]">
          Ready to start learning?
        </h2>

        <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
          Join thousands of students and tutors on our platform today. Find the
          perfect tutor and take your learning to the next level.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">

          <Link to="/signup" className="w-full sm:w-auto">
            <button
              className="w-full sm:w-auto px-6  py-3 rounded-full
              font-medium text-white cursor-pointer
              bg-linear-to-r from-[#FFC30B] via-[#8113B5] to-[#8113B5]
              shadow-md">
              Sign Up Now
            </button>
          </Link>

          <Link to="/dashboard/findtutors" className="w-full sm:w-auto">
            <button
              className="w-full sm:w-auto px-6 py-3 rounded-full
              font-medium text-white cursor-pointer
              bg-linear-to-r from-[#6657E2] via-[#8113B5] to-[#903CD1]
              shadow-md">
              Browse Tutors
            </button>
          </Link>

        </div>
      </div>
    </section>
  );
};

export default Learning;