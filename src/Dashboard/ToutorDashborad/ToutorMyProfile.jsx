import { useState, useRef, useEffect } from "react";
import defaultAvatar from "../../assets/user_icon.png";
import { FaRegEdit, FaSave, FaTimes } from "react-icons/fa";
import { FiCamera } from "react-icons/fi";
import { useAuth } from "../../context/UseAuth";
import Spinner from "../../Components/Spinner";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function TutorMyProfile() {
    // this is for tutor profile data integrate here 
    const { user, setUser } = useAuth()
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        countryCode: user?.countryCode || '+1242',
        bio: user?.bio || '',
        hourlyRate: user?.teacher?.hourlyRate || '',
        subjectsTaught: user?.teacher?.subjectsTaught?.join(', ') || '',
        availableTime: {
            startTime: user?.teacher?.availableTime?.startTime || '',
            endTime: user?.teacher?.availableTime?.endTime || ''
        },
        availableDays: user?.teacher?.availableDays?.join(', ') || '',
        qualification: user?.teacher?.qualification?.map(q =>
            `${q.title} - ${q.institution} (${q.year})`
        ).join('\n') || '',
        content: user?.teacher?.content || ''
    });

    // this is for loading spinner 
    if (!user) {
        return <Spinner text="User Loading....." />
    }

    // --- Helper Functions for Time Conversion ---
    const toInputTime = (val) => {
        if (!val) return '';
        // If ISO string (e.g. 2025-01-01T17:00...)
        if (val.includes('T')) {
            const date = new Date(val);
            if (isNaN(date.getTime())) return '';
            return date.toTimeString().slice(0, 5); // "17:00"
        }
        // If 12-hour format (e.g. "09:00 AM")
        const match = val.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (match) {
            let [_, h, m, ap] = match;
            h = parseInt(h);
            if (ap.toUpperCase() === 'PM' && h < 12) h += 12;
            if (ap.toUpperCase() === 'AM' && h === 12) h = 0;
            return `${h.toString().padStart(2, '0')}:${m}`;
        }
        return val; // Assume already HH:mm or invalid
    };

    const toBackendTime12h = (timeStr) => {
        if (!timeStr) return '';
        const [hStr, mStr] = timeStr.split(':');
        let h = parseInt(hStr);
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h.toString().padStart(2, '0')}:${mStr} ${ampm}`;
    };

    const toBackendIso = (timeStr, originalIso) => {
        if (!timeStr) {
            // If originalIso is valid, return it. Otherwise undefined.
            return (originalIso && originalIso !== '' && originalIso.includes('T')) ? originalIso : undefined;
        }

        // Construct a base date. Use original ISO date if valid, otherwise today.
        let date = new Date();
        if (originalIso && originalIso.includes('T')) {
            const parsed = new Date(originalIso);
            if (!isNaN(parsed.getTime())) date = parsed;
        }

        const [h, m] = timeStr.split(':');
        if (h === undefined || m === undefined) return undefined;

        date.setHours(parseInt(h), parseInt(m), 0, 0);
        return date.toISOString();
    };

    // Handle avatar/profile picture upload
    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            toast.error('Please select a valid image file (JPG, PNG, or GIF)');
            return;
        }

        // Validate file size (max 2MB)
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
        if (file.size > maxSize) {
            toast.error('Image size must be less than 2MB');
            return;
        }

        // Convert to base64 and update preview
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            setAvatarPreview(base64String);
            setFormData(prev => ({ ...prev, avatar: base64String }));
        };
        reader.readAsDataURL(file);
    };


    const handleEdit = () => {
        setIsEditing(true);
        // Set default values with formatted time for inputs
        setFormData(prev => ({
            ...prev,
            name: user?.name || '',
            email: user?.email || '',
            phoneNumber: user?.phoneNumber || '',
            countryCode: user?.countryCode || '+1242',
            bio: user?.bio || '',
            hourlyRate: user?.teacher?.hourlyRate || '',
            subjectsTaught: user?.teacher?.subjectsTaught?.join(', ') || '',
            availableTime: {
                startTime: toInputTime(user?.teacher?.availableTime?.startTime),
                endTime: toInputTime(user?.teacher?.availableTime?.endTime)
            },
            availableDays: user?.teacher?.availableDays?.join(', ') || '',
            qualification: user?.teacher?.qualification?.map(q =>
                `${q.title} - ${q.institution} (${q.year})`
            ).join('\n') || '',
            content: user?.teacher?.content || ''
        }));
    };

    const handleCancel = () => {
        setIsEditing(false);
        setAvatarPreview(null); // Reset avatar preview
        // Reset form data 
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            phoneNumber: user?.phoneNumber || '',
            countryCode: user?.countryCode || '+1242',
            bio: user?.bio || '',
            hourlyRate: user?.teacher?.hourlyRate || '',
            subjectsTaught: user?.teacher?.subjectsTaught?.join(', ') || '',
            availableTime: {
                startTime: user?.teacher?.availableTime?.startTime || '',
                endTime: user?.teacher?.availableTime?.endTime || ''
            },
            availableDays: user?.teacher?.availableDays?.join(', ') || '',
            qualification: user?.teacher?.qualification?.map(q =>
                `${q.title} - ${q.institution} (${q.year})`
            ).join('\n') || '',
            content: user?.teacher?.content || ''
        });
    };

    const handleSave = async () => {
        if (isSaving) return;
        setIsSaving(true);
        console.log('Saving profile data:', formData);

        try {
            // Process subjects - split by comma and trim each item
            const subjectsArray = formData.subjectsTaught
                .split(',')
                .map(s => s.trim())
                .filter(Boolean);

            // Process available days
            const daysArray = formData.availableDays
                .split(',')
                .map(d => d.trim())
                .filter(Boolean);

            // Process qualifications
            const qualificationsArray = formData.qualification
                .split('\n')
                .map(line => {
                    const match = line.match(/^(.*?) - (.*?) \((.*?)\)$/);
                    if (match) {
                        const yearMatch = match[3].trim();
                        const year = yearMatch && !isNaN(yearMatch) ? parseInt(yearMatch, 10) : new Date().getFullYear();
                        return {
                            title: match[1].trim() || 'Not specified',
                            institution: match[2].trim() || 'Not specified',
                            year: year
                        };
                    }
                    return line.trim() ? {
                        title: line.trim() || 'Not specified',
                        institution: `${line.trim()} Institution`,
                        year: new Date().getFullYear()
                    } : null;
                })
                .filter(Boolean);

            // Create FormData for the request
            const formDataPayload = new FormData();

            // Add basic user info
            formDataPayload.append('name', formData.name);
            if (formData.avatar) {
                formDataPayload.append('avatar', formData.avatar);
            }
            formDataPayload.append('phoneNumber', formData.phoneNumber);
            formDataPayload.append('countryCode', formData.countryCode);
            formDataPayload.append('bio', formData.bio);

            // Create teacher data object
            const teacherData = {
                ...(user?.teacher || {}), // Preserve existing teacher data
                yearsOfTeachingExp: user?.teacher?.yearsOfTeachingExp || 0,
                hourlyRate: Number(formData.hourlyRate) || 0,
                availableTime: {
                    startTime: toBackendIso(formData.availableTime.startTime, user?.teacher?.availableTime?.startTime) || new Date().toISOString(),
                    endTime: toBackendIso(formData.availableTime.endTime, user?.teacher?.availableTime?.endTime) || new Date().toISOString()
                },
                content: formData.content || formData.bio || 'No content provided',
                documents: Array.isArray(user?.teacher?.documents) ? user.teacher.documents : []
            };

            // Add arrays separately to ensure proper formatting
            subjectsArray.forEach((subject, index) => {
                formDataPayload.append(`teacher[subjectsTaught][${index}]`, subject);
            });

            daysArray.forEach((day, index) => {
                formDataPayload.append(`teacher[availableDays][${index}]`, day);
            });

            qualificationsArray.forEach((qual, index) => {
                formDataPayload.append(`teacher[qualification][${index}][title]`, qual.title || 'Not specified');
                formDataPayload.append(`teacher[qualification][${index}][institution]`, qual.institution || 'Not specified');
                // Ensure year is a valid number
                const yearValue = Number.isInteger(qual.year) ? qual.year : new Date().getFullYear();
                formDataPayload.append(`teacher[qualification][${index}][year]`, yearValue);
            });

            // Add other teacher data
            Object.entries(teacherData).forEach(([key, value]) => {
                if (key !== 'subjectsTaught' && key !== 'availableDays' && key !== 'qualification') {
                    if (typeof value === 'object' && value !== null) {
                        Object.entries(value).forEach(([subKey, subValue]) => {
                            formDataPayload.append(`teacher[${key}][${subKey}]`, subValue);
                        });
                    } else {
                        formDataPayload.append(`teacher[${key}]`, value);
                    }
                }
            });

            // Log the form data for debugging
            console.log('FormData entries:');
            for (let pair of formDataPayload.entries()) {
                console.log(pair[0], pair[1]);
            }

            // Send the request with proper headers
            const res = await api.patch("/user/self/update", formDataPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Handle different response structures
            const updatedUser = res.response?.data || res.data?.response?.data || res.data;

            if (updatedUser) {
                setUser(updatedUser);
                toast.success("Profile updated successfully!");
                setIsEditing(false);
            } else {
                console.warn('Unexpected response structure:', res);
                toast.success("Profile updated successfully!");
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Failed to save profile:", error);
            if (error.response) {
                console.error("Server Response Error:", error.response.data);
            }
            toast.error(error.response?.data?.message || "Failed to save changes. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };
    return (
        <div className="min-h-screen space-y-4 md:space-y-6 px-4 md:px-0">
            {/* TITLE */}
            <div>
                <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">My Profile</h2>
                <p className="text-gray-500 text-sm mt-1">
                    Manage your personal information and teaching preferences.
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
                                    src={avatarPreview || user?.avatar || defaultAvatar}
                                    alt={user?.name}
                                    className="w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto object-cover border-4 border-purple-100 bg-gray-50"
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
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <h3 className="mt-4 font-bold text-gray-900 text-base md:text-lg">
                            {user?.name}
                        </h3>

                        <span className="px-3 py-1 text-xs font-medium text-purple-700 bg-purple-50 rounded-full mt-2 inline-block capitalize">
                            {user?.role}
                        </span>

                        <p className="text-gray-500 text-xs md:text-sm mt-3">
                            Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>

                    {/* Teaching Preferences */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
                        <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4">
                            Teaching Preferences
                        </h3>
                        <p className="text-gray-500 text-xs md:text-sm mb-3">Subjects</p>
                        <div className="flex flex-wrap gap-2">
                            {user?.teacher?.subjectsTaught?.map((item) => (
                                <span
                                    key={item}
                                    className="px-2.5 py-1 md:px-3 md:py-1.5 font-medium text-xs rounded-full bg-purple-50 text-purple-700 border border-purple-100"
                                >
                                    {item}
                                </span>
                            )) || <span className="text-gray-500 text-sm">No subjects specified</span>}
                        </div>

                        {/* Available Time Preview */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-gray-500 text-xs md:text-sm mb-2">Available Hours</p>
                            <p className="text-sm text-gray-700">
                                {user?.teacher?.availableTime?.startTime && user?.teacher?.availableTime?.endTime
                                    ? `${toInputTime(user.teacher.availableTime.startTime)} - ${toInputTime(user.teacher.availableTime.endTime)}`
                                    : 'Not set'}
                            </p>
                        </div>

                        {/* Hourly Rate Preview */}
                        <div className="mt-3">
                            <p className="text-gray-500 text-xs md:text-sm mb-1">Hourly Rate</p>
                            <p className="text-sm text-gray-700 font-medium">
                                ${user?.teacher?.hourlyRate || '0'}/hour
                            </p>
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
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                    placeholder="Enter your name"
                                />
                            ) : (
                                <div className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-800">
                                    {user?.name}
                                </div>
                            )}
                        </div>

                        {/* Email */}
                        <div className="md:col-span-2">
                            <label className="block mb-1.5 text-gray-700 text-sm font-medium">Email</label>
                            <div className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                                {user?.email}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block mb-1.5 text-gray-700 text-sm font-medium">Phone Number</label>
                            <div className="flex gap-2">
                                <select
                                    value={formData.countryCode}
                                    onChange={(e) => isEditing && handleChange(e)}
                                    name="countryCode"
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
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                        placeholder="Enter phone number"
                                    />
                                ) : (
                                    <div className="flex-1 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-800">
                                        {user?.phoneNumber || "Not provided"}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hourly Rate */}
                        <div>
                            <label className="block mb-1.5 text-gray-700 text-sm font-medium">Hourly Rate ($)</label>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="hourlyRate"
                                    value={formData.hourlyRate}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                    placeholder="Enter hourly rate"
                                    min="0"
                                />
                            ) : (
                                <div className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-800">
                                    ${user?.teacher?.hourlyRate || '0'} / hour
                                </div>
                            )}
                        </div>

                        {/* Bio */}
                        <div className="md:col-span-2">
                            <label className="block mb-1.5 text-gray-700 text-sm font-medium">Bio</label>
                            {isEditing ? (
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none text-sm resize-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                    placeholder="Tell us about yourself..."
                                />
                            ) : (
                                <div className={`w-full rounded-xl border border-gray-100 px-4 py-3 text-sm ${user?.bio ? 'text-gray-800 bg-gray-50' : 'text-gray-400 bg-gray-50 italic'}`}>
                                    {user?.bio || "No bio added yet"}
                                </div>
                            )}
                        </div>

                        {/* About Me */}
                        <div className="md:col-span-2">
                            <label className="block mb-1.5 text-gray-700 text-sm font-medium">About Me</label>
                            {isEditing ? (
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none text-sm resize-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                    placeholder="More detailed introduction about your teaching experience..."
                                />
                            ) : (
                                <div className={`w-full rounded-xl border border-gray-100 px-4 py-3 text-sm ${user?.teacher?.content ? 'text-gray-800 bg-gray-50' : 'text-gray-400 bg-gray-50 italic'}`}>
                                    {user?.teacher?.content || "No detailed content added yet"}
                                </div>
                            )}
                        </div>

                        {/* Subjects Taught */}
                        <div className="md:col-span-2">
                            <label className="block mb-1.5 text-gray-700 text-sm font-medium">Subjects Taught</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="subjectsTaught"
                                    value={formData.subjectsTaught}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                    placeholder="Math, English, Science (comma separated)"
                                />
                            ) : (
                                <div className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-800 min-h-[46px]">
                                    {user?.teacher?.subjectsTaught?.join(', ') || "No subjects specified"}
                                </div>
                            )}
                        </div>

                        {/* Available Time */}
                        <div className="md:col-span-2">
                            <label className="block mb-1.5 text-gray-700 text-sm font-medium">Available Time</label>
                            {isEditing ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-1 text-gray-500 text-xs">Start Time</label>
                                        <input
                                            type="time"
                                            name="availableTime.startTime"
                                            value={formData.availableTime.startTime}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-gray-500 text-xs">End Time</label>
                                        <input
                                            type="time"
                                            name="availableTime.endTime"
                                            value={formData.availableTime.endTime}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-800">
                                    {user?.teacher?.availableTime?.startTime && user?.teacher?.availableTime?.endTime
                                        ? `${toInputTime(user.teacher.availableTime.startTime)} - ${toInputTime(user.teacher.availableTime.endTime)}`
                                        : "Not set"}
                                </div>
                            )}
                        </div>

                        {/* Available Days */}
                        <div className="md:col-span-2">
                            <label className="block mb-1.5 text-gray-700 text-sm font-medium">Available Days</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="availableDays"
                                    value={formData.availableDays}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                    placeholder="Monday, Tuesday, Wednesday (comma separated)"
                                />
                            ) : (
                                <div className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-800">
                                    {user?.teacher?.availableDays?.join(', ') || "No days specified"}
                                </div>
                            )}
                        </div>

                        {/* Qualifications */}
                        <div className="md:col-span-2">
                            <label className="block mb-1.5 text-gray-700 text-sm font-medium">Qualifications</label>
                            {isEditing ? (
                                <textarea
                                    name="qualification"
                                    value={formData.qualification}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none text-sm resize-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                    placeholder="B.Sc. in Mathematics - Dhaka University (2014)&#10;M.Sc. in Applied Math - Dhaka University (2016)"
                                />
                            ) : (
                                <div className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-800">
                                    {user?.teacher?.qualification?.length > 0 ? (
                                        <ul className="list-disc list-inside space-y-1">
                                            {user.teacher.qualification.map((q, i) => (
                                                <li key={i}>{q.title} - {q.institution} ({q.year})</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span className="text-gray-400 italic">No qualifications added</span>
                                    )}
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
                                    onClick={handleSave}
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
