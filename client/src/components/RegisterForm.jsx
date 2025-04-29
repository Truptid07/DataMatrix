import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { setCredentials } from "../redux/authSlice";
import Image from '../assets/image.jpg';

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
    <>
      <form onSubmit={handleSubmit} className="bg-[#ECFCFF] text-blue-900 p-8 pt-12 rounded-lg shadow-md w-80 lg:w-100 h-120">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <p className="text-l mb-12 text-center"> Create an account to get started </p>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full mb-4 p-2 border-[0.2px] border-gray-200 focus:outline-none bg-white text-blue-700 rounded"
          onChange={handleChange}
          required
          />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border-[0.2px] border-gray-200 focus:outline-none bg-white text-blue-700 rounded"
          onChange={handleChange}
          required
          />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-2 p-2 border-[0.2px] border-gray-200 focus:outline-none bg-white text-blue-700 rounded"
          onChange={handleChange}
          required
          />
          <p className="text-right mb-6 cursor-pointer" onClick={() => {navigate("/login")}}> Already have an account? Login </p>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 cursor-pointer"
          >
          Register
        </button>
      </form>

      <div className="bg-[#ECFCFF] text-blue-900 p-8 rounded-lg shadow-md w-80 lg:w-120">
        <p className="text-2xl font-bold mb-4 text-center"> Join SheetSense Today </p>
        <p className="text-l mb-8 text-center"> Sign up and begin transforming your Excel data into actionable insights through interactive charts and AI-powered summaries </p>
        <img src={Image} className="rounded-lg"/>
      </div>
    </>
  );
}

export default RegisterForm;
