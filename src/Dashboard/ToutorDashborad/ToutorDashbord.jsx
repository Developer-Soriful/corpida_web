import { Link, NavLink, Outlet, useLocation } from "react-router";
import { FiHome, FiBookOpen, FiCreditCard, FiMessageCircle, FiUser, FiHelpCircle, FiLogOut, FiBell, FiMenu, FiX } from "react-icons/fi";

import logo from '../../assets/image.png'
import logo2 from '../../assets/Frame2.png'
import logo3 from '../../assets/Frame3.png'
import logo4 from '../../assets/Frame4.png'
import logo5 from '../../assets/Vector.png'
import user_icon from '../../assets/user_icon.png';
import { MdPeopleAlt } from "react-icons/md";
import { toast } from 'react-toastify';
import { useAuth } from "../../context/UseAuth";
import { useEffect, useState } from "react";
import api from "../../services/api";

const ToutorDashbord = () => {

    const { pathname } = useLocation();
    const { logOut, user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isDashboardHome = pathname === "/toturdashbord";


    // this is for tutor dashboard api calling place 
    const [tutorData, setTutorData] = useState([])
    const [unreadCount, setUnreadCount] = useState(0);
    useEffect(() => {
        const fetchTutorData = async () => {
            const res = await api.get("/dashboard")
            setTutorData(res.response.data)
        }
        const fetchNotifications = async () => {
            try {
                const res = await api.get("/notification?limit=100");
                const data = res.response?.data?.docs || res.data?.docs || [];
                setUnreadCount(data.length);
            } catch (error) {
                console.error("NOTIFICATION ERROR:", error);
            }
        };
        fetchTutorData();
        fetchNotifications();
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
        <div className="w-full h-screen flex overflow-hidden relative">

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* ================= SIDEBAR ================= */}
            <div className={`fixed lg:static inset-y-0 left-0 z-50 h-full shrink-0 bg-white lg:bg-transparent transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="w-[280px] lg:w-[290px] min-h-full bg-gradient-to-r from-[#6657E2] to-[#903CD1] text-white px-4 lg:px-6 py-6 lg:py-8 lg:my-5 lg:ml-5 lg:rounded-2xl lg:h-auto">

                    {/* Close button for mobile */}
                    <div className="flex justify-between items-center mb-4 lg:hidden">
                        <img src={logo} alt="logo" className="w-[60px]" />
                        <button 
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    {/* Logo Center - Desktop only */}
                    <div className="hidden lg:flex justify-center mb-2">
                        <img src={logo} alt="logo" className="w-[80px]" />
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
            <div className="flex-1 px-4 md:px-6 lg:px-8 py-4 lg:py-5 h-full overflow-y-auto custom-scrollbar w-full">

                {/* TOPBAR always visible */}
                <div className="">
                    <div className="w-full bg-white shadow-lg shadow-gray-200/50 py-3 lg:py-4 px-4 md:px-6 lg:px-8 flex justify-between items-center rounded-2xl mb-6 lg:mb-8 border border-gray-100">
                        <div className="flex items-center gap-3">
                            {/* Hamburger Menu - Mobile only */}
                            <button 
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FiMenu size={24} className="text-gray-700" />
                            </button>
                            <div>
                                <h2 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 text-transparent bg-clip-text">
                                    Welcome Back, {user.name}!
                                </h2>
                                <p className="hidden sm:block text-gray-500 text-sm mt-0.5">Here's an overview of your teaching journey</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 lg:space-x-5">
                            <NavLink to="/toturdashbord/ToutorNotification">
                                <div className="relative cursor-pointer group">
                                    <button className="bg-gray-100 p-3 rounded-xl text-lg shadow-sm group-hover:bg-gray-200 transition-all duration-200 flex items-center justify-center">
                                        <FiBell className="text-gray-700" size={20} />
                                    </button>

                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full 
                bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/30">
                                            {unreadCount > 99 ? '99+' : unreadCount}
                                        </span>
                                    )}
                                </div>
                            </NavLink>
                            <div className="flex items-center space-x-2 lg:space-x-3 bg-gray-50 py-1.5 lg:py-2 px-2 lg:px-3 rounded-xl border border-gray-200">
                                <Link to='/toturdashbord/toutormyprofile' className="flex items-center space-x-2 lg:space-x-3">
                                    <img src={user?.avatar || user_icon} alt="user" className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-white shadow-md object-cover" />
                                    <div className="hidden md:flex flex-col">
                                        <span className="font-medium text-sm text-gray-800 leading-tight">{user?.name}</span>
                                        <span className="text-xs text-gray-500">Tutor</span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                {/* ONLY show these if we are in /toturdashbord */}
                {isDashboardHome && (
                    <>
                        {/* ============ STATS CARDS ============ */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-6 lg:mb-8">
                            <div className="bg-white p-5 lg:p-7 rounded-2xl shadow-md hover:shadow-lg transition-shadow flex flex-col items-center">
                                <img src={logo2} alt="" className="w-10 h-10 lg:w-12 lg:h-12 mb-3" />
                                <p className="text-gray-500 text-sm">Upcoming Lessons</p>
                                <h2 className="text-2xl lg:text-3xl text-gray-700 font-bold mt-2">{tutorData?.upcomingLesson ?? 0}</h2>
                            </div>

                            <div className="bg-white p-5 lg:p-7 rounded-2xl shadow-md hover:shadow-lg transition-shadow flex flex-col items-center">
                                <img src={logo3} alt="" className="w-10 h-10 lg:w-12 lg:h-12 mb-3" />
                                <p className="text-gray-500 text-sm">Completed Lessons</p>
                                <h2 className="text-2xl lg:text-3xl text-gray-700 font-bold mt-2">{tutorData?.completedLesson ?? 0}</h2>
                            </div>

                            <div className="bg-white p-5 lg:p-7 rounded-2xl shadow-md hover:shadow-lg transition-shadow flex flex-col items-center">
                                <img src={logo4} alt="" className="w-10 h-10 lg:w-12 lg:h-12 mb-3" />
                                <p className="text-gray-500 text-sm">Total Earnings</p>
                                <h2 className="text-2xl lg:text-3xl text-gray-700 font-bold mt-2">${tutorData?.totalEarnings ?? 0}</h2>
                            </div>

                            <div className="bg-white p-5 lg:p-7 rounded-2xl shadow-md hover:shadow-lg transition-shadow flex flex-col items-center">
                                <img src={logo4} alt="" className="w-10 h-10 lg:w-12 lg:h-12 mb-3" />
                                <p className="text-gray-500 text-sm">Total Students</p>
                                <h2 className="text-2xl lg:text-3xl text-gray-700 font-bold mt-2">{tutorData?.totalStudents ?? 0}</h2>
                            </div>
                        </div>


                        {/* ============ UPCOMING LESSONS ============ */}
                        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 lg:p-7 border border-gray-100">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
                                <h3 className="font-semibold text-purple-600 text-base lg:text-lg flex items-center gap-2">
                                    <img src={logo2} alt="" className="w-5 h-5" />
                                    Upcoming Lessons
                                </h3>
                            </div>

                            <div className="w-full py-12 lg:py-14 flex flex-col justify-center items-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                <div className="mb-4 p-4 bg-white rounded-full shadow-sm">
                                    <img src={logo5} alt="" className="w-12 h-12 opacity-60" />
                                </div>
                                <p className="text-gray-600 font-medium text-center">
                                    No upcoming lessons scheduled
                                </p>
                                <p className="text-sm text-gray-400 text-center mt-1">
                                    Your schedule is clear for now
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
