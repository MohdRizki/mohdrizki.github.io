import React from 'react';
import { motion } from 'framer-motion';

export default function Skeleton({ count = 6, type = "card" }) {
  const Skeletons = Array.from({ length: count });

  if (type === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Skeletons.map((_, i) => (
          <motion.div 
            key={i} 
            className="retro-card p-5 overflow-hidden flex flex-col h-[280px]"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Image Placeholder */}
            <div className="h-40 bg-retro-grey retro-border rounded-xl mb-4 w-full"></div>
            {/* Title Placeholder */}
            <div className="h-6 bg-retro-dark/20 rounded mb-2 w-3/4"></div>
            {/* Description Placeholder */}
            <div className="h-4 bg-retro-dark/10 rounded mb-4 w-full"></div>
            <div className="h-4 bg-retro-dark/10 rounded w-5/6"></div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Gallery style (Square aspect ratio)
  if (type === "gallery") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Skeletons.map((_, i) => (
          <motion.div 
            key={i} 
            className="retro-card p-3"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
          >
            <div className="aspect-square bg-retro-grey retro-border rounded-xl overflow-hidden mb-3"></div>
            <div className="h-5 bg-retro-dark/20 rounded mb-2 w-1/2"></div>
            <div className="h-4 bg-retro-dark/10 rounded w-1/3"></div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Default block
  return <div className="h-20 bg-retro-grey retro-border rounded-xl animate-pulse"></div>;
}
