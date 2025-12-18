import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { LuSettings2 } from "react-icons/lu";

import { Link, useNavigate, useParams } from "react-router";
import profileImg from "../../assets/IMG_8.png";
import logo2 from "../../assets/business_center.png";
import logo3 from "../../assets/award_star.png";
import logo4 from "../../assets/payments.png";
import logo5 from '../../assets/banner.png'
import api from "../../services/api";
import { toast } from "react-toastify";

export default function TutorDetails() {
  const navigate = useNavigate()
  const { id } = useParams();
  const [tutor, setTutor] = useState(null);
  const tutorData = tutor
  // this is for tutor details api end point calling part 
  const handleMessageButton = () => {
    // Navigate to SendMessages with tutor ID and tutor data for population
    navigate(`/dashboard/sendMessages/${id}`, { state: { tutor: tutorData } });
  }
  useEffect(() => {
    const tutorLoad = async () => {
      const res = await api.get(`/user/${id}`);
      setTutor(res.response.data)
    }
    tutorLoad();
  }, [])
  const reviews = [
    {
      id: 1,
      name: "Darrell Steward",
      date: "12/05/25",
      rating: 4.8,
      total: 120,
      img: "https://randomuser.me/api/portraits/men/32.jpg",
      text:
        "Ms. Sarah helped me prepare for my B math exams, I improved from a 4.0 to 6! Her techniques and practice sessions are very effective."
    },
    {
      id: 2,
      name: "Courtney Henry",
      date: "10/11/25",
      rating: 5.0,
      total: 98,
      img: "https://randomuser.me/api/portraits/women/44.jpg",
      text:
        "Highly professional tutor. She explains concepts clearly and provides great materials for practice."
    },
    {
      id: 3,
      name: "Wade Warren",
      date: "01/02/26",
      rating: 4.6,
      total: 88,
      img: "https://randomuser.me/api/portraits/men/75.jpg",
      text:
        "Amazing teaching method! My speaking skills improved a lot within a month."
    }
  ];
  // this is for teacher review data 
  // useEffect(() => { 
  //   const tutorReviewLoad = async () => {
  //     const res = await api.get(`/review/user`);
  //     setTutor(res.response.data.docs)
  //   }
  //   tutorReviewLoad();
  // }, [])

  // this is for handle bookings 
  const handleBooking = async () => {
    // Check if tutor data is available
    if (!tutor || !tutor.teacher) {
      toast.error("Tutor data not loaded. Please try again.");
      return;
    }

    try {
      // Get the first subject from the tutor's subjects or use default
      const subject = tutor.teacher.subjectsTaught?.[0] || "Mathematics";
      
      console.log("Booking with data:", {
        teacherId: id,
        subject: subject,
        tutorData: tutor.teacher
      });

      // Call booking claim API first
      const bookingResponse = await api.post('/booking/claim', {
        teacherId: id, // Teacher ID from URL params
        date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        duration: 1, // 1 hour session
        time: new Date().toISOString(), // Current time in ISO format
        subject: subject // Use the determined subject
      });

      if (bookingResponse.status === 200) {
        console.log("Booking response:", bookingResponse.data);
        
        // Check if response contains Stripe checkout URL
        const stripeCheckoutUrl = bookingResponse.data?.response?.data || 
                                  bookingResponse.data?.data;
        
        if (stripeCheckoutUrl && stripeCheckoutUrl.startsWith('https://checkout.stripe.com')) {
          // Open Stripe checkout page in new external tab
          window.open(stripeCheckoutUrl, '_blank');
        } else {
          // Fallback: Get booking ID and navigate to payment page
          const createdBookingId = bookingResponse.data?.response?.data?.id || 
                                  bookingResponse.data?.data?.id || 
                                  bookingResponse.data?.id || 
                                  id;
          
          console.log("Created booking ID:", createdBookingId);
          const bookingAmount = tutor?.teacher?.hourlyRate || 50.00;
          navigate(`/dashboard/paymentul/${createdBookingId}/${bookingAmount}`);
        }
      } else {
        // Handle booking creation error
        toast.error("Failed to create booking");
      }
    } catch (error) {
      console.error("Booking claim error:", error);
      toast.error("Failed to create booking");
    }
  }
  return (
    <div className="min-h-screen bg-[#F3F7F2] p-5">

      {/* 🔍 Search Bar */}
      <div className="bg-white p-3 rounded-xl shadow-sm ">


        <div className="flex items-center w-[900px] mx-auto gap-3">

          <div className="flex items-center bg-[#EBEBEB] border border-[#E5E7EB]
              px-3 h-[52px] rounded-xl w-full shadow-sm">
            <IoSearch className="text-gray-400 text-xl mr-2" />
            <input
              type="text"
              placeholder="Search by name, subject, language"
              className="w-full bg-transparent outline-none text-[15px]"
            />
          </div>

          <Link to="/dashboard/filtersidebar">
            <button className="bg-[#EBEBEB] border border-[#E5E7EB]
                h-[52px] w-[55px] rounded-xl shadow-sm flex items-center justify-center">
              <LuSettings2 className="text-xl" />
            </button>
          </Link>
        </div>
      </div>
      {/* MAIN CARD */}
      <div className="bg-white shadow-md rounded-2xl p-8 mt-10 max-w-4xl mx-auto">

        {/* Top Profile */}
        <div className="flex items-center gap-4">
          <img src={tutorData?.avatar} className="w-14 h-14 rounded-full" />
          <div>
            <h2 className="text-lg font-semibold">{tutorData?.name}</h2>
            <p className="text-gray-600">English</p>
          </div>
        </div>

        {/* Experience - Rating - Price */}
        <div className="grid grid-cols-3 w-96  text-center mt-10">

          <div className="flex flex-col items-center">
            <img src={logo2} className="w-7 h-7 mb-1" />
            <p className="font-semibold text-[14px]">{tutorData?.teacher?.yearsOfTeachingExp} years</p>
            <p className="text-gray-500 text-[11px]">Experience</p>
          </div>

          <div className="flex flex-col items-center border-l border-r border-gray-200 px-2">
            <img src={logo4} className="w-7 h-7 mb-1" />
            <p className="font-semibold text-[14px]">{tutorData?.teacher?.rating}</p>
            <p className="text-gray-500 text-[11px]">Rating</p>
          </div>

          <div className="flex flex-col items-center">
            <img src={logo3} className="w-7 h-7 mb-1" />
            <p className="font-semibold text-[14px]">${tutorData?.teacher?.hourlyRate}/hr</p>
            <p className="text-gray-500 text-[11px]">Price</p>
          </div>

        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm mt-6 leading-relaxed">
          {tutorData?.bio}
        </p>

        {/* Banner Image */}
        <div className="mt-6">
          <img
            src={logo5}
            className="w-full rounded-xl h-[270px] object-cover"
          />
        </div>

        {/* Qualification */}
        <h3 className="mt-8 font-semibold text-[#3D3D3D]">Qualification</h3>
        <p className="text-sm text-[#7C7C7C] mt-2">
          {tutorData?.teacher.qualification?.map((item, index) => (
            <span key={item.id || index}>
              {item.title}, {item.institution} - {item.year}
              {index < tutorData.teacher.qualification.length - 1 && <br />}
            </span>
          ))}
        </p>

        {/* Subject */}
        <h3 className="mt-8 font-semibold text-[#7C7C7C]">Subject</h3>
        <div className="flex flex-wrap gap-2 mt-2 max-w-[250px]">
          {tutorData?.teacher.subjectsTaught
            ?.map((item) => (
              <span
                key={item}
                className="
        px-3 py-1 text-sm rounded-full 
        bg-[#EBEBEB]
        border border-[#E3E3FF]
        font-medium
        bg-clip-text text-transparent
        bg-linear-to-r from-[#6657E2] to-[#903CD1]
      "
              >
                {item}
              </span>
            ))}
        </div>




        {/* Language */}
        <h3 className="mt-8 font-semibold text-[#7C7C7C]">Language</h3>

        <div className="inline-block px-3 py-1 bg-[#EBEBEB] border border-[#E3E3FF] rounded-full">
          <p
            className="
      text-sm font-medium
      bg-gradient-to-r from-[#6657E2] to-[#903CD1]
      bg-clip-text text-transparent
    "
          >
            English
          </p>
        </div>




        {/* Available Time */}
        <h3 className="mt-8 font-semibold text-[#7C7C7C]">Available time and date</h3>

        <div className="mt-2 flex flex-col gap-2">
          <span className="px-4 py-2 text-sm text-[#7C7C7C] shadow rounded-lg inline-block w-fit">
            {tutorData?.teacher.availableTime.startTime} to {tutorData?.teacher.availableTime.endTime}
          </span>

          <span className="px-4 py-2 text-sm text-[#7C7C7C] shadow rounded-lg flex flex-row gap-4 w-fit ">
            {tutorData?.teacher.availableDays.map((data, index) => {
              return (
                <span key={index}>{data}</span>
              )
            })}
          </span>
        </div>

        {/* Reviews */}
        <h3 className="mt-10 font-semibold text-[#7C7C7C]">Review</h3>
        <div className="mt-5 space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="flex items-start gap-3">
              <img src={review.img} className="w-10 h-10 rounded-full" />

              <div className="w-full">

                {/* Name + Date */}
                <div className="flex items-center justify-between">
                  <h4 className="text-sm text-[#0A0A0A] font-semibold">{review.name}</h4>
                  <p className="text-xs text-[#333333]">{review.date}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-[2px]">
                  <span className="text-[#FFB800] text-sm"> ★★★★★</span>

                </div>

                {/* Review Text */}
                <p className="text-sm text-[#333333] mt-2 leading-relaxed">
                  {review.text}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleBooking} className="w-full mt-5 py-3 text-white font-medium rounded-lg 
            bg-gradient-to-r from-[#FFC30B] via-[#8113B5] to-[#8113B5]">
          Book Now
        </button>
        <button onClick={() => handleMessageButton()} className="w-full cursor-pointer mt-5 py-3 text-white font-medium rounded-lg 
            bg-gradient-to-r from-[#6657E2] via-[#903CD1] to-[#903CD1]">
          Massage
        </button>
      </div>
    </div>
  );
}
