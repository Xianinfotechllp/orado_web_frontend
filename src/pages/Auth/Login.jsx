import React, { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import deliveryBoy from "../../assets/deliveryBoy.png";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../../slices/authSlice";
import { useDispatch } from "react-redux";
import { loginUser } from "../../apis/authApi";
import { FiMail, FiLock, FiLoader } from "react-icons/fi";
import { FaMotorcycle } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const res = await loginUser(email, password);
      dispatch(setUser({ token: res.token, user: res.user }));
      navigate("/");
    } catch (error) {
      console.error("Login error", error);
      setMessage(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-10">
      <Navbar />

      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="flex flex-col md:flex-row items-center justify-center min-h-[calc(100vh-80px)]">
          {/* Left side - Form */}
          <div className="w-full md:w-1/2 lg:w-2/5 bg-white rounded-lg shadow-xl p-8 md:mr-8">
            <div className="text-center mb-8">
              <FaMotorcycle className="text-4xl text-[#EA4424] mx-auto mb-2" />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome Back!
              </h1>
              <p className="text-gray-600">
                Log in to get your favorite meals delivered fast
              </p>
            </div>

            <div className="flex flex-col gap-5 mt-6">
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 p-3 rounded outline-none w-full focus:border-l-4 focus:border-[#EA4424]"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 p-3 rounded outline-none w-full focus:border-l-4 focus:border-[#EA4424]"
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-[#EA4424] focus:ring-[#EA4424] border-gray-300 rounded"
                  />
                  <span className="text-gray-700 text-sm">Remember me</span>
                </label>

                <Link
                  to="/login-with-otp"
                  className="text-sm text-[#EA4424] hover:underline"
                >
                  Login with OTP
                </Link>
              </div>

              {message && (
                <div className="mt-2 text-center text-sm text-red-600 font-medium">
                  {message}
                </div>
              )}

              <button
                disabled={isLoading}
                onClick={handleLogin}
                className="w-full bg-[#EA4424] hover:bg-[#d13b20] text-white py-3 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Logging in...
                  </>
                ) : (
                  "Log in"
                )}
              </button>
            </div>

            <div className="flex gap-5 mt-8">
              <button
                className="bg-[#EA4424] px-8 py-2 text-white"
                onClick={handleLogin}
              >
                Login
              </button>
              <Link to="/signup">
                <button className="px-8 py-2 border-[#EA4424] border text-[#EA4424]">
                  Signup
                </button>
              </Link>
            </div>

            {message && (
              <div className="mt-4 text-center text-[#EA4424] font-semibold">
                {message}
              </div>
            )}
          </div>

          <div className="hidden md:block w-1/2 bg-[#FDFCDB] h-screen">
            <img src={deliveryBoy} alt="Delivery Boy" className="h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
