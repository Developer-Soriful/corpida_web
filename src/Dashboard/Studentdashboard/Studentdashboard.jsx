import { Link, NavLink, Outlet, useLocation } from "react-router";
import { FiHome, FiBookOpen, FiCreditCard, FiMessageCircle, FiUser, FiHelpCircle, FiLogOut } from "react-icons/fi";
import { MdPeopleAlt } from "react-icons/md";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/UseAuth";
import api from "../../services/api";
import Spinner from "../../Components/Spinner";
import { toast } from 'react-toastify';

import logo from '../../assets/image.png'
import logo2 from '../../assets/Frame2.png'
import logo3 from '../../assets/Frame3.png'
import logo4 from '../../assets/Frame4.png'
import logo5 from '../../assets/Vector.png'

const Studentdashboard = () => {
    const { user, logOut } = useAuth()
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { pathname } = useLocation();
    const isDashboardHome = pathname === "/dashboard" || pathname === "/dashboard/";
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);


    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get("/dashboard/student")
                setDashboardData(res.response.data)
            } catch (error) {
                console.log("DASHBOARD ERROR:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchNotifications = async () => {
            try {
                const res = await api.get("/notification?limit=100");
                const data = res.response?.data?.docs || res.data?.docs || [];
                setNotifications(data);
                setUnreadCount(data.length);
            } catch (error) {
                console.error("NOTIFICATION ERROR:", error);
            }
        };

        fetchDashboard();
        fetchNotifications();
    }, []);
    if (loading) {
        return <Spinner text="Student Dashboard" />
    }


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
    console.log(dashboardData)
    return (
        <div className="w-full h-screen flex overflow-hidden">

            {/* ================= SIDEBAR ================= */}
            <div className="px-10 py-5 h-full overflow-y-auto shrink-0 custom-scrollbar">
                <div className="w-[290px] min-h-full bg-gradient-to-r from-[#6657E2] to-[#903CD1] text-white px-6 py-8 rounded-2xl">

                    {/* Logo Center */}
                    <div className="flex justify-center mb-2">
                        <img src={logo} alt="logo" className="w-[80px]" />
                    </div>

                    <ul className="space-y-3 text-[15px]">

                        <NavLink to="/dashboard" end>
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
                        <NavLink to="/dashboard/findtutors" end>
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
                                        Find Tutors
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
                        <NavLink to="/dashboard/myLessonspage" end>
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
                        <NavLink to="/dashboard/paymenthistory" end>
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
                                        Payments
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
                        <NavLink to="/dashboard/messages" end>
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
                        <NavLink to="/dashboard/myprofile" end>
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
                        <NavLink to="/dashboard/support" end>
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
                        <li onClick={handleLogout} className="text-red-300 hover:bg-white/10 cursor-pointer py-2.5 px-4 rounded-lg flex items-center space-x-3">
                            <FiLogOut size={18} /> <span>Log Out</span>
                        </li>

                    </ul>

                </div>
            </div>


            {/* ================= MAIN CONTENT ================= */}
            <div className="flex-1 p-8 h-full overflow-y-auto custom-scrollbar">

                {/* TOPBAR always visible */}
                <div className="">
                    <div className="w-full bg-[#FFFFFF] shadow-md py-3 px-6 flex justify-between items-center rounded-2xl mb-6">
                        <div>
                            <h2 className="text-[20px] font-semibold bg-gradient-to-r from-[#FFC30B] via-[#8113B5] to-[#8113B5] text-transparent bg-clip-text">
                                Welcome Back {user.name}!
                            </h2>

                            <p className="text-[#606060] text-[13px]">Here's an overview of your learning journey.</p>
                        </div>

                        <div className="flex items-center space-x-5">
                            <NavLink to="/dashboard/notification">
                                <div className="relative cursor-pointer">
                                    <button className="bg-[#EBEBEB] p-2.5 rounded-full text-lg shadow-sm">
                                        🔔
                                    </button>

                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 text-white text-[10px] px-1.5 py-[1px] rounded-full 
                bg-gradient-to-r from-[#6A4BFF] to-[#A048E9]">
                                            {unreadCount > 99 ? '99+' : unreadCount}
                                        </span>
                                    )}
                                </div>
                            </NavLink>




                            <div className="flex items-center space-x-2">
                                <Link to='/dashboard/myprofile'>
                                    <img src={user?.avatar || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMUAAACUCAMAAAAUNB2QAAAASFBMVEX6+vqPj4////+JiYmurq6MjIyDg4OGhobu7u739/eVlZX09PTMzMzx8fGbm5vr6+ve3t6mpqbY2NjBwcG4uLjS0tLl5eV8fHwPhmHxAAAEOElEQVR4nO2c3ZKjIBBGpREQRARR5/3fdDWZmc3OJv4QhXaKc5GLqZoqTjVNED9SFJlMJpPJZDKZTCZzBeCb1CMJZR56awc/M9iquKIJQKOdIX8xbqgvJgJyMFww9mDBmOCmKy7jAUXlGX80+DbhRDfX8IBKE/5E4Q5XwyU8OideOsyI0qYe4hogvaKLEoRQpVMPcxmQjj1riB/twUrMXQ7FaiE+Z5XBu+iCFNsk5lmVerCvgMZslZiq4WTq8T4F6nK9JR6q0ace8HP8HompxzXC1oCO7LRQIz6Nxm1viju0rFMP+j/0613HK/iArRjVvul0gxlkxQC/vHm6RjHk3qa4F0OhsoCArrgVw2LSABPQFnMxSkQW0ISVYtqIYLLQQW0xWyCaUrBrB/UI7RFZBLbF1BgOj0WjAiWmtTb12L+BMVSCEFVhKca0nQ0HzcYW9BsWaBYp0KHNPdFliyOBIVwC0Yz6Hd1twyXwrLRvfOsRhedY6nfsQMJ3gwzTblCHPHXPYHrYgzr4KSn10B+BwPammJ5Yg08PPhBNqJnfcJITfKqWetw/qHaemM9QbCecRRGw2FJspZiKsfvkXyA8+YduwzviR5hCtkDdAL+vGCjfiBWFLPdoYDpPewT2vBQTpcRpUUBrti5UwtVIJWaNlTzOF7zEHC+CqtyyoeI93krMgPRibcFlAufq9AhYs/jFwYhDc+yxwFQOQ195MGY03lDRP0A7eTxbdClzvr2GQzGHaUddEv5PhzDBVT+0FynEHYC6HXpD+RfU+K6Vl3K4AYWUdWuHQevOtrXEHBVc4+Jh+Uwmc2ngOJI5yKrzfXkEvbdNEgWQtmRc0GPgnPQJLjRA1bPQONHz3a4gPvazE4wbn013eUR+joV2RzB+OzRyhH73ceZGjZhvZcCf4jAT75H8pPk0Q120FReGN9Ira0RLt8j+8PXpG+EjSQS8qtgO7SO91Jja4rwZRctIjTFZnCZBmKuyxS6L82ZUtsBjEa27p5X2N1g0u15D7rToo21rg0If24j33R1+aWQdFu3aGHThmc01CRMtkADtae0d9VZof9aUYj7ewx4MJ02puAmX+qTvvbgh4bfujSwR9x6DPKUYsfPa0IXmgJfgsV8jw/Fng4THj0zVOwN261AT/xYDjAfPKUZTxBKge5n2CJJIdUNJBySBX0qoZJfFjtNgKuFPIHTkmA0VVSl/GQtadUSPc5f2phjU/ce7s4p9+OSpVBhfJ9M2OVCDIfgFhV5OCi5BCZoEHlTehbxwnf7HIfr9QYBKl2w1gvqjDEKVA577nzegsd7xzSKMC6dHhNlgKOpWG75uwsTHpNDWeCN4UNs58ygo+7/hpz9RKjh1fsQr8Mmcr2ms7p1RitwPGeZPpZQxZa+tvEyM8J4VkrIdrbVdN33YsZJXzUGiyD9lMplMJpPJZDKZzB7+AM4LNtVmj5i3AAAAAElFTkSuQmCC"} alt="user" className="w-9 h-9 rounded-full border" />
                                    <span className="font-medium text-[14px] text-[#585858]">{user?.name}</span>
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
                                <h2 className="text-[28px] font-semibold">
                                    {dashboardData?.upcomingLesson}
                                </h2>


                            </div>

                            <div className="bg-white p-7 rounded-2xl shadow-sm flex flex-col items-center">
                                <img src={logo3} alt="" className="mb-3" />
                                <p className="text-[#7C7C7C] text-[14px]">Completed Lesson</p>
                                <h2 className="text-[28px] font-semibold">
                                    {dashboardData?.completedLesson}
                                </h2>

                            </div>

                            <div className="bg-white p-7 rounded-2xl shadow-sm flex flex-col items-center">
                                <img src={logo4} alt="" className="mb-3" />
                                <p className="text-[#7C7C7C] text-[14px]">Total Spent</p>
                                <h2 className="text-[28px] font-semibold">
                                    ${dashboardData?.totalSpending}
                                </h2>
                            </div>

                            <div className="bg-white p-7 rounded-2xl shadow-sm flex flex-col items-center">
                                <img src={logo4} alt="" className="mb-3" />
                                <p className="text-[#7C7C7C] text-[14px]">Reviews Given</p>
                                <h2 className="text-[28px] font-semibold">
                                    {dashboardData?.totalLesson}
                                </h2>
                            </div>
                        </div>


                        {/* ============ UPCOMING LESSONS ============ */}
                        <div className="bg-white rounded-2xl shadow-sm  p-7">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="font-semibold text-[#6657E2] text-[17px] flex items-center gap-2">
                                    <img src={logo2} alt="" className="w-5 h-5" />
                                    Upcoming Lessons
                                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-[#6657E2]/10 text-[#6657E2]">
                                        {dashboardData?.upcomingLesson}
                                    </span>
                                </h3>

                                {dashboardData?.upcomingLesson > 0 && (
                                    <Link
                                        to="/dashboard/myLessonspage"
                                        className="text-[#6657E2] border border-[#6657E2] px-3 py-1 rounded-xl text-sm font-medium hover:bg-[#6657E2] hover:text-white transition"
                                    >
                                        View All
                                    </Link>
                                )}
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

                        {/* ============LEARNING PROGRES S ============ */}
                        <div className="bg-white rounded-2xl shadow-sm p-7 mt-7 mb-10">
                            <h3 className="font-semibold text-[#6657E2] text-[17px] mb-5">
                                Learning Progress
                            </h3>

                            {/* Lessons completed */}
                            <div className="flex justify-between items-center mb-2 text-[14px] font-medium">
                                <p className="text-[#585858]">Lessons Completed</p>
                                <span className="text-[#585858]">
                                    {dashboardData?.completedLesson} / {dashboardData?.totalLesson}
                                </span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
                                <div
                                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                                    style={{
                                        width:
                                            dashboardData?.totalLesson > 0
                                                ? `${(dashboardData.completedLesson / dashboardData.totalLesson) * 100}%`
                                                : "0%",
                                    }}
                                ></div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-5">
                                <div className="bg-gray-100 p-5 rounded-xl">
                                    <p className="text-[#585858] text-[14px]">Total Hours</p>
                                    <h2 className="text-[22px] text-[#2563EB] font-semibold mt-1">
                                        {dashboardData?.totalHours}h
                                    </h2>
                                </div>

                                <div className="bg-gray-100 p-5 rounded-xl">
                                    <p className="text-[#585858] text-[14px]">Total Lessons</p>
                                    <h2 className="text-[22px] text-[#6657E2] font-semibold mt-1">
                                        {dashboardData?.totalLesson}
                                    </h2>
                                </div>
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

export default Studentdashboard;
