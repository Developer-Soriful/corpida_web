import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/UseAuth";
import { toast } from "react-toastify";
import Spinner from "../Components/Spinner";

const EnterVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const inputsRef = useRef([]);
    const { verifyUser } = useAuth();
    const [loading, setLoading] = useState(false);

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
        // Handle backspace to move to previous input
        if (e.key === "Backspace" && !e.target.value && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handleVerify = async () => {
        const otp = inputsRef.current.map((input) => input.value).join("");

        if (!email) {
            toast.error("Email missing. Please sign up again.");
            return;
        }
        if (otp.length !== 6) {
            toast.error("Please enter the 6-digit code.");
            return;
        }

        setLoading(true);
        try {
            const res = await verifyUser(email, otp);
            const userData = res.userData || {};
            
            // Handle navigation based on user role
            if (userData.role === 'teacher') {
                if (!userData.teacher?.isProfileComplete) {
                    navigate('/teacher/complete-profile');
                } else {
                    navigate('/toturdashbord');
                }
            } else if (userData.role === 'student') {
                navigate('/dashboard');
            } else if (userData.role === 'admin') {
                navigate('/admin');
            } else {
                // Fallback for any other role or missing role
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Verification failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-[#F4F8F5]">
            <div className="bg-white rounded-2xl w-full max-w-lg px-16 py-16 shadow-xl">

                <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#614EFE] via-[#7D359F] to-[#7D359F] bg-clip-text text-transparent">
                    Enter Verification Code
                </h2>

                <p className="text-[#585858] text-sm mt-3 leading-relaxed">
                    We’ve sent a 6-digit code to {email || "your email"}
                </p>

                <div className="mt-10 flex justify-between gap-4">
                    {[1, 2, 3, 4, 5, 6].map((_, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputsRef.current[index] = el)}
                            maxLength={1}
                            className="w-12 h-14 text-center border border-gray-300 rounded-xl text-lg font-semibold 
                            focus:ring-purple-400 focus:border-purple-400 outline-none"
                            onChange={(e) => handleInputChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                    ))}
                </div>

                <p className="text-sm text-center text-gray-600 mt-3 cursor-pointer">
                    Paste Code
                </p>

                <button
                    onClick={handleVerify}
                    disabled={loading}
                    className={`w-full mt-10 bg-gradient-to-r from-[#6657E2] to-[#903CD1] 
                               text-white py-3 rounded-full text-base font-medium shadow-sm flex justify-center items-center ${loading ? 'opacity-70' : ''}`}
                >
                    {loading ? <Spinner size="small" showText={false} fullScreen={false} className="border-white" /> : "Verify Code"}
                </button>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Didn’t receive the code?{" "}
                    <button className="text-purple-600 font-medium hover:underline">
                        Resend
                    </button>
                </p>

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

export default EnterVerification;
