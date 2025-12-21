import { FiCalendar, FiClock, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import api from "../../services/api";
import Spinner from "../../Components/Spinner";
import { useSocket } from "../../context/SocketContext";
import { toast } from "react-toastify";

export default function MyLessonsPage() {
  const { onlineUsers } = useSocket();
  // this is for state 
  const [lessonData, setLessonData] = useState(null)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState({ show: false, bookingId: null });
  const [cancelReason, setCancelReason] = useState("");
  const LessonCard = ({ data }) => {
    const isOnline = (id) => onlineUsers?.includes(id);
    const { subject, status, date, fromTime, toTime } = data;

    // Fallback for fields not directly in the provided simplified API response
    const teacherName = data.teacher?.name || "Teacher";
    const teacherAvatar = data.teacher?.avatar || "https://vectorified.com/images/no-profile-picture-icon-24.jpg";
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
          src={teacherAvatar}
          alt="profile"
          className="w-[60px] h-[60px] rounded-full object-cover shrink-0 border-2 border-purple-100"
        />

        <div className="flex-1 w-full">
          <div className="flex items-center w-full justify-between mb-2">
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] font-bold text-gray-800">{teacherName}</h2>
              <span className={`w-2.5 h-2.5 rounded-full ${isOnline(data.teacher?._id || data.teacher?.id || data.teacher) ? "bg-green-500" : "bg-gray-300"}`}></span>
            </div>
            <span
              className={`text-[11px] px-3 py-1 rounded-full whitespace-nowrap font-semibold uppercase tracking-wider ${statusColor}`}
            >
              {status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8">
            <div className="flex flex-col gap-2">
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

            {/* Cancel Button - only show for scheduled/pending lessons */}
            {(status === "scheduled" || status === "pending" || status === "cancelled") && (
              <div className="flex items-end justify-end">
                <button
                  onClick={() => {
                    if (status !== "cancelled") {
                      setCancelModal({ show: true, bookingId: data._id || data.id });
                      setCancelReason("");
                    }
                  }}
                  disabled={status === "cancelled"}
                  className={`px-4 py-2 text-white text-sm rounded-lg transition-colors ${status === "cancelled"
                    ? "bg-gray-400 cursor-not-allowed opacity-60"
                    : "bg-red-500 hover:bg-red-600"
                    }`}
                >
                  {status === "cancelled" ? "Already Cancelled" : "Cancel Booking"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Handle cancel booking
  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    try {
      await api.post(`/booking/${cancelModal.bookingId}/cancel`, {
        reason: cancelReason
      });

      toast.success("Booking cancelled successfully");
      setCancelModal({ show: false, bookingId: null });
      setCancelReason("");

      // Refresh the lesson data
      const res = await api.get(`/booking/student?page=${currentPage}&limit=10`);
      const responseData = res.response?.data || {};
      const docs = responseData.docs || [];
      setLessonData(docs);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  // this is the lesson data from data bse 
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/booking/student?page=${currentPage}&limit=10`);
        const responseData = res.response?.data || {};
        const docs = responseData.docs || [];
        setLessonData(docs);
        setTotalPages(responseData.totalPages || 1);
      } catch (error) {
        console.error("Error fetching lessons:", error);
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
    return <Spinner text="Loading dashboard..." />
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
                // Showing only a few pages if there are many could be better, but basic for now
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

      {/* Cancel Booking Modal */}
      {cancelModal.show && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="rounded-t-xl relative">
              <div className="flex justify-center items-center py-6">
                <h3 className="text-xl font-semibold">Cancel Booking</h3>
              </div>
              <button
                onClick={() => {
                  setCancelModal({ show: false, bookingId: null });
                  setCancelReason("");
                }}
                className="bg-[#B6320E] rounded-bl-[20px] p-2 transition-colors absolute top-0 right-0 cursor-pointer rounded-tr-[8px]"
              >
                <FiX color="white" size={20} />
              </button>
            </div>

            <div className="pb-6 px-6">
              <p className="text-gray-600 text-sm mb-4">
                Please provide a reason for cancelling this booking:
              </p>

              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter cancellation reason..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows="4"
              />

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setCancelModal({ show: false, bookingId: null });
                    setCancelReason("");
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-[16px] hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCancelBooking}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-[16px] hover:bg-red-600 transition-colors"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
