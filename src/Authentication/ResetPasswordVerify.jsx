import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import api from "../services/api";
import Spinner from "../Components/Spinner";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ResetPasswordVerify = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const inputsRef = useRef([]);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleInputChange = (e, index) => {
        const value = e.target.value;
        if (!/^[0-9]$/.test(value) && value !== "") {
            e.target.value = ""; // only allow digits
            return;
        }

        // Move focus to next input if value is entered
        if (value && index < inputsRef.current.length - 1) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handleResetPassword = async () => {
        // Collect OTP value from inputs
        const otp = inputsRef.current.map((input) => input?.value || "").join("");

        if (!email) {
            toast.error("Email missing. Please try again.");
            return;
        }
        if (otp.length !== 6) {
            toast.error("Please enter the complete 6-digit code.");
            return;
        }
        if (!password) {
            toast.error("Please enter a new password.");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/auth/reset-password', {
                email,
                otp,
                password
            });

            if (res.status === 200) {
                toast.success("Password reset successful! Please login.");
                navigate("/login");
            } else {
                toast.error("Failed to reset password.");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-[#F4F8F5] py-10">
            <div className="bg-white rounded-2xl w-full max-w-lg px-8 md:px-16 py-12 shadow-xl">

                <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#614EFE] via-[#7D359F] to-[#7D359F] bg-clip-text text-transparent">
                    Reset Password
                </h2>

                <p className="text-[#585858] text-sm mt-3 leading-relaxed">
                    Enter the code sent to <span className="font-medium text-gray-800">{email}</span> and set your new password.
                </p>

                {/* OTP Inputs */}
                <div className="mt-8 flex justify-between gap-2 md:gap-4">
                    {[1, 2, 3, 4, 5, 6].map((_, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputsRef.current[index] = el)}
                            maxLength={1}
                            className="w-10 h-12 md:w-12 md:h-14 text-center border border-gray-300 rounded-xl text-lg font-semibold 
                            focus:ring-purple-400 focus:border-purple-400 outline-none transition-all"
                            onChange={(e) => handleInputChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                    ))}
                </div>

                {/* Password Fields */}
                <div className="mt-8 space-y-4">
                    <div className="relative">
                        <label className="text-sm font-medium text-gray-700 block mb-1">New Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-purple-400 focus:border-purple-400 outline-none pr-10"
                        />
                        <button
                            className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                    <div className="relative">
                        <label className="text-sm font-medium text-gray-700 block mb-1">Confirm Password</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-purple-400 focus:border-purple-400 outline-none pr-10"
                        />
                        <button
                            className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleResetPassword}
                    disabled={loading}
                    className={`w-full mt-10 bg-gradient-to-r from-[#6657E2] to-[#903CD1] 
                               text-white py-3 rounded-full text-base font-medium shadow-sm transition-all flex items-center justify-center ${loading ? 'opacity-75 cursor-wait' : 'hover:shadow-md'}`}
                >
                    {loading ? (
                        <Spinner size="small" showText={false} fullScreen={false} className="border-white" />
                    ) : (
                        "Reset Password"
                    )}
                </button>

                <p className="text-center text-sm text-gray-700 mt-5">
                    <Link
                        to="/login"
                        className="text-purple-600 font-medium hover:underline"
                    >
                        Back to Login
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default ResetPasswordVerify;
