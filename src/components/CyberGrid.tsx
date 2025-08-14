import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const CyberGrid = () => {
  const [gridPoints, setGridPoints] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    const points = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      delay: Math.random() * 3,
    }));
    setGridPoints(points);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Grid */}
      <div className="absolute inset-0 cyber-grid opacity-30" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {gridPoints.map((point) => (
          <motion.div
            key={point.id}
            className="absolute rounded-full bg-primary/20"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              width: `${point.size}px`,
              height: `${point.size}px`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              delay: point.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Scanning Lines */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            90deg,
            transparent 0%,
            hsl(var(--primary) / 0.1) 1%,
            hsl(var(--accent) / 0.2) 2%,
            hsl(var(--primary) / 0.1) 3%,
            transparent 4%,
            transparent 96%,
            hsl(var(--primary) / 0.1) 97%,
            hsl(var(--accent) / 0.2) 98%,
            hsl(var(--primary) / 0.1) 99%,
            transparent 100%
          )`,
        }}
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Holographic Distortion */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(circle at 25% 25%, hsl(var(--primary) / 0.3) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, hsl(var(--accent) / 0.2) 0%, transparent 50%)
          `,
          filter: "blur(40px)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 1, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};