import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";

export const AdminLogin = () => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
    >
      <Button
        variant="ghost"
        size="sm"
        className="opacity-70 hover:opacity-100 transition-opacity gap-2 text-muted-foreground hover:text-foreground"
        asChild
      >
        <a
          href="https://it.monynha.online"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Admin Login"
        >
          <Lock className="h-4 w-4" />
          <span className="hidden sm:inline">{t('adminLogin')}</span>
        </a>
      </Button>
    </motion.div>
  );
};
