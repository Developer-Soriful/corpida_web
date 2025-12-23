import { FiCamera } from "react-icons/fi";
import logo from "../../assets/Rectangle 923.png";
import { useAuth } from "../../context/UseAuth";
import { useState, useRef, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router";
import { objectToFormData } from "../../utils/formDataHelper";
import { toast } from "react-toastify";
import Spinner from "../../Components/Spinner";

export default function EditProfile() {
  const { user, setUser } = useAuth()
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(user?.avatar)
  const [selectedCountryCode, setSelectedCountryCode] = useState('+1242')
  const [dob, setDob] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const formRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      setPreviewUrl(user.avatar || logo);
      if (user.countryCode) setSelectedCountryCode(user.countryCode);
      if (user.dateOfBirth) {
        // Format date for date input (YYYY-MM-DD)
        const d = new Date(user.dateOfBirth);
        if (!isNaN(d.getTime())) {
          setDob(d.toISOString().split('T')[0]);
        }
      }
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true);
    try {
      const formData = new FormData(formRef.current)
      const phoneStr = formData.get('phoneNumber')?.toString().trim();
      const nameStr = formData.get('name')?.toString().trim();
      const bioStr = formData.get('bio')?.toString().trim();

      const updateData = {
        name: nameStr || undefined,
        bio: bioStr || undefined,
        phoneNumber: phoneStr ? Number(phoneStr) : undefined,
        dateOfBirth: dob ? new Date(dob).toISOString() : null,
        countryCode: selectedCountryCode
      };

      // Remove undefined keys
      Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

      // Construct API FormData
      const apiFormData = new FormData();

      // Append fields using helper or manually for specific logic
      objectToFormData(updateData, apiFormData);

      // Handle avatar separation if it's a file
      if (selectedImage) {
        apiFormData.append('avatar', selectedImage);
      }

      // Send FormData to backend
      const res = await api.patch("/user/self/update", apiFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log('Update response:', res.data)

      // Update user state with new data
      if (res.data?.response?.data) {
        const updatedUser = res.data.response.data
        setUser(updatedUser)

        // Update preview URL if avatar was updated
        if (updatedUser.avatar) {
          setPreviewUrl(updatedUser.avatar)
        }
      }

      // Show success message and redirect
      toast.success('Profile updated successfully!');
      navigate('/dashboard/myprofile')

    } catch (error) {
      console.error('Update failed:', error.response?.data || error.message)
      toast.error('Failed to update profile. Please try again.')
    } finally {
      setIsSaving(false);
    }
  }

  if (!user) return <Spinner text="Loading Profile..." className="text-[#6657E2]" />;

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      {/* TITLE */}
      <h2 className="text-[#6657E2] text-2xl font-semibold mb-1">Edit profile</h2>
      <p className="text-gray-500 mb-8">
        Manage your personal information and learning preferences.
      </p>

      <div className="flex gap-8">

        {/* LEFT CARD */}
        <div className="w-74">
          <div className="bg-white h-85 rounded-xl shadow p-6 text-center">
            <div className="relative inline-block">
              <label className="cursor-pointer">
                <img
                  src={previewUrl}
                  className="w-24 h-24 rounded-full mt-5 mx-auto object-cover"
                  alt="User avatar"
                  onError={(e) => { e.target.src = logo; }} // Fallback
                />
                <div className="absolute inset-0 flex items-center justify-center mt-5">
                  <div className="bg-black bg-opacity-50 rounded-full w-24 h-24 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <FiCamera className="text-white text-xl" />
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
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
              Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="flex-1  p-5 rounded-xl shadow">

          <div className="grid grid-cols-1 gap-6 w-full">

            {/* Name */}
            <div>
              <label className="block  text-gray-700 text-sm">Name</label>
              <input
                type="text"
                name="name"
                defaultValue={user.name}
                className="w-full rounded-lg bg-white border border-gray-300 px-2 py-3 outline-none text-sm shadow-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block  text-gray-700 text-sm">Email</label>
              <input
                type="email"
                name="email"
                defaultValue={user.email}
                disabled={true}
                className="w-full rounded-lg bg-white border text-gray-400 border-gray-300 px-2 py-3 outline-none text-sm shadow-sm"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block mb-1 text-gray-700 text-sm">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full rounded-lg bg-white border border-gray-300 px-2 py-3 outline-none text-sm shadow-sm"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block mb-1 text-gray-700 text-sm">Phone Number</label>

              <div className="flex gap-3">

                {/* COUNTRY CODE SELECT */}
                <select
                  value={selectedCountryCode}
                  onChange={(e) => setSelectedCountryCode(e.target.value)}
                  className="px-4 flex items-center gap-2 text-black rounded-lg  shadow-sm"
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

                {/* PHONE INPUT */}
                <input
                  type="text"
                  name="phoneNumber"
                  defaultValue={user.phoneNumber || ''}
                  className="flex-1 rounded-lg bg-white border border-gray-300 px-2 py-3 outline-none text-sm shadow-sm"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block mb-1 text-gray-700 text-sm">Bio</label>
              <textarea
                name="bio"
                defaultValue={user.bio || ''}
                rows="3"
                className="w-full rounded-lg bg-white border border-gray-300 px-2 py-3 outline-none text-sm shadow-sm resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          {/* EDIT BUTTON */}
          <div className="w-full flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className={`mt-3 px-6 py-3 rounded-lg flex items-center gap-2 text-sm font-medium shadow-md text-white ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-linear-to-r from-[#6657E2] to-[#903CD1] hover:opacity-90'}`}
            >
              {isSaving ? <Spinner size="small" showText={false} fullScreen={false} className="text-white" /> : null}
              {isSaving ? 'Saving...' : 'Save Change'}
            </button>
          </div>

        </div>
      </div>
    </form>
  );
}
