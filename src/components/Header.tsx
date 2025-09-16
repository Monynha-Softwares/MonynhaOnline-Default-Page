import { motion } from "framer-motion";
import { LanguageSelector } from "./LanguageSelector";
import { AdminLogin } from "./AdminLogin";

export const Header = () => {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 p-4"
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center rounded-2xl bg-background/70 backdrop-blur-md border border-border/40 px-4 py-3 shadow-[0_0_30px_rgba(124,58,237,0.15)]">
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">M</span>
          </div>
          <span className="font-semibold text-foreground hidden sm:inline">Monynha</span>
        </motion.div>

        <div className="flex items-center gap-3">
          <LanguageSelector />
          <AdminLogin />
        </div>
      </div>
    </motion.header>
  );
};