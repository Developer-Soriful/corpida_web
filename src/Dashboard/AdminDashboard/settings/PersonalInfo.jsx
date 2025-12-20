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
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    avatar: '',
    dateOfBirth: '',
  });
  const [newAdminFile, setNewAdminFile] = useState(null);
  const [newAdminPreview, setNewAdminPreview] = useState(null);

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

  // Handle new admin form changes
  const handleNewAdminChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin(prev => ({ ...prev, [name]: value }));
  };

  // Handle new admin file selection
  const handleNewAdminFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAdminFile(file);
      setNewAdminPreview(URL.createObjectURL(file));
    }
  };

  // Handle new admin submission
  const handleNewAdminSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      toast.error('Name, email, and password are required');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newAdmin.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      
      // Send as JSON with avatar URL if file is selected
      let payload = {
        name: newAdmin.name,
        email: newAdmin.email,
        password: newAdmin.password,
        role: newAdmin.role,
      };

      // Handle dateOfBirth - provide default if empty
      if (newAdmin.dateOfBirth) {
        // Validate date format and convert to proper format
        const date = new Date(newAdmin.dateOfBirth);
        if (isNaN(date.getTime())) {
          toast.error('Please enter a valid date of birth');
          return;
        }
        // Format as YYYY-MM-DD
        payload.dateOfBirth = date.toISOString().split('T')[0];
      } else {
        // Provide a default date if empty (e.g., 18 years ago)
        const defaultDate = new Date();
        defaultDate.setFullYear(defaultDate.getFullYear() - 18);
        payload.dateOfBirth = defaultDate.toISOString().split('T')[0];
      }

      // If there's a file, first upload it to get the URL
      if (newAdminFile) {
        const avatarFormData = new FormData();
        avatarFormData.append('avatar', newAdminFile);
        
        try {
          const avatarResponse = await api.post('/user/upload/avatar', avatarFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          payload.avatar = avatarResponse.data?.avatar || '';
        } catch (avatarError) {
          console.warn('Avatar upload failed, proceeding without avatar:', avatarError);
        }
      }

      // Create admin with JSON payload
      const response = await api.post('/user/create', payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      toast.success('Admin created successfully!');
      setShowAddAdminModal(false);
      setNewAdmin({ name: '', email: '', password: '', role: 'admin', avatar: '', dateOfBirth: '' });
      setNewAdminFile(null);
      setNewAdminPreview(null);
    } catch (error) {
      console.error('Admin creation error:', error);
      toast.error(error.response?.data?.message || 'Failed to create admin');
    } finally {
      setLoading(false);
    }
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
    formData.append('phoneNumber', Number(profile.phoneNumber)); 
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
          <button type="button" onClick={() => setShowAddAdminModal(true)} className="flex items-center gap-2 bg-linear-to-r from-[#6366F1] to-[#A855F7] text-white px-6 py-2.5 rounded-lg font-medium shadow-md hover:opacity-90 active:scale-95 transition-all">
            <HiPlus size={20} /> Add New Admin
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6">
          {/* --- Left: Profile Card --- */}
          <aside className="w-full md:w-80">
            <div className="bg-white border-2 border-purple-100 rounded-lg p-10 flex flex-col items-center justify-center shadow-sm text-center">
              <div className="w-36 h-36 rounded-full overflow-hidden mb-6 ring-4 ring-white shadow-lg relative group">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='14' fill='%239ca3af'%3ENo Profile%3C/text%3E%3C/svg%3E"
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
                    className="flex items-center justify-between gap-3 px-4 py-4 bg-linear-to-br from-[#6366F1] to-[#8B5CF6] text-white rounded-lg min-w-[140px] shadow-sm"
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
                  className="flex-1 px-5 py-4 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-400 outline-none transition-all disabled:bg-white text-slate-700 font-medium"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-linear-to-r from-[#6366F1] to-[#A855F7] text-white px-10 py-4 rounded-lg font-bold shadow-lg hover:shadow-purple-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70"
              >
                {loading ? 'Updating...' : isEditing ? <><FiSave size={18} /> Save Changes</> : <><FiEdit2 size={18} /> Edit Profile</>}
              </button>
            </div>
          </main>
        </form>

        {/* Add New Admin Modal */}
        {showAddAdminModal && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-semibold text-slate-800">Add New Admin</h2>
                <button 
                  onClick={() => setShowAddAdminModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <IoArrowBack size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleNewAdminSubmit} className="flex flex-col md:flex-row gap-6 p-6">
                {/* Left: Profile Card */}
                <aside className="w-full md:w-80">
                  <div className="bg-white border-2 border-purple-100 rounded-lg p-10 flex flex-col items-center justify-center shadow-sm text-center">
                    <div className="w-36 h-36 rounded-full overflow-hidden mb-6 ring-4 ring-white shadow-lg relative group">
                      <img
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='14' fill='%239ca3af'%3ENo Profile%3C/text%3E%3C/svg%3E"
                        alt="New Admin Profile"
                        className="w-full h-full object-cover"
                      />
                      <div 
                        onClick={() => document.getElementById('newAdminFileInput')?.click()}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <span className="text-white text-xs font-bold">Change Photo</span>
                      </div>
                    </div>
                    <input 
                      id="newAdminFileInput"
                      type="file" 
                      accept="image/*" 
                      onChange={handleNewAdminFileChange} 
                      className="hidden" 
                    />
                    <p className="text-slate-400 text-sm font-medium mb-2">Profile</p>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight truncate w-full px-2">{newAdmin.name || 'New Admin'}</h2>
                  </div>
                </aside>

                {/* Right: Form Inputs */}
                <main className="flex-1 space-y-6">
                  <InputField 
                    label="Name" 
                    name="name" 
                    value={newAdmin.name} 
                    onChange={handleNewAdminChange} 
                    disabled={false} 
                  />
                  <InputField 
                    label="Email" 
                    name="email" 
                    type="email" 
                    value={newAdmin.email} 
                    onChange={handleNewAdminChange} 
                    disabled={false} 
                  />
                  <InputField 
                    label="Password" 
                    name="password" 
                    type="password" 
                    value={newAdmin.password} 
                    onChange={handleNewAdminChange} 
                    disabled={false} 
                  />
                  <InputField 
                    label="Date of Birth" 
                    name="dateOfBirth" 
                    type="date" 
                    value={newAdmin.dateOfBirth} 
                    onChange={handleNewAdminChange} 
                    disabled={false} 
                    required={true}
                    max={new Date().toISOString().split('T')[0]}
                  />

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4 gap-4">
                    <button
                      type="button"
                      onClick={() => setShowAddAdminModal(false)}
                      className="flex items-center gap-2 bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-300 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 bg-linear-to-r from-[#6366F1] to-[#A855F7] text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-purple-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70"
                    >
                      {loading ? 'Creating...' : 'Create Admin'}
                    </button>
                  </div>
                </main>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Input Component
const InputField = ({ label, type = "text", name, value, onChange, disabled, required, max }) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-slate-500 ml-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      max={max}
      className="w-full px-5 py-4 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-400 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400 text-slate-700 font-medium"
    />
  </div>
);

export default PersonalInfo;