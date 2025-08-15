import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";
import { Heart, Github, Twitter, Globe, ArrowUp, Zap } from "lucide-react";
import { HolographicCard } from "./HolographicCard";
import { CyberButton } from "./CyberButton";

export const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const scrollToEcosystem = () => {
    document.getElementById('ecosystem')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.footer
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="py-16 border-t border-border/50 relative overflow-hidden cyber-bg particles"
    >
      {/* 3D Background Elements */}
      <div className="absolute inset-0 transform-3d">
        <motion.div
          animate={{
            rotateX: [0, 360],
            rotateY: [0, -360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full transform-3d"
          style={{
            background: "var(--gradient-cyber)",
            filter: "blur(3px)",
            opacity: 0.3,
          }}
        />
        <motion.div
          animate={{
            y: [0, -50, 0],
            rotateZ: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/3 right-1/4 w-6 h-6 neon-text transform-3d"
        >
          <Zap className="w-full h-full" />
        </motion.div>
        <div className="absolute bottom-0 right-1/3 w-48 h-48 bg-accent/5 rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Manifesto */}
          <HolographicCard className="md:col-span-2" delay={0.1}>
            <div className="flex items-center gap-3 mb-4">
              <motion.div 
                whileHover={{ rotateY: 180 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center transform-3d"
              >
                <span className="text-primary-foreground font-bold">M</span>
              </motion.div>
              <span className="text-2xl font-bold gradient-text">Monynha</span>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('footerManifesto')}
            </p>
            <div className="flex items-center gap-4">
              <motion.a
                href="https://github.com/monynha"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ 
                  scale: 1.2,
                  rotateZ: 15,
                }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:neon-glow transition-all duration-300"
              >
                <Github className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="https://twitter.com/monynha"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ 
                  scale: 1.2,
                  rotateZ: -15,
                }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:neon-glow transition-all duration-300"
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="https://monynha.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ 
                  scale: 1.2,
                  rotateZ: 15,
                }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:neon-glow transition-all duration-300"
              >
                <Globe className="h-5 w-5" />
              </motion.a>
            </div>
          </HolographicCard>

          {/* Quick Links */}
          <HolographicCard delay={0.2}>
            <h4 className="font-semibold mb-4 text-foreground neon-text">Links</h4>
            <div className="space-y-3">
              <motion.button
                onClick={scrollToEcosystem}
                whileHover={{ x: 10 }}
                className="block text-muted-foreground hover:text-primary transition-all duration-300 hover:neon-text"
              >
                {t('ecosystem')}
              </motion.button>
              <motion.a
                href="https://monynha.com/about"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 10 }}
                className="block text-muted-foreground hover:text-primary transition-all duration-300 hover:neon-text"
              >
                {t('about')}
              </motion.a>
              <motion.a
                href="https://monynha.com/contact"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 10 }}
                className="block text-muted-foreground hover:text-primary transition-all duration-300 hover:neon-text"
              >
                {t('contact')}
              </motion.a>
            </div>
          </HolographicCard>

          {/* Admin Link */}
          <HolographicCard delay={0.3}>
            <h4 className="font-semibold mb-4 text-foreground neon-text">Admin</h4>
            <CyberButton
              variant="ghost"
              href="https://admin.monynha.online"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm"
            >
              🔐 Área Admin
            </CyberButton>
          </HolographicCard>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-border/30 text-center relative"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {t('copyright').replace('2024', currentYear.toString())}
            </p>
            
            <CyberButton
              variant="ghost"
              size="sm"
              onClick={scrollToTop}
              className="gap-2"
            >
              <ArrowUp className="h-4 w-4" />
              <span>Voltar ao topo</span>
            </CyberButton>
          </div>

          {/* Holographic Line */}
          <motion.div
            animate={{
              scaleX: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 w-32 bg-gradient-cyber"
          />
        </motion.div>
      </div>
    </motion.footer>
  );
};