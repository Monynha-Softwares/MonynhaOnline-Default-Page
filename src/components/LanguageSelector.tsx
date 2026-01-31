import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";
import { getIcon } from "@/flyweights/IconFactory";
import { getLanguage } from "@/flyweights/LanguageFlyweight";
import { getStyle } from "@/flyweights/StyleFlyweight";
import { cn } from "@/lib/utils";

const GlobeIcon = getIcon("Globe");

export const LanguageSelector = () => {
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const currentLanguageFlyweight = getLanguage(currentLanguage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("gap-2", getStyle("mutedForegroundHover").className)}
        >
          <GlobeIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguageFlyweight.nativeLabel}</span>
          <span className="sm:hidden">{currentLanguage.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={getStyle("glassCardSurface").className}
      >
        {languages.map((lang) => {
          const languageFlyweight = getLanguage(lang);
          return (
            <DropdownMenuItem
              key={lang}
              onClick={() => changeLanguage(lang)}
              className={`cursor-pointer transition-colors ${
                currentLanguage === lang
                  ? "bg-primary/20 text-primary"
                  : "hover:bg-muted"
              }`}
            >
              <motion.span
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: languages.indexOf(lang) * 0.1 }}
              >
                {languageFlyweight.nativeLabel}
              </motion.span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
