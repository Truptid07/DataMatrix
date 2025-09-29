import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { setCredentials } from "../../redux/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importing eye icons from react-icons

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
  
    try {
      // Optional: simulate delay before request
      await new Promise((res) => setTimeout(res, 2000));
  
      const data = await loginUser(formData);
      dispatch(setCredentials(data));
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));
  
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      navigate("/");
      alert(error.response?.data?.message || "Login failed");
      setIsLoading(false); // Stop loading in case of error
    }
  };
  

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/20 backdrop-blur-lg shadow-2xl rounded-2xl p-6 w-full max-w-sm outfit border border-white/30"
    >
      <h2 className="text-2xl font-bold text-white text-center mb-1">
        Login
      </h2>
      <p className="text-white/90 text-center text-xs mb-4">
        Sign in to explore powerful Excel insights.
      </p>

      <div className="space-y-3">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-3 py-2.5 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/20 text-white placeholder-white/70 text-sm"
          onChange={handleChange}
          required
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"} // Toggle password visibility
            name="password"
            placeholder="Password"
            className="w-full px-3 py-2.5 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/20 text-white placeholder-white/70 text-sm"
            onChange={handleChange}
            required
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-white/70"
            onClick={() => setShowPassword(!showPassword)} // Toggle password visibility on click
          >
            {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}{" "}
            {/* Conditional rendering of icons */}
          </span>
        </div>
      </div>

      <div className="text-right mt-2 mb-4">
        <Link to="/register" className="text-xs text-white/80 hover:text-white hover:underline">
          New User? Register
        </Link>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl text-sm"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

export default LoginForm;
