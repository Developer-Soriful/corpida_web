import logo from "../../assets/searce.png";
import logo4 from "../../assets/Frame4.png";
import logo6 from "../../assets/Frame6.png";

const Porfiraworks = () => {
    return (
        <section id="work" className="mt-14 px-4 lg:px-20">

            <h2 className="text-3xl font-semibold text-center text-[#8113B5]">
                How Porfira works
            </h2>

            <p className="mt-2 text-center bg-gradient-to-r from-[#903CD1] to-[#6657E2] text-transparent bg-clip-text">
                Learn with confidence in three simple steps
            </p>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-10">


                <div className="bg-white border border-[#EDEDED] rounded-xl p-5
                hover:shadow-md transition
                flex flex-col items-center text-center gap-3">

                    <div className="w-11 h-11 flex items-center justify-center rounded-lg bg-[#F3F8F4]">
                        <img src={logo} alt="" className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-semibold bg-gradient-to-r from-[#903CD1] to-[#6657E2] text-transparent bg-clip-text">
                        Find Your Tutor
                    </h3>

                    <p className="text-sm text-[#7A7A7A] font-medium">
                        Search tutors by language, subject, price and budget.
                    </p>
                </div>


                <div className="bg-white border border-[#EDEDED] rounded-xl p-5
                hover:shadow-md transition
                flex flex-col items-center text-center gap-3">

                    <div className="w-11 h-11 flex items-center justify-center rounded-lg bg-[#F3F8F4]">
                        <img src={logo4} alt="" className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-semibold bg-gradient-to-r from-[#903CD1] to-[#6657E2] text-transparent bg-clip-text">
                        Book Your Lessons
                    </h3>

                    <p className="text-sm text-[#7A7A7A] font-medium">
                        Schedule lessons at times that work for you. Pay securely online with flexible options.
                    </p>
                </div>

                <div className="bg-white border border-[#EDEDED] rounded-xl p-5
                hover:shadow-md transition
                flex flex-col items-center text-center gap-3">

                    <div className="w-11 h-11 flex items-center justify-center rounded-lg bg-[#F3F8F4]">
                        <img src={logo6} alt="" className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-semibold bg-gradient-to-r from-[#903CD1] to-[#6657E2] text-transparent bg-clip-text">
                        Start Learning
                    </h3>

                    <p className="text-sm text-[#7A7A7A] font-medium">
                        Track your learning journey and enjoy the progress
                    </p>
                </div>


            </div>
        </section>
    );
};

export default Porfiraworks;