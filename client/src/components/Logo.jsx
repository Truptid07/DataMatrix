import React from 'react'
import { motion } from "framer-motion";

const Logo = () => {
  return (
    <motion.header
        className="p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <img src="./logo.png" alt="SheetSense Logo" className="w-12 h-12" />
      </motion.header>
  )
}

export default Logo
