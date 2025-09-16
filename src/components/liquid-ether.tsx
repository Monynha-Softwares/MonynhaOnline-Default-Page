import { memo, useEffect, useRef } from "react";

import { getLiquidEtherDefaultPalette } from "@/lib/liquid-ether-defaults";
import { cn } from "@/lib/utils";

export interface LiquidEtherProps {
  colors?: string[];
  mouseForce?: number;
  cursorSize?: number;
  isViscous?: boolean;
  viscous?: number;
  iterationsViscous?: number;
  iterationsPoisson?: number;
  resolution?: number;
  isBounce?: boolean;
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  takeoverDuration?: number;
  autoResumeDelay?: number;
  autoRampDuration?: number;
  className?: string;
}

interface PointerState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  lastInputTime: number;
  autoActive: boolean;
  autoStartTime: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const hexToRgba = (hex: string, alpha: number) => {
  const sanitized = hex.replace("#", "");
  const normalized =
    sanitized.length === 3
      ? sanitized
          .split("")
          .map((value) => value + value)
          .join("")
      : sanitized.padEnd(6, "0");
  const intValue = parseInt(normalized.slice(0, 6), 16);
  const r = (intValue >> 16) & 255;
  const g = (intValue >> 8) & 255;
  const b = intValue & 255;
  const clampedAlpha = clamp(alpha, 0, 1);

  return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
};

const DEFAULT_COLORS = getLiquidEtherDefaultPalette();

const getGradientStops = (colors: string[]) => {
  const slices = colors.length;
  return colors.map((color, index) => ({
    angle: (index / Math.max(1, slices)) * Math.PI * 2,
    color,
  }));
};

const LiquidEther = memo(
  ({
    colors = DEFAULT_COLORS,
    mouseForce = 20,
    cursorSize = 100,
    isViscous = false,
    viscous = 30,
    iterationsViscous = 32,
    iterationsPoisson = 32,
    resolution = 0.5,
    isBounce = false,
    autoDemo = true,
    autoSpeed = 0.5,
    autoIntensity = 2.2,
    takeoverDuration = 0.25,
    autoResumeDelay = 3000,
    autoRampDuration = 0.6,
    className,
  }: LiquidEtherProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationRef = useRef<number>();
    const pointerRef = useRef<PointerState>({
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      lastInputTime: 0,
      autoActive: autoDemo,
      autoStartTime: performance.now(),
    });
    const sizeRef = useRef({ width: 0, height: 0 });

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) {
        return;
      }

      const dpr = window.devicePixelRatio || 1;
      const normalizedResolution = clamp(resolution, 0.3, 0.6);
      const smoothingStrength = clamp(mouseForce / 120, 0.04, 0.25);
      const viscosityFactor = isViscous ? clamp(viscous / 50, 0.2, 1.5) : clamp(iterationsViscous / 48, 0.4, 1.2);
      const poissonFactor = clamp(iterationsPoisson / 48, 0.2, 1.4);

      const pointer = pointerRef.current;
      const gradients = getGradientStops(colors.length ? colors : DEFAULT_COLORS);

      const updateSize = () => {
        const { clientWidth, clientHeight } = canvas;
        const width = Math.max(1, clientWidth);
        const height = Math.max(1, clientHeight);
        sizeRef.current = { width, height };
        const scaledWidth = Math.floor(width * normalizedResolution * dpr);
        const scaledHeight = Math.floor(height * normalizedResolution * dpr);
        if (pointer.x === 0 && pointer.y === 0) {
          pointer.x = width / 2;
          pointer.y = height / 2;
          pointer.targetX = width / 2;
          pointer.targetY = height / 2;
        }

        if (canvas.width !== scaledWidth || canvas.height !== scaledHeight) {
          canvas.width = scaledWidth;
          canvas.height = scaledHeight;
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.scale((scaledWidth / width) * poissonFactor, (scaledHeight / height) * poissonFactor);
        }
      };

      updateSize();

      let resizeObserver: ResizeObserver | null = null;
      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(updateSize);
        resizeObserver.observe(canvas);
      }

      const handlePointerMove = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        pointer.targetX = event.clientX - rect.left;
        pointer.targetY = event.clientY - rect.top;
        pointer.lastInputTime = performance.now();
        pointer.autoActive = false;
      };

      const handlePointerLeave = () => {
        pointer.lastInputTime = performance.now();
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerleave", handlePointerLeave);

      let lastTimestamp = performance.now();
      const rampDurationMs = autoRampDuration * 1000;
      const takeoverDurationMs = takeoverDuration * 1000;

      const render = (timestamp: number) => {
        const { width, height } = sizeRef.current;
        if (width === 0 || height === 0) {
          animationRef.current = requestAnimationFrame(render);
          return;
        }

        const delta = timestamp - lastTimestamp;
        lastTimestamp = timestamp;

        const timeSinceInput = timestamp - pointer.lastInputTime;
        if (autoDemo && timeSinceInput > autoResumeDelay) {
          if (!pointer.autoActive) {
            pointer.autoActive = true;
            pointer.autoStartTime = timestamp;
          }
        }

        if (pointer.autoActive && autoDemo) {
          const elapsed = timestamp - pointer.autoStartTime;
          const ramp = clamp(elapsed / Math.max(1, rampDurationMs), 0, 1);
          const autoTime = timestamp * autoSpeed * 0.001;
          const amplitude = Math.min(width, height) * 0.25 * autoIntensity * ramp;
          pointer.targetX = width / 2 + Math.cos(autoTime * 0.9) * amplitude;
          pointer.targetY = height / 2 + Math.sin(autoTime * 1.1) * amplitude;
        }

        const easingFactor = smoothingStrength * clamp(delta / 16.67, 0.5, 1.5);
        pointer.x += (pointer.targetX - pointer.x) * easingFactor * viscosityFactor;
        pointer.y += (pointer.targetY - pointer.y) * easingFactor * viscosityFactor;

        if (!pointer.autoActive && timeSinceInput < takeoverDurationMs) {
          const takeoverT = clamp(timeSinceInput / Math.max(1, takeoverDurationMs), 0, 1);
          pointer.x = pointer.x + (pointer.targetX - pointer.x) * takeoverT;
          pointer.y = pointer.y + (pointer.targetY - pointer.y) * takeoverT;
        }

        if (isBounce) {
          pointer.x = clamp(pointer.x, cursorSize * 0.5, width - cursorSize * 0.5);
          pointer.y = clamp(pointer.y, cursorSize * 0.5, height - cursorSize * 0.5);
        }

        ctx.globalCompositeOperation = "source-over";
        ctx.clearRect(0, 0, width, height);
        const radius = Math.max(width, height) * 0.65 + cursorSize;
        const tailAlpha = clamp(0.08 * viscosityFactor, 0.04, 0.18);
        ctx.fillStyle = hexToRgba("#050017", tailAlpha);
        ctx.fillRect(0, 0, width, height);

        gradients.forEach(({ angle, color }, index) => {
          const wobble = timestamp * 0.0003 * (index + 1);
          const offsetRadius = cursorSize * (1 + Math.sin(wobble) * 0.4);
          const offsetX = Math.cos(angle + wobble) * offsetRadius;
          const offsetY = Math.sin(angle - wobble) * offsetRadius;
          const gradient = ctx.createRadialGradient(
            pointer.x + offsetX,
            pointer.y + offsetY,
            cursorSize * 0.15,
            pointer.x + offsetX,
            pointer.y + offsetY,
            radius
          );
          gradient.addColorStop(0, hexToRgba(color, 0.9));
          gradient.addColorStop(0.25, hexToRgba(color, 0.45));
          gradient.addColorStop(1, hexToRgba(color, 0));
          ctx.globalAlpha = clamp(0.9 / gradients.length, 0.18, 0.6);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, width, height);
        });

        ctx.globalAlpha = 1;

        animationRef.current = requestAnimationFrame(render);
      };

      animationRef.current = requestAnimationFrame(render);

      return () => {
        resizeObserver?.disconnect();
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerleave", handlePointerLeave);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [
      autoDemo,
      autoIntensity,
      autoRampDuration,
      autoResumeDelay,
      autoSpeed,
      colors,
      cursorSize,
      isBounce,
      isViscous,
      iterationsPoisson,
      iterationsViscous,
      mouseForce,
      resolution,
      takeoverDuration,
      viscous,
    ]);

    return <canvas ref={canvasRef} className={cn("h-full w-full", className)} aria-hidden />;
  }
);

LiquidEther.displayName = "LiquidEther";

export default LiquidEther;
