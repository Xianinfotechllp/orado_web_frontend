import React, { useState, useEffect } from "react";
import {
  Utensils,
  CheckCircle,
  User,
  Lock,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";
import RegisterModal from "../../components/merchant/RegisterModal";

const Partner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const slidingContent = [
    {
      title: "Boost Your Revenue",
      description:
        "Increase your restaurant's reach and earn more with our delivery platform",
      icon: "💰",
    },
    {
      title: "Easy Management",
      description:
        "Simple dashboard to manage orders, menu, and track your business growth",
      icon: "📊",
    },
    {
      title: "24/7 Support",
      description:
        "Get dedicated support from our team whenever you need assistance",
      icon: "🎧",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidingContent.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Food Image */}
      <div className="relative h-96 bg-black overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative z-10 flex h-full">
          {/* Left Side - Sliding Content */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center text-white max-w-md">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg mr-3">
                  <Utensils className="w-8 h-8 text-white" />
                </div>
                <span className="text-4xl font-bold">Orado</span>
              </div>

              <div className="transition-all duration-500 ease-in-out">
                <div className="text-6xl mb-4">
                  {slidingContent[currentSlide].icon}
                </div>
                <h2 className="text-2xl font-bold mb-4">
                  {slidingContent[currentSlide].title}
                </h2>
                <p className="text-lg opacity-90">
                  {slidingContent[currentSlide].description}
                </p>
              </div>

              {/* Slide Indicators */}
              <div className="flex justify-center mt-6 space-x-2">
                {slidingContent.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      currentSlide === index
                        ? "bg-orange-500"
                        : "bg-white bg-opacity-50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
                  Partner Login
                </h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter your email"
                        type="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter your password"
                        type="password"
                      />
                    </div>
                  </div>

                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white h-10 px-4 py-2 w-full">
                    Login
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>

                  <div className="text-center">
                    <span className="text-sm text-gray-600">
                      Don't have an account?{" "}
                    </span>
                    <button
                      onClick={() => setIsRegisterModalOpen(true)}
                      className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Register here
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Steps Section - Compact version */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            {/* Left Section - Steps */}
            <div className="flex-1">
              <div className="mb-4">
                <p className="text-gray-600 text-sm">In just 3 easy steps</p>
                <h3 className="text-xl font-bold text-gray-800">
                  Get your restaurant delivery-ready in 24hrs!
                </h3>
                <div className="w-12 h-1 bg-orange-500 mt-2"></div>
              </div>

              <div className="space-y-3 max-w-md">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-600">STEP 1</span>
                      <p className="font-semibold text-gray-800">
                        Install the Orado Owner App
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-600">STEP 2</span>
                      <p className="font-semibold text-gray-800">
                        Login/Register using your phone number
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-600">STEP 3</span>
                      <p className="font-semibold text-gray-800">
                        Enter restaurant details
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Documents */}
            <div className="flex-1 md:ml-8">
              <div className="bg-gray-50 rounded-xl p-4 max-w-md">
                <div className="mb-3">
                  <p className="font-semibold text-gray-800 mb-1">
                    For an easy form filling process,
                  </p>
                  <p className="text-gray-600 text-xs">
                    you can keep these documents handy.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">
                      FSSAI License copy
                    </span>
                  </div>

                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">
                      GSTIN certificate
                    </span>
                  </div>

                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">PAN card copy</span>
                  </div>
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
