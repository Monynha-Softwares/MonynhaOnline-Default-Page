import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";
import { getIcon } from "@/flyweights/IconFactory";
import { getStyle } from "@/flyweights/StyleFlyweight";
import { cn } from "@/lib/utils";

const ServerIcon = getIcon("Server");
const ZapIcon = getIcon("Zap");
const MonitorIcon = getIcon("Monitor");
const ShieldIcon = getIcon("Shield");

const infraFeatures = [
  { icon: ServerIcon, label: "Coolify Platform" },
  { icon: ZapIcon, label: "Static Builds" },
  { icon: MonitorIcon, label: "Next.js Export" },
  { icon: ShieldIcon, label: "Secure Deploy" }
];

export const InfrastructureSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            {t('infraTitle')}
          </h2>
          <p
            className={cn(
              "text-xl max-w-4xl mx-auto leading-relaxed",
              getStyle("mutedForeground").className
            )}
          >
            {t('infraDescription')}
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className={cn(
            "p-8 max-w-4xl mx-auto",
            getStyle("glassCard").className
          )}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {infraFeatures.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.4,
                  delay: 0.1 * index,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-primary/20 flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <span className={getStyle("mutedForegroundSm").className}>
                  {feature.label}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm"
            >
              <div className="w-2 h-2 bg-primary rounded-full animate-glow-pulse" />
              Sistema em produção
            </motion.div>
          </div>
        </motion.div>

        {/* Technical Details Grid */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto"
        >
          <div className="text-center p-6 rounded-xl border border-border/50">
            <h4 className="font-semibold text-primary mb-2">Performance</h4>
            <p className={getStyle("mutedForegroundSm").className}>
              Otimizado para velocidade e disponibilidade máxima
            </p>
          </div>
          <div className="text-center p-6 rounded-xl border border-border/50">
            <h4 className="font-semibold text-accent mb-2">Automação</h4>
            <p className={getStyle("mutedForegroundSm").className}>
              Deploy contínuo com integração Git
            </p>
          </div>
          <div className="text-center p-6 rounded-xl border border-border/50">
            <h4 className="font-semibold text-primary-glow mb-2">Monitoramento</h4>
            <p className={getStyle("mutedForegroundSm").className}>
              Observabilidade completa do ecossistema
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
