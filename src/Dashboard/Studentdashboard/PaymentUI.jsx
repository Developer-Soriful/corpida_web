import { useState } from "react";
import { FiCreditCard } from "react-icons/fi";
import logo from '../../assets/Group (11).png'
import logo1 from '../../assets/Group (21).png'
import logo2 from '../../assets/Layer_1.png'
import logo3 from '../../assets/card1.png'
import logo4 from '../../assets/card2.png'
import logo5 from '../../assets/card3.png'
export default function PaymentUI() {
  const [selected, setSelected] = useState("card");

  const methods = [
    { id: "card", label: "Card",  img: logo2, },
    {
      id: "ideal",
      label: "iDEAL",
      img: logo,
    },
    {
      id: "bancontact",
      label: "bancontact",
      img: logo1,
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center  p-10">
      <div className="bg-[#EBF1EC] p-10 rounded-xl shadow-md w-full max-w-3xl">

        {/* Payment Methods */}
        <div className="flex gap-6 justify-center">
          {methods.map((m) => (
            <div
              key={m.id}
              onClick={() => setSelected(m.id)}
              className={`
                flex flex-col items-center cursor-pointer border rounded-xl px-8 py-4
                transition-all duration-200 
                ${selected === m.id ? "border-[#7A3AEC] bg-[#F8F4FF]" : "border-gray-300 bg-[#F7F7F7]"}
              `}
            >
              {m.icon ? (
                <div className="text-[#7A3AEC]">{m.icon}</div>
              ) : (
                <img src={m.img} className="w-10 h-10 object-contain" />
              )}
              <p
                className={`mt-2 font-medium ${
                  selected === m.id ? "text-[#7A3AEC]" : "text-gray-600"
                }`}
              >
                {m.label}
              </p>
            </div>
          ))}
        </div>

        {/* Card Number */}
        <div className="mt-8">
          <label className="text-[#585858]  text-sm font-medium">Card number</label>

          <div className="w-full border border-gray-300 rounded-lg mt-2 px-4 py-3 flex items-center justify-between ">
            <input
              type="text"
              placeholder="43 837 8398 73798"
              className="outline-none w-full text-sm"
            />

            {/* Card type icons */}
            <div className="flex gap-2">
              <img
                src={logo3}
                className="w-8 h-5"
              />
              <img
                src={logo4}
                className="w-8 h-5"
              />
              <img
                src={logo5}
                className="w-8 h-5"
              />
            </div>
          </div>
        </div>

        {/* Expiry + CVC */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <label className="text-[#585858] text-sm font-medium">Expiration Date</label>
            <input
              type="text"
              placeholder="MM/YY"
              className="w-full border border-gray-300 rounded-lg mt-2 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="text-[#585858] text-sm font-medium">Security Code</label>
            <input
              type="text"
              placeholder="CVC"
              className="w-full border border-gray-300 rounded-lg mt-2 px-4 py-3 outline-none"
            />
          </div>
        </div>

        {/* Pay Button */}
        <button
          className="
            w-full py-3 mt-8 text-white font-medium rounded-lg 
            bg-gradient-to-r from-[#6A5AF9] via-[#8A3BE0] to-[#A536D4]
            hover:opacity-90
          "
        >
          Pay $45.00
        </button>
      </div>
    </div>
  );
}
