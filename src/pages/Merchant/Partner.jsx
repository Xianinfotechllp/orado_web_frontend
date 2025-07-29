import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  User,
  Lock,
  Mail,
  Phone,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Smartphone,
  FileText,
  TrendingUp,
  Headphones,
} from "lucide-react";
import RegisterModal from "../../components/merchant/Authentication/RegisterModal";
import { loginMerchant } from "../../apis/restaurantApi";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/oradoLogo.png";
import { setUser } from "../../slices/authSlice";
import { useDispatch } from "react-redux";

const Partner = () => {
  const dispatch = useDispatch();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    identifier: "",
    password: "",
  });
  const [identifierType, setIdentifierType] = useState("email");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const slidingContent = [
    {
      title: "Grow your business with Orado",
      description: "Reach millions of customers and increase your revenue with our delivery platform",
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Smart restaurant management",
      description: "Powerful dashboard to manage orders, menu, and track your business performance",
      icon: FileText,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "24/7 partner support",
      description: "Get dedicated support from our team whenever you need assistance",
      icon: Headphones,
      color: "from-slate-600 to-gray-700",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidingContent.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
    if (apiError) setApiError(null);
  };

  const toggleIdentifierType = () => {
    setIdentifierType(prev => prev === "email" ? "phone" : "email");
    setLoginData(prev => ({ ...prev, identifier: "" }));
    setErrors(prev => ({ ...prev, identifier: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!loginData.identifier) {
      newErrors.identifier = `${identifierType === "email" ? "Email" : "Phone number"} is required`;
    }
    
    if (!loginData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError(null);

    try {
      const response = await loginMerchant({
        identifier: loginData.identifier,
        password: loginData.password
      });

      dispatch(setUser({ 
        token: response.token, 
        user: response.user 
      }));
      navigate("/merchant");
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.data) {
        const { message } = error.response.data;

        if (message === "Merchant not found.") {
          setErrors({ identifier: "Account not found" });
        } else if (message === "Invalid password.") {
          setErrors({ password: "Invalid password" });
        } else {
          setApiError(message || "Login failed. Please try again.");
        }
      } else {
        setApiError(error.message || "Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const CurrentIcon = slidingContent[currentSlide].icon;

  return (
    <div className="min-h-screen bg-white">
      {/* Main Container */}
      <div className="flex min-h-screen">
        {/* Left Panel - Hero Section */}
        <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${slidingContent[currentSlide].color} transition-all duration-1000 ease-in-out`}>
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 right-10 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>

          <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center text-white">
            {/* Logo Section */}
            <div className="flex items-center gap-3 mb-12">
              <img src={logo} alt="Orado Logo" className="h-12 w-auto" />
              <span className="text-3xl font-bold">Orado</span>
            </div>

            {/* Sliding Content */}
            <div className="max-w-lg transition-all duration-700 ease-in-out transform">
              <div className="mb-8 flex justify-center">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <CurrentIcon className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-6 leading-tight">
                {slidingContent[currentSlide].title}
              </h1>
              <p className="text-xl opacity-90 leading-relaxed">
                {slidingContent[currentSlide].description}
              </p>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center mt-12 space-x-3">
              {slidingContent.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "bg-white scale-110"
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex-1 lg:flex-none lg:w-[500px] flex items-center justify-center p-8 bg-gray-50">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <img src={logo} alt="Orado Logo" className="h-10 w-auto" />
              <span className="text-2xl font-bold text-gray-900">Orado</span>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome back, Partner
                  </h2>
                  <p className="text-gray-600">
                    Sign in to manage your restaurant
                  </p>
                </div>

                {/* API Error */}
                {apiError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start">
                    <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-red-500" />
                    <span className="text-sm">{apiError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Identifier Input */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold text-gray-700">
                        {identifierType === "email" ? "Email Address" : "Phone Number"}
                      </label>
                      <button
                        type="button"
                        onClick={toggleIdentifierType}
                        className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
                      >
                        Use {identifierType === "email" ? "Phone" : "Email"}
                      </button>
                    </div>
                    <div className="relative">
                      {identifierType === "email" ? (
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      ) : (
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      )}
                      <input
                        name="identifier"
                        value={loginData.identifier}
                        onChange={handleInputChange}
                        className={`w-full h-12 pl-12 pr-4 rounded-xl border-2 transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                          errors.identifier 
                            ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200" 
                            : "border-gray-200 bg-white focus:border-orange-500 focus:ring-orange-200"
                        } focus:outline-none focus:ring-4`}
                        placeholder={
                          identifierType === "email" 
                            ? "Enter your email address" 
                            : "Enter your phone number"
                        }
                        type={identifierType === "email" ? "email" : "tel"}
                      />
                      {errors.identifier && (
                        <p className="text-sm text-red-500 mt-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.identifier}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        name="password"
                        value={loginData.password}
                        onChange={handleInputChange}
                        className={`w-full h-12 pl-12 pr-12 rounded-xl border-2 transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                          errors.password 
                            ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200" 
                            : "border-gray-200 bg-white focus:border-orange-500 focus:ring-orange-200"
                        } focus:outline-none focus:ring-4`}
                        placeholder="Enter your password"
                        type={showPassword ? "text" : "password"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      {errors.password && (
                        <p className="text-sm text-red-500 mt-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.password}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Signing in...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        Sign in
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </div>
                    )}
                  </button>

                  {/* Register Link */}
                  <div className="text-center pt-4 border-t border-gray-100">
                    <span className="text-gray-600">New to Orado? </span>
                    <button
                      type="button"
                      onClick={() => setIsRegisterModalOpen(true)}
                      className="text-orange-500 hover:text-orange-600 font-semibold transition-colors"
                    >
                      Create your account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Section - Steps */}
            <div>
              <div className="mb-8">
                <span className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-4">
                  Get Started in 3 Steps
                </span>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Start selling in just 24 hours
                </h3>
                <p className="text-gray-600 text-lg">
                  Join thousands of restaurants already growing with Orado
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    step: "1",
                    title: "Download Orado Partner App",
                    desc: "Get our free merchant app from Play Store or App Store",
                    color: "bg-blue-500",
                    icon: Smartphone,
                  },
                  {
                    step: "2", 
                    title: "Create your account",
                    desc: "Register with your phone number or email address",
                    color: "bg-indigo-500",
                    icon: User,
                  },
                  {
                    step: "3",
                    title: "Setup your restaurant",
                    desc: "Add your business details and start receiving orders",
                    color: "bg-slate-600",
                    icon: CheckCircle,
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Step {item.step}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Section - Documents */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-100">
              <div className="mb-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Documents needed
                </h4>
                <p className="text-gray-600">
                  Keep these documents ready for faster registration
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: FileText, text: "Business registration certificate" },
                  { icon: User, text: "Government issued ID proof" },
                  { icon: CheckCircle, text: "Bank account details" },
                  { icon: FileText, text: "FSSAI license (for food businesses)" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-orange-100">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-orange-100 rounded-lg border border-orange-200">
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <p className="text-sm text-orange-800">
                    <strong>Pro tip:</strong> Having all documents ready can get you live in under 2 hours!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onLoginClick={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
};

export default Partner;
