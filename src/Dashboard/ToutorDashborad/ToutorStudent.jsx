import { IoSearch } from "react-icons/io5";
import logo1 from "../../assets/IMG_8.png";
import logo2 from "../../assets/business_center.png";
import logo4 from "../../assets/payments.png";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import api from "../../services/api";

const ToutorStudent = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    totalDocs: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Fetch all students data
  const fetchAllStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/social/students`);
      const studentData = res.response.data;
      
      setAllStudents(studentData.docs || []);
      setStudents(studentData.docs || []);
      setPagination({
        page: studentData.page,
        limit: studentData.limit,
        totalDocs: studentData.totalDocs,
        totalPages: studentData.totalPages,
        hasNextPage: studentData.hasNextPage,
        hasPrevPage: studentData.hasPrevPage
      });
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStudents();
  }, []);

  // Handle search (client-side filtering)
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (value === "") {
      setStudents(allStudents);
    } else {
      const filtered = allStudents.filter(student => 
        student.name.toLowerCase().includes(value) ||
        student.email.toLowerCase().includes(value) ||
        student.bio?.toLowerCase().includes(value) ||
        student.student?.interestedSubjects?.some(subject => 
          subject.toLowerCase().includes(value)
        )
      );
      setStudents(filtered);
    }
  };

  // Handle pagination (for filtered results)
  const getPaginatedStudents = () => {
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    return students.slice(startIndex, endIndex);
  };

  // Update pagination based on filtered results
  useEffect(() => {
    const totalPages = Math.ceil(students.length / pagination.limit);
    setPagination(prev => ({
      ...prev,
      totalDocs: students.length,
      totalPages: totalPages,
      hasNextPage: pagination.page < totalPages,
      hasPrevPage: pagination.page > 1
    }));
  }, [students.length, pagination.page, pagination.limit]);

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  // Handle next/prev page
  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      handlePageChange(pagination.page + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.hasPrevPage) {
      handlePageChange(pagination.page - 1);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          My Students
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          View and manage your students and their lesson progress.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="text-sm text-gray-500">
            Showing {students.length} of {pagination.totalDocs} students
          </div>
        </div>
      </div>



      {/* Students Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500">Loading students...</div>
          </div>
        ) : students.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="text-gray-500">No students found</div>
          </div>
        ) : (
          getPaginatedStudents().map((student) => (
            <div key={student._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">

              {/* Profile */}
              <div className="flex items-center gap-3">
                <img
                  src={student.avatar || logo1}
                  alt={student.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-100"
                />
                <div className="w-full min-w-0">
                  <h3 className="font-semibold text-gray-900 text-base truncate">{student.name}</h3>
                  <p className="text-gray-500 text-sm truncate">
                    {student.email}
                  </p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-600 text-sm mt-4 leading-relaxed line-clamp-2">
                {student.bio || 'No bio available'}
              </p>

              <p className="text-gray-500 mt-4 text-sm mb-2">Interested Subjects</p>

              {/* Interested Subjects badges */}
              <div className="flex flex-wrap gap-2 max-h-[70px] overflow-hidden">
                {student.student?.interestedSubjects?.map((subject) => (
                  <span
                    key={subject}
                    className="px-2.5 py-1 text-xs rounded-full bg-purple-50 text-purple-700 border border-purple-100 font-medium">
                    {subject}
                  </span>
                )) || (
                    <span className="text-gray-500 text-sm">No subjects specified</span>
                  )}
              </div>

              {/* Online Status */}
              <div className="flex items-center gap-2 mt-4">
                <div className={`w-2 h-2 rounded-full ${student.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="text-xs text-gray-500">
                  {student.isOnline ? 'Online' : `Last seen: ${new Date(student.lastSeen).toLocaleDateString()}`}
                </span>
              </div>

              {/* Button */}
              <Link to={`/toturdashbord/toutorsendmessagest/${student._id}`} state={{ student }}>
                <button
                  className="w-full mt-5 py-2.5 text-white font-medium rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:opacity-90 transition-all shadow-sm hover:shadow-md"
                >
                  Message
                </button>
              </Link>

            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={!pagination.hasPrevPage}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pagination.hasPrevPage
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${pagination.page === pageNum
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={!pagination.hasNextPage}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pagination.hasNextPage
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
};

export default ToutorStudent;
