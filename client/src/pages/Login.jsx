import { motion } from "framer-motion";
import LoginForm from "../components/Login/LoginForm";
import Logo from "../components/Logo";
import LoginRight from "../components/Login/LoginRight";

function Login() {
  return (
    <div className="relative h-screen bg-gradient-to-tl from-[#667eea] via-[#764ba2] to-[#8B5A9F] overflow-hidden">
      {/* Animated Background Elements - Diagonal Layout */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          className="absolute top-16 right-8 w-32 h-32 bg-white/15 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-16 left-8 w-48 h-48 bg-purple-300/20 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Compact Top Navigation Bar with Logo */}
      <motion.nav 
        className="relative z-50 flex justify-between items-center px-6 py-3 bg-white/10 backdrop-blur-md border-b border-white/20"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Logo />
        <motion.div 
          className="text-white/80 text-xs font-medium hidden sm:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Welcome to DataMatrix
        </motion.div>
      </motion.nav>

      {/* Main Content - Optimized for Single Screen */}
      <div className="flex flex-col lg:flex-row items-center justify-center h-[calc(100vh-60px)] relative z-10 px-4 py-2">
        
        {/* Left: Welcome Text & Form */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center lg:items-start w-full lg:w-1/2 max-w-md"
        >
          {/* Compact Welcome Text */}
          <div className="text-center lg:text-left mb-6">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-white/80 text-sm">
              Sign in to access your Excel analytics dashboard
            </p>
          </div>
          
          {/* Login Form */}
          <LoginForm />
        </motion.div>

        {/* Right: Info Card */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full lg:w-1/2 max-w-md mt-6 lg:mt-0 lg:ml-8"
        >
          <LoginRight />
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
