import React, { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import deliveryBoy from "../../assets/deliveryBoy.png";
import { registerUser } from "../../apis/authApi"; 
import { useNavigate } from "react-router-dom";
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
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "phone") {
      // Always keep +91 prefix and allow only digits after it
      let phoneVal = value;
      if (!phoneVal.startsWith("+91")) {
        phoneVal = "+91";
      }
      // Allow only +91 followed by digits, max length 13 (+91 + 10 digits)
      if (phoneVal.length > 13) return;
      if (!/^\+91\d*$/.test(phoneVal)) return;

      setFormData((prev) => ({ ...prev, phone: phoneVal }));
      return;
    }

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(formData.email)
    )
      newErrors.email = "Invalid email format";

    if (!formData.phone || formData.phone.length !== 13)
      newErrors.phone = "Phone number must be +91 followed by 10 digits";

    if (!formData.password)
      newErrors.password = "Password is required";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.termsAccepted)
      newErrors.termsAccepted = "You must accept the terms";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    if (!validate()) return;

    setLoading(true);
    try {
      const { name, email, phone, password } = formData;
      const data = await registerUser({ name, email, phone, password });
      setSuccessMsg(data.message || "Registered successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "+91",
        password: "",
        confirmPassword: "",
        termsAccepted: false,
      });
        setTimeout(() => {
      navigate("/login");
    }, 2000);
      setErrors({});
    } catch (err) {
      setErrorMsg(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="mt-18">
        <div className="flex flex-1 flex-col md:flex-row h-screen">
          {/* Left side */}
          <div className="w-full md:w-1/2 flex flex-col px-4 py-6 md:px-10 md:py-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                New here?{" "}
                <span className="text-[#EA4424]">Create an account</span> <br />
                <span className="text-[#EA4424]">today</span>
              </h1>
              <h4 className="text-gray-500">
                Sign up and start ordering your favorite meals.
              </h4>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-6">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className={`border p-3 rounded outline-none w-full focus:border-l-4 focus:border-[#EA4424] ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={`border p-3 rounded outline-none w-full focus:border-l-4 focus:border-[#EA4424] ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91xxxxxxxxxx"
                className={`border p-3 rounded outline-none w-full focus:border-l-4 focus:border-[#EA4424] ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`border p-3 rounded outline-none w-full focus:border-l-4 focus:border-[#EA4424] ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={`border p-3 rounded outline-none w-full focus:border-l-4 focus:border-[#EA4424] ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}

              <div className="flex items-center mt-4 text-sm">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="form-checkbox h-4 w-4 text-[#EA4424] mr-2"
                />
                <span className="text-gray-700">
                  I agree to the Terms & Conditions
                </span>
              </div>
              {errors.termsAccepted && (
                <p className="text-red-500 text-sm">{errors.termsAccepted}</p>
              )}


              <div className="flex gap-5 mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#EA4424] px-8 py-2 text-white disabled:opacity-60"
                >
                  {loading ? "Signing up..." : "Signup"}
                </button>
                {/* You can add navigation on Login button if needed */}
                <button
                  type="button"
                  onClick={() => (window.location.href = "/login")}
                  className="px-8 py-2 border-[#EA4424] border text-[#EA4424]"
                >
                  Login
                </button> 
              </div>

              {successMsg && (
                <p className="text-green-600 mt-4 font-semibold">{successMsg}</p>
              )}
              {errorMsg && (
                <p className="text-red-600 mt-4 font-semibold">{errorMsg}</p>
              )}
            </form>
          </div>

          {/* Right side image */}
          <div className="hidden md:block w-1/2 bg-[#FDFCDB] h-screen">
            <img
              src={deliveryBoy}
              alt="Delivery Boy"
              className="object-contain h-full w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
