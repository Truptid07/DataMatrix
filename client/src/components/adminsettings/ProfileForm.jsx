import React from "react";

const ProfileForm = ({ formData, handleChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Your Name"
        className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        readOnly
        placeholder="Email Address"
        className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed shadow-sm"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="New Password (optional)"
        className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
      />
      <button
        type="submit"
        className="w-full py-2 rounded-xl bg-[#007ea7] text-white font-semibold hover:bg-[#0097a7] shadow-md transition"
      >
        Update Profile
      </button>
    </form>
  );
};

export default ProfileForm;
