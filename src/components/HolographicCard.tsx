import { motion } from "framer-motion";
import { ReactNode, useState } from "react";

interface HolographicCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const HolographicCard = ({ children, className = "", delay = 0 }: HolographicCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: 50,
        rotateX: 15,
        rotateY: -15,
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        rotateX: 0,
        rotateY: 0,
      }}
      transition={{ 
        duration: 0.8,
        delay,
        ease: "easeOut",
      }}
      whileHover={{ 
        scale: 1.05,
        rotateX: -5,
        rotateY: 5,
        z: 50,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      viewport={{ once: true }}
      className={`
        glass-card transform-3d tilt-3d relative overflow-hidden
        transition-all duration-500 ease-out
        ${className}
      `}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      {/* Holographic Border Animation */}
      <motion.div
        className="absolute inset-0 rounded-3xl"
        style={{
          background: `conic-gradient(
            from 0deg,
            hsl(var(--primary) / 0.5),
            hsl(var(--accent) / 0.5),
            hsl(var(--tertiary) / 0.5),
            hsl(var(--secondary) / 0.5),
            hsl(var(--primary) / 0.5)
          )`,
          padding: "2px",
        }}
        animate={{
          rotate: isHovered ? 360 : 0,
        }}
        transition={{
          duration: 3,
          ease: "linear",
          repeat: isHovered ? Infinity : 0,
        }}
      >
        <div className="w-full h-full rounded-3xl bg-background/90 backdrop-blur-xl" />
      </motion.div>

      {/* Scanning Effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl overflow-hidden"
        style={{
          background: `linear-gradient(
            45deg,
            transparent 0%,
            hsl(var(--primary) / 0.1) 49%,
            hsl(var(--accent) / 0.3) 50%,
            hsl(var(--primary) / 0.1) 51%,
            transparent 100%
          )`,
        }}
        animate={{
          x: isHovered ? ["0%", "100%"] : "0%",
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: isHovered ? Infinity : 0,
          repeatDelay: 0.5,
        }}
      />

      {/* Content with 3D effect */}
      <motion.div
        className="relative z-10 p-8"
        animate={{
          z: isHovered ? 30 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
      >
        {children}
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/30"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [-10, -30, -10],
              x: [-5, 5, -5],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};