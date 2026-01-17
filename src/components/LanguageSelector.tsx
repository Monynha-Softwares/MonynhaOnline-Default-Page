import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { languageLabels } from "@/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { Globe } from "lucide-react";
import { motion } from "framer-motion";

export const LanguageSelector = () => {
  const { currentLanguage, changeLanguage, languages, isLoading } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
          aria-label="Select language"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{languageLabels[currentLanguage]}</span>
          <span className="sm:hidden">{currentLanguage.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-card border-border/50">
        {languages.map((lang, index) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => changeLanguage(lang)}
            disabled={isLoading}
            className={`cursor-pointer transition-colors ${
              currentLanguage === lang ? "bg-primary/20 text-primary" : "hover:bg-muted"
            }`}
          >
            <motion.span
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {languageLabels[lang]}
            </motion.span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
