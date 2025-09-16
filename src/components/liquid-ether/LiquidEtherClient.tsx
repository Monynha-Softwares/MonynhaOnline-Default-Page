import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import type { LiquidEtherProps, LiquidEtherSettings } from "@/lib/liquid-ether";
import { useLiquidEtherSettings } from "@/lib/liquid-ether";

const LiquidEther = lazy(() => import("./LiquidEther"));

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const colorWithAlpha = (color: string, alpha: number) => {
  const trimmed = color.trim();
  const hexMatch = trimmed.match(/^#([0-9a-f]{3,8})$/i);
  if (hexMatch) {
    const hex = hexMatch[1];
    const normalized =
      hex.length === 3
        ? hex
            .split("")
            .map((value) => value + value)
            .join("")
        : hex.length >= 6
        ? hex.slice(0, 6)
        : hex.padEnd(6, "0");
    const r = Number.parseInt(normalized.slice(0, 2), 16);
    const g = Number.parseInt(normalized.slice(2, 4), 16);
    const b = Number.parseInt(normalized.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
  }

  const rgbMatch = trimmed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (rgbMatch) {
    return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${clamp(alpha, 0, 1)})`;
  }

  return trimmed;
};

const StaticGradient = ({ colors }: { colors: string[] }) => {
  const [primary, secondary, accent] = useMemo(() => {
    const palette = colors.length > 0 ? colors : ["#7C3AED", "#0EA5E9", "#EC4899"];
    return [palette[0], palette[1 % palette.length], palette[2 % palette.length]];
  }, [colors]);

  const background = useMemo(() => {
    const primarySoft = colorWithAlpha(primary, 0.5);
    const secondarySoft = colorWithAlpha(secondary, 0.42);
    const accentSoft = colorWithAlpha(accent, 0.38);
    const primaryGlow = colorWithAlpha(primary, 0.2);
    const secondaryGlow = colorWithAlpha(secondary, 0.18);
    const accentGlow = colorWithAlpha(accent, 0.16);

    return {
      backgroundImage: `radial-gradient(circle at 20% 25%, ${primaryGlow} 0%, transparent 55%),` +
        `radial-gradient(circle at 80% 30%, ${secondaryGlow} 0%, transparent 60%),` +
        `radial-gradient(circle at 50% 85%, ${accentGlow} 0%, transparent 55%),` +
        `linear-gradient(135deg, ${primarySoft} 0%, ${secondarySoft} 45%, ${accentSoft} 100%)`,
    } as const;
  }, [primary, secondary, accent]);

  return <div className="absolute inset-0" style={background} aria-hidden="true" />;
};

const checkWebGLSupport = () => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
};

const AnimatedLiquidEther = ({ enabled: _enabled, ...settings }: LiquidEtherSettings) => (
  <Suspense fallback={<StaticGradient colors={settings.colors} />}>
    <LiquidEther {...(settings as LiquidEtherProps)} />
  </Suspense>
);

export const LiquidEtherClient = () => {
  const settings = useLiquidEtherSettings();
  const [isMounted, setIsMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    setWebglAvailable(checkWebGLSupport());

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    setWebglAvailable(checkWebGLSupport());
  }, [isMounted]);

  const shouldAnimate =
    settings.enabled && isMounted && !prefersReducedMotion && webglAvailable;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {shouldAnimate ? (
        <AnimatedLiquidEther {...settings} />
      ) : settings.enabled ? (
        <StaticGradient colors={settings.colors} />
      ) : (
        <StaticGradient colors={settings.colors} />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(6,8,20,0.55),transparent_60%)]" />
    </div>
  );
};
