import { FiCamera, FiPlus, FiTrash } from "react-icons/fi";
import profilePic from "../../assets/banner.png";
import { useAuth } from "../../context/UseAuth";
import { useState, useRef, useEffect } from "react";
import api from "../../services/api";
import { objectToFormData } from "../../utils/formDataHelper";
import { useNavigate } from "react-router";
import Spinner from "../../Components/Spinner";
import { toast } from "react-toastify";

export default function ToutorEditProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  // Basic User State
  const [previewUrl, setPreviewUrl] = useState(user?.avatar || profilePic);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+880');
  const [dob, setDob] = useState('');

  // Teacher Specific State
  const [hourlyRate, setHourlyRate] = useState('');
  const [bio, setBio] = useState('');
  const [aboutContent, setAboutContent] = useState('');

  // Availability
  const [availableStartTime, setAvailableStartTime] = useState('');
  const [availableEndTime, setAvailableEndTime] = useState('');
  const [availableDays, setAvailableDays] = useState([]);

  // Qualifications (Array of objects)
  const [qualifications, setQualifications] = useState([
    { title: '', institution: '', year: '' }
  ]);

  // Subjects (Array of strings)
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');

  const formRef = useRef(null);

  useEffect(() => {
    if (user) {
      setPreviewUrl(user.avatar || profilePic);
      if (user.countryCode) setSelectedCountryCode(user.countryCode);
      if (user.dateOfBirth) {
        const d = new Date(user.dateOfBirth);
        if (!isNaN(d.getTime())) setDob(d.toISOString().split('T')[0]);
      }
      setBio(user.bio || '');

      if (user.teacher) {
        setHourlyRate(user.teacher.hourlyRate || '');
        setAboutContent(user.teacher.content || '');
        if (user.teacher.subjectsTaught) setSubjects(user.teacher.subjectsTaught);

        if (user.teacher.availableTime) {
          // Assuming format like "09:00 AM" or ISO string. Input type=time expects HH:mm
          // If backend sends ISO, we might need parsing. 
          // Using simple text for now if format is "09:00 AM", or strictly type="time" if HH:mm
          setAvailableStartTime(user.teacher.availableTime.startTime || '');
          setAvailableEndTime(user.teacher.availableTime.endTime || '');
        }

        if (user.teacher.availableDays) setAvailableDays(user.teacher.availableDays);

        if (user.teacher.qualification && user.teacher.qualification.length > 0) {
          setQualifications(user.teacher.qualification);
        }
      }
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Qualifications Handlers
  const handleQualificationChange = (index, field, value) => {
    const newQuals = [...qualifications];
    newQuals[index][field] = value;
    setQualifications(newQuals);
  };

  const addQualification = () => {
    setQualifications([...qualifications, { title: '', institution: '', year: '' }]);
  };

  const removeQualification = (index) => {
    const newQuals = qualifications.filter((_, i) => i !== index);
    setQualifications(newQuals);
  };

  // Subjects Handlers
  const addSubject = () => {
    if (newSubject.trim()) {
      if (!subjects.includes(newSubject.trim())) {
        setSubjects([...subjects, newSubject.trim()]);
      }
      setNewSubject('');
    }
  };

  const removeSubject = (sub) => {
    setSubjects(subjects.filter(s => s !== sub));
  };

  // Days Handler
  const toggleDay = (day) => {
    if (availableDays.includes(day)) {
      setAvailableDays(availableDays.filter(d => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(formRef.current);

    // Construct the payload object structure
    const payload = {
      name: formData.get('name'),
      bio: bio,
      phoneNumber: formData.get('phoneNumber'),
      countryCode: selectedCountryCode,
      dateOfBirth: dob ? new Date(dob).toISOString() : null,

      // Nested Teacher Object
      teacher: {
        hourlyRate: Number(hourlyRate),
        content: aboutContent,
        subjectsTaught: subjects,
        availableDays: availableDays,
        availableTime: {
          startTime: availableStartTime,
          endTime: availableEndTime
        },
        qualification: qualifications.filter(q => q.title && q.institution) // Filter empty
      }
    };

    const apiFormData = new FormData();

    objectToFormData(payload, apiFormData);

    // Files
    if (selectedImage) {
      apiFormData.append('avatar', selectedImage);
    }

    try {
      const res = await api.patch("/user/self/update", apiFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.response?.data) {
        setUser(res.data.response.data);
        toast.success('Profile updated successfully!');
        navigate('/toturdashbord/toutormyprofile');
      }
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const daysOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  if (!user) return <Spinner text="Loading Profile..." />;

  return (
    <div className="min-h-screen">
      <form ref={formRef} onSubmit={handleSubmit}>
        {/* TITLE */}
        <h2 className="text-[#6657E2] text-2xl font-semibold mb-1">Edit profile</h2>
        <p className="text-gray-500 mb-8">
          Manage your personal information and learning preferences.
        </p>

        <div className="flex gap-8 flex-col lg:flex-row">

          {/* LEFT CARD */}
          <div className="w-full lg:w-74 bg-">
            <div className="bg-[#FFFFFF] rounded-xl shadow p-6 text-center pb-8">
              <div className="relative inline-block">
                <label className="cursor-pointer">
                  <img
                    src={previewUrl}
                    className="w-24 h-24 rounded-full mt-5 mx-auto object-cover"
                    onError={(e) => { e.target.src = profilePic; }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center mt-5">
                    <div className="bg-black bg-opacity-50 rounded-full w-24 h-24 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <FiCamera className="text-white text-xl" />
                    </div>
                  </div>
                  <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                </label>
              </div>

              <h3 className="mt-4 font-semibold text-gray-900 text-lg">
                {user.name}
              </h3>

              {/* Badge */}
              <span className="px-3 py-1 text-xs text-[#F3934F] bg-[#EBEBEB] rounded-full mt-2 inline-block">
                {user.role}
              </span>

              <p className="text-[#7C7C7C] text-xs mt-2">
                Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
              </p>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="flex-1 p-5 rounded-xl shadow bg-white">

            <div className="grid grid-cols-1 gap-6 w-full">

              {/* Name */}
              <div>
                <label className="block text-gray-700 text-sm">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={user.name}
                  className="w-full rounded-lg bg-white border border-gray-300 px-2 py-3 outline-none text-sm shadow-sm"
                />
              </div>

              {/* Date of Birth & Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm">Email</label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    disabled
                    className="w-full rounded-lg bg-gray-100 border border-gray-300 px-2 py-3 outline-none text-sm text-gray-500 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full rounded-lg bg-white border border-gray-300 px-2 py-3 outline-none text-sm shadow-sm"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block mb-1 text-gray-700 text-sm">Phone Number</label>

                <div className="flex gap-3">
                  {/* COUNTRY CODE */}
                  <select
                    value={selectedCountryCode}
                    onChange={(e) => setSelectedCountryCode(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 bg-white shadow-sm"
                  >
                    <option value="+880">+880</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                  </select>

                  {/* PHONE INPUT */}
                  <input
                    type="text"
                    name="phoneNumber"
                    defaultValue={user.phoneNumber || ''}
                    className="flex-1 rounded-lg bg-white border border-gray-300 px-2 py-3 outline-none text-sm shadow-sm"
                  />
                </div>
              </div>

              <hr className="my-2 border-gray-200" />
              <h3 className="font-semibold text-lg text-gray-800">Teacher Information</h3>

              {/* Qualifications */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-gray-700 text-sm font-medium">Qualifications</label>
                  <button type="button" onClick={addQualification} className="text-[#6657E2] text-sm flex items-center gap-1 hover:underline">
                    <FiPlus /> Add
                  </button>
                </div>
                <div className="space-y-3">
                  {qualifications.map((qual, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="grid grid-cols-3 gap-2 flex-1">
                        <input
                          placeholder="Title (e.g. BSc)"
                          value={qual.title}
                          onChange={(e) => handleQualificationChange(index, 'title', e.target.value)}
                          className="border rounded px-2 py-2 text-sm"
                        />
                        <input
                          placeholder="Institution"
                          value={qual.institution}
                          onChange={(e) => handleQualificationChange(index, 'institution', e.target.value)}
                          className="border rounded px-2 py-2 text-sm"
                        />
                        <input
                          placeholder="Year"
                          type="number"
                          value={qual.year}
                          onChange={(e) => handleQualificationChange(index, 'year', e.target.value)}
                          className="border rounded px-2 py-2 text-sm"
                        />
                      </div>
                      <button type="button" onClick={() => removeQualification(index)} className="text-red-500 p-2 hover:bg-red-50 rounded">
                        <FiTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block mb-1 text-gray-700 text-sm">Short Bio</label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-lg shadow-sm bg-white border border-gray-300 px-4 py-3 outline-none text-sm"
                  placeholder="I'm an experienced teacher..."
                />
              </div>

              {/* About/Content */}
              <div>
                <label className="block mb-1 text-gray-700 text-sm">About / Content</label>
                <textarea
                  value={aboutContent}
                  onChange={(e) => setAboutContent(e.target.value)}
                  className="w-full h-24 rounded-lg shadow-sm bg-white border-gray-300 border px-4 py-3 outline-none text-sm resize-none"
                ></textarea>
              </div>

              {/* Hourly Rate */}
              <div>
                <label className="block mb-1 text-gray-700 text-sm">Hourly Rate ($)</label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full rounded-lg shadow-sm bg-white border border-gray-300 px-4 py-3 outline-none text-sm"
                />
              </div>

              {/* Subjects */}
              <div>
                <label className="block mb-1 text-gray-700 text-sm">Subjects Taught</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {subjects.map((sub, idx) => (
                    <span key={idx} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs flex items-center gap-1">
                      {sub}
                      <button type="button" onClick={() => removeSubject(sub)} className="hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
                    placeholder="Add a subject..."
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                  <button type="button" onClick={addSubject} className="bg-[#6657E2] text-white px-4 rounded text-sm">Add</button>
                </div>
              </div>

              {/* Availability Days */}
              <div>
                <label className="block mb-2 text-gray-700 text-sm">Available Days</label>
                <div className="flex flex-wrap gap-2">
                  {daysOptions.map(day => (
                    <button
                      type="button"
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1 rounded-full text-xs border ${availableDays.includes(day)
                        ? 'bg-[#6657E2] text-white border-[#6657E2]'
                        : 'bg-white text-gray-600 border-gray-300'
                        }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm">Start Time</label>
                  <input
                    type="time"
                    value={availableStartTime}
                    onChange={(e) => setAvailableStartTime(e.target.value)}
                    className="w-full rounded-lg bg-white border border-gray-300 px-2 py-3 outline-none text-sm shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm">End Time</label>
                  <input
                    type="time"
                    value={availableEndTime}
                    onChange={(e) => setAvailableEndTime(e.target.value)}
                    className="w-full rounded-lg bg-white border border-gray-300 px-2 py-3 outline-none text-sm shadow-sm"
                  />
                </div>
              </div>

            </div>

            {/* EDIT BUTTON */}
            <div className="w-full flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="mt-6 bg-linear-to-r from-[#6657E2] to-[#903CD1] hover:opacity-90 text-white px-6 py-3 rounded-lg flex items-center gap-2 text-sm font-medium shadow-md disabled:opacity-70 disabled:cursor-not-allowed">
                {isSaving ? <Spinner size="small" showText={false} fullScreen={false} className="text-white" /> : 'Save Changes'}
              </button>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}
