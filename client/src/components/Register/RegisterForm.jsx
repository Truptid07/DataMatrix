import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import { setCredentials } from "../../redux/authSlice";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true); // Start loading
    
    try {
      console.log('Attempting to register user:', formData);
      const data = await registerUser(formData);
      console.log('Registration successful:', data);
      
      dispatch(setCredentials(data));
      sessionStorage.setItem("token", data.token);
      
      // Show success message
      alert("Registration successful! Welcome to DataMatrix!");
      
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // Better error handling
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.response) {
        // Server responded with an error
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "Unable to connect to server. Please check your connection.";
      } else {
        // Something else happened
        errorMessage = error.message || errorMessage;
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false); // Always stop loading
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/20 backdrop-blur-lg shadow-lg rounded-2xl p-8 w-full max-w-sm outfit border border-white/20"
    >
      <h2 className="text-3xl font-bold text-white text-center mb-2">
        Register
      </h2>
      <p className="text-white/80 text-center text-sm mb-6">
        Create an account to get started.
      </p>

      <div className="space-y-4">
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-white/20 text-white placeholder-white/60 ${
              errors.name ? 'border-red-300 focus:ring-red-300' : 'border-white/30 focus:ring-white/50'
            }`}
            onChange={handleChange}
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-white/20 text-white placeholder-white/60 ${
              errors.email ? 'border-red-300 focus:ring-red-300' : 'border-white/30 focus:ring-white/50'
            }`}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        
        <div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-white/20 text-white placeholder-white/60 pr-12 ${
                errors.password ? 'border-red-300 focus:ring-red-300' : 'border-white/30 focus:ring-white/50'
              }`}
              onChange={handleChange}
              required
            />
            <span
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-white/70"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </span>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
      </div>

      <div className="text-right mt-2 mb-6">
        <Link to="/login" className="text-sm text-white/80 hover:text-white hover:underline">
          Already have an account? Login
        </Link>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl"
        disabled={isLoading}
      >
        {isLoading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}

export default RegisterForm;
