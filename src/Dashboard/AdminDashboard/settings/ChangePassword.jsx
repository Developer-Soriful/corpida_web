import { useState, useRef } from "react";
import { FiMail, FiEye, FiEyeOff, FiArrowLeft, FiLock } from "react-icons/fi";
import { toast } from "react-toastify";
import logo from "../../../assets/image.png";
import api from "../../../services/api";
import { useNavigate } from "react-router";

const ChangePassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  // Step 3 state
  const [passwords, setPasswords] = useState({
    old: "",
    new: "",
    confirm: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const otpRefs = useRef([]);

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.status === 200 || res.status === 201) {
        toast.success(res.data || "OTP sent to your email!");
        setStep(2);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }
    setStep(3);
  };

  const handleBackStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!passwords.new || !passwords.confirm) {
      toast.error("New password fields are required.");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    if (passwords.new.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    const enteredOtp = otp.join("");
    setLoading(true);
    try {
      // Functional integration using /auth/reset-password as per test.json
      const res = await api.post('/auth/change-password', {
        oldPassword: passwords.old,
        newPassword: passwords.new
      });

      if (res.status === 200) {
        toast.success(res.data || "Password updated successfully!");
        // Reset or redirect? We keep it on step 1 for now.
        setStep(1);
        setEmail("");
        setOtp(["", "", "", "", "", ""]);
        setPasswords({ old: "", new: "", confirm: "" });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };


  // this is for before path
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  }
  return (
    <div>
      {/* this is for back navigator  */}
      <div className="flex justify-start items-start mb-6">
        <button className="cursor-pointer" onClick={handleBack}>
          <FiArrowLeft size={20} />
        </button>
      </div>
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[450px] bg-white rounded-2xl p-8 shadow-[0_4px_25px_rgba(0,0,0,0.05)]">

          {/* Logo Section */}
          <div className="flex flex-col items-center mb-6">
            <img src={logo} alt="Porfira Logo" className="w-16 mb-2" />
          </div>

          {/* Back Link */}
          {step < 4 && (
            <button
              onClick={handleBackStep}
              className="flex items-center text-gray-800 font-semibold text-lg mb-2 hover:text-purple-600 transition-colors"
            >
              <FiArrowLeft className="mr-2" size={20} />
              {step === 1 && "Forgot Password"}
              {step === 2 && "Verify Email"}
              {step === 3 && "Change Password"}
            </button>
          )}

          {/* Step 1: Forgot Password */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <p className="text-[#8E8E8E] text-sm text-center mb-10">
                Please enter your email address to reset your password
              </p>

              <div className="mb-8">
                <label className="block text-[#444444] font-medium mb-3">Enter Your Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiMail size={18} />
                  </span>
                  <input
                    type="email"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-purple-200 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-purple-500 transition-all text-gray-700"
                  />
                </div>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-linear-to-r from-[#614EFE] to-[#9235BD] text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          )}

          {/* Step 2: Verify Email */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <p className="text-[#8E8E8E] text-sm text-center mb-10">
                Please enter the OTP we have sent you in your email.
              </p>

              <div className="flex justify-between gap-2 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => otpRefs.current[index] = el}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    className="w-12 h-14 border border-purple-200 rounded-xl text-center text-xl font-bold text-gray-700 outline-none focus:border-purple-500 transition-all"
                  />
                ))}
              </div>

              <div className="flex justify-between items-center mb-10">
                <span className="text-[#585858] text-[13px]">Didn't receive the code?</span>
                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="text-[#9235BD] font-semibold text-[13px] hover:underline disabled:opacity-50"
                >
                  Resend
                </button>
              </div>

              <button
                onClick={handleVerifyOtp}
                className="w-full bg-linear-to-r from-[#614EFE] to-[#9235BD] text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-purple-200 transition-all active:scale-[0.98]"
              >
                Verify
              </button>
            </div>
          )}

          {/* Step 3: Change Password */}
          {step === 3 && (
            <form onSubmit={handleUpdatePassword} className="animate-fadeIn">
              <p className="text-[#8E8E8E] text-sm text-center mb-8">
                Your password must be 8-10 character long.
              </p>

              <div className="space-y-6 mb-10">
                {/* Old Password */}
                <div>
                  <label className="block text-[#444444] font-medium mb-2 text-sm">Enter old password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <FiLock size={18} />
                    </span>
                    <input
                      type={showPasswords.old ? "text" : "password"}
                      placeholder="Enter old password"
                      value={passwords.old}
                      onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
                      className="w-full border border-purple-200 rounded-xl py-3 pl-12 pr-12 outline-none focus:border-purple-500 transition-all text-gray-700"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('old')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600"
                    >
                      {showPasswords.old ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-[#444444] font-medium mb-2 text-sm">Set new password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <FiLock size={18} />
                    </span>
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      placeholder="Set new password"
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      className="w-full border border-purple-200 rounded-xl py-3 pl-12 pr-12 outline-none focus:border-purple-500 transition-all text-gray-700"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600"
                    >
                      {showPasswords.new ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-[#444444] font-medium mb-2 text-sm">Re-enter new password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <FiLock size={18} />
                    </span>
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      placeholder="Re-enter new password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      className="w-full border border-purple-200 rounded-xl py-3 pl-12 pr-12 outline-none focus:border-purple-500 transition-all text-gray-700"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600"
                    >
                      {showPasswords.confirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[#9235BD] font-medium text-sm hover:underline"
                >
                  Forget password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-[#614EFE] to-[#9235BD] text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? "Updating..." : "Update password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
