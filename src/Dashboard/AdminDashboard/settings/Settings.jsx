import { FiChevronRight } from 'react-icons/fi';
import { Link, Outlet } from 'react-router';

const Settings = () => {
    const settingsItems = [
        { id: 1, title: 'Personal Information', path: '/admin/personal' },
        { id: 2, title: 'Change Password', path: '/admin/password' },
        { id: 3, title: 'Terms & Condition', path: '/admin/terms' },
        { id: 4, title: 'Privacy Policy', path: '/admin/privacy' },
        { id: 5, title: 'FAQ', path: '/admin/faq' },
    ];

    const handleItemClick = (path) => {
        console.log('Navigate to:', path);
        // You can add navigation logic here
    };

    return (
        <div className="bg-gray-50 min-h-screen"    >
            <div className="">
                <div className="bg-white rounded-xl lg:w-[70%] shadow-sm border border-gray-100">
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h2>

                        <div className="space-y-1">
                            {settingsItems.map((item) => (
                                <Link
                                    key={item.id}
                                    to={item.path}
                                    className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                                >
                                    <span className="text-gray-700 text-sm font-medium group-hover:text-gray-900">
                                        {item.title}
                                    </span>
                                    <FiChevronRight
                                        size={16}
                                        className="text-gray-400 group-hover:text-gray-600 transition-colors"
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Outlet />
        </div>
    );
};

export default Settings;