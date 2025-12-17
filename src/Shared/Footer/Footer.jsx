import React from 'react';
import logo from "../../assets/Group 39521.png";
import logo1 from "../../assets/Group 39522.png";
import logo2 from "../../assets/Group 39523.png";
import logo3 from "../../assets/Group 39524.png";
import logo4 from "../../assets/image.png";
import logo5 from "../../assets/phone_in_talk.png";
import logo6 from "../../assets/mail.png";
import logo7 from "../../assets/location (13) 1.png";

const Footer = () => {
    return (
        <div className="py-4 lg:py-20 px-4 lg:px-20">
            <div className="bg-gradient-to-r from-[#FFD142D9] via-[#8113B5] to-[#8113B5] text-white py-4 lg:py-12 rounded-2xl w-full px-4 lg:px-20">

                <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">


                    <div className=" flex flex-col items-center md:items-start w-full">


                        <div className="flex justify-center md:justify-start mb-4">
                            <img src={logo4} />
                        </div>


                        <div className="flex w-full justify-center md:justify-start gap-5">
                            <img src={logo} className="w-10 h-10 rounded-full" />
                            <img src={logo1} className="w-10 h-10 rounded-full" />
                            <img src={logo2} className="w-10 h-10 rounded-full" />
                            <img src={logo3} className="w-10 h-10 rounded-full" />
                        </div>
                    </div>


                    <div className="text-center md:text-left">
                        <ul className="space-y-2">
                            <li><a href="#home" className="text-lg text-[#EBEBEB]">Home</a></li>
                            <li><a href="#about-us" className="text-lg text-[#EBEBEB]">How It Works</a></li>
                            <li><a href="#services" className="text-lg text-[#EBEBEB]">Student Reviews</a></li>

                        </ul>
                    </div>


                    <div className="text-center md:text-left">
                        <ul className="space-y-2">
                            <li><a href="#faq" className="text-lg text-[#EBEBEB]">FAQ</a></li>
                            <li><a href="#contact" className="text-lg text-[#EBEBEB]">Contact</a></li>
                            <li><a href="#privacy-policy" className="text-lg text-[#EBEBEB]">Privacy Policy</a></li>
                            <li><a href="#terms-of-service" className="text-lg text-[#EBEBEB]">Terms of Service</a></li>

                        </ul>
                    </div>


                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h3 className="text-2xl text-[#FFFFFF] font-normal mb-3">Contact Us</h3>
                        <ul className="space-y-3">

                            <li className="flex items-center gap-2  text-lg text-[#EBEBEB]">
                                <img src={logo5} className="w-5 h-5 text-[#EBEBEB]" />
                                +123 456 789
                            </li>

                            <li className="flex items-center gap-2  text-lg text-[#EBEBEB]">
                                <img src={logo6} className="w-5 h-5" />
                                help@financial.com
                            </li>

                            <li className="flex items-center gap-2  text-lg text-[#EBEBEB]">
                                <img src={logo7} className="w-5 h-8" />
                                10 3rd Avenue,<br></br> Houghton Estate
                            </li>

                        </ul>
                    </div>


                </div>
                <div className="w-full h-px bg-white/30 mt-2"></div>

                <div className="text-center text-sm mt-3">

                    <p>© 2025 | FINANCIAL. All Rights Reserved</p>
                </div>

            </div>
        </div>
    );
};

export default Footer;
