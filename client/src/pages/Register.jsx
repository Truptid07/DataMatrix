import { motion } from "framer-motion";
import RegisterForm from "../components/Register/RegisterForm";
import Logo from "../components/Logo";
import RegisterRight from "../components/Register/RegisterRight";

function Register() {
  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-[#667eea] via-[#764ba2] to-[#8B5A9F] overflow-hidden">
      {/* Animated Background Elements - Mirror Layout */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          className="absolute top-20 left-10 w-40 h-40 bg-white/15 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -180, -360]
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-60 h-60 bg-blue-300/20 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/3 w-28 h-28 bg-purple-400/30 rounded-full blur-xl"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Top Navigation Bar with Logo */}
      <motion.nav 
        className="relative z-50 flex justify-between items-center p-6 bg-white/10 backdrop-blur-md border-b border-white/20"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Logo />
        <motion.div 
          className="text-white/80 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Join DataMatrix Today
        </motion.div>
      </motion.nav>

      {/* Main Content - Vertical Stack Layout */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] relative z-10 p-6">
        
        {/* Top: Welcome Text */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Get Started
          </h1>
          <p className="text-white/80 text-lg max-w-md">
            Create your account and unlock powerful Excel analytics
          </p>
        </motion.div>

        {/* Center: Register Form and Info Side by Side */}
        <div className="flex flex-col lg:flex-row-reverse items-center justify-center gap-12 w-full max-w-6xl">
          
          {/* Left: Register Form */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full lg:w-auto"
          >
            <RegisterForm />
          </motion.div>

          {/* Right: Info Card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="w-full lg:w-auto"
          >
            <RegisterRight />
          </motion.div>
        </div>

        {/* Bottom: Additional Info */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12 text-white/60 text-sm"
        >
          <p>Trusted by thousands • Advanced Analytics • AI-Powered Insights</p>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;
