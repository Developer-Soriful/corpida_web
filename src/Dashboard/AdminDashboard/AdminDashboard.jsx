import { NavLink, Outlet, useLocation } from "react-router";
import { FiHome, FiHelpCircle, FiLogOut, FiBell, FiEye, FiTrash2 } from "react-icons/fi";
import { FaMoneyCheck } from "react-icons/fa";
import { PiStudentThin } from "react-icons/pi";
import { useAuth } from "../../context/UseAuth";
import logo from '../../assets/image.png'
import { toast } from 'react-toastify';
import { useEffect, useState } from "react";
import api from "../../services/api";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { format } from 'date-fns';
import SummaryCard from "./SummaryCard";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
    const { user, logOut } = useAuth()
    const [unreadCount, setUnreadCount] = useState(0);

    // Dashboard data states
    const [summaryData, setSummaryData] = useState({
        totalEarnings: 0,
        totalStudents: 0,
        totalTutors: 0
    });
    const [earningsData, setEarningsData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // API Integration Functions
    const fetchSummaryData = async () => {
        try {
            // API Call: GET /api/admin/dashboard
            const res = await api.get('/dashboard');
            const dashboardData = res.response?.data || res.data || {};

            // Set summary data
            setSummaryData({
                totalEarnings: dashboardData.totalEarnings || 0,
                totalStudents: dashboardData.totalStudents || 0,
                totalTeachers: dashboardData.totalTeachers || 0
            });

            // Set monthly earnings data for chart
            if (dashboardData.monthlyEarnings) {
                const chartData = dashboardData.monthlyEarnings.map(item => ({
                    month: new Date(item.month).toLocaleDateString('en-US', { month: 'short' }),
                    amount: item.earnings
                }));
                setEarningsData(chartData);
            }

            // Set transactions from lastTransactions
            if (dashboardData.lastTransactions) {
                const mappedTransactions = dashboardData.lastTransactions.map(transaction => ({
                    id: transaction.id,
                    studentName: transaction.performedBy?.name || 'Unknown Student',
                    tutorName: transaction.receivedBy?.name || 'Unknown Tutor',
                    amount: transaction.amount,
                    date: transaction.createdAt,
                    status: transaction.status,
                    type: transaction.type,
                    description: transaction.description,
                    platformFee: transaction.platformFee,
                    teacherEarnings: transaction.teacherEarnings,
                    performedBy: transaction.performedBy,
                    receivedBy: transaction.receivedBy,
                    _id: transaction._id
                }));
                setTransactions(mappedTransactions);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');


        }
    };

    const handleDeleteTransaction = async (transactionId) => {
        try {
            // API Call: DELETE /api/admin/transactions/${transactionId}
            await api.delete(`/admin/transactions/${transactionId}`);

            // Remove from local state
            setTransactions(transactions.filter(t => t.id !== transactionId));
            toast.success('Transaction deleted successfully');
        } catch (error) {
            console.error('Error deleting transaction:', error);
            toast.error('Failed to delete transaction');
        }
    };

    const handleViewTransaction = (transactionId) => {
        // API Call: GET /api/admin/transactions/${transactionId}
        // Navigate to transaction details or show modal
        console.log('View transaction:', transactionId);
        toast.info(`Viewing transaction ${transactionId}`);
    };

    const fetchNotifications = async () => {
        try {
            const res = await api.get("/notification?limit=100");
            const data = res.response?.data?.docs || res.data?.docs || [];
            setUnreadCount(data.length);
        } catch (error) {
            console.error("NOTIFICATION ERROR:", error);
        }
    };

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            await Promise.all([
                fetchSummaryData(),
                fetchNotifications()
            ]);
            setLoading(false);
        };

        loadDashboardData();
    }, []);
    // Chart configuration
    const chartData = {
        labels: earningsData.map(item => item.month),
        datasets: [
            {
                label: 'Monthly Earnings',
                data: earningsData.map(item => item.amount),

                backgroundColor: (context) => {
                    const { ctx, chartArea } = context.chart;

                    // chartArea is undefined on first render
                    if (!chartArea) return null;

                    // LEFT ➜ RIGHT gradient
                    const liner = ctx.createLinearGradient(
                        chartArea.left,
                        0,
                        chartArea.right,
                        0
                    );

                    liner.addColorStop(0, "#FFC30B"); // left
                    liner.addColorStop(1, "#8113B5"); // right

                    return liner;
                },

                borderColor: "#8113B5",
                borderWidth: 1,
                borderRadius: 8,
            }


        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `$${context.parsed.y}k`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return '$' + value + 'k';
                    }
                }
            }
        }
    };

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
        <div className="w-full h-screen flex overflow-hidden bg-gray-50">

            {/* ================= SIDEBAR ================= */}
            <div className="px-6 py-5 h-full overflow-y-auto shrink-0 custom-scrollbar">
                <div className="w-[280px] min-h-full bg-linear-to-r from-[#6657E2] to-[#903CD1] text-white px-6 py-8 rounded-2xl flex flex-col">

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
                                    <span className={isActive ? "bg-linear-to-r from-[#FFC30B] to-[#8113B5] text-transparent bg-clip-text font-medium" : "text-white"}>
                                        Dashboard
                                    </span>
                                    {isActive && (
                                        <svg className="absolute w-0 h-0 overflow-hidden"><defs><linearGradient id="menuGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFC30B" /><stop offset="100%" stopColor="#8113B5" /></linearGradient></defs></svg>
                                    )}
                                </li>
                            )}
                        </NavLink>
                        <NavLink to="/admin/earnings" end>
                            {({ isActive }) => (
                                <li
                                    className={`py-2.5 px-4 rounded-lg flex items-center space-x-3 transition 
                                    ${isActive ? "bg-white" : "hover:bg-white/10"}
                                    `}
                                >
                                    <FaMoneyCheck

                                        size={18}
                                        className={`${isActive ? "text-transparent" : "text-white"}`}
                                        style={isActive ? { stroke: "url(#menuGradient)", fill: "url(#menuGradient)" } : {}}
                                    />
                                    <span className={isActive ? "bg-linear-to-r from-[#FFC30B] to-[#8113B5] text-transparent bg-clip-text font-medium" : "text-white"}>
                                        Earnings
                                    </span>
                                    {isActive && (
                                        <svg className="absolute w-0 h-0 overflow-hidden"><defs><linearGradient id="menuGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFC30B" /><stop offset="100%" stopColor="#8113B5" /></linearGradient></defs></svg>
                                    )}
                                </li>
                            )}
                        </NavLink>

                        <NavLink to="/admin/students" end>
                            {({ isActive }) => (
                                <li
                                    className={`py-2.5 px-4 rounded-lg flex items-center space-x-3 transition 
                                    ${isActive ? "bg-white" : "hover:bg-white/10"}
                                    `}
                                >
                                    <PiStudentThin


                                        size={18}
                                        className={`${isActive ? "text-transparent" : "text-white"}`}
                                        style={isActive ? { stroke: "url(#menuGradient)", fill: "url(#menuGradient)" } : {}}
                                    />
                                    <span className={isActive ? "bg-linear-to-r from-[#FFC30B] to-[#8113B5] text-transparent bg-clip-text font-medium" : "text-white"}>
                                        Earnings
                                    </span>
                                    {isActive && (
                                        <svg className="absolute w-0 h-0 overflow-hidden"><defs><linearGradient id="menuGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFC30B" /><stop offset="100%" stopColor="#8113B5" /></linearGradient></defs></svg>
                                    )}
                                </li>
                            )}
                        </NavLink>

                        <NavLink to="/admin/support" end>
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
                                    <span className={isActive ? "bg-linear-to-r from-[#FFC30B] to-[#8113B5] text-transparent bg-clip-text font-medium" : "text-white"}>
                                        Support Tickets
                                    </span>
                                </li>
                            )}
                        </NavLink>

                        <NavLink to="/admin/notification">
                            {({ isActive }) => (
                                <li
                                    className={`py-2.5 px-4 rounded-lg flex items-center space-x-3 transition 
                                    ${isActive ? "bg-white" : "hover:bg-white/10"}
                                    `}
                                >
                                    <FiBell
                                        size={18}
                                        className={`${isActive ? "text-transparent" : "text-white"}`}
                                        style={isActive ? { stroke: "url(#menuGradient)", fill: "url(#menuGradient)" } : {}}
                                    />
                                    <span className={isActive ? "bg-linear-to-r from-[#FFC30B] to-[#8113B5] text-transparent bg-clip-text font-medium" : "text-white"}>
                                        Notifications
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
            <div className="flex-1 p-8 h-full overflow-y-auto custom-scrollbar">

                {/* TOPBAR */}
                <div className="w-full bg-[#FFFFFF] shadow-md py-3 px-6 flex justify-between items-center rounded-2xl mb-6">
                    <div>
                        <h2 className="text-[20px] font-semibold bg-linear-to-r from-[#FFC30B] via-[#8113B5] to-[#8113B5] text-transparent bg-clip-text">
                            Admin Portal
                        </h2>
                        <p className="text-[#606060] text-[13px]">Manage platform operations.</p>
                    </div>

                    <div className="flex items-center space-x-5">
                        <NavLink to="/admin/notification">
                            <div className="relative cursor-pointer">
                                <button className="bg-[#f3f4f6] p-2.5 rounded-full text-lg shadow-sm hover:bg-gray-200 transition-all">
                                    🔔
                                </button>
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 text-white text-[10px] px-1.5 py-px rounded-full 
            bg-linear-to-r from-[#6A4BFF] to-[#A048E9]">
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                )}
                            </div>
                        </NavLink>

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
                    <div className="space-y-6">
                        {/* Summary Cards */}
                        {/* <div className="grid grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">Total Earnings</p>
                                        <p className="text-3xl text-[#8113b5] text-[32px] font-medium mt-2">
                                            ${summaryData.totalEarnings.toFixed(2)} K
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">Total Students</p>
                                        <p className="text-3xl text-[#8113b5] text-[32px] font-medium mt-2">
                                            {summaryData.totalStudents?.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">Total Tutors</p>
                                        <p className="text-3xl text-[#8113b5] text-[32px] font-medium mt-2">
                                            {summaryData.totalTeachers?.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        <SummaryCard summaryData={summaryData} />
                        {/* Earnings Chart */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-800">Earnings Overview</h3>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value={2024}>2024</option>
                                    <option value={2025}>2025</option>
                                    <option value={2026}>2026</option>
                                </select>
                            </div>
                            <div className="h-80">
                                {loading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                                    </div>
                                ) : (
                                    <Bar data={chartData} options={chartOptions} />
                                )}
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6">Recent Transactions</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-[#614EFE] to-[#7D359F] text-white">
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 text-sm font-medium ">#Tr.ID</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium ">Students Name</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium ">Tutors Name</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium ">Amount</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium ">Date</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium ">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-8">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                                                </td>
                                            </tr>
                                        ) : transactions.length > 0 ? (
                                            transactions.map((transaction) => (
                                                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 text-sm text-gray-800">{transaction.id}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-800">{transaction.studentName}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-800">{transaction.tutorName}</td>
                                                    <td className="py-3 px-4 text-sm font-medium text-gray-800">${transaction.amount}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">
                                                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleViewTransaction(transaction.id)}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="View"
                                                            >
                                                                <FiEye size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteTransaction(transaction.id)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Delete"
                                                            >
                                                                <FiTrash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center py-8 text-gray-500">
                                                    No transactions found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* All other pages show here */}
                <Outlet />

            </div>
        </div>
    );
};

export default AdminDashboard;
