import { FiCalendar, FiClock } from "react-icons/fi";
import logo1 from "../../assets/IMG_8.png";
import { useEffect, useState } from "react";
import api from "../../services/api";
import Spinner from "../../Components/Spinner";
import { useSocket } from "../../context/SocketContext";

export default function ToutorMyLessonsPage() {
  const { onlineUsers } = useSocket();
  const [lessonData, setLessonData] = useState(null)
  const isOnline = (id) => onlineUsers.includes(id);

  const LessonCard = ({ data }) => {
    // Handling cases where data might be missing or structure is different
    const img = data.student?.avatar || logo1;
    const name = data.student?.name || "Unknown Student";
    const subject = data.subject || "N/A";

    // Format Date from "2025-12-20T00:00:00.000Z" to readable format
    const formattedDate = data.date
      ? new Date(data.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : "N/A";

    // Format Time Range from fromTime/toTime
    const formatTime = (isoString) => {
      if (!isoString) return "";
      return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    const timeRange = (data.fromTime && data.toTime)
      ? `${formatTime(data.fromTime)} - ${formatTime(data.toTime)}`
      : "N/A";

    // Capitalize status
    const status = data.status ? data.status.charAt(0).toUpperCase() + data.status.slice(1) : "Scheduled";

    const statusColor =
      status === "Completed"
        ? "bg-[#D1FAE5] text-[#0F766E]"
        : "bg-[#E5E7EB] text-[#6B7280]";

    return (
      <div className="w-full bg-white rounded-lg p-10 shadow-[0_2px_6px_rgba(0,0,0,0.04)] flex flex-col items-start gap-4">
        <img
          src={img}
          alt="profile"
          className="w-[55px] h-[55px] rounded-full object-cover shrink-0"
        />

        <div className="w-1/2">
          <div className="flex items-center w-full justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-medium text-gray-800">{name}</h2>
              <span className={`w-2 h-2 rounded-full ${isOnline(data.student?._id || data.student?.id) ? "bg-green-500" : "bg-gray-300"}`}></span>
            </div>
            <span
              className={`text-[11px] px-3 py-[2px] rounded-full whitespace-nowrap ${statusColor}`}
            >
              {status}
            </span>
          </div>

          <p className="text-gray-600 text-[14px] mb-1">
            <span className="font-medium">Subject:</span> {subject}
          </p>

          {/* Chapter removed as it is not in the API response */}

          <div className="flex items-center gap-4 text-gray-600 text-[13px]">
            <div className="flex items-center gap-2">
              <FiCalendar className="text-[14px]" />
              {formattedDate}
            </div>

            <span className="text-gray-400">|</span>

            <div className="flex items-center gap-2">
              <FiClock className="text-[14px]" />
              {timeRange}
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get("/dashboard/teacher")
        // Assuming response structure is similar: res.response.data.upcomingLessons 
        const upcomingLessons = res.response?.data?.upcomingLessons || res.data?.upcomingLessons || [];
        setLessonData(upcomingLessons)
      } catch (error) {
        console.error("Failed to load lessons:", error);
        setLessonData([]); // Set empty array to stop loading spinner on error
      }
    }
    loadData()
  }, [])

  if (!lessonData) {
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
        {lessonData.length > 0 ? (
          lessonData.map((data) => (
            <LessonCard key={data.id || Math.random()} data={data} />
          ))
        ) : (
          <p className="text-gray-500 text-center py-10">No upcoming lessons found.</p>
        )}
      </div>
    </div>
  );
}
