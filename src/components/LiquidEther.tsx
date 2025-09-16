import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import {
  getLiquidEtherEnvConfig,
  normalizeHexColor,
} from "@/lib/liquid-ether";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export type LiquidEtherProps = {
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
  style?: CSSProperties;
  enabled?: boolean;
};

const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;

  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  varying vec2 v_uv;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_pointer;
  uniform vec2 u_pointerVelocity;
  uniform float u_pointerForce;
  uniform float u_cursorSize;
  uniform vec3 u_colors[3];
  uniform float u_intensity;
  uniform float u_autoStrength;
  uniform float u_viscosity;
  uniform float u_iterationsViscous;
  uniform float u_iterationsPoisson;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x)
      + (c - a) * u.y * (1.0 - u.x)
      + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p, float iterations) {
    float value = 0.0;
    float amplitude = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    vec2 point = p;

    for (int i = 0; i < 8; i++) {
      if (float(i) >= iterations) {
        break;
      }

      value += amplitude * noise(point);
      point = rot * point * 2.0 + shift;
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec2 resolution = u_resolution;
    float aspect = resolution.x / max(resolution.y, 1.0);

    vec2 centred = (v_uv - 0.5) * vec2(aspect, 1.0);
    float time = u_time * (0.7 + u_intensity * 0.12);

    vec2 pointer = vec2(u_pointer.x, 1.0 - u_pointer.y);
    vec2 pointerVelocity = u_pointerVelocity;

    float baseField = fbm(centred * (1.6 + u_intensity * 0.45) + vec2(time * 0.4), u_iterationsViscous);
    float layerField = fbm(centred.yx * (2.0 + u_viscosity * 0.6) - vec2(time * 0.55, time * 0.35), u_iterationsPoisson);

    float pointerDistance = distance(v_uv, pointer);
    float pointerInfluence = u_pointerForce * exp(-pointerDistance * max(u_cursorSize, 0.2));

    float swirl = pointerVelocity.x * (v_uv.y - pointer.y) - pointerVelocity.y * (v_uv.x - pointer.x);

    float blendWave = smoothstep(0.15, 0.9, baseField + pointerInfluence * 0.35);
    float accentWave = smoothstep(0.1, 0.85, layerField + swirl * 0.45);

    vec3 color = mix(u_colors[0], u_colors[1], blendWave);
    color = mix(color, u_colors[2], accentWave);

    float highlight = pow(max(pointerInfluence, 0.0), 1.4);
    color += highlight * (u_colors[1] * 0.6 + u_colors[2] * 0.4);

    float vignette = smoothstep(1.4, 0.2, length(centred));
    color *= vignette;

    color += u_autoStrength * 0.3 * (u_colors[2] * 0.3 + u_colors[0] * 0.2);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const TRIANGLE_VERTICES = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function triangularWave(value: number) {
  return (2 / Math.PI) * Math.asin(Math.sin(value));
}

function hexToRgbNormalized(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  const r = Number.parseInt(normalized.slice(0, 2), 16) / 255;
  const g = Number.parseInt(normalized.slice(2, 4), 16) / 255;
  const b = Number.parseInt(normalized.slice(4, 6), 16) / 255;
  return [r, g, b];
}

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("Failed to create shader");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (!success) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(info ?? "Failed to compile shader");
  }

  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexSource: string,
  fragmentSource: string,
) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();

  if (!program) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    throw new Error("Failed to create WebGL program");
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (!success) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    throw new Error(info ?? "Failed to link WebGL program");
  }

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  return program;
}

export const LiquidEther = ({
  className,
  style,
  ...props
}: LiquidEtherProps) => {
  const envConfig = useMemo(() => getLiquidEtherEnvConfig(), []);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [hasWebGL, setHasWebGL] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerStateRef = useRef({
    x: 0.5,
    y: 0.5,
    targetX: 0.5,
    targetY: 0.5,
    velocityX: 0,
    velocityY: 0,
  });
  const pointerInputRef = useRef({ x: 0.5, y: 0.5 });
  const autoStateRef = useRef({ strength: 0, targetStrength: 0, time: Math.random() * Math.PI * 2 });
  const autopointRef = useRef({ x: 0.5, y: 0.5 });
  const lastInteractionRef = useRef<number>(typeof performance !== "undefined" ? performance.now() : 0);
  const lastTimeRef = useRef<number>(typeof performance !== "undefined" ? performance.now() : 0);
  const readyRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      const context =
        canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl");
      setHasWebGL(Boolean(context));
    } catch (error) {
      console.warn("LiquidEther: WebGL is not available", error);
      setHasWebGL(false);
    }
  }, []);

  const colors = useMemo(() => {
    const source = props.colors?.length ? props.colors : envConfig.colors;
    const sanitized = source
      .map((color) => (color ? normalizeHexColor(color) : null))
      .filter((color): color is string => Boolean(color));

    const resolved = sanitized.length > 0 ? sanitized : envConfig.colors;
    const cloned = resolved.slice(0, 3);

    while (cloned.length < 3) {
      cloned.push(envConfig.colors[cloned.length % envConfig.colors.length]);
    }

    return cloned.slice(0, 3);
  }, [envConfig.colors, props.colors]);

  const normalizedColors = useMemo(() => colors.map(hexToRgbNormalized), [colors]);
  const colorArray = useMemo(() => new Float32Array(normalizedColors.flat()), [normalizedColors]);

  const fallbackGradient = useMemo(() => {
    const [primary, secondary, accent] = colors;
    return [
      `radial-gradient(circle at 15% 20%, ${hexToRgba(primary, 0.65)} 0%, transparent 55%)`,
      `radial-gradient(circle at 85% 25%, ${hexToRgba(secondary, 0.5)} 0%, transparent 60%)`,
      `radial-gradient(circle at 50% 80%, ${hexToRgba(accent, 0.55)} 0%, transparent 58%)`,
      `linear-gradient(125deg, ${hexToRgba(primary, 0.55)} 0%, ${hexToRgba(secondary, 0.35)} 50%, ${hexToRgba(accent, 0.5)} 100%)`,
    ].join(",");
  }, [colors]);

  const config = useMemo(() => {
    const enabled = (props.enabled ?? envConfig.enabled) && colors.length >= 3;
    const resolution = clamp(props.resolution ?? envConfig.resolution, 0.3, 0.6);
    const baseIntensity = envConfig.intensity;
    const autoIntensity = clamp(props.autoIntensity ?? envConfig.intensity, 0.1, 6);

    return {
      enabled,
      resolution,
      baseIntensity,
      autoDemo: props.autoDemo ?? true,
      autoSpeed: props.autoSpeed ?? 0.5,
      autoIntensity,
      isBounce: props.isBounce ?? false,
      mouseForce: props.mouseForce ?? 20,
      cursorSize: props.cursorSize ?? 100,
      isViscous: props.isViscous ?? false,
      viscous: props.viscous ?? 30,
      iterationsViscous: props.iterationsViscous ?? 32,
      iterationsPoisson: props.iterationsPoisson ?? 32,
      takeoverDuration: props.takeoverDuration ?? 0.25,
      autoResumeDelay: props.autoResumeDelay ?? 3000,
      autoRampDuration: props.autoRampDuration ?? 0.6,
    } as const;
  }, [colors.length, envConfig.enabled, envConfig.intensity, envConfig.resolution, props.autoDemo, props.autoIntensity, props.autoRampDuration, props.autoResumeDelay, props.autoSpeed, props.cursorSize, props.enabled, props.isBounce, props.isViscous, props.iterationsPoisson, props.iterationsViscous, props.mouseForce, props.resolution, props.takeoverDuration, props.viscous]);

  const shouldRenderCanvas = config.enabled && !prefersReducedMotion && hasWebGL;

  useEffect(() => {
    if (!shouldRenderCanvas) {
      setIsReady(false);
    }
  }, [shouldRenderCanvas]);

  useEffect(() => {
    if (!shouldRenderCanvas) {
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    readyRef.current = false;

    const gl =
      (canvas.getContext("webgl", {
        alpha: false,
        antialias: true,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
      }) as WebGLRenderingContext | null) ??
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) {
      setHasWebGL(false);
      return;
    }

    let disposed = false;
    let animationId = 0;

    const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    if (!positionBuffer) {
      gl.deleteProgram(program);
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, TRIANGLE_VERTICES, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      resolution: gl.getUniformLocation(program, "u_resolution"),
      time: gl.getUniformLocation(program, "u_time"),
      pointer: gl.getUniformLocation(program, "u_pointer"),
      pointerVelocity: gl.getUniformLocation(program, "u_pointerVelocity"),
      pointerForce: gl.getUniformLocation(program, "u_pointerForce"),
      cursorSize: gl.getUniformLocation(program, "u_cursorSize"),
      colors: gl.getUniformLocation(program, "u_colors"),
      intensity: gl.getUniformLocation(program, "u_intensity"),
      autoStrength: gl.getUniformLocation(program, "u_autoStrength"),
      viscosity: gl.getUniformLocation(program, "u_viscosity"),
      iterationsViscous: gl.getUniformLocation(program, "u_iterationsViscous"),
      iterationsPoisson: gl.getUniformLocation(program, "u_iterationsPoisson"),
    } as const;

    if (
      !uniforms.resolution ||
      !uniforms.time ||
      !uniforms.pointer ||
      !uniforms.pointerVelocity ||
      !uniforms.pointerForce ||
      !uniforms.cursorSize ||
      !uniforms.intensity ||
      !uniforms.autoStrength ||
      !uniforms.viscosity ||
      !uniforms.iterationsViscous ||
      !uniforms.iterationsPoisson
    ) {
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      return;
    }

    if (uniforms.colors) {
      gl.uniform3fv(uniforms.colors, colorArray);
    }

    const pointerState = pointerStateRef.current;
    pointerState.x = 0.5;
    pointerState.y = 0.5;
    pointerState.targetX = 0.5;
    pointerState.targetY = 0.5;
    pointerState.velocityX = 0;
    pointerState.velocityY = 0;

    pointerInputRef.current = { x: 0.5, y: 0.5 };
    autoStateRef.current = { strength: 0, targetStrength: 0, time: Math.random() * Math.PI * 2 };
    autopointRef.current = { x: 0.5, y: 0.5 };
    lastInteractionRef.current = performance.now();
    lastTimeRef.current = performance.now();

    const resolutionFactor = clamp(config.resolution, 0.3, 0.6);
    const intensityValue = config.baseIntensity;
    const autoIntensityValue = config.autoIntensity;
    const autoSpeedValue = Math.max(config.autoSpeed, 0.05);
    const mouseForceValue = Math.max(config.mouseForce, 1);
    const cursorSizeValue = Math.max(config.cursorSize, 10);
    const viscosityValue = config.isViscous ? clamp(config.viscous / 40, 0.1, 2) : 0.35;
    const iterationsViscousValue = clamp(Math.round(config.iterationsViscous / 8), 1, 8);
    const iterationsPoissonValue = clamp(Math.round(config.iterationsPoisson / 8), 1, 8);
    const takeoverSeconds = Math.max(config.takeoverDuration, 0.05);
    const autoRampSeconds = Math.max(config.autoRampDuration, 0.1);
    const resumeDelay = Math.max(config.autoResumeDelay, 0);
    const autoAmplitude = Math.min(0.32, 0.08 + autoIntensityValue * 0.05);

    const updateCanvasSize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(window.innerWidth, 1);
      const height = Math.max(window.innerHeight, 1);
      const scaledWidth = Math.floor(width * pixelRatio * resolutionFactor);
      const scaledHeight = Math.floor(height * pixelRatio * resolutionFactor);

      if (canvas.width !== scaledWidth || canvas.height !== scaledHeight) {
        canvas.width = scaledWidth;
        canvas.height = scaledHeight;
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        gl.viewport(0, 0, scaledWidth, scaledHeight);
      }
    };

    const toNormalizedCoordinates = (clientX: number, clientY: number) => {
      const width = Math.max(window.innerWidth, 1);
      const height = Math.max(window.innerHeight, 1);
      return {
        x: clamp(clientX / width, 0, 1),
        y: clamp(clientY / height, 0, 1),
      };
    };

    const handlePointerMove = (event: PointerEvent) => {
      const { x, y } = toNormalizedCoordinates(event.clientX, event.clientY);
      pointerInputRef.current = { x, y };
      lastInteractionRef.current = performance.now();
    };

    const handlePointerDown = (event: PointerEvent) => {
      handlePointerMove(event);
    };

    const handlePointerUp = () => {
      lastInteractionRef.current = performance.now();
    };

    const handleResize = () => {
      updateCanvasSize();
    };

    updateCanvasSize();

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("resize", handleResize);

    const renderFrame = (now: number) => {
      if (disposed) {
        return;
      }

      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const pointerInput = pointerInputRef.current;
      const pointer = pointerStateRef.current;
      const autoState = autoStateRef.current;
      const autopoint = autopointRef.current;

      const autoActive = config.autoDemo && now - lastInteractionRef.current > resumeDelay;
      autoState.targetStrength = autoActive ? 1 : 0;

      const rampDuration = autoState.targetStrength > autoState.strength ? autoRampSeconds : takeoverSeconds;
      const rampStep = rampDuration > 0 ? Math.min(delta / rampDuration, 1) : 1;
      autoState.strength = clamp(
        autoState.strength + (autoState.targetStrength - autoState.strength) * rampStep,
        0,
        1,
      );

      autoState.time += delta * autoSpeedValue * (0.8 + autoState.strength * 0.4);

      let autoX: number;
      let autoY: number;

      if (config.isBounce) {
        autoX = 0.5 + triangularWave(autoState.time) * autoAmplitude;
        autoY = 0.5 + triangularWave(autoState.time * 0.6 + 1.2) * autoAmplitude;
      } else {
        autoX = 0.5 + Math.sin(autoState.time) * autoAmplitude;
        autoY = 0.5 + Math.cos(autoState.time * 0.7 + 1.2) * autoAmplitude;
      }

      autopoint.x = clamp(autoX, 0.05, 0.95);
      autopoint.y = clamp(autoY, 0.05, 0.95);

      const targetX = clamp(lerp(pointerInput.x, autopoint.x, autoState.strength), 0.01, 0.99);
      const targetY = clamp(lerp(pointerInput.y, autopoint.y, autoState.strength), 0.01, 0.99);

      pointer.targetX = targetX;
      pointer.targetY = targetY;

      const smoothing = 0.09 + (mouseForceValue / 40);
      const damping = clamp(0.06 + viscosityValue * 0.3, 0.02, 0.6);

      pointer.velocityX += (pointer.targetX - pointer.x) * smoothing;
      pointer.velocityY += (pointer.targetY - pointer.y) * smoothing;

      pointer.velocityX *= 1 - damping;
      pointer.velocityY *= 1 - damping;

      pointer.x = clamp(pointer.x + pointer.velocityX, 0, 1);
      pointer.y = clamp(pointer.y + pointer.velocityY, 0, 1);

      const velocityMagnitude = Math.sqrt(
        pointer.velocityX * pointer.velocityX +
          pointer.velocityY * pointer.velocityY,
      );
      const pointerForceValue = clamp(velocityMagnitude * mouseForceValue * 18, 0, 8);
      const cursorSizeNormalized = clamp(cursorSizeValue / 140, 0.2, 2.6);

      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, now / 1000);
      gl.uniform2f(uniforms.pointer, pointer.x, pointer.y);
      gl.uniform2f(uniforms.pointerVelocity, pointer.velocityX, pointer.velocityY);
      gl.uniform1f(uniforms.pointerForce, pointerForceValue);
      gl.uniform1f(uniforms.cursorSize, cursorSizeNormalized);
      gl.uniform1f(uniforms.intensity, intensityValue);
      gl.uniform1f(uniforms.autoStrength, autoState.strength);
      gl.uniform1f(uniforms.viscosity, viscosityValue);
      gl.uniform1f(uniforms.iterationsViscous, iterationsViscousValue);
      gl.uniform1f(uniforms.iterationsPoisson, iterationsPoissonValue);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (!readyRef.current) {
        readyRef.current = true;
        setIsReady(true);
      }

      animationId = requestAnimationFrame(renderFrame);
    };

    animationId = requestAnimationFrame(renderFrame);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("resize", handleResize);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      readyRef.current = false;
      setIsReady(false);
    };
  }, [
    shouldRenderCanvas,
    colorArray,
    config.autoDemo,
    config.autoIntensity,
    config.autoRampDuration,
    config.autoResumeDelay,
    config.autoSpeed,
    config.cursorSize,
    config.isBounce,
    config.isViscous,
    config.iterationsPoisson,
    config.iterationsViscous,
    config.mouseForce,
    config.resolution,
    config.takeoverDuration,
    config.viscous,
    config.baseIntensity,
  ]);

  return (
    <div
      className={cn("fixed inset-0 -z-10 pointer-events-none", className)}
      style={style}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: fallbackGradient,
          opacity: shouldRenderCanvas && isReady ? 0 : 1,
        }}
      />
      {shouldRenderCanvas ? (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
};

export default LiquidEther;
