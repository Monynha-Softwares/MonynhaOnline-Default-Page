import { useMemo } from "react";

export const defaultLiquidEtherColors = [
  "#7C3AED",
  "#0EA5E9",
  "#EC4899",
] as const;

const ENABLE_KEYS = [
  "NEXT_PUBLIC_LIQUIDETHER_ENABLED",
  "VITE_LIQUIDETHER_ENABLED",
] as const;

const COLORS_KEYS = [
  "NEXT_PUBLIC_LIQUIDETHER_COLORS",
  "VITE_LIQUIDETHER_COLORS",
] as const;

const RESOLUTION_KEYS = [
  "NEXT_PUBLIC_LIQUIDETHER_RESOLUTION",
  "VITE_LIQUIDETHER_RESOLUTION",
] as const;

const INTENSITY_KEYS = [
  "NEXT_PUBLIC_LIQUIDETHER_INTENSITY",
  "VITE_LIQUIDETHER_INTENSITY",
] as const;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const parseBoolean = (rawValue: string | boolean | undefined, fallback: boolean) => {
  if (typeof rawValue === "boolean") {
    return rawValue;
  }

  if (typeof rawValue === "string") {
    const normalized = rawValue.trim().toLowerCase();
    if (["1", "true", "on", "yes"].includes(normalized)) {
      return true;
    }
    if (["0", "false", "off", "no"].includes(normalized)) {
      return false;
    }
  }

  return fallback;
};

const parseNumber = (
  rawValue: string | boolean | undefined,
  fallback: number,
  { min, max }: { min?: number; max?: number } = {}
) => {
  if (typeof rawValue === "string" && rawValue.trim() !== "") {
    const parsed = Number(rawValue);
    if (Number.isFinite(parsed)) {
      if (typeof min === "number" && parsed < min) {
        return min;
      }
      if (typeof max === "number" && parsed > max) {
        return max;
      }
      return parsed;
    }
  }

  if (typeof rawValue === "boolean") {
    return rawValue ? 1 : 0;
  }

  return fallback;
};

const parseColors = (rawValue: string | boolean | undefined) => {
  if (typeof rawValue === "string") {
    const values = rawValue
      .split(",")
      .map((value) => value.trim())
      .filter((value) => value.length > 0);

    if (values.length > 0) {
      return values;
    }
  }

  return [...defaultLiquidEtherColors];
};

const pickEnvValue = (keys: readonly string[]) => {
  const env = import.meta.env as Record<string, string | boolean | undefined>;
  for (const key of keys) {
    const value = env?.[key];
    if (value !== undefined && value !== "") {
      return value;
    }
  }
  return undefined;
};

export interface LiquidEtherProps {
  colors: string[];
  resolution: number;
  mouseForce: number;
  cursorSize: number;
  isViscous: boolean;
  viscous: number;
  iterationsViscous: number;
  iterationsPoisson: number;
  isBounce: boolean;
  autoDemo: boolean;
  autoSpeed: number;
  autoIntensity: number;
  takeoverDuration: number;
  autoResumeDelay: number;
  autoRampDuration: number;
}

export interface LiquidEtherSettings extends LiquidEtherProps {
  enabled: boolean;
}

export const getLiquidEtherSettings = (): LiquidEtherSettings => {
  const enabled = parseBoolean(pickEnvValue(ENABLE_KEYS), true);
  const colors = parseColors(pickEnvValue(COLORS_KEYS));
  const resolution = clamp(
    parseNumber(pickEnvValue(RESOLUTION_KEYS), 0.5, { min: 0.1, max: 1 }),
    0.3,
    0.6
  );
  const autoIntensity = parseNumber(pickEnvValue(INTENSITY_KEYS), 1.4, {
    min: 0.5,
    max: 6,
  });

  return {
    enabled,
    colors,
    resolution,
    autoIntensity,
    mouseForce: 20,
    cursorSize: 80,
    isViscous: false,
    viscous: 30,
    iterationsViscous: 32,
    iterationsPoisson: 32,
    isBounce: false,
    autoDemo: true,
    autoSpeed: 0.5,
    takeoverDuration: 0.25,
    autoResumeDelay: 3000,
    autoRampDuration: 0.6,
  };
};

export const useLiquidEtherSettings = () =>
  useMemo(() => getLiquidEtherSettings(), []);
