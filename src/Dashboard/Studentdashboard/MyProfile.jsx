import { useState, useRef, useEffect } from "react";
import defaultAvatar from "../../assets/user_icon.png";
import { FaRegEdit, FaSave, FaTimes } from "react-icons/fa";
import { FiCamera } from "react-icons/fi";
import { useAuth } from "../../context/UseAuth";
import api from "../../services/api";
import { objectToFormData } from "../../utils/formDataHelper";
import { toast } from "react-toastify";
import Spinner from "../../Components/Spinner";

export default function MyProfile() {
    const { user, setUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form States
    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [countryCode, setCountryCode] = useState(user?.countryCode || '+1242');
    const [dob, setDob] = useState('');

    // Image Upload State - prioritize selected image preview, then user avatar, then default
    const [previewUrl, setPreviewUrl] = useState(user?.avatar || defaultAvatar);
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setBio(user.bio || '');
            setPhoneNumber(user.phoneNumber || '');
            setCountryCode(user.countryCode || '+1242');
            setPreviewUrl(user.avatar || defaultAvatar);

            if (user.dateOfBirth) {
                const d = new Date(user.dateOfBirth);
                if (!isNaN(d.getTime())) {
                    setDob(d.toISOString().split('T')[0]);
                }
            }
        }
    }, [user]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset form to user data
        setName(user?.name || '');
        setBio(user?.bio || '');
        setPhoneNumber(user?.phoneNumber || '');
        setCountryCode(user?.countryCode || '+1242');
        setPreviewUrl(user?.avatar || defaultAvatar);
        setSelectedImage(null);
        if (user?.dateOfBirth) {
            const d = new Date(user.dateOfBirth);
            if (!isNaN(d.getTime())) setDob(d.toISOString().split('T')[0]);
        } else {
            setDob('');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            const phoneStr = phoneNumber?.toString().trim();
            const nameStr = name?.toString().trim();
            const bioStr = bio?.toString().trim();

            const updateData = {
                name: nameStr || undefined,
                bio: bioStr || undefined,
                phoneNumber: phoneStr ? Number(phoneStr) : undefined,
                dateOfBirth: dob ? new Date(dob).toISOString() : null,
                countryCode: countryCode
            };

            // Remove undefined keys
            Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

            console.log("Sending Update Payload:", updateData);

            const apiFormData = new FormData();
            objectToFormData(updateData, apiFormData);

            if (selectedImage) {
                apiFormData.append('avatar', selectedImage);
            }

            const res = await api.patch("/user/self/update", apiFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log("Update Response:", res);

            // Check for response structure (api.js unwraps response, so res is the body)
            const updatedUser = res.response?.data || res.user || res.data?.response?.data;

            if (updatedUser) {
                console.log("User Updated Successfully:", updatedUser);
                setUser(updatedUser);
                setPreviewUrl(updatedUser.avatar || defaultAvatar);
                toast.success('Profile updated successfully!');
                setIsEditing(false);
            } else {
                console.warn("Unexpected response structure:", res);
                toast.warning("Profile saved but response structure was unexpected.");
            }
        } catch (error) {
            console.error('Update failed:', error);
            const errorMsg = error.response?.data?.message || 'Failed to update profile. Please try again.';
            toast.error(errorMsg);
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) return <Spinner text="Loading Profile..." className="text-[#6657E2]" />;

    return (
        <div className="min-h-screen space-y-4 md:space-y-6 px-4 md:px-0">
            {/* TITLE */}
            <div>
                <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">My Profile</h2>
                <p className="text-gray-500 text-sm mt-1">
                    Manage your personal information and learning preferences.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                {/* LEFT CARD - Profile Summary */}
                <div className="w-full lg:w-80 xl:w-72 flex-shrink-0 space-y-4 lg:space-y-6">
                    {/* Profile Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 text-center">
                        <div className="relative inline-block">
                            <div className="relative">
                                <img
                                    src={previewUrl}
                                    className="w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto object-cover border-4 border-purple-100 bg-gray-50"
                                    alt="Profile"
                                    onError={(e) => { e.target.src = defaultAvatar; }}
                                />
                                {isEditing && (
                                    <div
                                        className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <div className="bg-black/60 rounded-full w-20 h-20 md:w-24 md:h-24 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <FiCamera className="text-white text-lg md:text-xl" />
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <h3 className="mt-4 font-bold text-gray-900 text-base md:text-lg">
                            {user.name}
                        </h3>

                        <span className="px-3 py-1 text-xs font-medium text-purple-700 bg-purple-50 rounded-full mt-2 inline-block capitalize">
                            {user.role}
                        </span>

                        <p className="text-gray-500 text-xs md:text-sm mt-3">
                            Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>

                    {/* Learning Preferences */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
                        <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4">
                            Learning Preferences
                        </h3>
                        <p className="text-gray-500 text-xs md:text-sm mb-3">Interests</p>
                        <div className="flex flex-wrap gap-2">
                            {user?.student?.interestedSubjects?.map((item) => (
                                <span
                                    key={item}
                                    className="px-2.5 py-1 md:px-3 md:py-1.5 font-medium text-xs rounded-full bg-purple-50 text-purple-700 border border-purple-100"
                                >
                                    {item}
                                </span>
                            )) || <span className="text-gray-500 text-sm">No interests specified</span>}
                        </div>
                    </div>
                </div>

                {/* RIGHT FORM */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 lg:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {/* Name */}
                        <div className="md:col-span-2">
                            <label className="block mb-1.5 text-gray-700 text-sm font-medium">Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                    placeholder="Enter your name"
                                />
                            ) : (
                                <div className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-800">
                                    {user.name}
                                </div>
                            )}
                        </div>

                        {/* Email */}
                        <div className="md:col-span-2">
                            <label className="block mb-1.5 text-gray-700 text-sm font-medium">Email</label>
                            <div className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                                {user.email}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block mb-1.5 text-gray-700 text-sm font-medium">Date of Birth</label>
                            {isEditing ? (
                                <input
                                    type="date"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                />
                            ) : (
                                <div className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-800">
                                    {dob ? new Date(dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not provided'}
                                </div>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block mb-1.5 text-gray-700 text-sm font-medium">Phone Number</label>
                            <div className="flex gap-2">
                                <select
                                    value={countryCode}
                                    onChange={(e) => isEditing && setCountryCode(e.target.value)}
                                    disabled={!isEditing}
                                    className="px-3 rounded-xl text-sm bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 outline-none cursor-pointer disabled:cursor-default min-w-[80px]"
                                >
                                    <option value="+880" className="text-gray-800 bg-white">🇧🇩 +880</option>
                                    <option value="+1" className="text-gray-800 bg-white">🇺🇸 +1</option>
                                    <option value="+44" className="text-gray-800 bg-white">🇬🇧 +44</option>
                                    <option value="+91" className="text-gray-800 bg-white">🇮🇳 +91</option>
                                    <option value="+1242" className="text-gray-800 bg-white">🇧🇸 +1242</option>
                                </select>

                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                        placeholder="Enter phone number"
                                    />
                                ) : (
                                    <div className="flex-1 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-800">
                                        {user.phoneNumber || "Not provided"}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="md:col-span-2">
                            <label className="block mb-1.5 text-gray-700 text-sm font-medium">Bio</label>
                            {isEditing ? (
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={4}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none text-sm resize-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                    placeholder="Tell us about yourself..."
                                />
                            ) : (
                                <div className={`w-full rounded-xl border border-gray-100 px-4 py-3 text-sm ${user.bio ? 'text-gray-800 bg-gray-50' : 'text-gray-400 bg-gray-50 italic'}`}>
                                    {user.bio || "No bio added yet"}
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 md:mt-8">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                    className="px-5 py-2.5 md:px-6 md:py-3 border border-gray-200 text-gray-700 rounded-xl flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-50 transition-colors"
                                >
                                    <FaTimes size={18} />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSaving}
                                    className={`px-5 py-2.5 md:px-6 md:py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-white transition-all ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:opacity-90 hover:shadow-lg'}`}
                                >
                                    {isSaving ? <Spinner size="small" showText={false} fullScreen={false} className="text-white" /> : <FaSave size={18} />}
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleEdit}
                                className="px-5 py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:opacity-90 text-white rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all hover:shadow-lg"
                            >
                                <FaRegEdit size={18} />
                                Edit Profile
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
