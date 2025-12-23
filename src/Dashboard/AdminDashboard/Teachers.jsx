import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiCheckCircle, FiAlertCircle, FiDownload, FiPrinter, FiX, FiTrash2, FiEye } from 'react-icons/fi';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import api from '../../services/api';
import SummaryCard from './SummaryCard';

const Teachers = () => {
    const [summaryData, setSummaryData] = useState({
        totalEarnings: 0,
        totalUsers: 0,
        totalProviders: 0
    });

    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchFilters, setSearchFilters] = useState({
        teacherName: '',
        email: ''
    });

    const [showModal, setShowModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    // State for rejection modal
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [teacherToReject, setTeacherToReject] = useState(null);

    // Debounce timer ref
    const debounceTimerRef = useRef(null);

    const fetchSummaryData = async () => {
        try {
            const res = await api.get('/dashboard');
            setSummaryData(res.response.data);
        } catch (error) {
            console.error('Error fetching summary data:', error);
            toast.error('Failed to load summary data');
        }
    };

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchFilters.teacherName) params.append('name', searchFilters.teacherName);

            // Only add email parameter if it's a valid email format
            if (searchFilters.email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(searchFilters.email)) {
                    params.append('email', searchFilters.email);
                }
            }

            params.append('role', 'teacher');
            params.append('page', currentPage);
            params.append('limit', 10);
            params.append('isDeleted', false)

            const res = await api.get(`/user/all?${params.toString()}`);
            const responseData = res.response?.data || res.data || {};
            const teachersData = responseData.docs || [];

            const mappedTeachers = teachersData.map(teacher => ({
                id: teacher._id,
                name: teacher.name,
                email: teacher.email,
                avatar: teacher.avatar,
                role: teacher.role,
                isEmailVerified: teacher.isEmailVerified,
                phoneNumber: teacher.phoneNumber,
                countryCode: teacher.countryCode,
                bio: teacher.bio,
                isOnline: teacher.isOnline,
                lastSeen: teacher.lastSeen,
                createdAt: teacher.createdAt,
                teacher: teacher.teacher,
                _id: teacher._id
            }));

            setTeachers(mappedTeachers);
            setTotalPages(responseData.totalPages || 1);
        } catch (error) {
            console.error('Error fetching teachers:', error);
            toast.error('Failed to load teachers');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (teacherId) => {
        try {
            await api.post(`/admin/teachers/${teacherId}/approve`);
            toast.success("Teacher approved successfully");
            fetchTeachers();
        } catch (error) {
            console.error(error);
            toast.error("Failed to approve teacher");
        }
    };

    const handleRejectClick = (teacher) => {
        setTeacherToReject(teacher);
        setRejectionReason('');
        setShowRejectModal(true);
    };

    const confirmReject = async () => {
        if (!rejectionReason.trim()) {
            toast.error("Please provide a rejection reason");
            return;
        }

        try {
            await api.post(`/admin/teachers/${teacherToReject._id}/reject`, {
                reason: rejectionReason
            });
            toast.success("Teacher rejected successfully");
            setShowRejectModal(false);
            setTeacherToReject(null);
            fetchTeachers();
        } catch (error) {
            console.error(error);
            toast.error("Failed to reject teacher");
        }
    };

    useEffect(() => {
        fetchSummaryData();
        fetchTeachers();
    }, []);

    // Debounced search effect - only triggers after user stops typing for 500ms
    useEffect(() => {
        // Clear existing timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set new timer
        debounceTimerRef.current = setTimeout(() => {
            fetchTeachers();
        }, 500);

        // Cleanup function
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [searchFilters]);

    // Immediate fetch when page changes
    useEffect(() => {
        fetchTeachers();
    }, [currentPage]);

    const handleFilterChange = (field, value) => {
        setSearchFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchTeachers();
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // this is for handleDeleteTeacher 
    const handleDeleteTeacher = async (userId) => {
        toast.warn(
            <div>
                <p className="font-semibold mb-3">Are you sure you want to delete this teacher?</p>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => toast.dismiss()}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            try {
                                const res = await api.delete(
                                    `/user/delete/${userId}`
                                );
                                console.log(res)
                                toast.success("Teacher deleted successfully");
                                fetchTeachers(); // Refresh the teacher list
                            } catch (error) {
                                console.error(error);
                                toast.error("Failed to delete teacher");
                            }
                            toast.dismiss();
                        }}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                        Confirm Delete
                    </button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
            }
        );
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <SummaryCard summaryData={summaryData} />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Teachers List</h3>

                    <div className="flex gap-4 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <input
                                type="text"
                                placeholder="Search by name"
                                value={searchFilters.teacherName}
                                onChange={(e) => handleFilterChange('teacherName', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div className="flex-1 min-w-[200px]">
                            <input
                                type="text"
                                placeholder="Search by email"
                                value={searchFilters.email}
                                onChange={(e) => handleFilterChange('email', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div
                            className="px-6 h-[42px] w-[42px] py-2 bg-linear-to-r from-[#614EFE] to-[#7D359F] text-white rounded-full hover:opacity-90 transition-opacity flex justify-center items-center gap-2"
                        >
                            <button
                                onClick={handleSearch}
                            >
                                <FiSearch size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-[#614EFE] to-[#7D359F] text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Teacher</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Joined Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
                                            <span className="text-gray-500">Loading teachers...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : teachers.length > 0 ? (
                                teachers.map((teacher) => (
                                    <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 shrink-0">
                                                    {teacher.avatar ? (
                                                        <img className="h-10 w-10 rounded-full object-cover" src={teacher.avatar} alt={teacher.name} />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-linear-to-r from-[#614EFE] to-[#7D359F] flex items-center justify-center text-white font-semibold">
                                                            {teacher.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                                                    <div className="text-sm text-gray-500">{teacher.phoneNumber ? `${teacher.countryCode || ''} ${teacher.phoneNumber}` : 'No phone'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{teacher.email}</div>
                                            <div className="text-sm text-gray-500">
                                                {teacher.isEmailVerified ? (
                                                    <span className="text-green-600 flex items-center">
                                                        <FiCheckCircle className="mr-1" size={12} />
                                                        Verified
                                                    </span>
                                                ) : (
                                                    <span className="text-yellow-600 flex items-center">
                                                        <FiAlertCircle className="mr-1" size={12} />
                                                        Not Verified
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                Teacher
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${teacher.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                <span className={`w-2 h-2 rounded-full mr-1 ${teacher.isOnline ? 'bg-green-400' : 'bg-gray-400'
                                                    }`}></span>
                                                {teacher.isOnline ? 'Online' : 'Offline'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {format(new Date(teacher.createdAt), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-start items-center gap-2">
                                            {/* Approve Button */}
                                            {teacher.teacher?.status !== 'approved' && (
                                                <button
                                                    onClick={() => handleApprove(teacher._id)}
                                                    className="p-1 rounded-full text-green-600 hover:bg-green-50 transition-colors"
                                                    title="Approve"
                                                >
                                                    <FiCheckCircle size={20} />
                                                </button>
                                            )}

                                            {/* Reject Button */}
                                            {teacher.teacher?.status !== 'rejected' && (
                                                <button
                                                    onClick={() => handleRejectClick(teacher)}
                                                    className="p-1 rounded-full text-red-600 hover:bg-red-50 transition-colors"
                                                    title="Reject"
                                                >
                                                    <FiX size={20} />
                                                </button>
                                            )}

                                            <button
                                                onClick={() => {
                                                    setSelectedTeacher(teacher);
                                                    setShowModal(true);
                                                }}
                                                className="p-1 rounded-full text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                title="View Details"
                                            >
                                                <FiEye size={20} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleDeleteTeacher(teacher._id)
                                                }}
                                                className="p-1 rounded-full text-red-600 hover:bg-red-50 transition-colors"
                                                title="Delete"
                                            >
                                                <FiTrash2 size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="text-gray-500">
                                            <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                            <p className="text-lg font-medium">No teachers found</p>
                                            <p className="text-sm mt-1">Try adjusting your search filters</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Back
                            </button>

                            <div className="flex items-center space-x-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`px-3 py-2 text-sm font-medium rounded-lg ${currentPage === pageNum
                                                ? 'bg-linear-to-r from-[#614EFE] to-[#7D359F] text-white'
                                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Page</span>
                            <input
                                type="number"
                                min="1"
                                max={totalPages}
                                value={currentPage}
                                onChange={(e) => handlePageChange(parseInt(e.target.value))}
                                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-600">of {totalPages}</span>
                            <button
                                onClick={() => handlePageChange(currentPage)}
                                className="px-3 py-1 text-sm font-medium text-white bg-linear-to-r from-[#614EFE] to-[#7D359F] rounded-lg hover:opacity-90"
                            >
                                Go
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Teacher Details Modal */}
            {showModal && selectedTeacher && (
                <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="bg-linear-to-r from-[#614EFE] to-[#7D359F] text-white p-6 rounded-t-xl">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold">Teacher Details</h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="space-y-6">
                                {/* Basic Information */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <span className="text-gray-600 text-sm">Teacher ID:</span>
                                                <span className="font-medium text-gray-800">{selectedTeacher._id}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <span className="text-gray-600 text-sm">Name:</span>
                                                <span className="font-medium text-gray-800">{selectedTeacher.name}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <span className="text-gray-600 text-sm">Email:</span>
                                                <span className="font-medium text-gray-800">{selectedTeacher.email}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <span className="text-gray-600 text-sm">Phone:</span>
                                                <span className="font-medium text-gray-800">{selectedTeacher.phoneNumber ? `${selectedTeacher.countryCode || ''} ${selectedTeacher.phoneNumber}` : 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <span className="text-gray-600 text-sm">Email Verified:</span>
                                                <span className="font-medium text-gray-800">{selectedTeacher.isEmailVerified ? 'Yes' : 'No'}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <span className="text-gray-600 text-sm">Status:</span>
                                                <span className={`font-medium ${selectedTeacher.isOnline ? 'text-green-600' : 'text-gray-600'}`}>
                                                    {selectedTeacher.isOnline ? 'Online' : 'Offline'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <span className="text-gray-600 text-sm">Joined Date:</span>
                                                <span className="font-medium text-gray-800">{format(new Date(selectedTeacher.createdAt), 'MMM dd, yyyy')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Professional Information */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Professional Information</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <span className="text-gray-600 text-sm">Years of Experience:</span>
                                                <span className="font-medium text-gray-800">{selectedTeacher.teacher?.yearsOfTeachingExp || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <span className="text-gray-600 text-sm">Hourly Rate:</span>
                                                <span className="font-medium text-gray-800">${selectedTeacher.teacher?.hourlyRate || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <span className="text-gray-600 text-sm">Teacher Status:</span>
                                                <span className={`font-medium ${selectedTeacher.teacher?.status === 'approved' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                    {selectedTeacher.teacher?.status?.charAt(0).toUpperCase() + selectedTeacher.teacher?.status?.slice(1) || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <span className="text-gray-600 text-sm">Rating:</span>
                                                <span className="font-medium text-gray-800">{selectedTeacher.teacher?.rating || 'N/A'}</span>
                                            </div>

                                            {/* Subjects Taught */}
                                            <div className="py-2">
                                                <span className="text-gray-600 text-sm">Subjects Taught:</span>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {selectedTeacher.teacher?.subjectsTaught?.length > 0 ? (
                                                        selectedTeacher.teacher.subjectsTaught.map((subject, index) => (
                                                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                                                {subject}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-500 text-sm">No subjects listed</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Available Days */}
                                            <div className="py-2">
                                                <span className="text-gray-600 text-sm">Available Days:</span>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {selectedTeacher.teacher?.availableDays?.length > 0 ? (
                                                        selectedTeacher.teacher.availableDays.map((day, index) => (
                                                            <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                                                {day}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-500 text-sm">No availability set</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Available Time */}
                                            <div className="py-2">
                                                <span className="text-gray-600 text-sm">Available Time:</span>
                                                <div className="mt-2">
                                                    {selectedTeacher.teacher?.availableTime?.startTime && selectedTeacher.teacher?.availableTime?.endTime ? (
                                                        <span className="font-medium text-gray-800">
                                                            {selectedTeacher.teacher.availableTime.startTime} - {selectedTeacher.teacher.availableTime.endTime}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-500 text-sm">No time set</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bio */}
                                {selectedTeacher.bio && (
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Bio</h4>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-gray-800">{selectedTeacher.bio}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Description */}
                                {selectedTeacher.teacher?.content && (
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Description</h4>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-gray-800">{selectedTeacher.teacher.content}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Qualifications */}
                                {selectedTeacher.teacher?.qualification?.length > 0 && (
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Qualifications</h4>
                                        <div className="space-y-3">
                                            {selectedTeacher.teacher.qualification.map((qual, index) => (
                                                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                                    <div className="font-medium text-gray-800">{qual.title}</div>
                                                    <div className="text-sm text-gray-600">{qual.institution}</div>
                                                    <div className="text-sm text-gray-500">Year: {qual.year}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex space-x-3 mt-6">
                                <button
                                    onClick={() => {
                                        const teacherData = {
                                            'Teacher ID': selectedTeacher._id,
                                            'Name': selectedTeacher.name,
                                            'Email': selectedTeacher.email,
                                            'Phone': selectedTeacher.phoneNumber ? `${selectedTeacher.countryCode || ''} ${selectedTeacher.phoneNumber}` : 'N/A',
                                            'Role': selectedTeacher.role || 'Teacher',
                                            'Email Verified': selectedTeacher.isEmailVerified ? 'Yes' : 'No',
                                            'Status': selectedTeacher.isOnline ? 'Online' : 'Offline',
                                            'Joined Date': format(new Date(selectedTeacher.createdAt), 'MM-dd-yyyy'),
                                            'Bio': selectedTeacher.bio || 'N/A',
                                            'Years of Experience': selectedTeacher.teacher?.yearsOfTeachingExp || 'N/A',
                                            'Hourly Rate': `$${selectedTeacher.teacher?.hourlyRate || 'N/A'}`,
                                            'Teacher Status': selectedTeacher.teacher?.status || 'N/A',
                                            'Rating': selectedTeacher.teacher?.rating || 'N/A',
                                            'Subjects Taught': selectedTeacher.teacher?.subjectsTaught?.join(', ') || 'N/A',
                                            'Available Days': selectedTeacher.teacher?.availableDays?.join(', ') || 'N/A',
                                            'Available Time': selectedTeacher.teacher?.availableTime?.startTime && selectedTeacher.teacher?.availableTime?.endTime
                                                ? `${selectedTeacher.teacher.availableTime.startTime} - ${selectedTeacher.teacher.availableTime.endTime}`
                                                : 'N/A',
                                            'Description': selectedTeacher.teacher?.content || 'N/A'
                                        };

                                        const dataStr = JSON.stringify(teacherData, null, 2);
                                        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

                                        const linkElement = document.createElement('a');
                                        linkElement.setAttribute('href', dataUri);
                                        linkElement.setAttribute('download', `teacher_${selectedTeacher._id}.json`);
                                        linkElement.click();

                                        toast.success('Teacher details downloaded successfully');
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-[#614EFE] to-[#7D359F] text-white rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    <FiDownload size={16} />
                                    Download
                                </button>
                                <button
                                    onClick={() => {
                                        const printContent = `
                                            <div style="padding: 20px; font-family: Arial, sans-serif;">
                                                <h2 style="margin-bottom: 20px;">Teacher Details</h2>
                                                <div style="margin-bottom: 20px;">
                                                    <h3 style="margin-bottom: 10px;">Basic Information</h3>
                                                    <div style="margin-bottom: 5px;"><strong>Teacher ID:</strong> ${selectedTeacher._id}</div>
                                                    <div style="margin-bottom: 5px;"><strong>Name:</strong> ${selectedTeacher.name}</div>
                                                    <div style="margin-bottom: 5px;"><strong>Email:</strong> ${selectedTeacher.email}</div>
                                                    <div style="margin-bottom: 5px;"><strong>Phone:</strong> ${selectedTeacher.phoneNumber ? `${selectedTeacher.countryCode || ''} ${selectedTeacher.phoneNumber}` : 'N/A'}</div>
                                                    <div style="margin-bottom: 5px;"><strong>Email Verified:</strong> ${selectedTeacher.isEmailVerified ? 'Yes' : 'No'}</div>
                                                    <div style="margin-bottom: 5px;"><strong>Status:</strong> ${selectedTeacher.isOnline ? 'Online' : 'Offline'}</div>
                                                    <div style="margin-bottom: 5px;"><strong>Joined Date:</strong> ${format(new Date(selectedTeacher.createdAt), 'MM-dd-yyyy')}</div>
                                                    <div style="margin-bottom: 5px;"><strong>Bio:</strong> ${selectedTeacher.bio || 'N/A'}</div>
                                                </div>
                                                <div style="margin-bottom: 20px;">
                                                    <h3 style="margin-bottom: 10px;">Professional Information</h3>
                                                    <div style="margin-bottom: 5px;"><strong>Years of Experience:</strong> ${selectedTeacher.teacher?.yearsOfTeachingExp || 'N/A'}</div>
                                                    <div style="margin-bottom: 5px;"><strong>Hourly Rate:</strong> $${selectedTeacher.teacher?.hourlyRate || 'N/A'}</div>
                                                    <div style="margin-bottom: 5px;"><strong>Teacher Status:</strong> ${selectedTeacher.teacher?.status || 'N/A'}</div>
                                                    <div style="margin-bottom: 5px;"><strong>Rating:</strong> ${selectedTeacher.teacher?.rating || 'N/A'}</div>
                                                    <div style="margin-bottom: 5px;"><strong>Subjects Taught:</strong> ${selectedTeacher.teacher?.subjectsTaught?.join(', ') || 'N/A'}</div>
                                                    <div style="margin-bottom: 5px;"><strong>Available Days:</strong> ${selectedTeacher.teacher?.availableDays?.join(', ') || 'N/A'}</div>
                                                    <div style="margin-bottom: 5px;"><strong>Available Time:</strong> ${selectedTeacher.teacher?.availableTime?.startTime && selectedTeacher.teacher?.availableTime?.endTime
                                                ? `${selectedTeacher.teacher.availableTime.startTime} - ${selectedTeacher.teacher.availableTime.endTime}`
                                                : 'N/A'}</div>
                                                    ${selectedTeacher.teacher?.content ? `<div style="margin-bottom: 5px;"><strong>Description:</strong> ${selectedTeacher.teacher.content}</div>` : ''}
                                                </div>
                                            </div>
                                        `;

                                        const printWindow = window.open('', '', 'width=800,height=600');
                                        printWindow.document.write(printContent);
                                        printWindow.document.close();
                                        printWindow.print();

                                        toast.success('Print dialog opened');
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    <FiPrinter size={16} />
                                    Print
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Rejection Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Reject Teacher Request</h3>
                        <p className="text-gray-600 mb-4">Please provide a reason for rejecting this teacher:</p>

                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
                            rows="4"
                            placeholder="Reason for rejection..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmReject}
                                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Teachers;
