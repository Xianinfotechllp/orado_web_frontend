import React, { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import deliveryBoy from "../../assets/deliveryBoy.png";
import { registerUser } from "../../apis/authApi";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiPhone, FiLoader } from "react-icons/fi";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+91",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success"); // 'success' | 'error'

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "phone") {
      let phoneVal = value.startsWith("+91") ? value : "+91";
      if (phoneVal.length > 13) return;
      if (!/^\+91\d*$/.test(phoneVal)) return;
      setFormData((prev) => ({ ...prev, phone: phoneVal }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim())
      newErrors.email = "Email is required";
    else if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(formData.email)
    )
      newErrors.email = "Invalid email format";
    if (!formData.phone || formData.phone.length !== 13)
      newErrors.phone = "Phone must be +91 followed by 10 digits";
    if (!formData.password) newErrors.password = "Password is required";
    // Optional: match backend strength rules (if backend rejects weak passwords)
    else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d@$!%*?&]{8,}/.test(
        formData.password
      )
    )
      newErrors.password =
        "Password must be 8+ characters, include uppercase, lowercase, number, special char.";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.termsAccepted)
      newErrors.termsAccepted = "You must accept terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validate()) return;

    setLoading(true);
    try {
      const { name, email, phone, password } = formData;
      const res = await registerUser({ name, email, phone, password });
      setMessage(res.message || "Registered successfully!");
      setMessageType("success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.message || "Registration failed");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="flex flex-col md:flex-row items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="w-full md:w-1/2 lg:w-2/5 bg-white rounded-lg shadow-xl p-8 md:mr-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Create Your Account
              </h1>
              <p className="text-gray-600">
                Sign up and start ordering your favorite meals.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <FiUser className="absolute inset-y-0 left-0 ml-3 my-auto text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-[#EA4424]`}
                />
              </div>
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

              <div className="relative">
                <FiMail className="absolute inset-y-0 left-0 ml-3 my-auto text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-[#EA4424]`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

              <div className="relative">
                <FiPhone className="absolute inset-y-0 left-0 ml-3 my-auto text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91XXXXXXXXXX"
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-[#EA4424]`}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

              <div className="relative">
                <FiLock className="absolute inset-y-0 left-0 ml-3 my-auto text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-[#EA4424]`}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}

              <div className="relative">
                <FiLock className="absolute inset-y-0 left-0 ml-3 my-auto text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-[#EA4424]`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}

              <label className="flex items-center space-x-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#EA4424] border-gray-300 rounded"
                />
                <span>I agree to the Terms & Conditions</span>
              </label>
              {errors.termsAccepted && (
                <p className="text-red-500 text-sm">{errors.termsAccepted}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#EA4424] hover:bg-[#d13b20] text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Signing up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>

              {message && (
                <p
                  className={`text-center text-sm mt-4 font-medium ${
                    messageType === "error"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {message}
                </p>
              )}
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#EA4424] font-medium hover:underline"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>

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

export default Signup;
