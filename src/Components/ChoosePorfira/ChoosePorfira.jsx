import logo from "../../assets/Frame1.png"
import logo2 from "../../assets/Frame2.png"
import logo3 from "../../assets/Frame3.png"
import logo4 from "../../assets/Frame4.png"
import logo5 from "../../assets/Frame5.png"
import logo6 from "../../assets/Frame6.png"
const ChoosePorfira = () => {
    return (
        <section className="mt-20 text-center">
            <h2 className="text-3xl font-semibold text-[#8113B5]">Why Choose Porfira</h2>
            <p className="mt-2 bg-gradient-to-r from-[#903CD1] to-[#6657E2] text-transparent bg-clip-text">
                Our platform offers everything you need for a seamless and effective<br />
                learning experience.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 px-4 lg:px-20 place-items-center">

                <div className="bg-white p-6 rounded-2xl border border-[#EDEDED] shadow-sm 
                    text-left hover:shadow-md transition
                    w-full h-full flex flex-col">

                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#F3F8F4]">
                        <img src={logo} alt="" className="w-6 h-6" />
                    </div>

                    <h3 className="text-2xl font-semibold mt-4 bg-gradient-to-r from-[#903CD1] to-[#6657E2] text-transparent bg-clip-text">
                        Expert Tutors
                    </h3>


                    <p className="text-[#7A7A7A] text-1xl mt-2 leading-relaxed font-semibold">
                        Connect with qualified tutors who <br></br> are experts in their fields. All <br></br> tutors are
                        verified and rated by <br></br> students.
                    </p>

                </div>
                <div className="bg-white p-6 rounded-2xl border border-[#EDEDED] shadow-sm 
                    text-left hover:shadow-md transition
                    w-full h-full flex flex-col">

                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#F3F8F4]">
                        <img src={logo2} alt="" className="w-6 h-6" />
                    </div>

                    <h3 className="text-2xl font-semibold mt-4 bg-gradient-to-r from-[#903CD1] to-[#6657E2] text-transparent bg-clip-text">Flexible Scheduling</h3>

                    <p className="text-[#7A7A7A] text-[15px] mt-2 leading-relaxed font-semibold">
                        Book lessons at times that work <br></br>for you. Our platform makes it<br></br>easy to find tutors available when<br></br>you need them.
                    </p>

                </div>
                <div className="bg-white p-6 rounded-2xl border border-[#EDEDED] shadow-sm 
                    text-left hover:shadow-md transition
                     w-full h-full flex flex-col">

                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#F3F8F4]">
                        <img src={logo3} alt="" className="w-6 h-6" />
                    </div>

                    <h3 className="text-2xl font-semibold mt-4 bg-gradient-to-r from-[#903CD1] to-[#6657E2] text-transparent bg-clip-text">Personalized Learning</h3>

                    <p className="text-[#7A7A7A] text-[15px] mt-2 leading-relaxed font-semibold">
                        Get customized lessons tailored <br></br>to your specific needs, learning<br></br>style, and pace.
                    </p>

                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#EDEDED] shadow-sm 
                    text-left hover:shadow-md transition
                    w-full h-full flex flex-col">

                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#F3F8F4]">
                        <img src={logo4} alt="" className="w-6 h-6" />
                    </div>

                    <h3 className="ttext-2xl font-semibold mt-4 bg-gradient-to-r from-[#903CD1] to-[#6657E2] text-transparent bg-clip-text">Secure Payments</h3>

                    <p className="text-[#7A7A7A] text-[15px] mt-2 leading-relaxed font-semibold">
                        Pay securely for lessons with our<br></br>integrated payment system. No<br></br> cash needed, and all transactions<br></br>are protected..
                    </p>

                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#EDEDED] shadow-sm 
                    text-left hover:shadow-md transition
                     w-full h-full flex flex-col">

                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#F3F8F4]">
                        <img src={logo5} alt="" className="w-6 h-6" />
                    </div>

                    <h3 className="text-2xl font-semibold mt-4 bg-gradient-to-r from-[#903CD1] to-[#6657E2] text-transparent bg-clip-text">Verified Profiles</h3>

                    <p className="text-[#7A7A7A] text-[15px] mt-2 leading-relaxed font-semibold">
                        All tutors undergo background<br></br>checks and verification to ensure<br></br>quality and safety.
                    </p>

                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#EDEDED] shadow-sm 
                    text-left hover:shadow-md transition
                     w-full h-full flex flex-col">

                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#F3F8F4]">
                        <img src={logo6} alt="" className="w-6 h-6" />
                    </div>

                    <h3 className="text-2xl font-semibold mt-4 bg-gradient-to-r from-[#903CD1] to-[#6657E2] text-transparent bg-clip-text">HD Video Lessons</h3>

                    <p className="text-[#7A7A7A] text-[15px] mt-2 leading-relaxed font-semibold">
                        Crystal clear video calls with<br></br>screen sharing, whiteboard, and<br></br>recording features.
                    </p>

                </div>

            </div>

        </section>


    );
};

export default ChoosePorfira;