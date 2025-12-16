import { useState } from "react";

export default function FilterSidebar() {
    const [minPrice, setMinPrice] = useState(5);
    const [maxPrice, setMaxPrice] = useState(82);

    const subjects = [
        "English", "Physics", "Biology", "Chemistry", "Mathematics",
        "History", "Geography", "Statistics", "Accounting",
        "Economics", "Sociology"
    ];

    const [selectedSubjects, setSelectedSubjects] = useState(["English"]);
    const [rating, setRating] = useState(0);

    const toggleSubject = (sub) => {
        if (selectedSubjects.includes(sub)) {
            setSelectedSubjects(selectedSubjects.filter((s) => s !== sub));
        } else {
            setSelectedSubjects([...selectedSubjects, sub]);
        }
    };

    return (
        <div className="w-64 mx-auto bg-white p-5 rounded-2xl shadow-lg">

            {/* Header */}
            <h2 className="text-lg text-center text-[#0A0A0A] font-bold mb-4">Filter</h2>

            {/* PRICE RANGE */}
            <div className="mb-6">
                <p className="font-medium text-[#0A0A0A] text-1xl mb-2">Price Range</p>

                <p className="text-center text-[#0A0A0A] text-1xl font-semibold mt-2">
                    ${minPrice}–${maxPrice}
                </p>

                <div className="relative h-6 mt-2">
                    <input
                        type="range"
                        min="5"
                        max="100"
                        value={minPrice}
                        onChange={(e) => setMinPrice(+e.target.value)}
                        className="absolute w-full top-1"
                        style={{
                            accentColor: "#903CD1",
                            background: "linear-gradient(90deg, #6657E2, #903CD1)",
                            height: "5px",
                            borderRadius: "6px"
                        }}
                    />

                    <input
                        type="range"
                        min="5"
                        max="100"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(+e.target.value)}
                        className="absolute w-full top-1"
                        style={{
                            accentColor: "#903CD1",
                            background: "linear-gradient(90deg,#6657E2, #903CD1)",
                            height: "5px",
                            borderRadius: "px"
                        }}
                    />
                </div>


                <div className="flex justify-between text-md text-[#0A0A0A] mt-1">
                    <span>$5</span>
                    <span>$100</span>
                </div>
            </div>

            {/* SUBJECT */}
            <div className="mb-6 h-[20rem]">
                <p className="font-medium text-1xl mb-2">Subject</p>
                <div className="space-y-2 max-h-full overflow-y-auto">
                    {subjects.map((sub) => (
                        <label
                            key={sub}
                            className="flex items-center gap-2 text-sm cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={selectedSubjects.includes(sub)}
                                onChange={() => toggleSubject(sub)}
                                className="w-4 h-4 rounded-sm cursor-pointer appearance-none"
                                style={{
                                    width: "18px",
                                    height: "18px",
                                    border: "2px solid transparent",
                                    borderRadius: "4px",
                                    backgroundImage:
                                        "linear-gradient(white, white), linear-gradient(90deg, #6657E2, #6657E2, #903CD1)",
                                    backgroundOrigin: "border-box",
                                    backgroundClip: "content-box, border-box",
                                    transition: "0.2s",
                                }}
                                onClick={(e) => {
                                    if (e.target.checked) {
                                        e.target.style.backgroundImage =
                                            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E\"), linear-gradient(#903CD1,#903CD1), linear-gradient(90deg,#6657E2,#903CD1)";
                                        e.target.style.backgroundPosition = "center, 0 0, 0 0";
                                        e.target.style.backgroundRepeat = "no-repeat";
                                        e.target.style.backgroundSize = "14px 14px, cover, cover";
                                    } else {
                                        e.target.style.backgroundImage =
                                            "linear-gradient(white, white), linear-gradient(90deg,#6657E2, #6657E2, #903CD1)";
                                    }
                                }}
                            />

                            <span>{sub}</span>
                        </label>
                    ))}
                </div>




            </div>

            {/* RATING */}
            <div className="mb-6">
                <p className="font-medium text-sm mb-2">Rating</p>

                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <span
                            key={i}
                            onClick={() => setRating(i)}
                            className={`cursor-pointer text-xl ${rating >= i ? "text-yellow-400" : "text-gray-300"
                                }`}
                        >
                            ★
                        </span>
                    ))}
                </div>
            </div>

            {/* APPLY BUTTON */}
            <button className="w-full py-2 text-white font-medium rounded-lg bg-gradient-to-r from-[#FFC30B] via-[#8113B5] to-[#8113B5] shadow-sm">
                Apply
            </button>

        </div>
    );
}
