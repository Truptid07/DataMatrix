import React from 'react'
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <main className="flex flex-col items-center justify-center px-6">
        <motion.div
          className="text-center space-y-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Main Heading with Enhanced Styling */}
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold outfit mb-6 cursor-default group"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.span 
              className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:via-purple-200 group-hover:to-white transition-all duration-500"
              whileHover={{ 
                textShadow: "0 0 30px rgba(255, 255, 255, 0.5)" 
              }}
            >
              Welcome to
            </motion.span>
            <br />
            <motion.span 
              className="bg-gradient-to-r from-yellow-200 via-pink-200 to-white bg-clip-text text-transparent relative group"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              style={{
                backgroundSize: '200% 200%'
              }}
              whileHover={{
                scale: 1.05,
                textShadow: "0 0 40px rgba(255, 192, 203, 0.8)"
              }}
            >
              DataMatrix
              
              {/* Sparkle effects */}
              <motion.div
                className="absolute -top-4 -right-4 text-2xl opacity-0 group-hover:opacity-100"
                animate={{ 
                  rotate: [0, 360],
                  scale: [0.8, 1.2, 0.8] 
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ✨
              </motion.div>
              
              <motion.div
                className="absolute -bottom-2 -left-6 text-xl opacity-0 group-hover:opacity-100"
                animate={{ 
                  rotate: [360, 0],
                  scale: [1, 1.3, 1] 
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                🌟
              </motion.div>
              
              <motion.div
                className="absolute top-1/2 -right-8 text-lg opacity-0 group-hover:opacity-100"
                animate={{ 
                  y: [-10, 10, -10],
                  rotate: [0, 180, 360] 
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                💫
              </motion.div>
            </motion.span>
          </motion.h1>

          {/* Enhanced Description */}
          <motion.div
            className="group cursor-default"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.p 
              className="text-white/90 text-lg md:text-xl outfit leading-relaxed mb-8 max-w-3xl mx-auto backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl group-hover:bg-white/20 group-hover:border-white/40 group-hover:shadow-2xl group-hover:shadow-white/10 transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              🚀 Transform raw Excel files into actionable intelligence. Simply upload your data, visualize it instantly with dynamic 2D and 3D charts, and leverage AI-driven insights to make smarter decisions faster.
              
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            </motion.p>
          </motion.div>

          {/* Enhanced Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to="/login"
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 text-lg font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-500 shadow-2xl hover:shadow-blue-500/50 border-2 border-transparent hover:border-white/30 block"
              >
                <span className="relative z-10 flex items-center space-x-2 group-hover:text-yellow-200 transition-colors duration-300">
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    🔐
                  </motion.span>
                  <span>Login</span>
                </span>
                
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                
                {/* Pulsing border */}
                <div className="absolute inset-0 rounded-full border-2 border-blue-400/0 group-hover:border-blue-400/50 group-hover:animate-pulse transition-all duration-500"></div>
                
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to="/register"
                className="group relative overflow-hidden bg-white/20 backdrop-blur-sm text-white px-8 py-3 text-lg font-semibold rounded-full border-2 border-white/30 hover:bg-white/30 hover:border-white/60 transition-all duration-500 shadow-2xl hover:shadow-white/30 block"
              >
                <span className="relative z-10 flex items-center space-x-2 group-hover:text-blue-200 transition-colors duration-300">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  >
                    ✨
                  </motion.span>
                  <span>Register</span>
                </span>
                
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                
                {/* Ripple effect */}
                <div className="absolute inset-0 rounded-full bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-500 ease-out"></div>
                
                {/* Outer glow */}
                <div className="absolute -inset-1 bg-white/20 rounded-full blur opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                
                {/* Particle effect simulation */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" style={{animationDelay: '0.1s'}}></div>
                  <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-300/60 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" style={{animationDelay: '0.3s'}}></div>
                  <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-purple-300/60 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" style={{animationDelay: '0.5s'}}></div>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
  )
}

export default Hero
