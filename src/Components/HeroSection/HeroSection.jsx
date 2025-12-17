import logo from '../../assets/Online learning-amico.png'
import logo1 from '../../assets/Frame.png'
const HeroSection = () => {
    return (
        <section className="mt-10 px-4 lg:px-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

                <div>
                    <p className="flex items-center bg-[#00000014] text-purple-600  text-sm mb-2 rounded-md w-full max-w-sm">
                        <img src={logo1} alt="Logo" className="mr-2 w-4 h-4" />
                        Now offering live courses & private tutoring
                    </p>



                    <h1 className="text-6xl font-bold text-[#8113B5] leading-snug mb-4">
                        Because knowledge <br /> is power!
                    </h1>

                    <p className="text-gray-600 mb-6 max-w-md">
                        Connect with expert tutors for personalized learning experiences.
                        Improve your skills, boost your grades, and achieve your academic goals.
                    </p>

                    <div className="flex space-x-4">
                        <button className="bg-gradient-to-r from-[#FFC30B] via-[#8c22be] to-[#8113B5]  text-[#ffffff]  px-6 py-3 rounded-xl transition">
                            Get Started Free
                        </button>


                        <button className="bg-gradient-to-r from-[#6657E2] via-[#8113B5]  to-[#903CD1] text-[#ffffff]  px-8 py- rounded-xl transition">
                            Find Tutors
                        </button>
                    </div>

                    <div className="flex gap-4 lg:gap-20 mt-10 
                bg-gradient-to-r from-[#6657E2]  to-[#903CD1] 
                justify-between items-center py-4 px-4 rounded-xl shadow-lg w-full md:w-fit ">

                        <div className="text-center">
                            <h3 className="text-xl  text-white">500+</h3>
                            <p className="text-white text-sm opacity-90">Expert Tutors</p>
                        </div>



                        <div className="text-center">
                            <h3 className="text2xl  text-white">10k+</h3>
                            <p className="text-white text-sm opacity-90">Students</p>
                        </div>


                        <div className="text-center">
                            <h3 className="text-xl  text-white">4.5 ⭐</h3>
                            <p className="text-white text-sm opacity-90">Rating</p>
                        </div>

                    </div>

                </div>
                <div className="flex justify-center">
                    <img
                        src={logo}
                        alt="Hero Illustration"
                        className="w-[90%] md:w-[85%]"
                    />
                </div>

            </div>
        </section>
    );
};

export default HeroSection;
