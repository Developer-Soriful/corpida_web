
import logo from "../../assets/Rectangle 923.png";
import { FaRegEdit } from "react-icons/fa";
import { Link } from "react-router";

import { useAuth } from "../../context/UseAuth";
import { FiChevronDown } from "react-icons/fi";

export default function MyProfile() {
    const { user } = useAuth();
    console.log(user)
    return (
        <div className=" bg-[#F3F7F2] min-h-screen">
            {/* TITLE */}
            <h2 className="text-[#6657E2] text-2xl font-semibold mb-1">My Profile</h2>
            <p className="text-gray-500 mb-8">
                Manage your personal information and learning preferences.
            </p>


            <div className="flex gap-8">

                {/* LEFT CARD */}
                <div className="w-64">
                    <div className="bg-white rounded-xl shadow p-6 text-center">
                        <img
                            src={user.avatar}
                            className="w-24 h-24 rounded-full mx-auto object-cover"
                        />

                        <h3 className="mt-4 font-semibold text-gray-900 text-lg">
                            {user.name}
                        </h3>

                        {/* Badge */}
                        <span className="px-3 py-1 text-xs text-[#F3934F] bg-[#EBEBEB] rounded-full mt-2 inline-block">
                            {user.role}
                        </span>

                        <p className="text-[#7C7C7C] text-xs mt-2">
                            Member since {user.createdAt}
                        </p>
                    </div>

                    {/* Learning Preferences */}
                    <div className="bg-white rounded-xl shadow p-6 mt-4">
                        <h3 className="text-[#6657E2] font-semibold mb-3 text-lg">
                            Learning Preferences
                        </h3>

                        <p className="text-[#7C7C7C] text-sm mb-2">Interests</p>

                        <div className="flex flex-wrap gap-2">
                            {user?.student?.interestedSubjects?.map((item) => (
                                <span
                                    key={item}
                                    className="px-3 py-1 font-medium text-xs rounded-full bg-[#EBEBEB] border border-[#E3E3FF]
                 bg-gradient-to-r from-[#6657E2] to-[#903CD1] text-transparent bg-clip-text"
                                >
                                    {item}
                                </span>
                            )) || <span className="text-gray-500 text-sm">No interests specified</span>}
                        </div>

                    </div>
                </div>

                {/* RIGHT FORM */}
                <div className="flex-1   p-8">

                    <div className="grid grid-cols-1 gap-6 w-full">

                        {/* Name */}
                        <div>
                            <label className="block mb-1 text-gray-700 text-sm">Name</label>
                            <p className="w-full rounded-lg shadow bg-[#FFFFFF] border-gray-300 px-4 py-3 outline-none text-sm"
                            >
                                {user.name}
                            </p>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block mb-1 text-gray-700 text-sm">Email</label>
                            <p className="w-full rounded-lg shadow bg-[#FFFFFF] border-gray-300 px-4 py-3 outline-none text-sm"
                            >
                                {user.email}
                            </p>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block mb-1 text-gray-700 text-sm">Phone Number</label>
                            <div className="flex gap-2">
                                <button
                                    className="px-4 flex items-center gap-2 rounded-lg text-sm text-white"
                                    style={{
                                        background: "linear-gradient(90deg, #6657E2, #903CD1)",
                                        border: "1px solid rgba(255,255,255,0.4)",
                                    }}
                                >
                                    <img
                                        src={logo}
                                        className="w-5 h-5 rounded-sm"
                                    />

                                    +1242

                                    {/* Dropdown Icon */}
                                    <FiChevronDown size={18} />
                                </button>
                                <p className="flex-1 rounded-lg shadow bg-[#FFFFFF] border-gray-300 px-4 py-3 outline-none text-sm"
                                >
                                    {user.phoneNumber || "Phone number not provided"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Edit Button */}

                    <div className="w-full flex justify-end">
                        <Link to="/dashboard/editprofile">
                            <button className="mt-8 bg-gradient-to-r from-[#6657E2] to-[#903CD1] hover:opacity-90 text-white px-6 py-3 rounded-lg flex items-center gap-2 text-sm font-medium shadow-md">
                                <FaRegEdit size="20" />
                                Edit Profile
                            </button>
                        </Link>
                    </div>



                </div>
            </div>
        </div>
    );
}
