import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { LINKS } from "@/config/links";
import { motion } from "framer-motion";
import { getIcon } from "@/flyweights/IconFactory";
import { getStyle } from "@/flyweights/StyleFlyweight";
import { cn } from "@/lib/utils";

const LockIcon = getIcon("Lock");

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
        className={cn(
          "opacity-70 hover:opacity-100 transition-opacity gap-2",
          getStyle("mutedForegroundHover").className
        )}
        asChild
      >
        <a
          href={LINKS.admin.itPortal}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Admin Login"
        >
          <LockIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{t('adminLogin')}</span>
        </a>
      </Button>
    </motion.div>
  );
};
