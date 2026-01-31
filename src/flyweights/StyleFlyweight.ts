export type StyleKey =
  | "glassCard"
  | "glassCardSurface"
  | "mutedForeground"
  | "mutedForegroundSm"
  | "mutedForegroundLg"
  | "mutedForegroundXl"
  | "mutedForegroundSoft"
  | "mutedForegroundHover"
  | "mutedLink"
  | "mutedLinkBlock"
  | "iconButtonMuted";

export type StyleFlyweight = Readonly<{
  key: StyleKey;
  className: string;
}>;

const styleDefinitions: Record<StyleKey, string> = Object.freeze({
  glassCard: "glass-card",
  glassCardSurface: "glass-card border-border/50",
  mutedForeground: "text-muted-foreground",
  mutedForegroundSm: "text-sm text-muted-foreground",
  mutedForegroundLg: "text-lg text-muted-foreground",
  mutedForegroundXl: "text-xl text-muted-foreground",
  mutedForegroundSoft: "text-muted-foreground/80",
  mutedForegroundHover: "text-muted-foreground hover:text-foreground",
  mutedLink: "text-muted-foreground hover:text-primary transition-colors",
  mutedLinkBlock: "block text-muted-foreground hover:text-primary transition-colors",
  iconButtonMuted:
    "w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-primary/20 transition-colors",
});

const styleCache = new Map<StyleKey, StyleFlyweight>();
const styleKeys = Object.freeze(Object.keys(styleDefinitions) as StyleKey[]);

export const getStyle = (key: StyleKey): StyleFlyweight => {
  const cached = styleCache.get(key);
  if (cached) return cached;
  const style = Object.freeze({ key, className: styleDefinitions[key] });
  styleCache.set(key, style);
  return style;
};

export const getStyleKeys = () => styleKeys;
