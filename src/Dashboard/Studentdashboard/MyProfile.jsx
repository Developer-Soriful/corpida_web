import { useState, useRef, useEffect } from "react";
import logo from "../../assets/Rectangle 923.png";
import { FaRegEdit, FaSave, FaTimes } from "react-icons/fa";
import { FiChevronDown, FiCamera } from "react-icons/fi";
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

    // Image Upload State
    const [previewUrl, setPreviewUrl] = useState(user?.avatar || logo);
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setBio(user.bio || '');
            setPhoneNumber(user.phoneNumber || '');
            setCountryCode(user.countryCode || '+1242');
            setPreviewUrl(user.avatar || logo);

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
        setPreviewUrl(user?.avatar || logo);
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
                setPreviewUrl(updatedUser.avatar || logo);
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
        <div className="bg-[#F3F7F2] min-h-screen">
            {/* TITLE */}
            <h2 className="text-[#6657E2] text-2xl font-semibold mb-1">My Profile</h2>
            <p className="text-gray-500 mb-8">
                Manage your personal information and learning preferences.
            </p>

            <div className="flex gap-8">
                {/* LEFT CARD */}
                <div className="w-64">
                    <div className="bg-white rounded-xl shadow p-6 text-center">
                        <div className="relative inline-block">
                            <img
                                src={previewUrl}
                                className="w-24 h-24 rounded-full mx-auto object-cover"
                                alt="Profile"
                                onError={(e) => { e.target.src = logo; }}
                            />
                            {isEditing && (
                                <div
                                    className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="bg-black bg-opacity-50 rounded-full w-24 h-24 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <FiCamera className="text-white text-xl" />
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

                        <h3 className="mt-4 font-semibold text-gray-900 text-lg">
                            {user.name}
                        </h3>

                        <span className="px-3 py-1 text-xs text-[#F3934F] bg-[#EBEBEB] rounded-full mt-2 inline-block">
                            {user.role}
                        </span>

                        <p className="text-[#7C7C7C] text-xs mt-2">
                            Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
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
                <div className="flex-1 p-8">
                    <div className="grid grid-cols-1 gap-6 w-full">
                        {/* Name */}
                        <div>
                            <label className="block mb-1 text-gray-700 text-sm">Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full rounded-lg shadow bg-white border-gray-300 px-4 py-3 outline-none text-sm"
                                />
                            ) : (
                                <p className="w-full rounded-lg shadow bg-[#FFFFFF] border-gray-300 px-4 py-3 outline-none text-sm">
                                    {user.name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block mb-1 text-gray-700 text-sm">Email</label>
                            <p className="w-full rounded-lg shadow bg-gray-50 text-gray-500 border-gray-300 px-4 py-3 outline-none text-sm">
                                {user.email}
                            </p>
                        </div>

                        {/* Date of Birth - Only show input in edit, or text if exists */}
                        {isEditing && (
                            <div>
                                <label className="block mb-1 text-gray-700 text-sm">Date of Birth</label>
                                <input
                                    type="date"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    className="w-full rounded-lg shadow bg-white border-gray-300 px-4 py-3 outline-none text-sm"
                                />
                            </div>
                        )}

                        {/* Phone */}
                        <div>
                            <label className="block mb-1 text-gray-700 text-sm">Phone Number</label>
                            <div className="flex gap-2">
                                {isEditing ? (
                                    <select
                                        value={countryCode}
                                        onChange={(e) => setCountryCode(e.target.value)}
                                        className="px-4 rounded-lg text-sm text-white shadow-md"
                                        style={{
                                            background: "linear-gradient(90deg, #6657E2, #903CD1)",
                                            border: "1px solid rgba(255,255,255,0.4)",
                                        }}
                                    >
                                        <option value="+880">🇧🇩 +880</option>
                                        <option value="+1">🇺🇸 +1</option>
                                        <option value="+44">🇬🇧 +44</option>
                                        <option value="+91">🇮🇳 +91</option>
                                        <option value="+1242">🇧🇸 +1242</option>
                                    </select>
                                ) : (
                                    <div
                                        className="px-4 flex items-center gap-2 rounded-lg text-sm text-white shadow-md"
                                        style={{
                                            background: "linear-gradient(90deg, #6657E2, #903CD1)",
                                            border: "1px solid rgba(255,255,255,0.4)",
                                        }}
                                    >
                                        <img src={logo} className="w-5 h-5 rounded-sm" />
                                        {user.countryCode || '+1242'}
                                        <FiChevronDown size={18} />
                                    </div>
                                )}

                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="flex-1 rounded-lg shadow bg-white border-gray-300 px-4 py-3 outline-none text-sm"
                                        placeholder="Enter phone number"
                                    />
                                ) : (
                                    <p className="flex-1 rounded-lg shadow bg-[#FFFFFF] border-gray-300 px-4 py-3 outline-none text-sm">
                                        {user.phoneNumber || "Phone number not provided"}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Bio */}
                        {isEditing ? (
                            <div>
                                <label className="block mb-1 text-gray-700 text-sm">Bio</label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full h-24 rounded-lg shadow bg-white border-gray-300 px-4 py-3 outline-none text-sm resize-none"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                        ) : user.bio && (
                            <div>
                                <label className="block mb-1 text-gray-700 text-sm">Bio</label>
                                <p className="w-full rounded-lg shadow bg-[#FFFFFF] border-gray-300 px-4 py-3 outline-none text-sm">
                                    {user.bio}
                                </p>
                            </div>
                        )}

                    </div>

                    {/* Action Buttons */}
                    <div className="w-full flex justify-end gap-3 mt-8">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg flex items-center gap-2 text-sm font-medium shadow-md hover:bg-gray-50"
                                >
                                    <FaTimes size="20" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSaving}
                                    className={`px-6 py-3 rounded-lg flex items-center gap-2 text-sm font-medium shadow-md text-white ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-linear-to-r from-[#6657E2] to-[#903CD1] hover:opacity-90'}`}
                                >
                                    {isSaving ? <Spinner size="small" showText={false} fullScreen={false} className="text-white" /> : <FaSave size="20" />}
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleEdit}
                                className="bg-gradient-to-r from-[#6657E2] to-[#903CD1] hover:opacity-90 text-white px-6 py-3 rounded-lg flex items-center gap-2 text-sm font-medium shadow-md"
                            >
                                <FaRegEdit size="20" />
                                Edit Profile
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
