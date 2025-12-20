import { useState, useEffect, useRef } from 'react';
import { IoArrowBack, IoChevronDown } from 'react-icons/io5';
import { HiPlus } from 'react-icons/hi';
import { FiEdit2, FiSave } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import api from '../../../services/api';

const PersonalInfo = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // --- State Management ---
  const [profile, setProfile] = useState({
    name: '', email: '', phoneNumber: '', countryCode: '',
    role: '', avatar: '', bio: '', dateOfBirth: '',
  });
  const [selectedFile, setSelectedFile] = useState(null); // Holds the actual File object
  const [previewUrl, setPreviewUrl] = useState(null);     // For local UI preview
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  // Country data with flags and codes
  const countries = [
    { code: '+1', name: 'United States', flag: 'https://flagcdn.com/w40/us.png' },
    { code: '+44', name: 'United Kingdom', flag: 'https://flagcdn.com/w40/gb.png' },
    { code: '+880', name: 'Bangladesh', flag: 'https://flagcdn.com/w40/bd.png' },
    { code: '+91', name: 'India', flag: 'https://flagcdn.com/w40/in.png' },
    { code: '+86', name: 'China', flag: 'https://flagcdn.com/w40/cn.png' },
    { code: '+81', name: 'Japan', flag: 'https://flagcdn.com/w40/jp.png' },
    { code: '+49', name: 'Germany', flag: 'https://flagcdn.com/w40/de.png' },
    { code: '+33', name: 'France', flag: 'https://flagcdn.com/w40/fr.png' },
    { code: '+39', name: 'Italy', flag: 'https://flagcdn.com/w40/it.png' },
    { code: '+34', name: 'Spain', flag: 'https://flagcdn.com/w40/es.png' },
    { code: '+7', name: 'Russia', flag: 'https://flagcdn.com/w40/ru.png' },
    { code: '+55', name: 'Brazil', flag: 'https://flagcdn.com/w40/br.png' },
    { code: '+61', name: 'Australia', flag: 'https://flagcdn.com/w40/au.png' },
    { code: '+1', name: 'Canada', flag: 'https://flagcdn.com/w40/ca.png' },
    { code: '+52', name: 'Mexico', flag: 'https://flagcdn.com/w40/mx.png' },
  ];

  // --- 1. Fetch Data ---
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/user/self/in');
        const userData = res.response?.data || res.data?.data;
        if (userData) setProfile({ ...userData });
      } catch (error) {
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  // --- 2. Handle File Selection (Local Only) ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Create a local blob URL for preview
    }
  };

  // Handle country selection
  const handleCountrySelect = (country) => {
    setProfile(prev => ({ ...prev, countryCode: country.code }));
    setShowCountryDropdown(false);
  };

  // --- 3. Submit Form (Multipart/Form-Data) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const formData = new FormData();
    // Append text fields
    formData.append('name', profile.name);
    formData.append('phoneNumber', Number(profile.phoneNumber)); // Backend expects number
    formData.append('countryCode', profile.countryCode);
    formData.append('bio', profile.bio);
    formData.append('dateOfBirth', profile.dateOfBirth);
    
    // Append file if a new one was selected
    if (selectedFile) {
      formData.append('avatar', selectedFile);
    }

    try {
      setLoading(true);
      await api.patch('/user/self/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setSelectedFile(null); // Reset file state after success
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  if (loading && !profile.name) return <div className="p-10 text-center text-slate-500 font-medium">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#475569]">
      <div className="w-full">
        {/* --- Header --- */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-slate-800 hover:bg-slate-200 p-2 rounded-full transition-all">
              <IoArrowBack size={24} />
            </button>
            <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Personal Information</h1>
          </div>
          <button type="button" className="flex items-center gap-2 bg-linear-to-r from-[#6366F1] to-[#A855F7] text-white px-6 py-2.5 rounded-[8px] font-medium shadow-md hover:opacity-90 active:scale-95 transition-all">
            <HiPlus size={20} /> Add New Admin
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6">
          {/* --- Left: Profile Card --- */}
          <aside className="w-full md:w-80">
            <div className="bg-white border-2 border-purple-100 rounded-[8px] p-10 flex flex-col items-center justify-center shadow-sm text-center">
              <div className="w-36 h-36 rounded-full overflow-hidden mb-6 ring-4 ring-white shadow-lg relative group">
                <img
                  src={previewUrl || profile.avatar || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="text-white text-xs font-bold">Change Photo</span>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <p className="text-slate-400 text-sm font-medium mb-2">Profile</p>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight truncate w-full px-2">{profile.name || 'Admin'}</h2>
            </div>
          </aside>

          {/* --- Right: Form Inputs --- */}
          <main className="flex-1 space-y-6">
            <InputField label="Name" name="name" value={profile.name} onChange={handleChange} disabled={!isEditing} />
            <InputField label="Email" name="email" type="email" value={profile.email} disabled={true} /> {/* Email is usually not editable */}

            {/* Phone Number Section */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 ml-1">Phone Number</label>
              <div className="flex gap-4">
                {/* Country Code Selector Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    disabled={!isEditing}
                    className="flex items-center justify-between gap-3 px-4 py-4 bg-linear-to-br from-[#6366F1] to-[#8B5CF6] text-white rounded-[8px] min-w-[140px] shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <img 
                        src={countries.find(c => c.code === profile.countryCode)?.flag || 'https://flagcdn.com/w40/us.png'} 
                        alt="Country" 
                        className="w-6 h-4 object-cover rounded-xs" 
                      />
                      <span className="font-semibold text-sm">{profile.countryCode || '+1'}</span>
                    </div>
                    <IoChevronDown size={18} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showCountryDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-purple-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                      {countries.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => handleCountrySelect(country)}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-purple-50 transition-colors text-left"
                        >
                          <img 
                            src={country.flag} 
                            alt={country.name} 
                            className="w-6 h-4 object-cover rounded-xs" 
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-slate-700">{country.name}</div>
                            <div className="text-xs text-slate-500">{country.code}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="8801622..."
                  className="flex-1 px-5 py-4 rounded-[8px] border border-purple-200 focus:ring-2 focus:ring-purple-400 outline-none transition-all disabled:bg-white text-slate-700 font-medium"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-linear-to-r from-[#6366F1] to-[#A855F7] text-white px-10 py-4 rounded-[8px] font-bold shadow-lg hover:shadow-purple-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70"
              >
                {loading ? 'Updating...' : isEditing ? <><FiSave size={18} /> Save Changes</> : <><FiEdit2 size={18} /> Edit Profile</>}
              </button>
            </div>
          </main>
        </form>
      </div>
    </div>
  );
};

// Reusable Input Component
const InputField = ({ label, type = "text", name, value, onChange, disabled }) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-slate-500 ml-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-5 py-4 rounded-[8px] border border-purple-200 focus:ring-2 focus:ring-purple-400 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400 text-slate-700 font-medium"
    />
  </div>
);

export default PersonalInfo;