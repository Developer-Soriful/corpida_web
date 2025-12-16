import { Link, NavLink, Outlet, useLocation } from "react-router";
import { FiHome, FiHelpCircle, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/UseAuth";
import logo from '../../assets/image.png'
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const { user, logOut } = useAuth()
    const { pathname } = useLocation();

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
        <div className="w-full min-h-screen flex bg-gray-50">

            {/* ================= SIDEBAR ================= */}
            <div className="px-6 py-5 sticky top-0 h-screen overflow-y-auto">
                <div className="w-[280px] h-full bg-gradient-to-r from-[#6657E2] to-[#903CD1] text-white px-6 py-8 rounded-2xl flex flex-col">

                    {/* Logo Center */}
                    <div className="flex justify-center mb-8">
                        <img src={logo} alt="logo" className="w-[80px]" />
                    </div>

                    <ul className="space-y-3 text-[15px] flex-1">

                        <NavLink to="/admin" end>
                            {({ isActive }) => (
                                <li
                                    className={`py-2.5 px-4 rounded-lg flex items-center space-x-3 transition 
                                    ${isActive ? "bg-white" : "hover:bg-white/10"}
                                    `}
                                >
                                    <FiHome
                                        size={18}
                                        className={`${isActive ? "text-transparent" : "text-white"}`}
                                        style={isActive ? { stroke: "url(#menuGradient)", fill: "url(#menuGradient)" } : {}}
                                    />
                                    <span className={isActive ? "bg-gradient-to-r from-[#FFC30B] to-[#8113B5] text-transparent bg-clip-text font-medium" : "text-white"}>
                                        Dashboard
                                    </span>
                                    {isActive && (
                                        <svg className="absolute w-0 h-0 overflow-hidden"><defs><linearGradient id="menuGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFC30B" /><stop offset="100%" stopColor="#8113B5" /></linearGradient></defs></svg>
                                    )}
                                </li>
                            )}
                        </NavLink>

                        <NavLink to="/admin/support">
                            {({ isActive }) => (
                                <li
                                    className={`py-2.5 px-4 rounded-lg flex items-center space-x-3 transition 
                                    ${isActive ? "bg-white" : "hover:bg-white/10"}
                                    `}
                                >
                                    <FiHelpCircle
                                        size={18}
                                        className={`${isActive ? "text-transparent" : "text-white"}`}
                                        style={isActive ? { stroke: "url(#menuGradient)", fill: "url(#menuGradient)" } : {}}
                                    />
                                    <span className={isActive ? "bg-gradient-to-r from-[#FFC30B] to-[#8113B5] text-transparent bg-clip-text font-medium" : "text-white"}>
                                        Support Tickets
                                    </span>
                                </li>
                            )}
                        </NavLink>

                        {/* Placeholder for future admin links */}
                        {/* 
                         <NavLink to="/admin/users">
                            ... Users
                         </NavLink>
                         */}

                        <li onClick={handleLogout} className="text-red-300 hover:bg-white/10 cursor-pointer py-2.5 px-4 rounded-lg flex items-center space-x-3 mt-auto">
                            <FiLogOut size={18} /> <span>Log Out</span>
                        </li>

                    </ul>
                </div>
            </div>


            {/* ================= MAIN CONTENT ================= */}
            <div className="flex-1 p-8 overflow-y-auto h-screen">

                {/* TOPBAR */}
                <div className="w-full bg-[#FFFFFF] shadow-md py-3 px-6 flex justify-between items-center rounded-2xl mb-6">
                    <div>
                        <h2 className="text-[20px] font-semibold bg-gradient-to-r from-[#FFC30B] via-[#8113B5] to-[#8113B5] text-transparent bg-clip-text">
                            Admin Portal
                        </h2>
                        <p className="text-[#606060] text-[13px]">Manage platform operations.</p>
                    </div>

                    <div className="flex items-center space-x-5">
                        <div className="flex items-center space-x-2">
                            <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold border border-purple-200">
                                {user?.name?.charAt(0) || "A"}
                            </div>
                            <span className="font-medium text-[14px] text-[#585858]">{user?.name} (Admin)</span>
                        </div>
                    </div>
                </div>

                {/* DASHBOARD HOME CONTENT (only if exactly at /admin) */}
                {pathname === "/admin" && (
                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-gray-500 text-sm font-medium">Support Tickets</h3>
                            <p className="text-3xl font-bold text-[#6657E2] mt-2">Manage</p>
                            <Link to="/admin/support" className="text-sm text-purple-500 hover:underline mt-4 block">View Tickets &rarr;</Link>
                        </div>
                        {/* Add more stats here */}
                    </div>
                )}

                {/* All other pages show here */}
                <Outlet />

            </div>
        </div>
    );
};

export default AdminDashboard;
