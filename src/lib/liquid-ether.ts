const BRAND_COLORS = ["#7C3AED", "#0EA5E9", "#EC4899"] as const;

export type LiquidEtherEnvConfig = {
  enabled: boolean;
  colors: string[];
  resolution: number;
  intensity: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function normalizeHexColor(color: string) {
  const trimmed = color.trim();
  if (!trimmed) {
    return null;
  }

  const prefixed = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  const hexMatch = prefixed.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);

  if (!hexMatch) {
    return null;
  }

  if (prefixed.length === 4) {
    const r = prefixed[1];
    const g = prefixed[2];
    const b = prefixed[3];
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }

  return prefixed.toUpperCase();
}

function parseBoolean(value: string | undefined, fallback: boolean) {
  if (typeof value === "undefined") {
    return fallback;
  }

  const normalized = value.toLowerCase().trim();

  if (["1", "true", "yes", "on"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(normalized)) {
    return false;
  }

  return fallback;
}

function parseNumber(value: string | undefined, fallback: number) {
  if (typeof value === "undefined") {
    return fallback;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseColorList(value: string | undefined) {
  if (typeof value === "undefined") {
    return [] as string[];
  }

  return value
    .split(",")
    .map((entry) => normalizeHexColor(entry))
    .filter((entry): entry is string => Boolean(entry));
}

export function getLiquidEtherEnvConfig(): LiquidEtherEnvConfig {
  const env = import.meta.env;

  const enabled = parseBoolean(env.NEXT_PUBLIC_LIQUIDETHER_ENABLED, true);
  const envColors = parseColorList(env.NEXT_PUBLIC_LIQUIDETHER_COLORS);
  const resolutionRaw = parseNumber(env.NEXT_PUBLIC_LIQUIDETHER_RESOLUTION, 0.5);
  const intensityRaw = parseNumber(env.NEXT_PUBLIC_LIQUIDETHER_INTENSITY, 2.2);

  const resolution = clamp(resolutionRaw, 0.3, 0.6);
  const intensity = clamp(intensityRaw, 0.1, 6);

  const colorsSource = envColors.length > 0 ? envColors : Array.from(BRAND_COLORS);
  const colors = colorsSource.slice(0, 3);

  while (colors.length < 3) {
    colors.push(BRAND_COLORS[colors.length % BRAND_COLORS.length]);
  }

  return {
    enabled,
    colors,
    resolution,
    intensity,
  };
}

export const LIQUID_ETHER_BRAND_COLORS = Array.from(BRAND_COLORS);
