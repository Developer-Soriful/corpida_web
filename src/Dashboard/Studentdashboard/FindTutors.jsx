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
        // Add pagination parameters as seen in test.json
        const res = await api.get("/social/teachers?page=1&limit=10");

        let extractedDocs = [];

        // Structure confirmed from test.json: res.response.data.docs
        if (res?.response?.data?.docs && Array.isArray(res.response.data.docs)) {
          extractedDocs = res.response.data.docs;
        }
        // Fallbacks for other possible structures
        else if (res?.data?.docs && Array.isArray(res.data.docs)) {
          extractedDocs = res.data.docs;
        } else if (res?.docs && Array.isArray(res.docs)) {
          extractedDocs = res.docs;
        } else if (Array.isArray(res)) {
          extractedDocs = res;
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Find Your Perfect Tutor
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Browse our qualified tutors and find the right match for your learning needs.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row items-center gap-4">

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
      h-[52px] w-[52px] sm:w-[55px] rounded-xl shadow-sm
      flex items-center justify-center shrink-0
      hover:bg-gray-200 transition-colors
    ">
            <span className="text-xl">
              <LuSettings2 />
            </span>
          </button>
        </div>
      </div>



      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div key={item._id || item.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col h-full border border-gray-100">

              {/* Profile */}
              <div className="flex items-center gap-4">
                <img
                  src={item.avatar || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-100"
                />
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{item.name || "Unnamed"}</h3>
                  <p className="text-purple-600 text-sm font-medium">{Array.isArray(item.subject) ? item.subject[0] : (item.subject || "General")}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 text-center mt-6 py-4 border-y border-gray-100">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-2">
                    <img src={logo1} className="w-5 h-5" />
                  </div>
                  <p className="font-bold text-base text-gray-900">{item.teacher?.yearsOfTeachingExp || 0}y</p>
                  <p className="text-gray-500 text-xs">Experience</p>
                </div>

                <div className="flex flex-col items-center border-l border-r border-gray-100 px-2">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-2">
                    <img src={logo2} className="w-5 h-5" />
                  </div>
                  <p className="font-bold text-base text-gray-900">{item.teacher?.rating || 0}</p>
                  <p className="text-gray-500 text-xs">Rating</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-2">
                    <img src={logo4} className="w-5 h-5" />
                  </div>
                  <p className="font-bold text-base text-gray-900">${item.teacher?.hourlyRate || 0}/hr</p>
                  <p className="text-gray-500 text-xs">Price</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mt-4 leading-relaxed line-clamp-3 mb-6 flex-1">
                "{item.teacher?.content || "Exploring new ways to teach and learn together."}"
              </p>

              {/* Button */}
              <button
                onClick={() => navigate(`/dashboard/tutordetails/${item._id || item.id}`)}
                className="w-full mt-auto py-3 text-white font-semibold rounded-xl 
                          bg-gradient-to-r from-[#6657E2] to-[#903CD1]
                          hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98] transition-all duration-200"
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] transition-opacity duration-300"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      {/* Filter Drawer */}
      <div className={`
        fixed top-0 right-0 h-full w-full sm:w-[380px] bg-white z-[1000] shadow-2xl transition-transform duration-300 ease-in-out
        ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}
        flex flex-col
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
          <button
            onClick={() => {
              setTempFilters({ minPrice: 0, maxPrice: 10000, subjects: [], rating: 0 });
            }}
            className="text-[#6657E2] font-semibold text-sm hover:underline transition-colors"
          >
            Reset
          </button>
          <h3 className="text-lg font-bold text-gray-800">Filters</h3>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all"
          >
            <IoClose size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar">
          {/* Price Range */}
          <div className="mb-8">
            <h4 className="font-bold text-gray-800 text-base mb-4">Price Range</h4>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Min</span>
                <span className="text-lg font-bold text-[#8113B5]">${tempFilters.minPrice}</span>
                <span className="text-gray-300">|</span>
                <span className="text-lg font-bold text-[#8113B5]">${tempFilters.maxPrice}</span>
                <span className="text-sm text-gray-500">Max</span>
              </div>
            </div>

            <div className="relative w-full h-8 flex items-center mb-4">
              {/* Track Background */}
              <div className="absolute w-full h-2 bg-gray-200 rounded-full" />

              {/* Active Track */}
              <div
                className="absolute h-2 bg-gradient-to-r from-[#FFC30B] to-[#8113B5] rounded-full"
                style={{
                  left: `${(tempFilters.minPrice / 10000) * 100}%`,
                  width: `${((tempFilters.maxPrice - tempFilters.minPrice) / 10000) * 100}%`
                }}
              />

              {/* Min Range Input */}
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={tempFilters.minPrice}
                onChange={(e) => handlePriceChange(e, 'min')}
                className="absolute w-full appearance-none bg-transparent pointer-events-none custom-range-slider p-0 m-0 z-20"
              />

              {/* Max Range Input */}
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={tempFilters.maxPrice}
                onChange={(e) => handlePriceChange(e, 'max')}
                className="absolute w-full appearance-none bg-transparent pointer-events-none custom-range-slider p-0 m-0 z-20"
              />
            </div>

            <div className="flex justify-between text-xs text-gray-500 font-medium px-1">
              <span>$0</span>
              <span>$10,000</span>
            </div>

            <style>{`
                .custom-range-slider::-webkit-slider-thumb {
                    pointer-events: auto;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    background: linear-gradient(135deg, #FFC30B, #8113B5);
                    border: 3px solid white;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(129, 19, 181, 0.3);
                    position: relative;
                    z-index: 30;
                    transition: transform 0.1s ease;
                }
                .custom-range-slider::-webkit-slider-thumb:hover {
                    transform: scale(1.1);
                }
                .custom-range-slider::-moz-range-thumb {
                    pointer-events: auto;
                    width: 20px;
                    height: 20px;
                    background: linear-gradient(135deg, #FFC30B, #8113B5);
                    border: 3px solid white;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(129, 19, 181, 0.3);
                }
            `}</style>
          </div>

          {/* Subject */}
          <div className="mb-8">
            <h4 className="font-bold text-gray-800 text-base mb-4">Subjects</h4>
            <div className="flex flex-wrap gap-2">
              {subjectsList.map(sub => (
                <button
                  key={sub}
                  onClick={() => toggleSubject(sub)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    tempFilters.subjects.includes(sub)
                      ? 'bg-gradient-to-r from-[#6657E2] to-[#903CD1] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-800 text-base mb-4">Minimum Rating</h4>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => handleRatingClick(tempFilters.rating === star ? 0 : star)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    tempFilters.rating >= star
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-lg">★</span>
                </button>
              ))}
            </div>
            {tempFilters.rating > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                {tempFilters.rating}+ stars & above
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 sm:p-6 border-t border-gray-100 bg-white">
          <button
            onClick={handleApplyFilters}
            className="w-full py-3.5 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 transition-all duration-200 active:scale-[0.98] hover:shadow-xl hover:shadow-purple-500/40 bg-gradient-to-r from-[#6657E2] to-[#903CD1]"
          >
            Apply Filters
          </button>
        </div>
      </div>

    </div>
  );
};

export default FindTutors;
