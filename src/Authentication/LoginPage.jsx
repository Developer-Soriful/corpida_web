import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/UseAuth';

const LoginPage = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signin } = useAuth()
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await signin(email, password)
    console.log(res.response)
    const role = res.response.data.role
    // 👉 role based redirect
    if (role === "student") {
      navigate("/dashboard");
    } else if (role === "teacher") {
      navigate("/toturdashbord");
    } else {
      navigate("/");
    }


  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white rounded-2xl w-full max-w-lg px-16 py-40 shadow-xl">

        <div className="mb-12">
          <h2 className="text-3xl font-semibold bg-gradient-to-r from-[#614EFE] to-[#7D359F] bg-clip-text text-transparent">
            Login to your account
          </h2>

          <p className="text-sm text-[#585858] mt-3">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="bg-gradient-to-r from-[#614EFE] to-[#7D359F] bg-clip-text text-transparent font-medium"
            >
              Register
            </a>
          </p>
        </div>

        <form onSubmit={handleLogin}>

          <div className="mb-7">
            <label className="block text-sm font-medium text-[#585858]">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="mt-2 block w-full px-2 py-2 border border-gray-300 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-[#585858]">
              Password
            </label>
            <input
              type="password"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Link to="/recoveraccount">
            <p className="text-md text-[#585858] mb-3">Forgot Password?</p>
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default LoginPage;
