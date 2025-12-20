import { useState, useEffect, } from 'react';
import { FiSearch, FiEye, FiDownload, FiPrinter, FiX, FiCheckCircle, FiAlertCircle, FiTrash2 } from 'react-icons/fi';
import { MdBlock } from "react-icons/md";
import { CgUnblock } from "react-icons/cg";
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import api from '../../services/api';
import SummaryCard from './SummaryCard';
const Students = () => {
    // State management
    const [summaryData, setSummaryData] = useState({
        totalEarnings: 0,
        totalUsers: 0,
        totalProviders: 0
    });

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(14);
    const [searchFilters, setSearchFilters] = useState({
        studentName: '',
        email: ''
    });

    const [showModal, setShowModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // API Integration Functions
    const fetchSummaryData = async () => {
        try {
            const res = await api.get('/dashboard');
            setSummaryData(res.response.data);
        } catch (error) {
            console.error('Error fetching summary data:', error);
            toast.error('Failed to load summary data');

        }
    };

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchFilters.studentName) params.append('name', searchFilters.studentName);
            if (searchFilters.email) params.append('email', searchFilters.email);
            params.append('role', 'student');
            params.append('page', currentPage);
            params.append('limit', 10);
            params.append('isDeleted', false)

            const res = await api.get(`/user/all?${params.toString()}`);
            const responseData = res.response?.data || res.data || {};
            console.log('API Response:', responseData);
            const studentsData = responseData.docs || [];
            const mappedStudents = studentsData.map(student => ({
                id: student._id,
                name: student.name,
                email: student.email,
                avatar: student.avatar,
                isRestricted: student.isRestricted,
                role: student.role,
                isEmailVerified: student.isEmailVerified,
                phoneNumber: student.phoneNumber,
                countryCode: student.countryCode,
                bio: student.bio,
                isOnline: student.isOnline,
                lastSeen: student.lastSeen,
                createdAt: student.createdAt,
                student: student.student,
                teacher: student.teacher,
                _id: student._id
            }));

            setStudents(mappedStudents);
            setTotalPages(responseData.totalPages || 1);
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };
    // Load data on component mount and when filters/page change
    useEffect(() => {
        fetchSummaryData();
        fetchStudents();
    }, []);

    useEffect(() => {
        fetchStudents();
    }, [currentPage, searchFilters]);

    const handleFilterChange = (field, value) => {
        setSearchFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchStudents();
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // this is for handleDeleteStudent 
    const handleDeleteStudent = async (userId) => {
        toast.warn(
            <div>
                <p className="font-semibold mb-3">Are you sure you want to delete this student?</p>
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
                                toast.success("Student deleted successfully");
                                fetchStudents();
                            } catch (error) {
                                console.error(error);
                                toast.error("Failed to delete student");
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
            {/* Summary Cards */}
            <SummaryCard summaryData={summaryData} />

            {/* Student List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Students List</h3>
                    {/* Search and Filter */}
                    <div className="flex gap-4 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <input
                                type="text"
                                placeholder="Search by name"
                                value={searchFilters.studentName}
                                onChange={(e) => handleFilterChange('studentName', e.target.value)}
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

                {/* Student Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-[#614EFE] to-[#7D359F] text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Student
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Joined Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
                                            <span className="text-gray-500">Loading students...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : students.length > 0 ? (
                                students.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 shrink-0">
                                                    {student.avatar ? (
                                                        <img className="h-10 w-10 rounded-full object-cover" src={student.avatar} alt={student.name} />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-linear-to-r from-[#614EFE] to-[#7D359F] flex items-center justify-center text-white font-semibold">
                                                            {student.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                    <div className="text-sm text-gray-500">{student.phoneNumber ? `${student.countryCode || ''} ${student.phoneNumber}` : 'No phone'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{student.email}</div>
                                            <div className="text-sm text-gray-500">
                                                {student.isEmailVerified ? (
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
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${student.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                student.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                {student.role?.charAt(0).toUpperCase() + student.role?.slice(1) || 'Student'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${student.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                <span className={`w-2 h-2 rounded-full mr-1 ${student.isOnline ? 'bg-green-400' : 'bg-gray-400'
                                                    }`}></span>
                                                {student.isOnline ? 'Online' : 'Offline'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {format(new Date(student.createdAt), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-start items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedStudent(student);
                                                    setShowModal(true);
                                                }}
                                                className="text-indigo-600 hover:text-indigo-900 hover:underline transition-colors cursor-pointer"
                                            >
                                                <FiEye size={24} />
                                            </button>

                                            <button
                                                onClick={() => {
                                                    handleDeleteStudent(student._id)
                                                }}
                                                className="text-indigo-600 hover:text-indigo-900 hover:underline transition-colors cursor-pointer"
                                            >
                                                <FiTrash2 color='red' size={24} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="text-gray-500">
                                            <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                            <p className="text-lg font-medium">No students found</p>
                                            <p className="text-sm mt-1">Try adjusting your search filters</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
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

            {/* Student Details Modal */}
            {showModal && selectedStudent && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
                        <div className="rounded-t-xl relative">
                            <div className="flex justify-center items-center py-6">
                                <h3 className="text-xl font-semibold">Student Details</h3>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-[#B6320E] rounded-bl-[20px] p-2 transition-colors absolute top-0 right-0 cursor-pointer rounded-tr-[8px]"
                            >
                                <FiX color="white" size={20} />
                            </button>
                        </div>

                        <div className="pb-6">
                            <div className="space-y-2">
                                <div className="w-full bg-gradient-to-r from-[#614EFE] to-[#7D359F] py-[1px]">
                                    <div className="flex justify-between items-center py-2 bg-white px-6">
                                        <span className="text-gray-600 text-sm">Student ID:</span>
                                        <span className="font-medium text-gray-800 w-full text-end">{selectedStudent._id.slice(0, 30)}</span>
                                    </div>
                                </div>

                                <div className="w-full bg-gradient-to-r from-[#614EFE] to-[#7D359F] pb-[1px]">
                                    <div className="flex justify-between items-center py-2 bg-white px-6">
                                        <span className="text-gray-600 text-sm">Name:</span>
                                        <span className="font-medium text-gray-800">{selectedStudent.name}</span>
                                    </div>
                                </div>

                                <div className="w-full bg-gradient-to-r from-[#614EFE] to-[#7D359F] pb-[1px]">
                                    <div className="flex justify-between items-center py-2 bg-white px-6">
                                        <span className="text-gray-600 text-sm">Email:</span>
                                        <span className="font-medium text-gray-800">{selectedStudent.email}</span>
                                    </div>
                                </div>

                                <div className="w-full bg-gradient-to-r from-[#614EFE] to-[#7D359F] pb-[1px]">
                                    <div className="flex justify-between items-center py-2 bg-white px-6">
                                        <span className="text-gray-600 text-sm">Phone:</span>
                                        <span className="font-medium text-gray-800">{selectedStudent.phoneNumber ? `${selectedStudent.countryCode || ''} ${selectedStudent.phoneNumber}` : 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="w-full bg-gradient-to-r from-[#614EFE] to-[#7D359F] pb-[1px]">
                                    <div className="flex justify-between items-center py-2 bg-white px-6">
                                        <span className="text-gray-600 text-sm">Role:</span>
                                        <span className="font-medium text-gray-800">{selectedStudent.role || 'Student'}</span>
                                    </div>
                                </div>

                                <div className="w-full bg-gradient-to-r from-[#614EFE] to-[#7D359F] pb-[1px]">
                                    <div className="flex justify-between items-center py-2 bg-white px-6">
                                        <span className="text-gray-600 text-sm">Email Verified:</span>
                                        <span className="font-medium text-gray-800">{selectedStudent.isEmailVerified ? 'Yes' : 'No'}</span>
                                    </div>
                                </div>

                                <div className="w-full bg-gradient-to-r from-[#614EFE] to-[#7D359F] pb-[1px]">
                                    <div className="flex justify-between items-center py-2 bg-white px-6">
                                        <span className="text-gray-600 text-sm">Status:</span>
                                        <span className="font-medium text-gray-800">{selectedStudent.isOnline ? 'Online' : 'Offline'}</span>
                                    </div>
                                </div>

                                <div className="w-full bg-gradient-to-r from-[#614EFE] to-[#7D359F] pb-[1px]">
                                    <div className="flex justify-between items-center py-2 bg-white px-6">
                                        <span className="text-gray-600 text-sm">Joined Date:</span>
                                        <span className="font-medium text-gray-800">{format(new Date(selectedStudent.createdAt), 'MMM dd, yyyy')}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-3 mt-6 px-6">
                                <button
                                    onClick={() => {
                                        const studentData = {
                                            'Student ID': selectedStudent._id,
                                            'Name': selectedStudent.name,
                                            'Email': selectedStudent.email,
                                            'Phone': selectedStudent.phoneNumber ? `${selectedStudent.countryCode || ''} ${selectedStudent.phoneNumber}` : 'N/A',
                                            'Role': selectedStudent.role || 'Student',
                                            'Email Verified': selectedStudent.isEmailVerified ? 'Yes' : 'No',
                                            'Status': selectedStudent.isOnline ? 'Online' : 'Offline',
                                            'Joined Date': format(new Date(selectedStudent.createdAt), 'MM-dd-yyyy')
                                        };

                                        const dataStr = JSON.stringify(studentData, null, 2);
                                        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

                                        const linkElement = document.createElement('a');
                                        linkElement.setAttribute('href', dataUri);
                                        linkElement.setAttribute('download', `student_${selectedStudent._id}.json`);
                                        linkElement.click();

                                        toast.success('Student details downloaded successfully');
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-[#614EFE] to-[#7D359F] text-white rounded-[16px] hover:opacity-90 transition-opacity"
                                >
                                    <FiDownload size={16} />
                                    Download
                                </button>
                                <button
                                    onClick={() => {
                                        const printContent = `
                                            <div style="padding: 20px; font-family: Arial, sans-serif;">
                                                <h2 style="margin-bottom: 20px;">Student Details</h2>
                                                <div style="margin-bottom: 10px;"><strong>Student ID:</strong> ${selectedStudent._id}</div>
                                                <div style="margin-bottom: 10px;"><strong>Name:</strong> ${selectedStudent.name}</div>
                                                <div style="margin-bottom: 10px;"><strong>Email:</strong> ${selectedStudent.email}</div>
                                                <div style="margin-bottom: 10px;"><strong>Phone:</strong> ${selectedStudent.phoneNumber ? `${selectedStudent.countryCode || ''} ${selectedStudent.phoneNumber}` : 'N/A'}</div>
                                                <div style="margin-bottom: 10px;"><strong>Role:</strong> ${selectedStudent.role || 'Student'}</div>
                                                <div style="margin-bottom: 10px;"><strong>Email Verified:</strong> ${selectedStudent.isEmailVerified ? 'Yes' : 'No'}</div>
                                                <div style="margin-bottom: 10px;"><strong>Status:</strong> ${selectedStudent.isOnline ? 'Online' : 'Offline'}</div>
                                                <div style="margin-bottom: 10px;"><strong>Joined Date:</strong> ${format(new Date(selectedStudent.createdAt), 'MM-dd-yyyy')}</div>
                                            </div>
                                        `;

                                        const printWindow = window.open('', '', 'width=600,height=600');
                                        printWindow.document.write(printContent);
                                        printWindow.document.close();
                                        printWindow.print();

                                        toast.success('Print dialog opened');
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-[16px] hover:bg-gray-200 transition-colors"
                                >
                                    <FiPrinter size={16} />
                                    Print
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Students;
