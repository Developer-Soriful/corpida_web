import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { FiCamera, FiUser, FiCalendar, FiPhone, FiGlobe, FiBook, FiDollarSign, FiClock, FiCheck } from "react-icons/fi";
import { useAuth } from "../context/UseAuth";
import api, { getImageUrl } from "../services/api";
import Spinner from "../Components/Spinner";

const TeacherCompleteProfile = () => {
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
        avatar: null,
        yearsOfTeachingExp: 0,
        subjectsTaught: [""],
        hourlyRate: 0,
        availableTime: {
            startTime: "09:00",
            endTime: "17:00"
        },
        availableDays: [],
        qualification: [{ title: "", institution: "", year: "" }],
        documents: []
    });

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    useEffect(() => {
        // If user is not a teacher, redirect to home
        if (user?.role !== 'teacher') {
            navigate('/');
        }
    }, [user, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNestedInputChange = (parent, name, value) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [name]: value
            }
        }));
    };

    const handleQualificationChange = (index, field, value) => {
        const updatedQualifications = [...formData.qualification];
        updatedQualifications[index] = {
            ...updatedQualifications[index],
            [field]: field === 'year' ? parseInt(value) || '' : value
        };
        setFormData(prev => ({
            ...prev,
            qualification: updatedQualifications
        }));
    };

    const addQualification = () => {
        setFormData(prev => ({
            ...prev,
            qualification: [...prev.qualification, { title: "", institution: "", year: "" }]
        }));
    };

    const removeQualification = (index) => {
        const updatedQualifications = formData.qualification.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            qualification: updatedQualifications.length > 0 ? updatedQualifications : [{ title: "", institution: "", year: "" }]
        }));
    };

    const handleSubjectChange = (index, value) => {
        const updatedSubjects = [...formData.subjectsTaught];
        updatedSubjects[index] = value;
        setFormData(prev => ({
            ...prev,
            subjectsTaught: updatedSubjects.filter(subject => subject.trim() !== "")
        }));
    };

    const addSubject = () => {
        setFormData(prev => ({
            ...prev,
            subjectsTaught: [...prev.subjectsTaught, ""]
        }));
    };

    const toggleDay = (day) => {
        setFormData(prev => {
            const updatedDays = prev.availableDays.includes(day)
                ? prev.availableDays.filter(d => d !== day)
                : [...prev.availableDays, day];
            return {
                ...prev,
                availableDays: updatedDays
            };
        });
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

    const handleDocumentUpload = (e) => {
        const files = Array.from(e.target.files);
        // Validate file types and sizes
        const validFiles = files.filter(file => {
            const isValidType = ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type);
            const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max
            
            if (!isValidType) {
                toast.error(`Invalid file type: ${file.name}. Only PDF, JPG, and PNG are allowed.`);
                return false;
            }
            if (!isValidSize) {
                toast.error(`File too large: ${file.name}. Max size is 5MB.`);
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            setFormData(prev => ({
                ...prev,
                documents: [...prev.documents, ...validFiles]
            }));
        }
    };

    const removeDocument = (index) => {
        setFormData(prev => ({
            ...prev,
            documents: prev.documents.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataPayload = new FormData();

            // Basic info
            if (formData.phoneNumber) formDataPayload.append('phoneNumber', Number(formData.phoneNumber));
            if (formData.countryCode) formDataPayload.append('countryCode', formData.countryCode);
            if (formData.dateOfBirth) formDataPayload.append('dateOfBirth', formData.dateOfBirth);
            if (formData.bio) formDataPayload.append('bio', formData.bio);
            if (formData.avatar) formDataPayload.append('avatar', formData.avatar);

            // Teacher specific fields
            formDataPayload.append('yearsOfTeachingExp', formData.yearsOfTeachingExp);
            formDataPayload.append('subjectsTaught', JSON.stringify(formData.subjectsTaught));
            formDataPayload.append('hourlyRate', formData.hourlyRate);
            formDataPayload.append('availableTime', JSON.stringify(formData.availableTime));
            formDataPayload.append('availableDays', JSON.stringify(formData.availableDays));
            formDataPayload.append('qualification', JSON.stringify(formData.qualification));
            
            // Append documents
            formData.documents.forEach((doc, index) => {
                formDataPayload.append(`documents`, doc);
            });

            const response = await api.patch("/user/self/update", formDataPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Update local user context
            if (response.response?.data) {
                setUser(response.response.data);
                toast.success("Profile completed successfully!");
                navigate("/");
            }

        } catch (error) {
            console.error("Profile update error:", error);
            const msg = error.response?.data?.message || "Failed to update profile";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">Complete Your Teacher Profile</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Please provide the following information to complete your profile and start teaching.
                    </p>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <form onSubmit={handleSubmit} className="space-y-8 p-6">
                        {/* Basic Information */}
                        <div className="border-b border-gray-200 pb-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h3>
                            
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                {/* Profile Picture */}
                                <div className="sm:col-span-6">
                                    <div className="flex items-center">
                                        <div className="relative">
                                            {imagePreview ? (
                                                <img
                                                    className="h-24 w-24 rounded-full object-cover"
                                                    src={imagePreview}
                                                    alt="Profile"
                                                />
                                            ) : (
                                                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <FiUser className="h-12 w-12 text-gray-400" />
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current.click()}
                                                className="absolute -bottom-2 -right-2 bg-indigo-600 rounded-full p-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                <FiCamera className="h-4 w-4" />
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleImageChange}
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="sm:col-span-6">
                                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                                        Bio
                                    </label>
                                    <div className="mt-1">
                                        <textarea
                                            id="bio"
                                            name="bio"
                                            rows={3}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                                            placeholder="Tell us about yourself and your teaching experience..."
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">
                                        A brief introduction about yourself and your teaching philosophy.
                                    </p>
                                </div>

                                {/* Contact Information */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <select
                                            id="countryCode"
                                            name="countryCode"
                                            value={formData.countryCode}
                                            onChange={handleInputChange}
                                            className="focus:ring-indigo-500 focus:border-indigo-500 h-10 block w-20 pl-3 pr-8 py-2 text-sm border-gray-300 bg-gray-50 rounded-l-md border-r-0"
                                        >
                                            <option value="+1">+1 (US)</option>
                                            <option value="+44">+44 (UK)</option>
                                            <option value="+880">+880 (BD)</option>
                                            <option value="+91">+91 (IN)</option>
                                        </select>
                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            id="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                            placeholder="123-456-7890"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                                        Date of Birth
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            id="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleInputChange}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Teaching Information */}
                        <div className="border-b border-gray-200 pb-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Teaching Information</h3>
                            
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                {/* Years of Experience */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="yearsOfTeachingExp" className="block text-sm font-medium text-gray-700">
                                        Years of Teaching Experience
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="number"
                                            name="yearsOfTeachingExp"
                                            id="yearsOfTeachingExp"
                                            min="0"
                                            value={formData.yearsOfTeachingExp}
                                            onChange={handleInputChange}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                </div>

                                {/* Hourly Rate */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">
                                        Hourly Rate (USD)
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            name="hourlyRate"
                                            id="hourlyRate"
                                            min="0"
                                            step="0.01"
                                            value={formData.hourlyRate}
                                            onChange={handleInputChange}
                                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md p-2"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                {/* Subjects Taught */}
                                <div className="sm:col-span-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subjects You Teach
                                    </label>
                                    <div className="space-y-2">
                                        {formData.subjectsTaught.map((subject, index) => (
                                            <div key={index} className="flex space-x-2">
                                                <input
                                                    type="text"
                                                    value={subject}
                                                    onChange={(e) => handleSubjectChange(index, e.target.value)}
                                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                                                    placeholder="e.g., Mathematics, Physics"
                                                />
                                                {formData.subjectsTaught.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const updatedSubjects = [...formData.subjectsTaught];
                                                            updatedSubjects.splice(index, 1);
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                subjectsTaught: updatedSubjects.length > 0 ? updatedSubjects : [""]
                                                            }));
                                                        }}
                                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addSubject}
                                            className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Add Another Subject
                                        </button>
                                    </div>
                                </div>

                                {/* Available Days */}
                                <div className="sm:col-span-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Available Days
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {daysOfWeek.map((day) => (
                                            <div key={day} className="flex items-center">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleDay(day)}
                                                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium w-full text-center ${
                                                        formData.availableDays.includes(day)
                                                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {formData.availableDays.includes(day) && (
                                                        <FiCheck className="mr-1.5 h-4 w-4 text-indigo-600" />
                                                    )}
                                                    {day.slice(0, 3)}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Available Time */}
                                <div className="sm:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Available From
                                    </label>
                                    <input
                                        type="time"
                                        value={formData.availableTime.startTime}
                                        onChange={(e) => handleNestedInputChange('availableTime', 'startTime', e.target.value)}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                                    />
                                </div>
                                <div className="sm:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Available Until
                                    </label>
                                    <input
                                        type="time"
                                        value={formData.availableTime.endTime}
                                        onChange={(e) => handleNestedInputChange('availableTime', 'endTime', e.target.value)}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Qualifications */}
                        <div className="border-b border-gray-200 pb-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Qualifications</h3>
                            
                            <div className="space-y-6">
                                {formData.qualification.map((qual, index) => (
                                    <div key={index} className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <div className="sm:col-span-6 flex justify-between items-center">
                                            <h4 className="text-sm font-medium text-gray-700">Qualification #{index + 1}</h4>
                                            {formData.qualification.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeQualification(index)}
                                                    className="text-sm text-red-600 hover:text-red-800"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className="sm:col-span-6">
                                            <label htmlFor={`qual-title-${index}`} className="block text-sm font-medium text-gray-700">
                                                Degree/Title
                                            </label>
                                            <input
                                                type="text"
                                                id={`qual-title-${index}`}
                                                value={qual.title}
                                                onChange={(e) => handleQualificationChange(index, 'title', e.target.value)}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="e.g., Bachelor of Science in Computer Science"
                                            />
                                        </div>

                                        <div className="sm:col-span-4">
                                            <label htmlFor={`qual-institution-${index}`} className="block text-sm font-medium text-gray-700">
                                                Institution
                                            </label>
                                            <input
                                                type="text"
                                                id={`qual-institution-${index}`}
                                                value={qual.institution}
                                                onChange={(e) => handleQualificationChange(index, 'institution', e.target.value)}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="e.g., University of Example"
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label htmlFor={`qual-year-${index}`} className="block text-sm font-medium text-gray-700">
                                                Year
                                            </label>
                                            <input
                                                type="number"
                                                id={`qual-year-${index}`}
                                                min="1900"
                                                max={new Date().getFullYear() + 5}
                                                value={qual.year}
                                                onChange={(e) => handleQualificationChange(index, 'year', e.target.value)}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="e.g., 2020"
                                            />
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addQualification}
                                    className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Add Another Qualification
                                </button>
                            </div>
                        </div>

                        {/* Documents */}
                        <div className="border-b border-gray-200 pb-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Supporting Documents</h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col w-full h-32 border-4 border-dashed hover:bg-gray-50 hover:border-gray-300">
                                        <div className="flex flex-col items-center justify-center pt-7">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-12 h-12 text-gray-400 group-hover:text-gray-600"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                                                Upload certificates, degrees, or other supporting documents (PDF, JPG, PNG)
                                            </p>
                                        </div>
                                        <input 
                                            type="file" 
                                            className="opacity-0" 
                                            onChange={handleDocumentUpload}
                                            multiple
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                    </label>
                                </div>

                                {formData.documents.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents:</h4>
                                        <ul className="space-y-2">
                                            {formData.documents.map((doc, index) => (
                                                <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                    <span className="text-sm text-gray-600 truncate">
                                                        {doc.name || `Document ${index + 1}`}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeDocument(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="terms" className="font-medium text-gray-700">
                                    I agree to the <a href="/terms" className="text-indigo-600 hover:text-indigo-500">Terms of Service</a> and{' '}
                                    <a href="/privacy" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-5">
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Saving...' : 'Complete Profile'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TeacherCompleteProfile;
