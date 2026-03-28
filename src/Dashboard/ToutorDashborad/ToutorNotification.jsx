import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FiBell, FiTrash2 } from "react-icons/fi";
import api from "../../services/api";
import Spinner from "../../Components/Spinner";
import { toast } from "react-toastify";
import { formatDistanceToNow } from 'date-fns';

const ToutorNotification = () => {
    const navigate = useNavigate();
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

    const getNotificationNavigation = (notification) => {
        const { title = '', message = '' } = notification;
        const content = (title + ' ' + message).toLowerCase();
        
        if (content.includes('booking') || content.includes('lesson') ||
            content.includes('appointment') || content.includes('session')) {
            return '/toturdashbord/toutormyLessonspage';
        }
        
        if (content.includes('message') || content.includes('chat') ||
            content.includes('conversation')) {
            return '/toturdashbord/toutormessages';
        }
        
        if (content.includes('payment') || content.includes('transaction') ||
            content.includes('invoice') || content.includes('paid') || content.includes('earned')) {
            return '/toturdashbord/earning';
        }
        
        if (content.includes('profile') || content.includes('update') ||
            content.includes('verified') || content.includes('approved')) {
            return '/toturdashbord/toutormyprofile';
        }
        
        if (content.includes('support') || content.includes('ticket') ||
            content.includes('issue')) {
            return '/toturdashbord/toutorsupport';
        }
        
        if (content.includes('student') || content.includes('learner')) {
            return '/toturdashbord/toutorstudent';
        }
        
        return null;
    };

    const handleNotificationClick = (notification) => {
        const route = getNotificationNavigation(notification);
        if (route) {
            navigate(route);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
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
        <div className="space-y-4 md:space-y-6 px-4 md:px-0">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Notifications
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Stay updated with your latest activities.
                    </p>
                </div>
                {notifications.length > 0 && (
                    <button
                        onClick={handleClearAll}
                        className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors px-3 py-1.5 hover:bg-red-50 rounded-lg"
                    >
                        Clear All
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 md:py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <FiBell size={32} className="text-gray-300" />
                        </div>
                        <p className="text-gray-600 font-medium">No notifications found.</p>
                        <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
                    </div>
                ) : (
                    notifications.map((notification) => {
                        const hasNavigation = getNotificationNavigation(notification) !== null;
                        return (
                            <div
                                key={notification._id}
                                onClick={() => hasNavigation && handleNotificationClick(notification)}
                                className={`bg-white rounded-2xl p-4 md:p-5 flex gap-4 items-start shadow-sm border border-gray-100 group relative hover:shadow-md transition-shadow ${hasNavigation ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                            >
                                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-purple-50 shrink-0">
                                    <FiBell className="text-purple-600" size={20} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">{notification.title || "Notification"}</h3>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {notification.message}
                                    </p>
                                    <p className="text-gray-400 text-xs mt-2">
                                        {notification.createdAt ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true }) : ''}
                                    </p>
                                </div>

                                <button
                                    onClick={(e) => handleDelete(notification._id, e)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    title="Delete notification"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ToutorNotification;
