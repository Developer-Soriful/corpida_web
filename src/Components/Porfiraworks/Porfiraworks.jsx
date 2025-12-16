import React from 'react';
import logo from  "../../assets/searce.png"
import logo4 from "../../assets/Frame4.png"
import logo6 from "../../assets/Frame6.png"
const Porfiraworks = () => {
    return (
      <section className="mt-20 text-center">
    <h2 className="text-3xl font-semibold text-[#8113B5]">How Porfira works</h2>
    <p className="mt-2 bg-gradient-to-r from-[#903CD1] to-[#6657E2] text-transparent bg-clip-text">
    Learn with confidence in three simple steps
</p>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 px-20 place-items-center ">
    <div className="bg-white p-6 rounded-2xl border border-[#EDEDED] shadow-sm items-center text-center
                     hover:shadow-md transition
                    w-[450px] h-[250.54px] flex flex-col">
        
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#F3F8F4]">
            <img src={logo} alt="" className="w-6 h-6" />
        </div>

        <h3 className="text-2xl font-semibold mt-4 bg-gradient-to-r from-[#903CD1] to-[#6657E2] text-transparent bg-clip-text">Find Your Tutor</h3>

        <p className="text-[#9CA3AF] text-1xl mt-2 leading-relaxed font-semibold">
           Search for tutors based on the language,<br></br> prices, subject, and your budget.
        </p>

    </div>
    <div className="bg-white p-6 rounded-2xl border border-[#EDEDED] shadow-sm items-center text-center
                     hover:shadow-md transition
                    w-[450px] h-[250.54px] flex flex-col">
        
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#F3F8F4]">
            <img src={logo4} alt="" className="w-6 h-6" />
        </div>

        <h3 className="text-2xl font-semibold mt-4 bg-gradient-to-r from-[#903CD1] to-[#6657E2] text-transparent bg-clip-text">Book Your Lessons</h3>

        <p className="text-[#9CA3AF] text-[15px] mt-2 leading-relaxed font-semibold">
           Schedule lessons at times that work for you.<br></br> Pay securely online with flexible options.
        </p>

    </div>


    <div className="bg-white p-6 rounded-2xl border border-[#EDEDED] shadow-sm items-center text-center
                     hover:shadow-md transition
                     w-[450px] h-[250.54px] flex flex-col">
        
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#F3F8F4]">
            <img src={logo6} alt="" className="w-6 h-6" />
        </div>

        <h3 className="text-2xl font-semibold mt-4 bg-gradient-to-r from-[#903CD1] to-[#6657E2] text-transparent bg-clip-text">Start Learning</h3>

        <p className="text-[#9CA3AF] text-[15px] mt-2 leading-relaxed font-semibold">
          Track your learning journey and enjoy the <br></br> progress
        </p>

    </div>

    
</div>

</section>


    );
};

export default Porfiraworks;