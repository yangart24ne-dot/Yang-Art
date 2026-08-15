import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎛️  FLUID EFFECT DEFAULT SETTINGS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface FluidEffectSettings {
  gradientToggle: boolean;
  colors: string[];
  radius: number;             // cursor influence radius (0.0 to 1.0)
  distortionStrength: number;  // liquid distortion strength
  hueShift: number;           // base hue shift
  colorSpeed: number;         // speed of color cycling
  animationSpeed: number;     // overall animation speed
  trailPersistence: number;   // fade rate of movement trails (0.01 to 0.1)
  pointerSmoothing: number;   // smoothing lag for pointer (0.0 = instant, 0.95 = very smooth lag)
  overflowPadding: number;    // padding factor to prevent clipping at edges
  highQuality: boolean;       // use simplex/curl noise vs simple sine noise
  fadeInDuration: number;     // in seconds
  maxDPR: number;             // max device pixel ratio
  reducedMotion: boolean;     // disable mouse distortion, keep animation static
  glowSpread: number;         // glow spread size factor
  glowIntensity: number;      // glow intensity factor
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎛️ BẢNG ĐIỀU CHỈNH HIỆU ỨNG CHỮ TAN CHẢY (CÓ THỂ SỬA CÁC THÔNG SỐ DƯỚI ĐÂY)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const DEFAULT_SETTINGS: FluidEffectSettings = {
  gradientToggle: true,
  colors: ["#A7F417", "#FF009E"], // brand màu Chuẩn (xanh lá và hồng)
  radius: 0.25,             // 🎯 Bán kính tác động của chuột (Mặc định: 0.45, giảm xuống giúp vệt chảy gọn sát chuột)
  distortionStrength: 0.12, // 🎯 Độ mạnh của biến dạng co giãn (Mặc định: 0.35, giảm xuống giúp chữ ít bị loang to)
  hueShift: 0.0,
  colorSpeed: 1.2,
  animationSpeed: 0.5,      // ⚡ TỐC ĐỘ CHUYỂN ĐỘNG CỦA DÒNG CHẢY (Mặc định: 1.0, tăng lên sẽ chạy nhanh hơn) 
  glowSpread: 0.2,          // 🌸 ĐỘ LOANG CỦA ÁNH SÁNG PHÁT SÁNG (Mặc định: 1.0, tăng lên loang rộng hơn)
  glowIntensity: 0.20,      // ✨ ĐỘ SÁNG CỦA HÀO QUANG (Mặc định: 0.45, giảm xuống giúp hào quang dịu nhẹ và sát chữ) 
  trailPersistence: 0.05,
  pointerSmoothing: 0.85,
  overflowPadding: 0.15,
  highQuality: true,
  fadeInDuration: 0.8,
  maxDPR: 2,
  reducedMotion: false,
};

interface FluidTextEffectProps {
  text: string;
  className?: string;
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
  textColor?: string;
  paddingTop?: number;
  letterHeight?: number;
  settings?: Partial<FluidEffectSettings>;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🧬  GLSL SHADERS FOR LIQUID DISTORTION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uMouseStrength;
  uniform float uRadius;
  uniform float uTime;
  uniform float uHover;
  uniform vec3 uMainColor;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;
  uniform float uUseGradient;
  uniform float uDistortionStrength;
  uniform float uHueShift;
  uniform float uColorSpeed;
  uniform float uGlowSpread;
  uniform float uGlowIntensity;
  uniform float uFadeIn;
  uniform vec2 uClickPos;
  uniform float uClickTime;
  uniform float uHighQuality;
  varying vec2 vUv;

  // GLSL Simplex 2D Noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx) ;
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 a0 = x - floor(x + 0.5);
    vec3 col = 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * col.x  + h.x  * col.y;
    g.yz = a0.yz * col.yz + h.yz * col.z;
    m *= g;
    return 130.0 * dot(m, vec3(1.0));
  }

  // Generate a vector displacement field
  vec2 getDisplacement(vec2 uv, vec2 target, float strength, float radius, float time) {
    vec2 dir = uv - target;
    float dist = length(dir);
    
    // Smooth falloff based on radius
    float force = smoothstep(radius, 0.0, dist);
    
    if (force <= 0.0) return vec2(0.0);

    // High quality curl noise distortion
    float n1 = snoise(uv * 3.5 + vec2(time * 0.2));
    float n2 = snoise(uv * 3.5 - vec2(time * 0.25));
    
    // Swirl vector (orthogonal to direction)
    vec2 swirl = vec2(-dir.y, dir.x) * n1 * 1.5;
    // Push vector (away from cursor)
    vec2 push = normalize(dir) * n2 * 0.8;
    
    return (swirl + push) * strength * force;
  }

  void main() {
    vec2 uv = vUv;
    
    // Calculate primary cursor distortion
    vec2 cursorDisplace = vec2(0.0);
    if (uMouseStrength > 0.0) {
      if (uHighQuality > 0.5) {
        cursorDisplace = getDisplacement(uv, uMouse, uDistortionStrength, uRadius, uTime);
      } else {
        // Fast low-quality sine/cosine wave distortion
        vec2 dir = uv - uMouse;
        float dist = length(dir);
        float force = smoothstep(uRadius, 0.0, dist);
        cursorDisplace = vec2(
          sin(uv.y * 10.0 + uTime) * 0.02,
          cos(uv.x * 10.0 + uTime) * 0.02
        ) * force * uDistortionStrength * 2.0;
      }
    }

    // Calculate click radial shockwave
    vec2 clickDisplace = vec2(0.0);
    if (uClickTime > 0.0) {
      float clickAge = uTime - uClickTime;
      if (clickAge < 2.0) {
        vec2 dir = uv - uClickPos;
        float dist = length(dir);
        
        // Ripple speed & wave propagation
        float waveSpeed = 1.2;
        float waveFront = clickAge * waveSpeed;
        float waveThickness = 0.15;
        float distToFront = abs(dist - waveFront);
        
        // Define ripple profile
        float ripple = smoothstep(waveThickness, 0.0, distToFront);
        // Decay with age and distance
        float decay = smoothstep(2.0, 0.0, clickAge) / (1.0 + dist * 3.0);
        
        clickDisplace = normalize(dir) * sin(dist * 40.0 - uTime * 15.0) * 0.08 * ripple * decay;
      }
    }

    // Apply combined displacements to UV coordinates
    vec2 distortedUv = uv - (cursorDisplace + clickDisplace) * uHover;
    
    // Transparent if outside text bounds
    if (distortedUv.x < 0.0 || distortedUv.x > 1.0 || distortedUv.y < 0.0 || distortedUv.y > 1.0) {
      discard;
    }
    
    // Sample texture mask
    vec4 textMask = texture2D(uTexture, distortedUv);
    
    // 9-tap blur for soft outer glow (using dynamic glow spread)
    float glow = 0.0;
    float stepX = (8.0 * uGlowSpread) / 600.0;
    float stepY = (8.0 * uGlowSpread) / 600.0;
    
    glow += texture2D(uTexture, distortedUv + vec2(-stepX, -stepY)).a * 0.075;
    glow += texture2D(uTexture, distortedUv + vec2(0.0, -stepY)).a * 0.125;
    glow += texture2D(uTexture, distortedUv + vec2(stepX, -stepY)).a * 0.075;
    
    glow += texture2D(uTexture, distortedUv + vec2(-stepX, 0.0)).a * 0.125;
    glow += texture2D(uTexture, distortedUv + vec2(0.0, 0.0)).a * 0.2;
    glow += texture2D(uTexture, distortedUv + vec2(stepX, 0.0)).a * 0.125;
    
    glow += texture2D(uTexture, distortedUv + vec2(-stepX, stepY)).a * 0.075;
    glow += texture2D(uTexture, distortedUv + vec2(0.0, stepY)).a * 0.125;
    glow += texture2D(uTexture, distortedUv + vec2(stepX, stepY)).a * 0.075;

    // Combined alpha (text alpha + soft glow active only on hover, using dynamic glow intensity)
    float alpha = max(textMask.a, glow * uGlowIntensity * uHover) * uFadeIn;
    if (alpha < 0.01) {
      discard;
    }

    // Set flowing color strictly to the Brand Pink (#FF009E)
    vec3 gradientColor = uColor2;

    // Blend between static flat color and animated liquid gradient based on hover
    vec3 finalColor = mix(uMainColor, gradientColor, uHover);

    // Apply text opacity & fade-in duration using premultiplied alpha
    gl_FragColor = vec4(finalColor * alpha, alpha);
  }
`;

// Global tracking of active WebGL text instances to prevent browser context exhaustion crashes
let activeWebGLCount = 0;
const MAX_CONCURRENT_WEBGL = 3; // Allow up to 3 active WebGL text effects at the same time

export default function FluidTextEffect({
  text,
  className,
  fontSize = "clamp(32px, 11vw, 180px)",
  fontFamily = "Malinton, sans-serif",
  fontWeight = "900",
  textColor = "#0020D7",
  paddingTop = 0,
  letterHeight = 160,
  settings = {},
}: FluidTextEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  // Combine custom settings with defaults
  const fxSettings = { ...DEFAULT_SETTINGS, ...settings };

  // Dynamic WebGL mounting state to conserve browser WebGL context limits
  const [isInteracting, setIsInteracting] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  // Animation and interaction states preserved in ref
  const stateRef = useRef({
    time: 0,
    hoverProgress: 0,
    isHovered: false,
    mouse: new THREE.Vector2(0.5, 0.5),
    targetMouse: new THREE.Vector2(0.5, 0.5),
    mouseVel: 0,
    clickPos: new THREE.Vector2(0.5, 0.5),
    clickTime: -99.0,
    fadeInProgress: 0,
    hasWebGL: true,
    isSettled: false,
    active: false,
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🖱️ MOUSE EVENT HANDLERS (ON WRAPPER DIV)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const handlePointerEnter = () => {
    if (!hasWebGL) return;
    if (!isInteracting) {
      if (activeWebGLCount >= MAX_CONCURRENT_WEBGL) return;
      setIsInteracting(true);
      activeWebGLCount++;
    }
    stateRef.current.isHovered = true;
  };

  const handlePointerLeave = () => {
    stateRef.current.isHovered = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!hasWebGL) return;
    if (!isInteracting) {
      if (activeWebGLCount >= MAX_CONCURRENT_WEBGL) return;
      setIsInteracting(true);
      activeWebGLCount++;
    }
    stateRef.current.isHovered = true;

    const rect = e.currentTarget.getBoundingClientRect();
    const padX = 150;
    const padY = 150;
    const totalW = rect.width + padX * 2;
    const totalH = letterHeight + padY * 2;
    const x = ((e.clientX - rect.left) + padX) / totalW;
    const y = 1.0 - ((e.clientY - rect.top) + padY) / totalH; // invert for WebGL coordinates
    stateRef.current.targetMouse.set(x, y);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasWebGL) return;
    if (!isInteracting) {
      if (activeWebGLCount >= MAX_CONCURRENT_WEBGL) return;
      setIsInteracting(true);
      activeWebGLCount++;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const padX = 150;
    const padY = 150;
    const totalW = rect.width + padX * 2;
    const totalH = letterHeight + padY * 2;
    const x = ((e.clientX - rect.left) + padX) / totalW;
    const y = 1.0 - ((e.clientY - rect.top) + padY) / totalH;

    const state = stateRef.current;
    state.clickPos.set(x, y);
    state.clickTime = state.time;
  };

  useEffect(() => {
    // If not interacting, we do not initialize WebGL to save context limits
    if (!isInteracting) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Reset interaction state parameters on mount for clean fade-in
    const state = stateRef.current;
    state.fadeInProgress = 0.0;
    state.hoverProgress = 0.0;
    state.isSettled = false;

    // Determine sizes with extra padding to prevent edge cropping
    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio, fxSettings.maxDPR);
    const width = rect.width > 0 ? rect.width : 200;
    const height = letterHeight > 0 ? letterHeight : 160;

    const padX = 150;
    const padY = 150;
    const totalW = width + padX * 2;
    const totalH = height + padY * 2;

    canvas.width = totalW * dpr;
    canvas.height = totalH * dpr;
    canvas.style.width = `${totalW}px`;
    canvas.style.height = `${totalH}px`;
    canvas.style.left = `-${padX}px`;
    canvas.style.top = `-${padY}px`;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎨 RENDER TEXT TO AN OFFSCREEN CANVAS TO USE AS GLYPH MASK
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const textCanvas = document.createElement("canvas");
    textCanvas.width = totalW * dpr;
    textCanvas.height = totalH * dpr;
    const ctx = textCanvas.getContext("2d");
    if (!ctx) return;

    // Helper to resolve CSS clamp/px expressions directly in JS to prevent layout engine racing/hidden element bugs
    const resolveFontSize = (str: string): number => {
      const match = str.match(/clamp\(\s*([\d.]+)\s*px\s*,\s*([\d.]+)\s*vw\s*,\s*([\d.]+)\s*px\s*\)/i);
      if (match) {
        const min = parseFloat(match[1]);
        const vw = parseFloat(match[2]);
        const max = parseFloat(match[3]);
        const preferred = window.innerWidth * (vw / 100);
        return Math.max(min, Math.min(max, preferred));
      }
      const pxMatch = str.match(/^([\d.]+)\s*px$/i);
      if (pxMatch) {
        return parseFloat(pxMatch[1]);
      }
      return 180;
    };

    // Create Three.js Texture from Canvas
    const textTexture = new THREE.CanvasTexture(textCanvas);
    textTexture.minFilter = THREE.LinearFilter;
    textTexture.magFilter = THREE.LinearFilter;
    textTexture.format = THREE.RGBAFormat;

    // Reusable text drawer that properly configures style attributes after canvas width/height resets them
    const drawText = (w: number, h: number) => {
      const padX = 150;
      const padY = 150;
      const tW = w + padX * 2;
      const tH = h + padY * 2;

      if (textCanvas.width !== tW * dpr || textCanvas.height !== tH * dpr) {
        textCanvas.width = tW * dpr;
        textCanvas.height = tH * dpr;
      }
      // Reset transform before scaling to prevent accumulation bugs
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
      ctx.scale(dpr, dpr);

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const currentSize = resolveFontSize(fontSize);
      console.log("[FluidTextEffect] drawText called for letter:", text, "w:", w, "h:", h, "dpr:", dpr, "fontSize:", currentSize, "font:", `${fontWeight} ${currentSize}px ${fontFamily}`);

      ctx.font = `${fontWeight} ${currentSize}px ${fontFamily}`;
      ctx.fillText(text, tW / 2, tH / 2 + paddingTop);

      // Update texture source dimensions for Three.js uploading
      textTexture.image = textCanvas;
      textTexture.needsUpdate = true;
    };

    // Draw initially
    drawText(width, height);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 📦 THREE.JS SCENE SETUP
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const scene = new THREE.Scene();

    // Orthographic Camera for perfect 2D mapping (using aspect ratio to prevent stretching)
    const aspect = totalW / totalH;
    const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 10);
    camera.position.z = 1;

    // Direct WebGLRenderer instantiation inside a try-catch block to handle context exhaustion gracefully
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        premultipliedAlpha: true,
      });
      // Check for immediate context loss during instantiation
      if (renderer.getContext().isContextLost()) {
        throw new Error("WebGL context lost immediately during renderer construction.");
      }
    } catch (e) {
      console.warn("WebGL initialization failed, falling back to static typography:", e);
      stateRef.current.hasWebGL = false;
      setHasWebGL(false);
      setIsInteracting(false);

      // Clean up text texture if it was allocated
      textTexture.dispose();
      return;
    }

    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    // Geometry matches the full viewport quad matching the aspect ratio
    // Include extra padding to allow fluid overflow outside letter bounds
    const padding = fxSettings.overflowPadding;
    const geometry = new THREE.PlaneGeometry(2 * aspect + padding * 2, 2 + padding * 2);

    // Uniforms mapping
    const uniforms = {
      uTexture: { value: textTexture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseStrength: { value: 0.0 },
      uRadius: { value: fxSettings.radius },
      uTime: { value: 0.0 },
      uHover: { value: 0.0 },
      uMainColor: { value: new THREE.Color(textColor) },
      uColor1: { value: new THREE.Color(fxSettings.colors[0] || "#A7F417") },
      uColor2: { value: new THREE.Color(fxSettings.colors[1] || "#FF009E") },
      uColor3: { value: new THREE.Color(fxSettings.colors[2] || "#A7F417") },
      uColor4: { value: new THREE.Color(fxSettings.colors[3] || "#FF009E") },
      uUseGradient: { value: fxSettings.gradientToggle ? 1.0 : 0.0 },
      uDistortionStrength: { value: fxSettings.distortionStrength },
      uHueShift: { value: fxSettings.hueShift },
      uColorSpeed: { value: fxSettings.colorSpeed },
      uFadeIn: { value: 0.0 },
      uClickPos: { value: new THREE.Vector2(-1, -1) },
      uClickTime: { value: -99.0 },
      uHighQuality: { value: fxSettings.highQuality ? 1.0 : 0.0 },
      uGlowSpread: { value: fxSettings.glowSpread },
      uGlowIntensity: { value: fxSettings.glowIntensity },
    };

    // Sync current click coordinates if click occurred on mount transition
    const clickState = stateRef.current;
    if (clickState.clickTime > -98.0) {
      uniforms.uClickPos.value.copy(clickState.clickPos);
      uniforms.uClickTime.value = clickState.clickTime;
    }

    // Material with custom shaders
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🏃 ANIMATION LOOP WITH AUTO-PAUSE & SETTLING
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    let animationId: number;
    let lastTime = performance.now();

    const animate = () => {
      const state = stateRef.current;
      const now = performance.now();
      const dt = Math.max(0.001, Math.min((now - lastTime) / 1000, 0.1));
      lastTime = now;

      // Update global time
      state.time += dt * fxSettings.animationSpeed;
      uniforms.uTime.value = state.time;

      // Handle Smooth Fade In
      if (state.fadeInProgress < 1.0) {
        state.fadeInProgress += dt / fxSettings.fadeInDuration;
        uniforms.uFadeIn.value = Math.min(1.0, state.fadeInProgress);
      }
      if (Math.random() < 0.05) {
        console.log(`[FluidColors Debug ${text}] main: ${uniforms.uMainColor.value.getHexString()}, col1: ${uniforms.uColor1.value.getHexString()}, col2: ${uniforms.uColor2.value.getHexString()}, hover: ${uniforms.uHover.value.toFixed(3)}, fadeIn: ${uniforms.uFadeIn.value.toFixed(3)}`);
      }

      // Smooth pointer lag / interpolation
      if (!fxSettings.reducedMotion && state.isHovered) {
        const factor = 1.0 - fxSettings.pointerSmoothing;
        state.mouse.x += (state.targetMouse.x - state.mouse.x) * factor;
        state.mouse.y += (state.targetMouse.y - state.mouse.y) * factor;

        // Calculate velocity/strength of movement
        const vel = state.mouse.distanceTo(state.targetMouse);
        state.mouseVel = state.mouseVel * 0.9 + vel * 0.1;

        uniforms.uMouse.value.copy(state.mouse);
        // Hovering pushes strength towards 1.0
        uniforms.uMouseStrength.value = THREE.MathUtils.lerp(uniforms.uMouseStrength.value, 1.0, 0.1);
      } else {
        uniforms.uMouseStrength.value = THREE.MathUtils.lerp(uniforms.uMouseStrength.value, 0.0, 0.15);
      }

      // Smoothly interpolate hover state
      const targetHover = state.isHovered ? 1.0 : 0.0;
      state.hoverProgress += (targetHover - state.hoverProgress) * 0.1;
      uniforms.uHover.value = state.hoverProgress;

      // Render
      renderer.render(scene, camera);

      // Check if animation is settled to pause render loop and unmount WebGL context
      const mouseSettled = !state.isHovered && uniforms.uMouseStrength.value < 0.01 && state.hoverProgress < 0.01;
      const clickSettled = (state.time - state.clickTime) > 2.0;

      if (mouseSettled && clickSettled && state.fadeInProgress >= 1.0) {
        state.isSettled = true;
        state.active = false;

        // Safe batch update to transition back to static vector rendering
        setTimeout(() => {
          setIsInteracting(false);
        }, 0);
        return;
      }

      animationId = requestAnimationFrame(animate);
    };

    const resumeAnimation = () => {
      const state = stateRef.current;
      if (!state.active) {
        state.active = true;
        state.isSettled = false;
        lastTime = performance.now(); // reset clock anchor
        animate();
      }
    };

    // Initial trigger
    resumeAnimation();

    // Resize observer to handle mount dimension changes and responsive window scaling
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width || container.getBoundingClientRect().width;
        const h = letterHeight;
        if (w <= 0) continue;

        const padX = 150;
        const padY = 150;
        const totalW = w + padX * 2;
        const totalH = h + padY * 2;

        canvas.width = totalW * dpr;
        canvas.height = totalH * dpr;
        canvas.style.width = `${totalW}px`;
        canvas.style.height = `${totalH}px`;
        canvas.style.left = `-${padX}px`;
        canvas.style.top = `-${padY}px`;

        renderer.setSize(totalW, totalH);

        // Update camera boundaries & plane geometry dynamically to prevent text stretching
        const newAspect = totalW / totalH;
        camera.left = -newAspect;
        camera.right = newAspect;
        camera.updateProjectionMatrix();

        mesh.geometry.dispose();
        mesh.geometry = new THREE.PlaneGeometry(2 * newAspect + padding * 2, 2 + padding * 2);

        // Redraw text to offscreen canvas texture using drawText helper
        drawText(w, h);

        resumeAnimation();
      }
    });

    resizeObserver.observe(container);

    // Redraw when custom fonts are ready
    if (document.fonts) {
      document.fonts.ready.then(() => {
        const w = container.getBoundingClientRect().width;
        if (w > 0) {
          const padX = 150;
          const padY = 150;
          const totalW = w + padX * 2;
          const totalH = letterHeight + padY * 2;

          // Re-trigger layout redraw
          canvas.width = totalW * dpr;
          canvas.height = totalH * dpr;
          canvas.style.width = `${totalW}px`;
          canvas.style.height = `${totalH}px`;
          canvas.style.left = `-${padX}px`;
          canvas.style.top = `-${padY}px`;

          renderer.setSize(totalW, totalH);

          const newAspect = totalW / totalH;
          camera.left = -newAspect;
          camera.right = newAspect;
          camera.updateProjectionMatrix();

          mesh.geometry.dispose();
          mesh.geometry = new THREE.PlaneGeometry(2 * newAspect + padding * 2, 2 + padding * 2);

          // Redraw text to offscreen canvas texture using drawText helper
          drawText(w, letterHeight);
          resumeAnimation();
        }
      });
    }

    // Safe context lost event handling
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn("[FluidTextEffect] WebGL context lost. Falling back to static typography.");
      stateRef.current.hasWebGL = false;
      setHasWebGL(false);
      setIsInteracting(false);
    };

    canvas.addEventListener("webglcontextlost", handleContextLost);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      canvas.removeEventListener("webglcontextlost", handleContextLost);

      // Decrement the global count when this instance unmounts and disposes WebGL
      activeWebGLCount = Math.max(0, activeWebGLCount - 1);

      // WebGL resource cleanup
      geometry.dispose();
      material.dispose();
      textTexture.dispose();
      renderer.dispose();
    };
  }, [text, fontSize, fontFamily, fontWeight, textColor, paddingTop, letterHeight, isInteracting, JSON.stringify(settings)]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-visible flex items-center justify-center ${className}`}
      style={{ height: `${letterHeight}px`, zIndex: isInteracting ? 50 : 1 }}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
    >
      {/* 1. WebGL living liquid/energy canvas overlay (visible if WebGL is supported and user is interacting) */}
      {hasWebGL && isInteracting && (
        <canvas
          ref={canvasRef}
          className="absolute z-10 block pointer-events-none cursor-pointer"
        />
      )}

      {/* 2. Static typography fallback for SEO, indexing, and non-WebGL states */}
      <span
        ref={spanRef}
        className="font-display font-black uppercase block w-full text-center select-none"
        style={{
          fontSize: fontSize,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          color: textColor,
          paddingTop: `${paddingTop}px`,
          opacity: (hasWebGL && isInteracting) ? 0 : 1, // hidden but indexing-friendly if WebGL is loaded
          transition: "opacity 0.15s ease",
        }}
      >
        {text}
      </span>
    </div>
  );
}
