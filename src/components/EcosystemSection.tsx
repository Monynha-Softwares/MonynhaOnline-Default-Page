import { useLanguage } from "@/hooks/useLanguage";
import { LINKS } from "@/config/links";
import { motion } from "framer-motion";
import { ExternalLink, Globe, Code, Users, User } from "lucide-react";
import { HolographicCard } from "./HolographicCard";

const ecosystemSites = [
  {
    ...LINKS.ecosystem.monynhaCom,
    icon: Globe,
    descKey: 'monynhaComDesc' as const,
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    ...LINKS.ecosystem.monynhaTech,
    icon: Code,
    descKey: 'monynahTechDesc' as const,
    color: "text-accent",
    bgColor: "bg-accent/10"
  },
  {
    ...LINKS.ecosystem.monynhaFun,
    icon: Users,
    descKey: 'monynhaFunDesc' as const,
    color: "text-primary-glow",
    bgColor: "bg-primary-glow/10"
  },
  {
    ...LINKS.ecosystem.monynhaMe,
    icon: User,
    descKey: 'monynhaMeDesc' as const,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10"
  }
];

export const EcosystemSection = () => {
  const { t } = useLanguage();

  return (
    <section id="ecosystem" className="py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            {t('ecosystemTitle')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('ecosystemDescription')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {ecosystemSites.map((site, index) => (
            <motion.a
              key={site.domain}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer"
            >
              <HolographicCard delay={index * 0.15} className="text-center h-full">
                <motion.div 
                  className="w-20 h-20 rounded-3xl neon-glow flex items-center justify-center mx-auto mb-6 relative overflow-hidden"
                  style={{
                    background: "var(--gradient-cyber)",
                  }}
                  animate={{
                    rotateY: [0, 360],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.8,
                  }}
                >
                  <site.icon className="h-10 w-10 text-foreground relative z-10" />
                </motion.div>
                
                <h3 className="text-xl font-bold mb-3 hologram">
                  {site.domain}
                </h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {t(site.descKey)}
                </p>
                
                <div className="flex items-center justify-center gap-2 text-sm neon-text">
                  <span>Visitar</span>
                  <ExternalLink className="h-4 w-4" />
                </div>
              </HolographicCard>
            </motion.a>
          ))}
        </div>

        {/* Marquee Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 overflow-hidden"
        >
          <div className="flex animate-marquee whitespace-nowrap gap-8 text-sm text-muted-foreground/50">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-8">
                {ecosystemSites.map((site) => (
                  <span key={`${i}-${site.domain}`} className="inline-block">
                    {site.domain}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};