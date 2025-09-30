import React from 'react'
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Logo = () => {
  return (
    <motion.div
        className="relative z-50 pointer-events-auto"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Link to="/" className="inline-flex items-center space-x-3 group relative cursor-pointer hover:opacity-80 active:opacity-60 transition-opacity duration-200" title="Click to go back to Home Page">
          <motion.div 
            className="relative w-12 h-12 bg-gradient-to-br from-white to-blue-100 rounded-xl shadow-lg flex items-center justify-center group-hover:shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-500 cursor-pointer"
            whileHover={{ 
              scale: 1.15, 
              rotate: [0, -5, 5, 0],
              boxShadow: "0 20px 40px rgba(102, 126, 234, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ 
              duration: 0.6,
              rotate: { duration: 0.8, ease: "easeInOut" }
            }}
          >
            <motion.span 
              className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent group-hover:from-[#764ba2] group-hover:to-[#667eea] transition-all duration-500"
              whileHover={{
                scale: 1.1,
                textShadow: "0 0 20px rgba(118, 75, 162, 0.8)"
              }}
            >
              DM
            </motion.span>
            
            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/20 group-hover:to-purple-400/20 rounded-xl transition-all duration-500"></div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-white/30 transition-all duration-500"></div>
          </motion.div>
          
          <motion.span 
            className="text-xl font-bold text-white/90 group-hover:text-white transition-all duration-500 relative cursor-pointer select-none"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{
              scale: 1.05,
              textShadow: "0 0 20px rgba(255, 255, 255, 0.8)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            DataMatrix
            
            {/* Underline animation */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 origin-left"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.span>
          
          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 rounded-full bg-white/10 animate-ping"></div>
          </div>
        </Link>
      </motion.div>
  )
}

export default Logo
