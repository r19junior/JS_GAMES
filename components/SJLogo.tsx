
import React from 'react';
import { motion } from 'framer-motion';

export const SJLogo: React.FC<{ className?: string }> = ({ className }) => {
  const logoUrl = "https://res.cloudinary.com/dvzxrg1tq/image/upload/v1770243156/sj_oficial_740d37.png";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex flex-col justify-center items-center ${className}`}
    >
      <div className="relative flex justify-center items-center h-[450px] md:h-[550px] w-full z-10">
        <motion.img
          src={logoUrl}
          alt="SJ Games Logo"
          // Multi-layer shadow for professional depth
          className="h-full w-auto max-w-full drop-shadow-[20px_20px_0px_rgba(222,10,10,0.1)] drop-shadow-[-10px_-10px_40px_rgba(0,0,0,0.05)] object-contain"
          animate={{
            y: [0, -15, 0],
            rotateZ: [0, 1, 0, -1, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-[14px] font-black text-white uppercase tracking-[1.2em] bg-black px-12 py-3 rounded-full border-4 border-[#DE0A0A] shadow-[8px_8px_0px_rgba(222,10,10,0.2)]"
      >
        ELITE GAMES 2025
      </motion.div>
    </motion.div>
  );
};
