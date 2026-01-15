import React, { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import deliveryBoy from "../../assets/deliveryBoy.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../slices/authSlice";
import { sendOtpToPhone, loginWithOtp } from "../../apis/authApi";
import { FiPhone, FiKey, FiLoader } from "react-icons/fi";
import { FaMotorcycle } from "react-icons/fa";

function LoginWithOtp() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSendOtp = async () => {
    if (!phone) {
      setMessage("Please enter your phone number");
      return;
    }
    setIsLoading(true);
    setMessage("");
    try {
      await sendOtpToPhone(phone);
      setIsOtpSent(true);
      setMessage("OTP sent successfully");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithOtp = async (e) => {
    e.preventDefault();
    if (!phone || !otp) {
      setMessage("Please enter both phone number and OTP");
      return;
    }

    setIsLoading(true);
    setMessage("");
    try {
      const res = await loginWithOtp(phone, otp);
      dispatch(setUser({ token: res.token, user: res.user }));
      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message || "OTP login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50  mt-10">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-center min-h-[calc(100vh-80px)]">
          {/* Left side */}
          <div className="w-full md:w-1/2 lg:w-2/5 bg-white rounded-lg shadow-xl p-8 md:mr-8">
            <div className="text-center mb-8">
              <FaMotorcycle className="text-4xl text-[#EA4424] mx-auto mb-2" />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Log in with OTP
              </h1>
              <p className="text-gray-600">Fast login with your phone number</p>
            </div>

            <form onSubmit={handleLoginWithOtp}>
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA4424] focus:border-transparent"
                    required
                  />
                </div>

                {isOtpSent && (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiKey className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA4424] focus:border-transparent"
                      required
                    />
                  </div>
                )}

                {message && (
                  <div className="text-sm text-center text-red-600 font-medium">
                    {message}
                  </div>
                )}

                {!isOtpSent ? (
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleSendOtp}
                    className="w-full bg-[#EA4424] hover:bg-[#d13b20] text-white py-3 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <FiLoader className="animate-spin mr-2" />
                        Sending OTP...
                      </>
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                ) : (
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
                      "Log in with OTP"
                    )}
                  </button>
                )}
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Have an account?{" "}
                <Link to="/login" className="text-[#EA4424] font-medium hover:underline">
                  Login with Email
                </Link>
              </p>
            </div>
          </div>

          {/* Right side */}
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

export default LoginWithOtp;
