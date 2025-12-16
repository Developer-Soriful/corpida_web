import { FiCalendar, FiClock } from "react-icons/fi";
import logo1 from "../../assets/IMG_8.png";
import { useEffect, useState } from "react";
import api from "../../services/api";
import Spinner from "../../Components/Spinner";

export default function MyLessonsPage() {
  // this is for state 
  const [lessonData, setLessonData] = useState(null)
  const LessonCard = ({ data }) => {
    const { img, name, subject, chapter, date, time, status } = data
    console.log(data)
    const statusColor =
      status === "Completed"
        ? "bg-[#D1FAE5] text-[#0F766E]"
        : "bg-[#E5E7EB] text-[#6B7280]";

    return (
      <div className="w-full bg-white rounded-lg p-10 shadow-[0_2px_6px_rgba(0,0,0,0.04)] flex flex-col items-start gap-4">
        <img
          src={img || logo1}
          alt="profile"
          className="w-[55px] h-[55px] rounded-full object-cover shrink-0"
        />

        <div className="w-1/2">
          <div className="flex items-center w-full justify-between mb-3">
            <h2 className="text-[16px] font-medium text-gray-800">{data.teacher.name}</h2>
            <span
              className={`text-[11px] px-3 py-[2px] rounded-full whitespace-nowrap ${statusColor}`}
            >
              {status}
            </span>
          </div>

          <p className="text-gray-600 text-[14px] mb-1">
            <span className="font-medium">Subject:</span> {subject}
          </p>

          <p className="text-gray-600 text-[14px] mb-3">
            <span className="font-medium">Chapter:</span> {chapter}
          </p>

          <div className="flex items-center gap-4 text-gray-600 text-[13px]">
            <div className="flex items-center gap-2">
              <FiCalendar className="text-[14px]" />
              {date}
            </div>

            <span className="text-gray-400">|</span>

            <div className="flex items-center gap-2">
              <FiClock className="text-[14px]" />
              {data.updatedAt}
            </div>
          </div>
        </div>
      </div>
    );
  };


  // this is the lesson data from data bse 
  useEffect(() => {
    const loadData = async () => {
      const res = await api.get("/dashboard/student")
      setLessonData(res.response.data.upcomingLessons)
    }
    loadData()
  }, [])
  if (!lessonData) {
    return <Spinner text="Loading dashboard..." />
  }
  // LessonCard(lessonData)
  // console.log(lessonData)
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
        {
          lessonData.map((data) => (
            <LessonCard key={data.id} data={data} />
          ))
        }
      </div>
    </div>
  );
}
