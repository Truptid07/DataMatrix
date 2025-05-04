import { motion } from "framer-motion";

const ringVariants = {
  animate: {
    strokeDasharray: ["0 660", "60 600", "60 600", "0 660", "60 600", "60 600", "0 660"],
    strokeDashoffset: [-330, -335, -595, -660, -665, -925, -990],
    strokeWidth: [20, 30, 30, 20, 30, 30, 20],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: "linear",
      times: [0, 0.12, 0.32, 0.54, 0.62, 0.82, 1],
    },
  },
};

const Loader = () => {
  return (
    <div className="w-24 h-24 flex items-center justify-center">
      <svg viewBox="0 0 240 240" className="w-full h-full">
        <motion.circle
          cx="120"
          cy="120"
          r="105"
          fill="none"
          stroke="#9708F4"
          strokeLinecap="round"
          variants={ringVariants}
          animate="animate"
        />
        <motion.circle
          cx="120"
          cy="120"
          r="35"
          fill="none"
          stroke="#5E14E4"
          strokeLinecap="round"
          variants={ringVariants}
          animate="animate"
          transition={{ delay: 0.2, ...ringVariants.animate.transition }}
        />
        <motion.circle
          cx="85"
          cy="120"
          r="70"
          fill="none"
          stroke="#9708F4"
          strokeLinecap="round"
          variants={ringVariants}
          animate="animate"
          transition={{ delay: 0.4, ...ringVariants.animate.transition }}
        />
        <motion.circle
          cx="155"
          cy="120"
          r="70"
          fill="none"
          stroke="#5E14E4"
          strokeLinecap="round"
          variants={ringVariants}
          animate="animate"
          transition={{ delay: 0.6, ...ringVariants.animate.transition }}
        />
      </svg>
    </div>
  );
};

export default Loader;
