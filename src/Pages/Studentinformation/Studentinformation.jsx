import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

const Studentinformation = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    bio: "",
    subjects: []
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubjectChange = (subject) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        role: "student",
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        bio: formData.bio,
        subjects: formData.subjects
      };

      const res = await axios.post(
        "https://abilities-wav-behind-outdoors.trycloudflare.com/api/v1/auth/register",
        payload
      );

      console.log("REGISTER SUCCESS:", res.data);
      alert("Student registered successfully");

      navigate("/login");
    } catch (error) {
      console.log("REGISTER ERROR:", error);
      alert("Registration failed");
    }
  };

  return (
    <div className="w-full min-h-screen  flex items-center justify-center py-10">
      <div className="bg-white w-[700px] px-10 py-10 rounded-xl shadow-md">

        <h1 className="text-2xl font-semibold bg-gradient-to-r from-[#614EFE] via-[#903CD1] to-[#7D359F] bg-clip-text text-transparent">
          Personal Information
        </h1>

        <p className="text-[#4B5563] mt-1 text-sm">
          Please provide your basic personal information to begin the verification process.
        </p>

        <div className="mt-6">
          <h2 className="text-md font-semibold bg-gradient-to-r from-[#614EFE] via-[#903CD1] to-[#7D359F] bg-clip-text text-transparent">
            Profile Picture
          </h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg h-40 mt-2 flex items-center justify-center text-gray-500 text-md">
            Upload a file or drag and drop
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-md font-semibold bg-gradient-to-r from-[#614EFE] via-[#903CD1] to-[#7D359F] bg-clip-text text-transparent">
            Bio
          </h2>
          <textarea
            name="bio"
            placeholder="Upload a file  or drag and drop"
            className="w-full border border-gray-300 rounded-lg p-3 mt-2 h-20 text-sm"
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-5 mt-6">
          <div>
            <label className="text-md font-semibold bg-gradient-to-r from-[#614EFE] to-[#7D359F] bg-clip-text text-transparent">
              Full Name *
            </label>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-sm"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-md font-semibold bg-gradient-to-r from-[#614EFE] to-[#7D359F] bg-clip-text text-transparent">
              Date of Birth *
            </label>
            <input
              name="dateOfBirth"
              type="date"
              className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-sm"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="text-md font-semibold bg-gradient-to-r from-[#614EFE] to-[#7D359F] bg-clip-text text-transparent">
            Phone Number *
          </label>
          <input
            name="phone"
            type="text"
            placeholder="Phone Number"
            className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-sm"
            onChange={handleChange}
          />
        </div>

        <div className="mt-6">
          <label className="text-md font-semibold bg-gradient-to-r from-[#614EFE] to-[#7D359F] bg-clip-text text-transparent">
            Email *
          </label>
          <input
            name="email"
            type="email"
            placeholder="Username or Email"
            className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-sm"
            onChange={handleChange}
          />
        </div>

        <div className="mt-8">
          <h2 className="text-md font-semibold bg-gradient-to-r from-[#614EFE] via-[#903CD1] to-[#7D359F] bg-clip-text text-transparent">
            Interested Subject
          </h2>

          <div className="grid grid-cols-3 gap-y-3 mt-3 text-sm text-gray-700">
            {[
              "English","Mathematics","Physics","Science","History","Computer Science",
              "Geography","Chemistry","Physical Education","Biology","Art","Economics",
              "Music","Foreign Languages","Special Education","Social Studies",
              "Business Studies","Religious Studies"
            ].map((subject, index) => (
              <label key={index} className="flex items-center gap-2 text-[#101010]">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-[#6657E2]"
                  onChange={() => handleSubjectChange(subject)}
                />
                {subject}
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-8 py-3 text-white rounded-lg 
          bg-gradient-to-r from-[#6657E2] via-[#903CD1] to-[#903CD1]"
        >
          Sign up
        </button>

      </div>
    </div>
  );
};

export default Studentinformation;
