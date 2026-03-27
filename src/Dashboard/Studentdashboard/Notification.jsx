import { useState, useEffect } from "react";
import { FiBell, FiTrash2 } from "react-icons/fi";
import api from "../../services/api";
import Spinner from "../../Components/Spinner";
import { toast } from "react-toastify";
import { formatDistanceToNow } from 'date-fns';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await api.get("/notification?limit=100");
            const data = res.response?.data?.docs || res.data?.docs || [];
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/notification/${id}`);
            setNotifications(prev => prev.filter(n => n._id !== id));
            toast.success("Notification deleted");
        } catch (error) {
            toast.error("Failed to delete notification");
        }
    };

    const handleClearAll = async () => {
        try {
            await api.delete("/notification/clear");
            setNotifications([]);
            toast.success("All notifications cleared");
        } catch (error) {
            toast.error("Failed to clear notifications");
        }
    };

    if (loading) return <Spinner text="Loading notifications..." />;

    return (
        <div className="w-full min-h-screen space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Notifications
                </h2>
                {notifications.length > 0 && (
                    <button
                        onClick={handleClearAll}
                        className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
                    >
                        Clear All
                    </button>
                )}
            </div>

            <div className="h-px bg-gray-200"></div>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <FiBell size={48} className="mb-4 opacity-20" />
                        <p>No notifications found.</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className="bg-white rounded-xl p-4 flex gap-4 items-start shadow-sm hover:shadow-md transition-all duration-300 group relative border border-gray-100"
                        >
                            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-purple-50 shrink-0">
                                <FiBell className="text-purple-600" size={20} />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-semibold text-[#1F1D1D] text-[15px]">{notification.title || "Notification"}</h3>
                                <p className="text-[#606060] text-[13px]">
                                    {notification.message}
                                </p>
                                <p className="text-[#606060] text-[12px] mt-1">
                                    {notification.createdAt ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true }) : ''}
                                </p>
                            </div>

                            <button
                                onClick={() => handleDelete(notification._id)}
                                className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all"
                                title="Delete notification"
                            >
                                <FiTrash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notification;
