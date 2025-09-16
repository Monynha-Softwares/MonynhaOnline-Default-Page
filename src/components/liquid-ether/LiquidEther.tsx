import { useEffect, useRef } from "react";
import type { LiquidEtherProps } from "@/lib/liquid-ether";
import { defaultLiquidEtherColors } from "@/lib/liquid-ether";

interface BlobState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  color: string;
  offset: number;
  noise: number;
}

interface PointerState {
  x: number;
  y: number;
  strength: number;
  targetStrength: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const createColorParser = () => {
  const fallback: [number, number, number] = [124, 58, 237];
  const rgbCache = new Map<string, [number, number, number]>();
  const rgbaCache = new Map<string, string>();

  const parse = (color: string): [number, number, number] => {
    const key = color.trim();
    const cached = rgbCache.get(key);
    if (cached) {
      return cached;
    }

    let rgb = fallback;
    const hexMatch = key.match(/^#([0-9a-f]{3,8})$/i);
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
      const r = parseInt(normalized.slice(0, 2), 16);
      const g = parseInt(normalized.slice(2, 4), 16);
      const b = parseInt(normalized.slice(4, 6), 16);
      rgb = [r, g, b];
    } else {
      const rgbMatch = key.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
      if (rgbMatch) {
        rgb = [
          Number.parseInt(rgbMatch[1], 10),
          Number.parseInt(rgbMatch[2], 10),
          Number.parseInt(rgbMatch[3], 10),
        ];
      }
    }

    rgbCache.set(key, rgb);
    return rgb;
  };

  return (color: string, alpha: number) => {
    const cacheKey = `${color}|${alpha}`;
    const cached = rgbaCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const [r, g, b] = parse(color);
    const rgba = `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
    rgbaCache.set(cacheKey, rgba);
    return rgba;
  };
};

const createBlobs = (
  width: number,
  height: number,
  colors: string[],
  autoIntensity: number
) => {
  const maxDimension = Math.max(width, height);
  const count = Math.max(8, colors.length * 4);

  return Array.from({ length: count }, (_, index): BlobState => {
    const color = colors[index % colors.length];
    const baseRadius =
      maxDimension * (0.24 + (index % colors.length) * 0.015 + Math.random() * 0.08);

    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
      baseRadius,
      radius: baseRadius,
      color,
      offset: Math.random() * Math.PI * 2,
      noise: 0.5 + Math.random() * 0.6 * autoIntensity,
    };
  });
};

const LiquidEther = ({
  colors,
  resolution,
  mouseForce,
  cursorSize,
  isViscous,
  viscous,
  iterationsViscous,
  iterationsPoisson,
  isBounce,
  autoDemo,
  autoSpeed,
  autoIntensity,
  takeoverDuration,
  autoResumeDelay,
  autoRampDuration,
}: LiquidEtherProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const palette = colors.length > 0 ? colors : [...defaultLiquidEtherColors];
    const pointer: PointerState = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      strength: 0,
      targetStrength: 0,
    };

    let width = window.innerWidth;
    let height = window.innerHeight;
    let scale = 1;
    let frame = 0;
    let blobs = createBlobs(width, height, palette, autoIntensity);
    let lastInteraction = performance.now();
    let lastTime = performance.now();
    const autoDelayMs = Math.max(0, autoResumeDelay);
    const takeoverSeconds = Math.max(takeoverDuration, 0.05);
    const fadeSeconds = Math.max(autoRampDuration, 0.1);
    const swirlFactor = Math.max(1, iterationsPoisson) / 28;
    const smoothingFactor = Math.max(1, iterationsViscous) / 64;
    const colorToRgba = createColorParser();

    const updateCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      pointer.x = clamp(pointer.x, 0, width);
      pointer.y = clamp(pointer.y, 0, height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      scale = dpr * clamp(resolution, 0.3, 0.6);
      canvas.width = Math.max(1, Math.floor(width * scale));
      canvas.height = Math.max(1, Math.floor(height * scale));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(scale, 0, 0, scale, 0, 0);
    };

    updateCanvasSize();

    const handleResize = () => {
      updateCanvasSize();
      blobs = createBlobs(width, height, palette, autoIntensity);
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = clamp(event.clientX, 0, width);
      pointer.y = clamp(event.clientY, 0, height);
      pointer.targetStrength = 1;
      lastInteraction = performance.now();
    };

    const handlePointerUp = () => {
      pointer.targetStrength = 0;
      lastInteraction = performance.now();
    };

    const handleBlur = () => {
      pointer.targetStrength = 0;
      pointer.strength = 0;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointercancel", handlePointerUp, { passive: true });
    window.addEventListener("blur", handleBlur);

    const autoState = {
      angle: Math.random() * Math.PI * 2,
    };

    const renderFrame = (time: number) => {
      frame = window.requestAnimationFrame(renderFrame);

      const delta = clamp((time - lastTime) / 1000, 0, 0.08);
      const timeSeconds = time / 1000;
      lastTime = time;

      const timeSinceInteraction = time - lastInteraction;
      if (autoDemo && timeSinceInteraction > autoDelayMs) {
        autoState.angle += delta * autoSpeed * Math.PI * 2;
        const radius = Math.min(width, height) * 0.25 * autoIntensity;
        const targetX = width / 2 + Math.cos(autoState.angle) * radius;
        const targetY = height / 2 + Math.sin(autoState.angle) * radius;
        const lerp = 1 - Math.exp(-delta / takeoverSeconds);
        pointer.x += (targetX - pointer.x) * lerp;
        pointer.y += (targetY - pointer.y) * lerp;
        const rampProgress = clamp(
          (timeSinceInteraction - autoDelayMs) / (autoRampDuration * 1000),
          0,
          1
        );
        pointer.targetStrength = Math.max(pointer.targetStrength, rampProgress);
      }

      const fadeRate = pointer.targetStrength > pointer.strength ? takeoverSeconds : fadeSeconds;
      const strengthStep = delta / fadeRate;
      if (pointer.targetStrength > pointer.strength) {
        pointer.strength = clamp(pointer.strength + strengthStep, 0, 1);
      } else {
        pointer.strength = clamp(pointer.strength - strengthStep, 0, 1);
      }

      pointer.x = clamp(pointer.x, 0, width);
      pointer.y = clamp(pointer.y, 0, height);

      const damping = Math.exp(-delta * (isViscous ? viscous / 8 : 3.4));
      const pointerRadius = Math.max(cursorSize, 40);
      const pointerForce = mouseForce;

      blobs.forEach((blob, index) => {
        const dx = pointer.x - blob.x;
        const dy = pointer.y - blob.y;
        const distSq = dx * dx + dy * dy + 1e-6;
        const dist = Math.sqrt(distSq);
        const normalizedX = dx / dist;
        const normalizedY = dy / dist;
        const gaussian = Math.exp(-(distSq) / (2 * pointerRadius * pointerRadius));
        const attraction = pointer.strength * pointerForce * gaussian;

        blob.vx += normalizedX * attraction * delta * 20;
        blob.vy += normalizedY * attraction * delta * 20;

        const swirlAngle = Math.atan2(dy, dx) + Math.PI / 2;
        const swirlStrength = swirlFactor * pointer.strength * gaussian * autoIntensity;
        blob.vx += Math.cos(swirlAngle) * swirlStrength * 18 * delta;
        blob.vy += Math.sin(swirlAngle) * swirlStrength * 18 * delta;

        const noisePhase = timeSeconds * (0.6 + index * 0.03) + blob.offset;
        blob.vx += Math.cos(noisePhase) * blob.noise * autoIntensity * delta * 15;
        blob.vy += Math.sin(noisePhase * 0.8) * blob.noise * autoIntensity * delta * 15;

        blob.vx *= damping;
        blob.vy *= damping;

        blob.x += blob.vx;
        blob.y += blob.vy;

        if (isBounce) {
          if (blob.x < 0) {
            blob.x = 0;
            blob.vx *= -0.6;
          } else if (blob.x > width) {
            blob.x = width;
            blob.vx *= -0.6;
          }
          if (blob.y < 0) {
            blob.y = 0;
            blob.vy *= -0.6;
          } else if (blob.y > height) {
            blob.y = height;
            blob.vy *= -0.6;
          }
        } else {
          const wrapRadius = blob.baseRadius;
          if (blob.x < -wrapRadius) blob.x = width + wrapRadius;
          if (blob.x > width + wrapRadius) blob.x = -wrapRadius;
          if (blob.y < -wrapRadius) blob.y = height + wrapRadius;
          if (blob.y > height + wrapRadius) blob.y = -wrapRadius;
        }

        const breathing = 1 + Math.sin(timeSeconds * 0.7 + blob.offset) * 0.12 * smoothingFactor;
        blob.radius = clamp(
          blob.baseRadius * breathing,
          blob.baseRadius * 0.65,
          blob.baseRadius * 1.35
        );
      });

      context.setTransform(scale, 0, 0, scale, 0, 0);
      context.globalCompositeOperation = "source-over";
      context.fillStyle = "rgba(6, 9, 20, 0.22)";
      context.fillRect(0, 0, width, height);

      context.globalCompositeOperation = "lighter";
      blobs.forEach((blob) => {
        const gradient = context.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          blob.radius
        );
        gradient.addColorStop(0, colorToRgba(blob.color, 0.92));
        gradient.addColorStop(0.45, colorToRgba(blob.color, 0.45));
        gradient.addColorStop(1, colorToRgba(blob.color, 0));
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        context.fill();
      });

      context.globalCompositeOperation = "soft-light";
      context.fillStyle = "rgba(10, 12, 24, 0.18)";
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = "source-over";
    };

    frame = window.requestAnimationFrame(renderFrame);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [
    colors,
    resolution,
    mouseForce,
    cursorSize,
    isViscous,
    viscous,
    iterationsViscous,
    iterationsPoisson,
    isBounce,
    autoDemo,
    autoSpeed,
    autoIntensity,
    takeoverDuration,
    autoResumeDelay,
    autoRampDuration,
  ]);

  return (
    <canvas
      ref={canvasRef}
      role="presentation"
      aria-hidden="true"
      className="h-full w-full"
      style={{ display: "block" }}
    />
  );
};

export default LiquidEther;
