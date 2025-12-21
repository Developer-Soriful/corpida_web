import { FiCalendar, FiClock, FiX, FiSlash } from "react-icons/fi";
import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import Spinner from "../../Components/Spinner";
import { useSocket } from "../../context/SocketContext";
import { toast } from "react-toastify";

export default function ToutorMyLessonsPage() {
  const { onlineUsers } = useSocket();
  const [lessonData, setLessonData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Modal and Action States
  const [cancelModal, setCancelModal] = useState({ show: false, bookingId: null });
  const [cancelReason, setCancelReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOnline = (id) => onlineUsers?.includes(id);

  // --- API Functions ---

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/booking/teacher?page=${currentPage}&limit=10`);
      // Handling different possible response structures
      const responseData = res.response?.data || res.data || {};
      const docs = responseData.docs || [];
      setLessonData(docs);
      setTotalPages(responseData.totalPages || 1);
    } catch (error) {
      console.error("Failed to load lessons:", error);
      setLessonData([]);
      toast.error("Could not fetch lessons.");
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    try {
      setIsSubmitting(true);
      // Endpoint: /booking/:bookingId/cancel
      await api.post(`/booking/${cancelModal.bookingId}/cancel`, {
        reason: cancelReason
      });

      toast.success("Booking cancelled successfully");
      setCancelModal({ show: false, bookingId: null });
      setCancelReason("");
      
      // Refresh list to show 'cancelled' status
      loadData();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      const errorMsg = error.response?.data?.message || "Failed to cancel booking";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- UI Components ---

  const LessonCard = ({ data }) => {
    const { _id, subject, status, date, fromTime, toTime } = data;

    const studentName = data.student?.name || "Student";
    const studentAvatar = data.student?.avatar || "https://vectorified.com/images/no-profile-picture-icon-24.jpg";
    const formattedDate = date ? new Date(date).toLocaleDateString() : 'N/A';

    const timeRange = fromTime && toTime
      ? `${new Date(fromTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(toTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      : 'N/A';

    const statusStyles = {
      completed: "bg-[#D1FAE5] text-[#0F766E]",
      scheduled: "bg-blue-100 text-blue-700",
      cancelled: "bg-red-100 text-red-700",
      unpaid: "bg-orange-100 text-orange-700",
      default: "bg-[#E5E7EB] text-[#6B7280]"
    };

    const currentStatusStyle = statusStyles[status] || statusStyles.default;

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
              <span className={`w-2.5 h-2.5 rounded-full ${isOnline(data.student?._id) ? "bg-green-500" : "bg-gray-300"}`}></span>
            </div>
            <span className={`text-[11px] px-3 py-1 rounded-full whitespace-nowrap font-semibold uppercase tracking-wider ${currentStatusStyle}`}>
              {status}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="grid grid-cols-1 gap-1">
              <p className="text-gray-600 text-[14px]">
                <span className="font-semibold text-gray-700">Subject:</span> {subject}
              </p>
              <div className="flex items-center gap-4 text-gray-500 text-[13px]">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-purple-500" /> {formattedDate}
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="text-purple-500" /> {timeRange}
                </div>
              </div>
            </div>

            {/* Only show Cancel button if the lesson is still 'scheduled' */}
            {status === "scheduled" && (
              <div className="flex gap-2">
                <button
                  onClick={() => setCancelModal({ show: true, bookingId: _id })}
                  className="flex items-center gap-1 bg-white border border-red-200 text-red-600 px-4 py-2 rounded-md text-xs font-medium hover:bg-red-50 transition-colors"
                >
                  <FiSlash size={14} />
                  Cancel Lesson
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading && !lessonData) {
    return <Spinner text="Loading your lessons..." className="text-[#6657E2]" />
  }

  return (
    <div className="bg-[#F5FAF7] min-h-screen p-4 md:p-8 relative">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-[20px] font-semibold text-[#6B46C1]">My Lessons</h1>
      </div>

      <p className="text-gray-500 mb-6 text-[13px]">
        View and manage your teaching schedule.
      </p>

      <div className="flex flex-col gap-4">
        {lessonData?.length > 0 ? (
          lessonData.map((data) => (
            <LessonCard key={data._id || data.id} data={data} />
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 italic">No lessons found in your schedule.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Back
          </button>
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Cancellation Modal */}
      {cancelModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Cancel Lesson</h3>
              <button
                onClick={() => setCancelModal({ show: false, bookingId: null })}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                rows="4"
                placeholder="Explain to the student why you need to cancel..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button
                disabled={isSubmitting}
                onClick={() => setCancelModal({ show: false, bookingId: null })}
                className="px-4 py-2 text-sm font-semibold text-gray-600"
              >
                Close
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleCancelBooking}
                className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? "Processing..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}