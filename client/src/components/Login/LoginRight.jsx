import React from "react";

const LoginRight = () => {
  return (
    <div className="bg-white/20 backdrop-blur-md shadow-2xl rounded-2xl p-6 max-w-md w-full text-center border border-white/30">
      <h2 className="text-lg font-semibold text-white mb-3 outfit">
        Smart Excel Analysis Dashboard
      </h2>
      <p className="text-white/90 mb-4 text-sm">
        Explore AI-powered insights, interactive charts, and report downloads — all from your spreadsheets.
      </p>
      <div className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-lg p-4 border border-white/20">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-white/80 text-xs">Live Analytics</span>
        </div>
        <div className="text-white/70 text-xs">
          ✓ AI Insights • ✓ Interactive Charts • ✓ Real-time Analysis
        </div>
      </div>
    </div>
  );
};

export default LoginRight;
