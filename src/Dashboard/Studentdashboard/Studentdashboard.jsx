import { Link, NavLink, Outlet, useLocation } from "react-router";
import { FiHome, FiBookOpen, FiCreditCard, FiMessageCircle, FiUser, FiHelpCircle, FiLogOut, FiBell, FiMenu, FiX } from "react-icons/fi";
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
import { exportedAssets } from "../../assets/export_assets";

const Studentdashboard = () => {
    const { user, logOut } = useAuth()
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { pathname } = useLocation();
    const isDashboardHome = pathname === "/dashboard" || pathname === "/dashboard/";
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);


    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get("/dashboard")
                setDashboardData(res.response.data)
            } catch (error) {
                console.log("DASHBOARD ERROR:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchNotifications = async () => {
            try {
                const res = await api.get("/notification?limit=30");
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

    // Close sidebar when route changes on mobile
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);
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
                <div className="w-[280px] lg:w-[290px] min-h-full bg-gradient-to-r from-[#6657E2] to-[#903CD1] text-white px-4 lg:px-6 py-6 lg:py-8 lg:m-5 lg:rounded-2xl lg:h-auto">

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
                                <p className="hidden sm:block text-gray-500 text-sm mt-0.5">Here's an overview of your learning journey</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 lg:space-x-5">
                            <NavLink to="/dashboard/notification">
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
                                <Link to='/dashboard/myprofile' className="flex items-center space-x-2 lg:space-x-3">
                                    <img src={user?.avatar || exportedAssets.user_icon} alt="user" className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-white shadow-md object-cover" />
                                    <div className="hidden md:flex flex-col">
                                        <span className="font-medium text-sm text-gray-800 leading-tight">{user?.name}</span>
                                        <span className="text-xs text-gray-500">Student</span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                {/* ONLY show these if we are in /dashboard */}
                {isDashboardHome && (
                    <>
                        {/* ============ STATS CARDS ============ */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-6 lg:mb-8">
                            <StatCard 
                                icon={logo2} 
                                label="Upcoming Lessons" 
                                value={dashboardData?.upcomingLesson ?? 0}
                                gradient="from-blue-500 to-cyan-500"
                            />
                            <StatCard 
                                icon={logo3} 
                                label="Completed Lessons" 
                                value={dashboardData?.completedLesson ?? 0}
                                gradient="from-emerald-500 to-teal-500"
                            />
                            <StatCard 
                                icon={logo4} 
                                label="Total Spent" 
                                value={`$${dashboardData?.totalSpending ?? 0}`}
                                gradient="from-orange-500 to-amber-500"
                            />
                            <StatCard 
                                icon={logo4} 
                                label="Reviews Given" 
                                value={dashboardData?.totalLesson ?? 0}
                                gradient="from-purple-500 to-pink-500"
                            />
                        </div>


                        {/* ============ UPCOMING LESSONS ============ */}
                        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 lg:p-6 border border-gray-100">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 lg:mb-6">
                                <div className="flex items-center gap-2 lg:gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <img src={logo2} alt="" className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-gray-800 text-base lg:text-lg">
                                        Upcoming Lessons
                                    </h3>
                                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs lg:text-sm font-semibold">
                                        {dashboardData?.upcomingLesson ?? 0}
                                    </span>
                                </div>

                                {dashboardData?.upcomingLesson > 0 && (
                                    <Link
                                        to="/dashboard/myLessonspage"
                                        className="text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-all duration-200"
                                    >
                                        View All →
                                    </Link>
                                )}
                            </div>

                            <div className="w-full py-16 flex flex-col justify-center items-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                <div className="mb-4 p-4 bg-white rounded-full shadow-sm">
                                    <img src={logo5} alt="" className="w-12 h-12 opacity-60" />
                                </div>
                                <p className="text-gray-600 font-medium text-center">
                                    No upcoming lessons scheduled
                                </p>
                <p className="text-sm text-gray-400 text-center mt-1">
                                    Book a lesson with one of our tutors to start learning
                                </p>
                            </div>
                        </div>

                        {/* ============ LEARNING PROGRESS ============ */}
                        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 lg:p-6 mt-4 lg:mt-6 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                                <h3 className="font-bold text-gray-800 text-lg">
                                    Learning Progress
                                </h3>
                            </div>

                            <div className="flex justify-between items-center mb-3">
                                <p className="text-gray-600 font-medium">Lessons Completed</p>
                                <span className="text-gray-800 font-bold">
                                    {dashboardData?.completedLesson ?? 0} / {dashboardData?.totalLesson ?? 0}
                                </span>
                            </div>

                            <div className="w-full h-3 bg-gray-100 rounded-full mb-6 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out"
                                    style={{
                                        width:
                                            dashboardData?.totalLesson > 0
                                                ? `${(dashboardData.completedLesson / dashboardData.totalLesson) * 100}%`
                                                : "0%",
                                    }}
                                ></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 rounded-xl border border-blue-100">
                                    <p className="text-blue-600 font-medium text-sm mb-1">Total Hours</p>
                                    <p className="text-3xl font-bold text-gray-800">
                                        {dashboardData?.totalHours ?? 0}<span className="text-lg text-gray-500 font-normal">h</span>
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-5 rounded-xl border border-purple-100">
                                    <p className="text-purple-600 font-medium text-sm mb-1">Total Lessons</p>
                                    <p className="text-3xl font-bold text-gray-800">
                                        {dashboardData?.totalLesson ?? 0}
                                    </p>
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

// Reusable Stat Card Component
const StatCard = ({ icon, label, value, gradient }) => (
  <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer">
    <div className="flex items-start justify-between mb-3 lg:mb-4">
      <div className={`p-2 lg:p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg shadow-opacity-20 group-hover:scale-105 transition-transform duration-300`}>
        <img src={icon} alt="" className="w-5 h-5 lg:w-6 lg:h-6 brightness-0 invert" />
      </div>
    </div>
    <p className="text-gray-500 text-xs lg:text-sm font-medium mb-1">{label}</p>
    <p className="text-2xl lg:text-3xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">{value}</p>
  </div>
);
