import React from "react";
import { motion } from "framer-motion";
import { FaFileExcel, FaChartBar, FaRobot, FaHistory } from "react-icons/fa";

const features = [
  { icon: <FaFileExcel size={30} />, text: "Upload Excel files" },
  { icon: <FaChartBar size={30} />, text: "Generate 2D/3D charts" },
  { icon: <FaRobot size={30} />, text: "AI-powered insights" },
  { icon: <FaHistory size={30} />, text: "See upload history" },
];

function Features() {
  return (
    <div className="py-6 px-6 overflow-hidden">
      {/* Enhanced feature grid */}
      <motion.div
        className="flex justify-center flex-wrap gap-3 md:gap-4 inter max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="group flex items-center bg-white/20 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/30 shadow-xl hover:shadow-2xl hover:bg-white/30 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1"
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.2 + (0.1 * index),
              ease: "easeOut" 
            }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
          >
            <motion.div 
              className="text-yellow-300 mr-3 group-hover:text-yellow-200 transition-colors duration-300"
              animate={{ 
                rotate: [0, 5, -5, 0],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: index * 0.5
              }}
            >
              {React.cloneElement(feature.icon, { size: 22 })}
            </motion.div>
            <p className="text-sm font-semibold text-white/90 group-hover:text-white whitespace-nowrap transition-colors duration-300">
              {feature.text}
            </p>
            
            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 via-purple-400/0 to-pink-400/0 group-hover:from-blue-400/20 group-hover:via-purple-400/20 group-hover:to-pink-400/20 transition-all duration-500 pointer-events-none"></div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default Features;
