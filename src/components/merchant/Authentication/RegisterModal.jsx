import {
  User,
  Lock,
  Mail,
  Phone,
  FileText,
  FileDigit,
  FileInput,
} from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { toast } from "react-toastify";
import { registerMerchant } from "../../../apis/restaurantApi";

const RegisterModal = ({ isOpen, onClose, onLoginClick }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useLayoutEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    
    // Remove all non-digit characters
    value = value.replace(/\D/g, '');
    
    // If the value doesn't start with +91, prepend it
    if (!value.startsWith('91') && value.length > 0) {
      value = '91' + value;
    }
    
    // Limit to 12 digits (91 + 10 digits)
    value = value.substring(0, 12);
    
    // Format as +91XXXXXXXXXX
    const formattedValue = value.length > 0 ? `+${value}` : '';
    
    setFormData((prev) => ({
      ...prev,
      phone: formattedValue,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      handlePhoneChange(e);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    // Password validation
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate phone number (should be +91 followed by 10 digits)
    const phoneRegex = /^\+91\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit Indian phone number");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await registerMerchant({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      if (response.message === "Merchant registration submitted!") {
        toast.success("Merchant registration submitted successfully!");
        onClose();
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.data?.message === "Email or phone already in use.") {
        toast.error("Email or phone number already registered");
      } else {
        toast.error(error.message || "Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
    >
      <div
        className={`relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg transform transition-all duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        <div className="flex flex-col space-y-1.5 text-center mb-6">
          <h2 className="text-2xl font-bold">Register as Merchant</h2>
          <p className="text-sm text-gray-500">
            Create your merchant account to start selling
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Full Name*
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm"
                placeholder="Your full name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email*</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm"
                placeholder="Email address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Phone Number*
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm"
                placeholder="+91XXXXXXXXXX"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Password*
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm"
                placeholder="Create a password (min 8 characters)"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={8}
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Confirm Password*
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm"
                placeholder="Confirm your password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                minLength={8}
              />
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white h-10 px-4 py-2 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register as Merchant"}
          </button>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Already have an account?{" "}
            </span>
            <button
              type="button"
              onClick={onLoginClick}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Login here
            </button>
          </div>
        </form>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-md hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default RegisterModal;