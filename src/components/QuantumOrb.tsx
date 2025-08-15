import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface QuantumOrbProps {
  size?: number;
  className?: string;
  delay?: number;
}

export const QuantumOrb = ({ size = 200, className = "", delay = 0 }: QuantumOrbProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      initial={{ 
        scale: 0,
        rotateX: -90,
        opacity: 0 
      }}
      animate={{ 
        scale: 1,
        rotateX: 0,
        opacity: 1,
        x: mousePosition.x * 0.02,
        y: mousePosition.y * 0.02,
      }}
      transition={{ 
        duration: 1.5,
        delay,
        ease: "easeOut"
      }}
      className={`fixed pointer-events-none z-0 transform-3d ${className}`}
      style={{
        width: size,
        height: size,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Core Orb */}
      <motion.div
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
          rotateZ: [0, 180],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="relative w-full h-full transform-3d"
      >
        {/* Inner Core */}
        <div
          className="absolute inset-4 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, 
              hsl(var(--primary) / 0.8), 
              hsl(var(--accent) / 0.6), 
              hsl(var(--tertiary) / 0.4), 
              transparent)`,
            boxShadow: `
              0 0 40px hsl(var(--primary) / 0.6),
              0 0 80px hsl(var(--accent) / 0.4),
              inset 0 0 40px hsl(var(--secondary) / 0.3)
            `,
            filter: "blur(1px)",
          }}
        />

        {/* Energy Rings */}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              rotateY: [0, 360],
              rotateX: [0, 180],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5,
            }}
            className="absolute inset-0 rounded-full border-2"
            style={{
              borderColor: `hsl(var(--${i === 0 ? 'primary' : i === 1 ? 'accent' : 'tertiary'}) / 0.3)`,
              transform: `rotateX(${i * 60}deg) rotateY(${i * 45}deg)`,
            }}
          />
        ))}

        {/* Quantum Particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            animate={{
              rotateY: [0, 360],
              scale: [0.5, 1.5, 0.5],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: `hsl(var(--${i % 2 === 0 ? 'primary' : 'accent'}))`,
              top: "50%",
              left: "50%",
              transform: `
                translate(-50%, -50%) 
                rotateY(${i * 45}deg) 
                translateZ(${60 + i * 10}px)
              `,
              boxShadow: `0 0 10px hsl(var(--${i % 2 === 0 ? 'primary' : 'accent'}) / 0.8)`,
            }}
          />
        ))}
      </motion.div>

      {/* Holographic Data Streams */}
      <motion.div
        animate={{
          rotateZ: [0, 360],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={`stream-${i}`}
            animate={{
              scaleY: [0.5, 1.5, 0.5],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
            className="absolute w-0.5 h-full"
            style={{
              background: `linear-gradient(to bottom, 
                transparent, 
                hsl(var(--tertiary) / 0.6), 
                transparent)`,
              left: "50%",
              top: 0,
              transform: `translateX(-50%) rotateZ(${i * 90}deg)`,
              filter: "blur(0.5px)",
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};