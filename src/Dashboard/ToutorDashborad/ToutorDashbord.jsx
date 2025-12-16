import { Link, NavLink, Outlet, useLocation } from "react-router";
import { FiHome, FiBookOpen, FiCreditCard, FiMessageCircle, FiUser, FiHelpCircle, FiLogOut } from "react-icons/fi";

import logo from '../../assets/image.png'
import logo2 from '../../assets/Frame2.png'
import logo3 from '../../assets/Frame3.png'
import logo4 from '../../assets/Frame4.png'
import logo5 from '../../assets/Vector.png'
import { MdPeopleAlt } from "react-icons/md";
import { toast } from 'react-toastify';
import { useAuth } from "../../context/UseAuth";
import { useEffect, useState } from "react";
import api from "../../services/api";

const ToutorDashbord = () => {

    const { pathname } = useLocation();
    const { logOut, user } = useAuth();

    const isDashboardHome = pathname === "/toturdashbord";


    // this is for tutor dashboard api calling place 
    const [tutorData, setTutorData] = useState([])
    useEffect(() => {
        const tutorData = async () => {
            const res = await api.get("/dashboard/teacher")
            setTutorData(res.response.data)
        }
        tutorData()
    }, [])
    // console.log(tutorData)
    // this is for handle logout 
    const handleLogout = () => {
        toast.warn(
            <div>
                <p className="font-medium">Are you sure you want to logout?</p>
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={() => {
                            toast.dismiss();
                            logOut();
                        }}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={() => toast.dismiss()}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false
            }
        );
    }
    return (
        <div className="w-full min-h-screen flex ">

            {/* ================= SIDEBAR ================= */}
            <div className="px-10 py-5 min-h-screen">
                <div className="w-[290px] h-full bg-gradient-to-r from-[#6657E2] to-[#903CD1] text-white px-6 py-8 rounded-2xl">

                    {/* Logo Center */}
                    <div className="flex justify-center mb-2">
                        <img src={logo} alt="logo" className="w-20" />
                    </div>

                    <ul className="space-y-3 text-[15px]">

                        <NavLink to="/toturdashbord" end>
                            {({ isActive }) => (
                                <li
                                    className={`py-2.5 px-4 rounded-lg flex items-center space-x-3 transition 
        ${isActive ? "bg-white" : "hover:bg-white/10"}
      `}
                                >
                                    {/* ICON with Gradient */}
                                    <FiHome
                                        size={18}
                                        className={`${isActive ? "text-transparent" : "text-white"}`}
                                        style={
                                            isActive
                                                ? {
                                                    stroke: "url(#menuGradient)",
                                                    fill: "url(#menuGradient)",
                                                }
                                                : {}
                                        }
                                    />

                                    {/* TEXT with Gradient */}
                                    <span
                                        className={
                                            isActive
                                                ? "bg-gradient-to-r from-[#FFC30B] to-[#8113B5] text-transparent bg-clip-text font-medium"
                                                : "text-white"
                                        }
                                    >
                                        Dashboard
                                    </span>

                                    {/* GRADIENT DEFINITION (hidden) */}
                                    <svg className="absolute w-0 h-0 overflow-hidden">
                                        <defs>
                                            <linearGradient id="menuGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#FFC30B" />
                                                <stop offset="100%" stopColor="#8113B5" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </li>
                            )}
                        </NavLink>
                        <NavLink to="/toturdashbord/toutorstudent" end>
                            {({ isActive }) => (
                                <li
                                    className={`py-2.5 px-4 rounded-lg flex items-center space-x-3 transition 
        ${isActive ? "bg-white" : "hover:bg-white/10"}
      `}
                                >
                                    {/* ICON with Gradient */}
                                    <MdPeopleAlt
                                        size={18}
                                        className={`${isActive ? "text-transparent" : "text-white"}`}
                                        style={
                                            isActive
                                                ? {
                                                    stroke: "url(#menuGradient)",
                                                    fill: "url(#menuGradient)",
                                                }
                                                : {}
                                        }
                                    />

                                    {/* TEXT with Gradient */}
                                    <span
                                        className={
                                            isActive
                                                ? "bg-gradient-to-r from-[#FFC30B] to-[#8113B5] text-transparent bg-clip-text font-medium"
                                                : "text-white"
                                        }
                                    >
                                        Student
                                    </span>

                                    {/* GRADIENT DEFINITION (hidden) */}
                                    <svg className="absolute w-0 h-0 overflow-hidden">
                                        <defs>
                                            <linearGradient id="menuGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#FFC30B" />
                                                <stop offset="100%" stopColor="#8113B5" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </li>
                            )}
                        </NavLink>
                        <NavLink to="/toturdashbord/toutormyLessonspage" end>
                            {({ isActive }) => (
                                <li
                                    className={`py-2.5 px-4 rounded-lg flex items-center space-x-3 transition 
        ${isActive ? "bg-white" : "hover:bg-white/10"}
      `}
                                >
                                    {/* ICON with Gradient */}
                                    <FiBookOpen
                                        size={18}
                                        className={`${isActive ? "text-transparent" : "text-white"}`}
                                        style={
                                            isActive
                                                ? {
                                                    stroke: "url(#menuGradient)",
                                                    fill: "url(#menuGradient)",
                                                }
                                                : {}
                                        }
                                    />

                                    {/* TEXT with Gradient */}
                                    <span
                                        className={
                                            isActive
                                                ? "bg-gradient-to-r from-[#FFC30B] to-[#8113B5] text-transparent bg-clip-text font-medium"
                                                : "text-white"
                                        }
                                    >
                                        My Lessons
                                    </span>

                                    {/* GRADIENT DEFINITION (hidden) */}
                                    <svg className="absolute w-0 h-0 overflow-hidden">
                                        <defs>
                                            <linearGradient id="menuGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#FFC30B" />
                                                <stop offset="100%" stopColor="#8113B5" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </li>
                            )}
                        </NavLink>
                        <NavLink to="/toturdashbord/earning" end>
                            {({ isActive }) => (
                                <li
                                    className={`py-2.5 px-4 rounded-lg flex items-center space-x-3 transition 
        ${isActive ? "bg-white" : "hover:bg-white/10"}
      `}
                                >
                                    {/* ICON with Gradient */}
                                    <FiCreditCard
                                        size={18}
                                        className={`${isActive ? "text-transparent" : "text-white"}`}
                                        style={
                                            isActive
                                                ? {
                                                    stroke: "url(#menuGradient)",
                                                    fill: "url(#menuGradient)",
                                                }
                                                : {}
                                        }
                                    />

                                    {/* TEXT with Gradient */}
                                    <span
                                        className={
                                            isActive
                                                ? "bg-gradient-to-r from-[#FFC30B] to-[#8113B5] text-transparent bg-clip-text font-medium"
                                                : "text-white"
                                        }
                                    >
                                        Earning
                                    </span>

                                    {/* GRADIENT DEFINITION (hidden) */}
                                    <svg className="absolute w-0 h-0 overflow-hidden">
                                        <defs>
                                            <linearGradient id="menuGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#FFC30B" />
                                                <stop offset="100%" stopColor="#8113B5" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </li>
                            )}
                        </NavLink>
                        <NavLink to="/toturdashbord/toutormessages" end>
                            {({ isActive }) => (
                                <li
                                    className={`py-2.5 px-4 rounded-lg flex items-center space-x-3 transition 
        ${isActive ? "bg-white" : "hover:bg-white/10"}
      `}
                                >
                                    {/* ICON with Gradient */}
                                    <FiMessageCircle
                                        size={18}
                                        className={`${isActive ? "text-transparent" : "text-white"}`}
                                        style={
                                            isActive
                                                ? {
                                                    stroke: "url(#menuGradient)",
                                                    fill: "url(#menuGradient)",
                                                }
                                                : {}
                                        }
                                    />

                                    {/* TEXT with Gradient */}
                                    <span
                                        className={
                                            isActive
                                                ? "bg-gradient-to-r from-[#FFC30B] to-[#8113B5] text-transparent bg-clip-text font-medium"
                                                : "text-white"
                                        }
                                    >
                                        Messages
                                    </span>

                                    {/* GRADIENT DEFINITION (hidden) */}
                                    <svg className="absolute w-0 h-0 overflow-hidden">
                                        <defs>
                                            <linearGradient id="menuGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#FFC30B" />
                                                <stop offset="100%" stopColor="#8113B5" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </li>
                            )}
                        </NavLink>
                        <NavLink to="/toturdashbord/toutormyprofile" end>
                            {({ isActive }) => (
                                <li
                                    className={`py-2.5 px-4 rounded-lg flex items-center space-x-3 transition 
        ${isActive ? "bg-white" : "hover:bg-white/10"}
      `}
                                >
                                    {/* ICON with Gradient */}
                                    <FiUser
                                        size={18}
                                        className={`${isActive ? "text-transparent" : "text-white"}`}
                                        style={
                                            isActive
                                                ? {
                                                    stroke: "url(#menuGradient)",
                                                    fill: "url(#menuGradient)",
                                                }
                                                : {}
                                        }
                                    />

                                    {/* TEXT with Gradient */}
                                    <span
                                        className={
                                            isActive
                                                ? "bg-gradient-to-r from-[#FFC30B] to-[#8113B5] text-transparent bg-clip-text font-medium"
                                                : "text-white"
                                        }
                                    >
                                        Profile
                                    </span>

                                    {/* GRADIENT DEFINITION (hidden) */}
                                    <svg className="absolute w-0 h-0 overflow-hidden">
                                        <defs>
                                            <linearGradient id="menuGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#FFC30B" />
                                                <stop offset="100%" stopColor="#8113B5" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </li>
                            )}
                        </NavLink>
                        <NavLink to="/toturdashbord/toutorsupport" end>
                            {({ isActive }) => (
                                <li
                                    className={`py-2.5 px-4 rounded-lg flex items-center space-x-3 transition 
        ${isActive ? "bg-white" : "hover:bg-white/10"}
      `}
                                >
                                    {/* ICON with Gradient */}
                                    <FiHelpCircle
                                        size={18}
                                        className={`${isActive ? "text-transparent" : "text-white"}`}
                                        style={
                                            isActive
                                                ? {
                                                    stroke: "url(#menuGradient)",
                                                    fill: "url(#menuGradient)",
                                                }
                                                : {}
                                        }
                                    />

                                    {/* TEXT with Gradient */}
                                    <span
                                        className={
                                            isActive
                                                ? "bg-gradient-to-r from-[#FFC30B] to-[#8113B5] text-transparent bg-clip-text font-medium"
                                                : "text-white"
                                        }
                                    >
                                        Support
                                    </span>

                                    {/* GRADIENT DEFINITION (hidden) */}
                                    <svg className="absolute w-0 h-0 overflow-hidden">
                                        <defs>
                                            <linearGradient id="menuGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#FFC30B" />
                                                <stop offset="100%" stopColor="#8113B5" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </li>
                            )}
                        </NavLink>

                        <li onClick={handleLogout} className="text-red-300 cursor-pointer hover:bg-white/10 py-2.5 px-4 rounded-lg flex items-center space-x-3">
                            <FiLogOut size={18} /> <span>Log Out</span>
                        </li>

                    </ul>

                </div>
            </div>


            {/* ================= MAIN CONTENT ================= */}
            <div className="w-full py-5 pr-5">

                {/* TOPBAR always visible */}
                <div>
                    <div className="w-full bg-[#FFFFFF] shadow-md py-3 px-6 flex justify-between items-center rounded-2xl mb-6">
                        <div>
                            <h2 className="text-[20px] font-semibold bg-gradient-to-r from-[#FFC30B] via-[#8113B5] to-[#8113B5] text-transparent bg-clip-text">
                                Welcome Back {user.name}
                            </h2>

                            <p className="text-[#606060] text-[13px]">Here's an overview of your learning journey.</p>
                        </div>

                        <div className="flex items-center space-x-5">
                            <NavLink to="/toturdashbord/ToutorNotification">
                                <div className="relative cursor-pointer">
                                    <button className="bg-[#EBEBEB] p-2.5 rounded-full text-lg shadow-sm">
                                        🔔
                                    </button>

                                    {/* Gradient Badge */}
                                    <span className="absolute -top-1 -right-1 text-white text-[10px] px-1.5 py-[1px] rounded-full 
            bg-gradient-to-r from-[#6A4BFF] to-[#A048E9]">
                                        2
                                    </span>
                                </div>
                            </NavLink>




                            <div className="flex items-center space-x-2">
                                <Link to='/toturdashbord/toutormyprofile'>
                                    <img src={user.avatar} alt="user" className="w-9 h-9 rounded-full border" />
                                    <span className="font-medium text-[14px] text-[#585858]">{user.name}</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                {/* ONLY show these if we are in /dashboard */}
                {isDashboardHome && (
                    <>
                        {/* ============ STATS CARDS ============ */}
                        <div className="grid grid-cols-4 gap-6 py-6 text-center">
                            <div className="bg-white p-7 rounded-2xl shadow-sm flex flex-col items-center">
                                <img src={logo2} alt="" className="mb-3" />
                                <p className="text-[#7C7C7C] text-[14px]">Upcoming Lesson</p>
                                <h2 className="text-[28px] text-[#585858] font-semibold mt-2">{tutorData?.upcomingLesson}</h2>
                            </div>

                            <div className="bg-white p-7 rounded-2xl shadow-sm flex flex-col items-center">
                                <img src={logo3} alt="" className="mb-3" />
                                <p className="text-[#7C7C7C] text-[14px]">Completed Lesson</p>
                                <h2 className="text-[28px] text-[#585858] font-semibold mt-2">{tutorData?.completedLesson}</h2>
                            </div>

                            <div className="bg-white p-7 rounded-2xl shadow-sm flex flex-col items-center">
                                <img src={logo4} alt="" className="mb-3" />
                                <p className="text-[#7C7C7C] text-[14px]">Total Earning</p>
                                <h2 className="text-[28px] text-[#585858] font-semibold mt-2">${tutorData?.totalEarnings}</h2>
                            </div>

                            <div className="bg-white p-7 rounded-2xl shadow-sm flex flex-col items-center">
                                <img src={logo4} alt="" className="mb-3" />
                                <p className="text-[#7C7C7C] text-[14px]">Total Student</p>
                                <h2 className="text-[28px] text-[#585858] font-semibold mt-2">{tutorData?.totalStudents}</h2>
                            </div>
                        </div>


                        {/* ============ UPCOMING LESSONS ============ */}
                        <div className="bg-white rounded-2xl shadow-sm  p-7">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="font-semibold text-[#6657E2] text-[17px] flex items-center gap-2">
                                    <img src={logo2} alt="" className="w-5 h-5" />
                                    Upcoming Lessons
                                </h3>

                                {/* <button className="text-[#6657E2] border p-2 rounded-xl text-sm font-medium">
                                    View All
                                </button> */}
                            </div>


                            <div className="w-full py-14 text-gray-400 flex flex-col justify-center items-center">
                                <div className="text-5xl mb-3 flex justify-center">
                                    <img src={logo5} alt="" className="mx-auto" />
                                </div>

                                <p className="text-[15px] text-[#7A7A7A] text-center">
                                    No upcoming lessons scheduled.
                                </p>
                                <p className="text-[12px] text-[#7A7A7A] text-center">
                                    Book a lesson with one of our tutors to start learning.
                                </p>
                            </div>

                        </div>


                    </>
                )}

                {/* All other pages show here */}
                <Outlet />

            </div>
        </div>
    );
};

export default ToutorDashbord;
