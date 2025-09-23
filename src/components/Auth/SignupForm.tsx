import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, Phone, CreditCard, CheckCircle, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import apiClient from "../../lib/apiClient";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToLogin: () => void;
}

function SuccessModal({ isOpen, onClose, onGoToLogin }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-4 transform transition-all duration-300 scale-100">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your account has been created. Please log in with your username and password.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onGoToLogin}
              className="flex-1 px-4 py-2 bg-pine-green text-white rounded-lg hover:bg-dark-teal transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SignupForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "+880",
    studentId: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usernameStatus, setUsernameStatus] = useState({ available: true, suggestion: "" });
  const [emailStatus, setEmailStatus] = useState({ available: true });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const { signUp } = useAuth();
  const navigate = useNavigate();

  // Debounced username check
  useEffect(() => {
    if (formData.username.length >= 3) {
      const timer = setTimeout(async () => {
        try {
          const response = await apiClient.get(`/api/auth/check-username/${formData.username}`);
          setUsernameStatus(response.data);
        } catch (error) {
          console.error("Error checking username:", error);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [formData.username]);

  // Debounced email check
  useEffect(() => {
    if (formData.email.includes("@")) {
      const timer = setTimeout(async () => {
        try {
          const response = await apiClient.get(`/api/auth/check-email/${formData.email}`);
          setEmailStatus(response.data);
        } catch (error) {
          console.error("Error checking email:", error);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [formData.email]);

  const validatePhoneNumber = (phone: string) => {
    // Remove +880 prefix for validation
    const phoneWithoutPrefix = phone.replace("+880", "").trim();
    if (phoneWithoutPrefix.length !== 10) {
      setPhoneError("Please enter a complete 10-digit phone number (e.g., +880 1613732227)");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (!formData.phone || !validatePhoneNumber(formData.phone)) {
      setError("Please enter a valid phone number");
      setLoading(false);
      return;
    }

    if (!formData.studentId) {
      setError("Student/Staff ID is required");
      setLoading(false);
      return;
    }

    if (!usernameStatus.available) {
      setError("Username is not available");
      setLoading(false);
      return;
    }

    if (!emailStatus.available) {
      setError("Email is already registered");
      setLoading(false);
      return;
    }

    try {
      // Register user without auto-login
      const response = await apiClient.post("/api/auth/register", {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        studentId: formData.studentId,
        password: formData.password,
      });

      if (response.status === 200) {
        setShowSuccessModal(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "phone" && !value.startsWith("+880")) {
      value = "+880" + value.replace("+880", "");
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    if (field === "phone") {
      validatePhoneNumber(value);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  const handleGoToLogin = () => {
    setShowSuccessModal(false);
    navigate("/login");
  };

  const handleUsernameUseSuggestion = () => {
    setFormData(prev => ({ ...prev, username: usernameStatus.suggestion }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-powder-blue to-bright-cyan/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join UniSwap
          </h1>
          <p className="text-gray-600">
            Create your account to start exchanging
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pine-green focus:border-transparent ${
                  formData.username.length >= 3 && !usernameStatus.available 
                    ? "border-red-300" 
                    : formData.username.length >= 3 && usernameStatus.available 
                    ? "border-green-300" 
                    : "border-gray-300"
                }`}
                placeholder="Choose a username"
                required
              />
            </div>
            {formData.username.length >= 3 && !usernameStatus.available && (
              <div className="mt-2 text-sm text-red-600">
                Username not available. 
                {usernameStatus.suggestion && (
                  <button
                    type="button"
                    onClick={handleUsernameUseSuggestion}
                    className="ml-2 text-blue-600 underline hover:text-blue-800"
                  >
                    Try "{usernameStatus.suggestion}"
                  </button>
                )}
              </div>
            )}
            {formData.username.length >= 3 && usernameStatus.available && (
              <div className="mt-2 text-sm text-green-600">✓ Username available</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pine-green focus:border-transparent ${
                  formData.email.includes("@") && !emailStatus.available 
                    ? "border-red-300" 
                    : formData.email.includes("@") && emailStatus.available 
                    ? "border-green-300" 
                    : "border-gray-300"
                }`}
                placeholder="your.email@university.edu"
                required
              />
            </div>
            {formData.email.includes("@") && !emailStatus.available && (
              <div className="mt-2 text-sm text-red-600">Email already registered</div>
            )}
            {formData.email.includes("@") && emailStatus.available && (
              <div className="mt-2 text-sm text-green-600">✓ Email available</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pine-green focus:border-transparent ${
                  phoneError ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="+880 1613732227"
                required
              />
            </div>
            {phoneError && (
              <div className="mt-2 text-sm text-red-600">{phoneError}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student/Staff ID
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => handleInputChange("studentId", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pine-green focus:border-transparent"
                placeholder="Your student or staff ID"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pine-green focus:border-transparent"
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pine-green focus:border-transparent"
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !usernameStatus.available || !emailStatus.available}
            className="w-full bg-pine-green text-white py-3 rounded-lg font-medium hover:bg-dark-teal focus:ring-2 focus:ring-pine-green focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-pine-green hover:text-dark-teal font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        onGoToLogin={handleGoToLogin}
      />
    </div>
  );
}