import React from 'react';
import logo from "../../assets/Avatar Image.png";
import logo1 from "../../assets/Avatar Image (1).png";
import logo2 from "../../assets/Avatar Image (2).png";
import logo3 from "../../assets/Avatar Image (3).png";
import logo4 from "../../assets/Avatar Image (4).png";
import logo5 from "../../assets/Avatar Image (5).png";


const Testimonials = () => {
  return (
    <div className="mt-20 px-20">

     
      <h2 className="text-3xl font-semibold text-center 
        bg-gradient-to-r from-[#903CD1] to-[#903CD1] text-transparent bg-clip-text">
        Students Testimonials
      </h2>

     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 place-items-center">
    <div className="w-[470px] h-[185px] 
        bg-gradient-to-br from-[#6657E2] to-[#903CD1]
        p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between">
        <p className="text-sm leading-relaxed opacity-90">
            "I ordered online and my drink was ready <br />
            within minutes. Super smooth experience <br />
            and delicious every time!"
        </p>

        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <img src={logo} className="w-10 h-10 rounded-full" />
                <div>
                    <h4 className="text-xl font-semibold">Courtney Henry</h4>
                    <p className="text-xs opacity-80">CA, Canada</p>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <span className="text-sm">⭐</span>
                <span className="text-sm">4.5</span>
            </div>
        </div>
    </div>

    <div className="w-[470px] h-[185px] -mt-12
        bg-gradient-to-br from-[#6657E2] to-[#903CD1]
        p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between">

        <p className="text-sm leading-relaxed opacity-90">
            "I ordered online and my drink was ready <br />
            within minutes. Super smooth experience <br />
            and delicious every time!"
        </p>

        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <img src={logo1} className="w-10 h-10 rounded-full" />
                <div>
                    <h4 className="text-xl font-semibold">Eleanor Pena</h4>
                    <p className="text-xs opacity-80">CA, Canada</p>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <span className="text-sm">⭐</span>
                <span className="text-sm">4.5</span>
            </div>
        </div>
    </div>

   
    <div className="w-[470px] h-[185px] 
        bg-gradient-to-br from-[#6657E2] to-[#903CD1]
        p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between">
        <p className="text-sm leading-relaxed opacity-90">
            "I ordered online and my drink was ready <br />
            within minutes. Super smooth experience <br />
            and delicious every time!"
        </p>

        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <img src={logo2} className="w-10 h-10 rounded-full" />
                <div>
                    <h4 className=" text-xl font-semibold">Robert Fox</h4>
                    <p className="text-xs opacity-80">CA, Canada</p>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <span className="text-sm">⭐</span>
                <span className="text-sm">4.5</span>
            </div>
        </div>
    </div>

   
    <div className="w-[470px] h-[185px] 
        bg-gradient-to-br from-[#6657E2] to-[#903CD1]
        p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between">
        <p className="text-sm leading-relaxed opacity-90">
            "I ordered online and my drink was ready <br />
            within minutes. Super smooth experience <br />
            and delicious every time!"
        </p>

        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <img src={logo3} className="w-10 h-10 rounded-full" />
                <div>
                    <h4 className="text-xl font-semibold">Dianne Russell</h4>
                    <p className="text-xs opacity-80">CA, Canada</p>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <span className="text-sm">⭐</span>
                <span className="text-sm">4.5</span>
            </div>
        </div>
    </div>

  
    <div className="w-[470px] h-[185px] -mt-12
        bg-gradient-to-br from-[#6657E2] to-[#903CD1]
        p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between">
        <p className="text-sm leading-relaxed opacity-90">
            "I ordered online and my drink was ready <br />
            within minutes. Super smooth experience <br />
            and delicious every time!"
        </p>

        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <img src={logo4} className="w-10 h-10 rounded-full" />
                <div>
                    <h4 className="text-xl font-semibold">Albert Flores</h4>
                    <p className="text-xs opacity-80">CA, Canada</p>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <span className="text-sm">⭐</span>
                <span className="text-sm">4.5</span>
            </div>
        </div>
    </div>


    <div className="w-[470px] h-[185px] 
        bg-gradient-to-br from-[#6657E2] to-[#903CD1]
        p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between">

        <p className="text-sm leading-relaxed opacity-90">
            "I ordered online and my drink was ready <br />
            within minutes. Super smooth experience <br />
            and delicious every time!"
        </p>

        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <img src={logo5} className="w-10 h-10 rounded-full" />
                <div>
                    <h4 className="text-xl font-semibold">Wade Warren</h4>
                    <p className="text-xs opacity-80">CA, Canada</p>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <span className="text-sm">⭐</span>
                <span className="text-sm">4.5</span>
            </div>
        </div>
    </div>

</div>

    </div>
  );
};

export default Testimonials;
