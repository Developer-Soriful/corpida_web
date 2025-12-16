import { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import Spinner from "../Components/Spinner";
const RecoverAccount = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerifyAccount = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", { email });

      if (response.status === 200) {
        toast.success("Recovery email sent!");
        navigate("/reset-password-verify", { state: { email } });
      } else {
        toast.error("Failed to send recovery email");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to send recovery email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white rounded-2xl w-full max-w-lg px-16 py-50 shadow-xl">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#614EFE] via-[#7D359F] to-[#7D359F] bg-linear-to-r bg-clip-text text-transparent">
          Recover Account
        </h2>

        <p className="text-[#585858] font-normal text-sm mt-3 leading-relaxed">
          Enter your email and we will send you a recovery code
        </p>

        <div className="mt-10">
          <label className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="text"
            name="email"
            placeholder="Username or Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 mt-3 text-sm focus:ring-purple-400 focus:border-purple-400"
          />
        </div>

        <button
          onClick={handleVerifyAccount}
          disabled={loading}
          className={`w-full mt-10 bg-gradient-to-r from-[#6657E2] to-[#903CD1] bg-linear-to-r text-white py-3 rounded-full text-base font-medium shadow-sm transition-all flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md'}`}
        >
          {loading ? (
            <Spinner size="small" showText={false} fullScreen={false} className="border-white" />
          ) : (
            "Send Recovery Email"
          )}
        </button>
      </div>
    </div>
  );
};

export default RecoverAccount;
