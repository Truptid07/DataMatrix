import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { setCredentials } from "../redux/authSlice";

function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUser(formData);
      dispatch(setCredentials(data));
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error(error.response.data.message);
      alert(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <input
        type="text"
        name="name"
        placeholder="Name"
        className="w-full mb-4 p-2 border rounded"
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full mb-4 p-2 border rounded"
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="w-full mb-6 p-2 border rounded"
        onChange={handleChange}
        required
      />
      <button
        type="submit"
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
      >
        Register
      </button>
    </form>
  );
}

export default RegisterForm;
