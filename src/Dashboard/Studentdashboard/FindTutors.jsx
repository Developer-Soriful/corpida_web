import { useEffect, useState } from "react";
import { LuSettings2 } from "react-icons/lu";
import { IoSearch } from "react-icons/io5";
import logo1 from "../../assets/business_center.png";
import logo2 from "../../assets/award_star.png";
import logo4 from "../../assets/payments.png";
import { useNavigate } from "react-router";
import api from "../../services/api";
import { IoClose, IoCheckmark } from "react-icons/io5";

const FindTutors = () => {
  const [tutor, setTutor] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Initial state is very broad (maxPrice 10000) so ALL tutors show by default
  const [activeFilters, setActiveFilters] = useState({
    minPrice: 0,
    maxPrice: 10000,
    subjects: [],
    rating: 0
  });

  // Temp filters for the drawer (capped at 100 for UI slider)
  const [tempFilters, setTempFilters] = useState({
    minPrice: 0,
    maxPrice: 10000,
    subjects: [],
    rating: 0
  });

  const subjectsList = [
    "English", "Physics", "Biology", "Chemistry", "Mathematics",
    "History", "Geography", "Statistics", "Accounting",
    "Economics", "Sociology"
  ];
  useEffect(() => {
    const tutorLoad = async () => {
      try {
        setLoading(true);
        const res = await api.get("/social/teachers");
        console.log("FindTutors: API Response:", res);

        // Robust data extraction
        let extractedDocs = [];
        if (Array.isArray(res)) {
          extractedDocs = res;
        } else if (res?.response?.data?.docs && Array.isArray(res.response.data.docs)) {
          extractedDocs = res.response.data.docs;
        } else if (res?.data?.docs && Array.isArray(res.data.docs)) {
          extractedDocs = res.data.docs;
        } else if (res?.docs && Array.isArray(res.docs)) {
          extractedDocs = res.docs;
        } else if (res?.response?.data && Array.isArray(res.response.data)) {
          extractedDocs = res.response.data;
        } else if (res?.data && Array.isArray(res.data)) {
          extractedDocs = res.data;
        }

        setTutor(extractedDocs);
        if (extractedDocs.length === 0) {
          console.warn("FindTutors: No tutors extracted from response", res);
        }
      } catch (error) {
        console.error("FindTutors: Error loading tutors:", error);
      } finally {
        setLoading(false);
      }
    }
    tutorLoad();
  }, []);

  const navigate = useNavigate();

  const filteredTutors = tutor.filter(item => {
    try {
      const sTerm = searchTerm.toLowerCase().trim();

      // Check if ANY filtering is happening
      const isFiltering = !!sTerm ||
        activeFilters.subjects.length > 0 ||
        activeFilters.rating > 0 ||
        activeFilters.minPrice > 0 ||
        activeFilters.maxPrice < 10000;

      // If NOT filtering, return true for all items to ensure initial display
      if (!isFiltering) return true;

      // Search filter
      const nameMatch = item.name?.toLowerCase().includes(sTerm);
      const itemSub = Array.isArray(item.subject) ? item.subject.join(" ") : (item.subject || "");
      const subjectMatch = itemSub.toLowerCase().includes(sTerm);
      const bioMatch = item.teacher?.content?.toLowerCase().includes(sTerm);

      const matchesSearch = !sTerm || nameMatch || subjectMatch || bioMatch;

      // Price filter
      const price = Number(item.teacher?.hourlyRate) || 0;
      const matchesPrice = price >= activeFilters.minPrice && price <= activeFilters.maxPrice;

      // Subject filter (Drawer)
      const subjectsTaught = Array.isArray(item.teacher?.subjectsTaught) ? item.teacher.subjectsTaught : [];
      const itemSubjects = Array.isArray(item.subject) ? item.subject : (item.subject ? [item.subject] : []);
      const allTutorSubjects = [...itemSubjects, ...subjectsTaught].map(s => String(s).toLowerCase());

      const matchesSubject = activeFilters.subjects.length === 0 ||
        activeFilters.subjects.some(fs => allTutorSubjects.some(ts => ts.includes(fs.toLowerCase())));

      // Rating filter
      const rating = Number(item.teacher?.rating) || 0;
      const matchesRating = rating >= activeFilters.rating;

      return matchesSearch && matchesPrice && matchesSubject && matchesRating;
    } catch (err) {
      console.error("FindTutors: Filter Error", err, item);
      return true; // Show on error to be safe
    }
  });

  const toggleSubject = (sub) => {
    setTempFilters(prev => ({
      ...prev,
      subjects: prev.subjects.includes(sub)
        ? prev.subjects.filter(s => s !== sub)
        : [...prev.subjects, sub]
    }));
  };

  const handleApplyFilters = () => {
    setActiveFilters(tempFilters);
    setIsFilterOpen(false);
  };

  const handleRatingClick = (r) => {
    setTempFilters(prev => ({ ...prev, rating: r }));
  };

  const handlePriceChange = (e, type) => {
    const val = parseInt(e.target.value);
    setTempFilters(prev => {
      if (type === 'min') {
        return { ...prev, minPrice: Math.min(val, prev.maxPrice - 5) };
      } else {
        return { ...prev, maxPrice: Math.max(val, prev.minPrice + 5) };
      }
    });
  };
  return (
    <div className="rounded-2xl mb-1">
      <h2 className="text-[22px] font-semibold text-[#6657E2]">
        Find Your Perfect Tutor
      </h2>
      <p className="text-gray-500 text-sm mt-1">
        Browse our qualified tutors and find the right match for your learning needs.
      </p>

      <div className="p-3 mt-5 rounded-2xl bg-white">
        <div className="flex flex-col sm:flex-row items-center gap-3">

          <div className="
      flex items-center bg-[#EBEBEB] border border-[#E5E7EB]
      px-3 h-[52px] rounded-xl w-full sm:max-w-[600px] shadow-sm
    ">
            <span className="text-gray-400 text-xl mr-3">
              <IoSearch />
            </span>

            <input
              type="text"
              placeholder="Search by name, subject, language"
              className="w-full bg-transparent outline-none text-[15px] placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="
      bg-[#EBEBEB] border border-[#E5E7EB]
      h-[52px] w-full sm:w-[55px] rounded-xl shadow-sm
      flex items-center justify-center
      hover:bg-gray-200 transition-colors
    ">
            <span className="text-xl">
              <LuSettings2 />
            </span>
          </button>
        </div>
      </div>



      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6657E2] mb-4"></div>
            <p className="font-medium">Loading tutors...</p>
          </div>
        ) : filteredTutors.length === 0 ? (
          <div className="col-span-full py-20 bg-white rounded-2xl text-center shadow-sm border border-dashed border-gray-200 px-4 flex flex-col items-center">
            <IoSearch className="text-gray-300 text-5xl mb-4" />
            <p className="text-lg font-bold text-gray-800">No tutors found</p>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or search term.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveFilters({ minPrice: 0, maxPrice: 10000, subjects: [], rating: 0 });
                setTempFilters({ minPrice: 0, maxPrice: 1000, subjects: [], rating: 0 });
              }}
              className="mt-6 px-6 py-2 bg-[#6657E2] text-white rounded-xl text-sm font-medium"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredTutors.map((item) => (
            <div key={item._id || item.id} className="bg-white rounded-xl shadow-md p-5 flex flex-col h-full">

              {/* Profile */}
              <div className="flex items-center gap-3 mt-5">
                <img
                  src={item.avatar || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-[17px] truncate max-w-[150px] text-gray-900">{item.name || "Unnamed"}</h3>
                  <p className="text-[#6657E2] text-sm font-medium">{Array.isArray(item.subject) ? item.subject[0] : (item.subject || "General")}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 text-center mt-10">
                <div className="flex flex-col items-center">
                  <img src={logo1} className="w-7 h-7 mb-1" />
                  <p className="font-semibold text-[14px]">{item.teacher?.yearsOfTeachingExp || 0}y</p>
                  <p className="text-gray-500 text-[11px]">Experience</p>
                </div>

                <div className="flex flex-col items-center border-l border-r border-gray-200 px-2">
                  <img src={logo2} className="w-7 h-7 mb-1" />
                  <p className="font-semibold text-[14px]">{item.teacher?.rating || 0}</p>
                  <p className="text-gray-500 text-[11px]">Rating</p>
                </div>

                <div className="flex flex-col items-center">
                  <img src={logo4} className="w-7 h-7 mb-1" />
                  <p className="font-semibold text-[14px]">${item.teacher?.hourlyRate || 0}/hr</p>
                  <p className="text-gray-500 text-[11px]">Price</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-[#7A7A7A] text-sm mt-4 leading-relaxed line-clamp-3 mb-6 flex-1 italic">
                "{item.teacher?.content || "Exploring new ways to teach and learn together."}"
              </p>

              {/* Button */}
              <button
                onClick={() => navigate(`/dashboard/tutordetails/${item._id || item.id}`)}
                className="w-full mt-auto py-3 text-white font-medium rounded-lg 
                              bg-linear-to-r from-[#FFC30B] via-[#8113B5] to-[#8113B5]
                              hover:brightness-110 active:scale-95 transition-all shadow-md"
              >
                View Details
              </button>
            </div>
          ))
        )}
      </div>

      {/* Filter Drawer Overlay */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-999 transition-opacity"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      {/* Filter Drawer */}
      <div className={`
        fixed top-0 right-0 h-full w-[350px] bg-white z-1000 shadow-2xl transition-transform duration-300 transform
        ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}
        flex flex-col
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <button
            onClick={() => {
              setTempFilters({ minPrice: 0, maxPrice: 10000, subjects: [], rating: 0 });
            }}
            className="text-[#6657E2] font-semibold text-sm hover:underline"
          >
            Reset
          </button>
          <h3 className="text-xl font-bold text-gray-800">Filter</h3>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="text-gray-400 hover:text-gray-600 border border-gray-200 rounded-md p-1"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {/* Price Range */}
          <div className="mb-0">
            <h4 className="font-bold text-gray-800 text-[18px] mb-6">Price Range</h4>
            <div className="flex justify-center text-[18px] font-bold mb-8">
              <span className="text-gray-900">${tempFilters.minPrice}-${tempFilters.maxPrice}</span>
            </div>

            <div className="relative w-full h-8 flex items-center mb-2">
              {/* Track Background */}
              <div className="absolute w-full h-[3px] bg-gray-300 rounded-full" />

              {/* Active Track */}
              <div
                className="absolute h-[3px] bg-[#8113B5]"
                style={{
                  left: `${(tempFilters.minPrice - 5) / 95 * 10000}%`,
                  width: `${(tempFilters.maxPrice - tempFilters.minPrice) / 95 * 10000}%`
                }}
              />

              {/* Min Range Input */}
              <input
                type="range"
                min="5"
                max="10000"
                value={tempFilters.minPrice}
                onChange={(e) => handlePriceChange(e, 'min')}
                className="absolute w-full appearance-none bg-transparent pointer-events-none custom-range-slider p-0 m-0 z-20"
              />

              {/* Max Range Input */}
              <input
                type="range"
                min="5"
                max="10000"
                value={tempFilters.maxPrice}
                onChange={(e) => handlePriceChange(e, 'max')}
                className="absolute w-full appearance-none bg-transparent pointer-events-none custom-range-slider p-0 m-0 z-20"
              />
            </div>

            <div className="flex justify-between text-[14px] text-gray-800 font-bold px-1 mt-1 mb-8">
              <span>$5</span>
              <span>$10000</span>
            </div>

            <style>{`
                .custom-range-slider::-webkit-slider-thumb {
                    pointer-events: auto;
                    appearance: none;
                    width: 24px;
                    height: 24px;
                    background: #8113B5;
                    border: 4px solid white;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                    position: relative;
                    z-index: 30;
                }
                .custom-range-slider::-moz-range-thumb {
                    pointer-events: auto;
                    width: 24px;
                    height: 24px;
                    background: #8113B5;
                    border: 4px solid white;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                }
            `}</style>
          </div>

          {/* Subject */}
          <div className="mb-8">
            <h4 className="font-bold text-gray-800 text-[18px] mb-6">Subject</h4>
            <div className="space-y-4">
              {subjectsList.map(sub => (
                <label key={sub} className="flex items-center gap-4 cursor-pointer group">
                  <div className={`
                    w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all
                    ${tempFilters.subjects.includes(sub) ? 'bg-[#8113B5] border-[#8113B5]' : 'border-[#8113B5]'}
                  `}>
                    {tempFilters.subjects.includes(sub) && <IoCheckmark className="text-white" size={18} />}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={tempFilters.subjects.includes(sub)}
                    onChange={() => toggleSubject(sub)}
                  />
                  <span className={`text-[17px] font-medium leading-none ${tempFilters.subjects.includes(sub) ? 'text-gray-900' : 'text-gray-800'}`}>
                    {sub}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="mb-10">
            <h4 className="font-bold text-gray-800 text-[18px] mb-6">Rating</h4>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => handleRatingClick(star)}
                  className={`transition-colors text-4xl leading-none select-none ${tempFilters.rating >= star ? 'text-gray-800' : 'text-gray-300'}`}
                >
                  {tempFilters.rating >= star ? '★' : '☆'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6">
          <button
            onClick={handleApplyFilters}
            className="w-full py-4 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-[0.98]
                       bg-linear-to-r from-[#FFC30B] to-[#8113B5]"
          >
            Apply
          </button>
        </div>
      </div>

    </div>
  );
};

export default FindTutors;
