import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { LINKS } from "@/config/links";
import { motion } from "framer-motion";
import { CyberGrid } from "./CyberGrid";
import { CyberButton } from "./CyberButton";

export const HeroSection = () => {
  const { t } = useLanguage();

  const scrollToEcosystem = () => {
    document.getElementById('ecosystem')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden cyber-bg particles scanlines">
      {/* Advanced Cyber Grid */}
      <CyberGrid />
      
      {/* Matrix Rain Effect */}
      <div className="absolute inset-0 matrix-rain" />
      
      {/* 3D Floating Holographic Elements */}
      <div className="absolute inset-0 transform-3d">
        <motion.div
          animate={{ 
            y: [0, -30, 0],
            rotateX: [0, 15, 0],
            rotateY: [0, -10, 0],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-8 h-8 neon-glow rounded-lg transform-3d"
          style={{
            background: "var(--gradient-cyber)",
            filter: "blur(2px)",
          }}
        />
        <motion.div
          animate={{ 
            y: [0, 40, 0],
            rotateX: [0, -20, 0],
            rotateY: [0, 15, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
          className="absolute top-1/3 right-1/4 w-12 h-12 hologram-border rounded-full transform-3d"
        />
        <motion.div
          animate={{ 
            y: [0, -25, 0],
            x: [0, 20, 0],
            rotateZ: [0, 180, 360],
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6
          }}
          className="absolute bottom-1/3 left-1/3 w-6 h-6 neon-text transform-3d"
        >
          <Zap className="w-full h-full" />
        </motion.div>

        {/* Additional 3D Elements */}
        <motion.div
          animate={{ 
            rotateX: [0, 360],
            rotateY: [0, -360],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 right-1/3 w-4 h-4 bg-tertiary/40 rounded-full blur-sm transform-3d"
        />
        <motion.div
          animate={{ 
            y: [0, -50, 0],
            rotateY: [0, 180, 360],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{ 
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-1/4 right-1/4 w-10 h-1 bg-gradient-cyber transform-3d"
        />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut",
            delay: 0.2
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 text-sm"
        >
          <Sparkles className="h-4 w-4 text-primary animate-glow-pulse" />
          <span className="text-muted-foreground">The heart of our infrastructure</span>
        </motion.div>

        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut",
            delay: 0.4
          }}
          className="text-6xl md:text-8xl font-bold mb-6 gradient-text"
        >
          {t('heroTitle')}
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.6,
            ease: "easeOut",
            delay: 0.6
          }}
          className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto leading-relaxed"
        >
          {t('heroSubtitle')}
        </motion.p>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.6,
            ease: "easeOut",
            delay: 0.8
          }}
          className="text-lg text-muted-foreground/80 mb-12 max-w-2xl mx-auto"
        >
          {t('heroDescription')}
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.6,
            ease: "easeOut",
            delay: 1
          }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <CyberButton
            size="lg"
            onClick={scrollToEcosystem}
            variant="primary"
            className="gap-2 text-lg whitespace-nowrap min-w-[300px]"
          >
            {t('exploreCta')}
            <ArrowRight className="h-5 w-5" />
          </CyberButton>

          <CyberButton
            variant="ghost"
            size="lg"
            href={LINKS.admin.dashboard}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg"
          >
            {t('adminCta')}
          </CyberButton>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center"
        >
          <div className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2" />
        </motion.div>
      </motion.div>
    </section>
  );
};
