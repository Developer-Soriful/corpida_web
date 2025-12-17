import { FiCalendar, FiClock } from "react-icons/fi";
import { useEffect, useState } from "react";
import api from "../../services/api";
import Spinner from "../../Components/Spinner";
import { useSocket } from "../../context/SocketContext";

export default function MyLessonsPage() {
  const { onlineUsers } = useSocket();
  // this is for state 
  const [lessonData, setLessonData] = useState(null)
  const LessonCard = ({ data }) => {
    const isOnline = (id) => onlineUsers.includes(id);
    const { img, name, subject, chapter, date, time, status } = data
    console.log(data)
    const statusColor =
      status === "Completed"
        ? "bg-[#D1FAE5] text-[#0F766E]"
        : "bg-[#E5E7EB] text-[#6B7280]";

    return (
      <div className="w-full bg-white rounded-lg p-10 shadow-[0_2px_6px_rgba(0,0,0,0.04)] flex flex-col items-start gap-4">
        <img
          src={img || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMUAAACUCAMAAAAUNB2QAAAASFBMVEX6+vqPj4////+JiYmurq6MjIyDg4OGhobu7u739/eVlZX09PTMzMzx8fGbm5vr6+ve3t6mpqbY2NjBwcG4uLjS0tLl5eV8fHwPhmHxAAAEOElEQVR4nO2c3ZKjIBBGpREQRARR5/3fdDWZmc3OJv4QhXaKc5GLqZoqTjVNED9SFJlMJpPJZDKZTCZzBeCb1CMJZR56awc/M9iquKIJQKOdIX8xbqgvJgJyMFww9mDBmOCmKy7jAUXlGX80+DbhRDfX8IBKE/5E4Q5XwyU8OideOsyI0qYe4hogvaKLEoRQpVMPcxmQjj1riB/twUrMXQ7FaiE+Z5XBu+iCFNsk5lmVerCvgMZslZiq4WTq8T4F6nK9JR6q0ace8HP8HompxzXC1oCO7LRQIz6Nxm1viju0rFMP+j/0613HK/iArRjVvul0gxlkxQC/vHm6RjHk3qa4F0OhsoCArrgVw2LSABPQFnMxSkQW0ISVYtqIYLLQQW0xWyCaUrBrB/UI7RFZBLbF1BgOj0WjAiWmtTb12L+BMVSCEFVhKca0nQ0HzcYW9BsWaBYp0KHNPdFliyOBIVwC0Yz6Hd1twyXwrLRvfOsRhedY6nfsQMJ3gwzTblCHPHXPYHrYgzr4KSn10B+BwPammJ5Yg08PPhBNqJnfcJITfKqWetw/qHaemM9QbCecRRGw2FJspZiKsfvkXyA8+YduwzviR5hCtkDdAL+vGCjfiBWFLPdoYDpPewT2vBQTpcRpUUBrti5UwtVIJWaNlTzOF7zEHC+CqtyyoeI93krMgPRibcFlAufq9AhYs/jFwYhDc+yxwFQOQ195MGY03lDRP0A7eTxbdClzvr2GQzGHaUddEv5PhzDBVT+0FynEHYC6HXpD+RfU+K6Vl3K4AYWUdWuHQevOtrXEHBVc4+Jh+Uwmc2ngOJI5yKrzfXkEvbdNEgWQtmRc0GPgnPQJLjRA1bPQONHz3a4gPvazE4wbn013eUR+joV2RzB+OzRyhH73ceZGjZhvZcCf4jAT75H8pPk0Q120FReGN9Ira0RLt8j+8PXpG+EjSQS8qtgO7SO91Jja4rwZRctIjTFZnCZBmKuyxS6L82ZUtsBjEa27p5X2N1g0u15D7rToo21rg0If24j33R1+aWQdFu3aGHThmc01CRMtkADtae0d9VZof9aUYj7ewx4MJ02puAmX+qTvvbgh4bfujSwR9x6DPKUYsfPa0IXmgJfgsV8jw/Fng4THj0zVOwN261AT/xYDjAfPKUZTxBKge5n2CJJIdUNJBySBX0qoZJfFjtNgKuFPIHTkmA0VVSl/GQtadUSPc5f2phjU/ce7s4p9+OSpVBhfJ9M2OVCDIfgFhV5OCi5BCZoEHlTehbxwnf7HIfr9QYBKl2w1gvqjDEKVA577nzegsd7xzSKMC6dHhNlgKOpWG75uwsTHpNDWeCN4UNs58ygo+7/hpz9RKjh1fsQr8Mmcr2ms7p1RitwPGeZPpZQxZa+tvEyM8J4VkrIdrbVdN33YsZJXzUGiyD9lMplMJpPJZDKZzB7+AM4LNtVmj5i3AAAAAElFTkSuQmCC"}
          alt="profile"
          className="w-[55px] h-[55px] rounded-full object-cover shrink-0"
        />

        <div className="w-1/2">
          <div className="flex items-center w-full justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-medium text-gray-800">{data.teacher.name}</h2>
              <span className={`w-2 h-2 rounded-full ${isOnline(data.teacher._id || data.teacher.id) ? "bg-green-500" : "bg-gray-300"}`}></span>
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
