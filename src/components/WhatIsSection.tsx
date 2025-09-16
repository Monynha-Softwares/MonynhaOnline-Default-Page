import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";
import { CheckCircle, Zap, Shield, BarChart3, GitBranch } from "lucide-react";
import { HolographicCard } from "./HolographicCard";

const features = [
  { icon: GitBranch, key: 'feature1' as const },
  { icon: Zap, key: 'feature2' as const },
  { icon: BarChart3, key: 'feature3' as const },
  { icon: Shield, key: 'feature4' as const },
];

export const WhatIsSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 relative">
        {/* Decorative Elements */}
        <div className="pointer-events-none absolute top-1/2 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/4 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />

        <div className="relative z-10 rounded-3xl border border-white/10 bg-background/70 backdrop-blur-sm px-8 py-12 shadow-[0_30px_80px_rgba(124,58,237,0.15)]">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              {t('whatIsTitle')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('whatIsDescription')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <HolographicCard key={feature.key} delay={index * 0.2}>
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <motion.div
                      className="w-16 h-16 rounded-2xl neon-glow flex items-center justify-center relative overflow-hidden"
                      style={{
                        background: "var(--gradient-cyber)",
                      }}
                      animate={{
                        rotateY: [0, 360],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                        delay: index * 0.5,
                      }}
                    >
                      <feature.icon className="h-8 w-8 text-foreground relative z-10" />

                      {/* Holographic shimmer */}
                      <motion.div
                        className="absolute inset-0"
                        style={{
                          background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)",
                        }}
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                          delay: index * 0.3,
                        }}
                      />
                    </motion.div>
                  </div>
                  <div className="flex-1">
                    <motion.p
                      className="text-foreground leading-relaxed text-lg"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      {t(feature.key)}
                    </motion.p>
                  </div>
                </div>
              </HolographicCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};