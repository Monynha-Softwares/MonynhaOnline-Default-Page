import { lazy, Suspense, useEffect, useMemo, useState } from "react";

import { LIQUID_ETHER_DEFAULT_COLORS, getLiquidEtherDefaultPalette } from "@/lib/liquid-ether-defaults";
import type { LiquidEtherProps } from "./liquid-ether";

const LiquidEtherCanvas = lazy(() => import("./liquid-ether"));

const STATIC_LAYER_OPACITY = 0.85;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getEnvValue = (keys: string[]) => {
  const env = import.meta.env as Record<string, string | undefined>;
  for (const key of keys) {
    const value = env[key];
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }
  return undefined;
};

const parseBoolean = (value: string | undefined, fallback: boolean) => {
  if (typeof value !== "string") {
    return fallback;
  }
  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes", "y"].includes(normalized)) {
    return true;
  }
  if (["false", "0", "no", "n"].includes(normalized)) {
    return false;
  }
  return fallback;
};

const parseNumber = (value: string | undefined, fallback: number, min?: number, max?: number) => {
  if (typeof value !== "string") {
    return fallback;
  }
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  if (typeof min === "number" && parsed < min) {
    return min;
  }
  if (typeof max === "number" && parsed > max) {
    return max;
  }
  return parsed;
};

const hexToRgba = (hex: string, alpha: number) => {
  const sanitized = hex.replace("#", "");
  const normalized =
    sanitized.length === 3
      ? sanitized
          .split("")
          .map((value) => value + value)
          .join("")
      : sanitized.padEnd(6, "0");
  const intValue = Number.parseInt(normalized.slice(0, 6), 16);
  const r = (intValue >> 16) & 255;
  const g = (intValue >> 8) & 255;
  const b = intValue & 255;
  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
};

const parseColors = (value?: string) => {
  if (!value) {
    return getLiquidEtherDefaultPalette();
  }
  const palette = value
    .split(",")
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
  if (palette.length === 0) {
    return getLiquidEtherDefaultPalette();
  }
  return palette;
};

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    setPrefersReducedMotion(query.matches);
    query.addEventListener("change", handleChange);

    return () => {
      query.removeEventListener("change", handleChange);
    };
  }, []);

  return prefersReducedMotion;
};

const useIsMounted = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
};

const useWebglSupport = (shouldCheck: boolean) => {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (!shouldCheck) {
      setIsSupported(false);
      return;
    }

    let supported = false;
    try {
      const canvas = document.createElement("canvas");
      supported = Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    } catch (error) {
      supported = false;
    }

    setIsSupported(supported);
  }, [shouldCheck]);

  return isSupported;
};

const createStaticGradient = (colors: string[]) => {
  const layers = [
    `radial-gradient(circle at 20% 20%, ${hexToRgba(colors[0] ?? LIQUID_ETHER_DEFAULT_COLORS[0], STATIC_LAYER_OPACITY)}, transparent 65%)`,
    `radial-gradient(circle at 80% 25%, ${hexToRgba(colors[1] ?? LIQUID_ETHER_DEFAULT_COLORS[1], STATIC_LAYER_OPACITY)}, transparent 60%)`,
    `radial-gradient(circle at 50% 80%, ${hexToRgba(colors[2] ?? LIQUID_ETHER_DEFAULT_COLORS[2], STATIC_LAYER_OPACITY)}, transparent 70%)`,
    `linear-gradient(135deg, ${hexToRgba(colors[0] ?? LIQUID_ETHER_DEFAULT_COLORS[0], 0.55)}, ${hexToRgba(colors[1] ?? LIQUID_ETHER_DEFAULT_COLORS[1], 0.35)}, ${hexToRgba(colors[2] ?? LIQUID_ETHER_DEFAULT_COLORS[2], 0.45)})`,
  ];
  return layers.join(", ");
};

const LiquidEtherStatic = ({ colors }: { colors: string[] }) => (
  <div
    aria-hidden
    className="h-full w-full"
    style={{
      background: createStaticGradient(colors),
      filter: "blur(0px)",
      transform: "translateZ(0)",
    }}
  />
);

const LiquidEtherClient = () => {
  const enabled = parseBoolean(
    getEnvValue(["NEXT_PUBLIC_LIQUIDETHER_ENABLED", "VITE_LIQUIDETHER_ENABLED"]),
    true
  );
  const colors = useMemo(() => {
    return parseColors(getEnvValue(["NEXT_PUBLIC_LIQUIDETHER_COLORS", "VITE_LIQUIDETHER_COLORS"]));
  }, []);
  const resolution = parseNumber(
    getEnvValue(["NEXT_PUBLIC_LIQUIDETHER_RESOLUTION", "VITE_LIQUIDETHER_RESOLUTION"]),
    0.5,
    0.3,
    0.6
  );
  const intensity = parseNumber(
    getEnvValue(["NEXT_PUBLIC_LIQUIDETHER_INTENSITY", "VITE_LIQUIDETHER_INTENSITY"]),
    2.2
  );

  const isMounted = useIsMounted();
  const prefersReducedMotion = usePrefersReducedMotion();
  const canUseFluid = useWebglSupport(enabled && isMounted && !prefersReducedMotion);

  if (!enabled) {
    return null;
  }

  const fallback = <LiquidEtherStatic colors={colors} />;
  const baseProps: LiquidEtherProps = {
    colors,
    resolution,
    autoIntensity: intensity,
    mouseForce: 20,
    cursorSize: 100,
    iterationsViscous: 32,
    iterationsPoisson: 32,
    isViscous: false,
    autoDemo: true,
    autoSpeed: 0.5,
    takeoverDuration: 0.25,
    autoResumeDelay: 3000,
    autoRampDuration: 0.6,
    isBounce: false,
  };

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden>
      {!isMounted || prefersReducedMotion || !canUseFluid ? (
        fallback
      ) : (
        <Suspense fallback={fallback}>
          <LiquidEtherCanvas {...baseProps} />
        </Suspense>
      )}
    </div>
  );
};

export default LiquidEtherClient;
