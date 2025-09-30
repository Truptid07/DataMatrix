import React from "react";

const RegisterRight = () => {
  return (
    <div className="bg-white/20 backdrop-blur-md shadow-2xl rounded-2xl p-8 max-w-md w-full text-center border border-white/30">
      <h2 className="text-2xl font-semibold text-white mb-4 outfit">
        Join DataMatrix Today
      </h2>
      <p className="text-white/90 mb-6">
        Sign up and begin transforming your Excel data into actionable insights
        through interactive charts and AI-powered summaries.
      </p>
      <img
        src="./new.png.png"
        alt="Excel Analysis Preview"
        className="rounded-xl shadow-md"
      />
    </div>
  );
};

export default RegisterRight;
