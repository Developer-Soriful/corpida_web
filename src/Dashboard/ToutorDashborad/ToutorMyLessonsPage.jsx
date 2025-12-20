import { FiCalendar, FiClock } from "react-icons/fi";
import { useEffect, useState } from "react";
import api from "../../services/api";
import Spinner from "../../Components/Spinner";
import { useSocket } from "../../context/SocketContext";

export default function ToutorMyLessonsPage() {
  const { onlineUsers } = useSocket();
  const [lessonData, setLessonData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const isOnline = (id) => onlineUsers?.includes(id);

  const LessonCard = ({ data }) => {
    const { subject, status, date, fromTime, toTime } = data;

    // Fallback for fields not directly in the provided simplified API response
    const studentName = data.student?.name || "Student";
    const studentAvatar = data.student?.avatar || "https://vectorified.com/images/no-profile-picture-icon-24.jpg";
    const formattedDate = date ? new Date(date).toLocaleDateString() : 'N/A';
    const timeRange = fromTime && toTime
      ? `${new Date(fromTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(toTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      : 'N/A';

    const statusColor =
      status === "completed" || status === "scheduled"
        ? "bg-[#D1FAE5] text-[#0F766E]"
        : status === "cancelled" || status === "unpaid"
          ? "bg-red-100 text-red-700"
          : "bg-[#E5E7EB] text-[#6B7280]";

    return (
      <div className="w-full bg-white rounded-lg p-6 shadow-[0_2px_6px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-center gap-6 border border-gray-100">
        <img
          src={studentAvatar}
          alt="profile"
          className="w-[60px] h-[60px] rounded-full object-cover shrink-0 border-2 border-purple-100"
        />

        <div className="flex-1 w-full">
          <div className="flex items-center w-full justify-between mb-2">
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] font-bold text-gray-800">{studentName}</h2>
              <span className={`w-2.5 h-2.5 rounded-full ${isOnline(data.student?._id || data.student?.id || data.student) ? "bg-green-500" : "bg-gray-300"}`}></span>
            </div>
            <span
              className={`text-[11px] px-3 py-1 rounded-full whitespace-nowrap font-semibold uppercase tracking-wider ${statusColor}`}
            >
              {status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8">
            <p className="text-gray-600 text-[14px]">
              <span className="font-semibold text-gray-700">Subject:</span> {subject}
            </p>

            <div className="flex items-center gap-4 text-gray-500 text-[13px]">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-purple-500" />
                {formattedDate}
              </div>

              <div className="flex items-center gap-2 ml-4">
                <FiClock className="text-purple-500" />
                {timeRange}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/booking/teacher?page=${currentPage}&limit=10`);
        const responseData = res.response?.data || {};
        const docs = responseData.docs || [];
        setLessonData(docs);
        setTotalPages(responseData.totalPages || 1);
      } catch (error) {
        console.error("Failed to load lessons:", error);
        setLessonData([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading && !lessonData) {
    return <Spinner text="Loading dashboard..." className="text-[#6657E2]" />
  }

  return (
    <div className=" bg-[#F5FAF7] min-h-screen">

      <div className="flex items-center justify-between mb-3">
        <h1 className="text-[20px] font-semibold text-[#6B46C1]">My Lessons</h1>

        <button className="bg-[#7C3AED] text-white px-4 py-1.5 rounded-lg flex items-center gap-2 text-[14px]">
          All Lessons
        </button>
      </div>

      <p className="text-gray-500 mb-6 text-[13px]">
        Manage your upcoming, past, and cancelled lessons.
      </p>

      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner text="Fetching lessons..." />
          </div>
        ) : lessonData?.length > 0 ? (
          lessonData.map((data) => (
            <LessonCard key={data._id || data.id} data={data} />
          ))
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No lessons found.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === pageNum
                        ? 'bg-linear-to-r from-[#614EFE] to-[#7D359F] text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>

          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}
    </div>
  );
}
