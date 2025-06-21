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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setMessage("");
    
    try {
      const res = await loginUser(email, password);
      dispatch(setUser({ token: res.token, user: res.user }));
      
      // Store login info if "Remember me" is checked
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      
      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load remembered email if exists
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

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

            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA4424] focus:border-transparent"
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA4424] focus:border-transparent"
                    required
                    minLength="6"
                  />
                </div>

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

  <div className="flex flex-col items-end space-y-1">
    {/* <Link
      to="/forgot-password"
      className="text-sm text-[#EA4424] hover:underline"
    >
      Forgot password?
    </Link> */}
    <Link
      to="/login-with-otp"
      className="text-sm text-[#EA4424] hover:underline"
    >
      Login with OTP
    </Link>
  </div>
</div>

                {message && (
                  <div className="mt-2 text-center text-sm text-red-600 font-medium">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
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
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-[#EA4424] font-medium hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="hidden md:flex w-1/2 lg:w-2/5 items-center justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-[#FDFCDB] rounded-full opacity-70 blur"></div>
              <img
                src={deliveryBoy}
                alt="Delivery person"
                className="relative z-10 max-w-md w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;