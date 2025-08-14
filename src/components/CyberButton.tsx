import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface CyberButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
}

export const CyberButton = ({ 
  children, 
  onClick, 
  variant = "primary", 
  size = "md", 
  className = "",
  href,
  target,
  rel
}: CyberButtonProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "neon-glow bg-gradient-primary hover:shadow-cyber border-primary/50";
      case "secondary":
        return "glass border-accent/50 hover:border-accent text-accent";
      case "ghost":
        return "border border-border/50 hover:border-primary/50 text-muted-foreground hover:text-primary";
      default:
        return "neon-glow bg-gradient-primary hover:shadow-cyber border-primary/50";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-4 py-2 text-sm";
      case "md":
        return "px-6 py-3 text-base";
      case "lg":
        return "px-8 py-4 text-lg";
      default:
        return "px-6 py-3 text-base";
    }
  };

  const MotionButton = motion(Button);

  const buttonProps = {
    className: `
      relative overflow-hidden transform-3d transition-all duration-300
      ${getVariantStyles()} ${getSizeStyles()} ${className}
    `,
    onClick,
    whileHover: { 
      scale: 1.05,
      rotateX: -2,
      rotateY: 2,
      z: 20,
    },
    whileTap: { 
      scale: 0.95,
      rotateX: 2,
      rotateY: -2,
    },
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
    },
  };

  const content = (
    <>
      {/* Holographic Overlay */}
      <motion.div
        className="absolute inset-0 opacity-0 hover:opacity-30 transition-opacity duration-300"
        style={{
          background: `linear-gradient(
            45deg,
            hsl(var(--primary) / 0.5),
            hsl(var(--accent) / 0.5),
            hsl(var(--tertiary) / 0.5)
          )`,
        }}
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Scanning Line */}
      <motion.div
        className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0"
        whileHover={{
          opacity: [0, 1, 0],
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <span className="relative z-10 font-medium tracking-wide">
        {children}
      </span>

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-primary/50 transition-all duration-300 group-hover:border-primary" />
      <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-primary/50 transition-all duration-300 group-hover:border-primary" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-primary/50 transition-all duration-300 group-hover:border-primary" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-primary/50 transition-all duration-300 group-hover:border-primary" />
    </>
  );

  if (href) {
    return (
      <MotionButton asChild {...buttonProps}>
        <a href={href} target={target} rel={rel} className="group">
          {content}
        </a>
      </MotionButton>
    );
  }

  return (
    <MotionButton {...buttonProps} className={`group ${buttonProps.className}`}>
      {content}
    </MotionButton>
  );
};