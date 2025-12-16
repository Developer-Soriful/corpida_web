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
    <div className="rounded-2xl mb-1">


      <h2 className="text-[22px] font-semibold text-[#6657E2]">
        My Students
      </h2>
      <p className="text-gray-500 text-sm mt-1">
        View and manage your students and their lesson progress.
      </p>

      <div className="p-3 mt-5 rounded-2xl bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6657E2] w-64"
              />
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Showing {students.length} of {pagination.totalDocs} students
          </div>
        </div>
      </div>



      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full text-center py-8">
            <div className="text-gray-500">Loading students...</div>
          </div>
        ) : students.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <div className="text-gray-500">No students found</div>
          </div>
        ) : (
          getPaginatedStudents().map((student) => (
            <div key={student._id} className="bg-white rounded-xl shadow-md p-5">

              {/* Profile */}
              <div className="flex items-center gap-3 mt-5">
                <img
                  src={student.avatar || logo1}
                  alt={student.name}
                  className="w-11 h-11 rounded-full object-cover"
                />
                <div className="w-full">
                  <h3 className="font-semibold text-[17px]">{student.name}</h3>

                  {/* Email */}
                  <p className="text-gray-500 text-sm leading-[18px] break-words line-clamp-2">
                    {student.email}
                  </p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-[#7A7A7A] text-sm mt-4 leading-relaxed line-clamp-2">
                {student.bio || 'No bio available'}
              </p>

              <p className="text-[#7C7C7C] mt-3 text-sm mb-2">Interested Subjects</p>

              {/* Interested Subjects badges */}
              <div className="flex flex-wrap gap-2 max-h-[70px] overflow-hidden">
                {student.student?.interestedSubjects?.map((subject) => (
                  <span
                    key={subject}
                    className="px-5 py-1 text-sm rounded-full bg-[#EBEBEB] border border-[#E3E3FF]
      bg-clip-text text-transparent font-medium [background-image:linear-gradient(90deg,#6657E2,#903CD1)]
      whitespace-normal">
                    {subject}
                  </span>
                )) || (
                    <span className="text-gray-500 text-sm">No subjects specified</span>
                  )}
              </div>

              {/* Online Status */}
              <div className="flex items-center gap-2 mt-3">
                <div className={`w-2 h-2 rounded-full ${student.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="text-xs text-gray-500">
                  {student.isOnline ? 'Online' : `Last seen: ${new Date(student.lastSeen).toLocaleDateString()}`}
                </span>
              </div>

              {/* Button */}
              <Link to={`/toturdashbord/toutorsendmessagest/${student._id}`} state={{ student }}>
                <button
                  className="w-full mt-5 py-3 text-white font-medium rounded-lg 
          bg-gradient-to-r from-[#6657E2] via-[#903CD1] to-[#903CD1]"
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
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={!pagination.hasPrevPage}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${pagination.hasPrevPage
              ? 'bg-[#6657E2] text-white hover:bg-[#5a47d0]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${pagination.page === pageNum
                  ? 'bg-[#6657E2] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={!pagination.hasNextPage}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${pagination.hasNextPage
              ? 'bg-[#6657E2] text-white hover:bg-[#5a47d0]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
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
