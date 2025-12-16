import { useEffect, useState } from "react";
import { LuSettings2 } from "react-icons/lu";
import { IoSearch } from "react-icons/io5";
import logo1 from "../../assets/business_center.png";
import logo2 from "../../assets/award_star.png";
import logo4 from "../../assets/payments.png";
import { Link, useNavigate } from "react-router";
import api from "../../services/api";

const FindTutors = () => {
  // this is for tutor data api end point calling part 
  const [tutor, setTutor] = useState([]);
  useEffect(() => {
    const tutorLoad = async () => {
      const res = await api.get("/social/teachers");
      setTutor(res.response.data.docs);
    }
    tutorLoad();
  }, []);

  // this is for testing tutor  
  console.log(tutor)

  const navigate = useNavigate();
  return (
    <div className="rounded-2xl mb-1">
      <h2 className="text-[22px] font-semibold text-[#6657E2]">
        Find Your Perfect Tutor
      </h2>
      <p className="text-gray-500 text-sm mt-1">
        Browse our qualified tutors and find the right match for your learning needs.
      </p>

      <div className="p-3 mt-5 rounded-2xl bg-white">
        <div className="flex flex-col sm:flex-row items-center gap-3">

          <div className="
      flex items-center bg-[#EBEBEB] border border-[#E5E7EB]
      px-3 h-[52px] rounded-xl w-full sm:max-w-[600px] shadow-sm
    ">
            <span className="text-gray-400 text-xl mr-3">
              <IoSearch />
            </span>

            <input
              type="text"
              placeholder="Search by name, subject, language"
              className="w-full bg-transparent outline-none text-[15px] placeholder-gray-400"
            />
          </div>

          <Link to="/dashboard/filtersidebar">
            <button className="
      bg-[#EBEBEB] border border-[#E5E7EB]
      h-[52px] w-full sm:w-[55px] rounded-xl shadow-sm
      flex items-center justify-center
    ">
              <span className="text-xl">
                <LuSettings2 />
              </span>
            </button>
          </Link>
        </div>
      </div>



      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tutor.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-md p-5">

            {/* Profile */}
            <div className="flex items-center gap-3 mt-5">
              <img src={item.avatar} alt="" className="w-11 h-11 rounded-full" />
              <div>
                <h3 className="font-semibold text-[17px]">{item.name}</h3>
                <p className="text-gray-500 text-sm">{item.subject}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 text-center mt-10">
              <div className="flex flex-col items-center">
                <img src={logo1} className="w-7 h-7 mb-1" />
                <p className="font-semibold text-[14px]">{item.teacher.yearsOfTeachingExp} years</p>
                <p className="text-gray-500 text-[11px]">Experience</p>
              </div>

              <div className="flex flex-col items-center border-l border-r border-gray-200 px-2">
                <img src={logo2} className="w-7 h-7 mb-1" />
                <p className="font-semibold text-[14px]">{item.teacher.rating}</p>
                <p className="text-gray-500 text-[11px]">Rating</p>
              </div>

              <div className="flex flex-col items-center">
                <img src={logo4} className="w-7 h-7 mb-1" />
                <p className="font-semibold text-[14px]">${item.teacher.hourlyRate}/hr</p>
                <p className="text-gray-500 text-[11px]">Price</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-[#7A7A7A] text-sm mt-4 leading-relaxed">
              {item.teacher.content}
            </p>

            {/* Button */}
            <button
              onClick={() => navigate(`/dashboard/tutordetails/${item.id}`)}
              className="w-full mt-5 py-3 text-white font-medium rounded-lg 
                            bg-gradient-to-r from-[#FFC30B] via-[#8113B5] to-[#8113B5]"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default FindTutors;
