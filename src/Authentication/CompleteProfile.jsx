import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { FiCamera, FiUser, FiCalendar, FiPhone, FiGlobe } from "react-icons/fi";
import { useAuth } from "../context/UseAuth";
import api, { getImageUrl } from "../services/api";
import Spinner from "../Components/Spinner";

const CompleteProfile = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(user?.avatar ? getImageUrl(user.avatar) : null);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        phoneNumber: "",
        countryCode: "+880",
        dateOfBirth: "",
        bio: "",
        avatar: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image size too large. Max 2MB.");
                return;
            }
            setFormData(prev => ({ ...prev, avatar: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataPayload = new FormData();

            // Append non-file fields
            if (formData.phoneNumber) formDataPayload.append('phoneNumber', Number(formData.phoneNumber));
            if (formData.countryCode) formDataPayload.append('countryCode', formData.countryCode);
            if (formData.dateOfBirth) formDataPayload.append('dateOfBirth', formData.dateOfBirth);
            if (formData.bio) formDataPayload.append('bio', formData.bio);

            // Append file if exists
            if (formData.avatar instanceof File) {
                formDataPayload.append('avatar', formData.avatar);
            }

            // Note: /user/self/update typically expects JSON if no files, or FormData if files.
            // Since we might upload avatar, we use FormData. API generally handles Multipart for updates.
            // However, looking at api.js, 'patch' function uses default json content-type if not specified.
            // We need to ensure axios handles headers correctly for FormData or manually set it.
            // But usually axios handles FormData automatically.

            // Important: Based on previous tasks (Student Profile), the API might expect JSON for fields 
            // and a separate call for avatar? Or supports FormData? 
            // In MyProfile.jsx (Student), we saw separate handling or JSON payload.
            // Let's check test.json again... line 1600+ shows 'body: raw' JSON for text fields 
            // AND a file param for 'avatar'. This suggests we can send everything as JSON 
            // EXCEPT the file. But standard is FormData for mixed.
            // If the backend assumes standard Multer, FormData works.
            // Let's try FormData approach as it's standard for file upload + data.

            const res = await api.patch("/user/self/update", formDataPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Update local user context
            if (res.response?.data) {
                setUser(res.response.data);
            }

            toast.success("Profile completed successfully!");
            navigate("/"); // Redirect to Home

        } catch (error) {
            console.error("Profile update error:", error);
            const msg = error.response?.data?.message || "Failed to update profile";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F4F8F5] py-10 px-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl px-8 py-10 shadow-xl">
                <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-[#614EFE] via-[#7D359F] to-[#7D359F] bg-clip-text text-transparent mb-2">
                    Complete Your Profile
                </h2>
                <p className="text-center text-[#585858] mb-8">
                    Let's get to know you better. Please fill in the details below.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center justify-center mb-6">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="w-28 h-28 rounded-full border-4 border-[#E3E3FF] overflow-hidden">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                        <FiUser size={40} />
                                    </div>
                                )}
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <FiCamera className="text-white" size={24} />
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                            accept="image/*"
                        />
                        <p className="text-xs text-gray-500 mt-2">Click to upload avatar</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Phone Number */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <FiPhone />
                                </div>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    placeholder="017..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Country Code */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">Country Code</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <FiGlobe />
                                </div>
                                <input
                                    type="text"
                                    name="countryCode"
                                    value={formData.countryCode}
                                    onChange={handleInputChange}
                                    placeholder="+880"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Date of Birth */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">Date of Birth</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <FiCalendar />
                                </div>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 block">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            placeholder="Tell us a little about yourself..."
                            rows="4"
                            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none transition-all resize-none"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-gradient-to-r from-[#6657E2] to-[#903CD1] text-white py-3.5 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 ${loading ? 'opacity-70 cursor-wait' : ''}`}
                    >
                        {loading ? <Spinner size="small" showText={false} fullScreen={false} className="border-white" /> : "Complete Profile"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompleteProfile;
