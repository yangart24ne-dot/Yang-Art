import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

// Import local assets
import bgImagePlaceholder from "../../assets/ảnh tính năng/kaboompics_microplastic-particles-with-glove-laboratory-concept-42046.jpg";
import logoMascotPlaceholder from "../../assets/LOGO/Logo mascot.svg";
import maskGroupDesktop from "../../assets/info workshop/SVG/Mask group.png";
import maskGroupMobile from "../../assets/info workshop/SVG/Mask group-1.png";

interface Pixel {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  opacity: number;
  threshold: number;
}

export interface PixelHeroProps {
  headline?: string;
  subheadline?: string;
  bgImage?: string;
  imagePosition?: "center" | "top" | "bottom";
  pixelColor?: string;
  pixelDensity?: number; // 0.0 to 1.0
  pixelSize?: number;
  pixelOpacity?: number; // 0.0 to 1.0
  revealRadius?: number;
  animationSpeed?: number;
  enableInteraction?: boolean;
  heroHeight?: {
    desktop?: string;
    tablet?: string;
    mobile?: string;
  };
  textColor?: string;
  headlineFont?: string;
  bodyFont?: string;
  marginTop?: string;
  scrollProgress?: number;
}

export function PixelHeroSection({
  headline = "RECYCLE3D PRO // SKETCH_TO_PRINT",
  subheadline = "SKETCH_TO_PRINT",
  bgImage = bgImagePlaceholder,
  imagePosition = "center",
  pixelColor = "#FFFFFF", // Solid white pixel blocks for digital overlay
  pixelDensity = 0.7, // 70% white pixels, 30% background reveal as requested
  pixelSize = 48, // Larger editorial pixel size as requested
  pixelOpacity = 1.0,
  revealRadius = 120, // Adjusted for larger pixels
  animationSpeed = 0.06,
  enableInteraction = true,
  heroHeight = {
    desktop: "750px",
    tablet: "650px",
    mobile: "500px"
  },
  textColor = "#0020D7",
  headlineFont = "font-display",
  bodyFont = "font-sans",
  marginTop = "mt-28", // Spacing to avoid overlap with fixed Navbar
  scrollProgress = 0
}: PixelHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);

  const scrollProgressRef = useRef(scrollProgress);
  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  // Keep track of cursor state
  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    isHovering: false
  });

  const pixelsRef = useRef<Pixel[]>([]);

  const [gridConfig, setGridConfig] = useState<{
    width: number;
    height: number;
    cols: number;
    rows: number;
    pixelSize: number;
  } | null>(null);

  // Tính toán kích thước hoàn hảo để không bị cắt ô pixel và các ô vuông hoàn toàn đều nhau
  useEffect(() => {
    const calculateGrid = () => {
      const container = containerRef.current;
      if (!container) return;

      const parent = container.parentElement || document.body;
      const W = parent.clientWidth;

      const parseHeight = (val: string) => {
        if (typeof val === "string" && val.endsWith("vh")) {
          return (parseFloat(val) / 100) * window.innerHeight;
        }
        return parseInt(val) || 750;
      };

      let desiredH = 750;
      if (window.innerWidth <= 640) {
        desiredH = parseHeight(heroHeight.mobile || "500");
      } else if (window.innerWidth <= 1024) {
        desiredH = parseHeight(heroHeight.tablet || "650");
      } else {
        desiredH = parseHeight(heroHeight.desktop || "750");
      }

      const targetSize = pixelSize;
      // cols và rows được làm tròn để đảm bảo khít tuyệt đối từ cạnh này sang cạnh kia
      const cols = Math.round(W / targetSize) || 1;
      const actualSize = W / cols; // Kích thước thực tế của pixel sau khi chia đều chiều rộng
      const rows = Math.round(desiredH / actualSize) || 1;
      const H = rows * actualSize; // Chiều cao thực tế của container để vừa vặn số hàng nguyên vẹn

      setGridConfig({
        width: W,
        height: H,
        cols,
        rows,
        pixelSize: actualSize
      });
    };

    calculateGrid();
    window.addEventListener("resize", calculateGrid);
    return () => window.removeEventListener("resize", calculateGrid);
  }, [pixelSize, heroHeight.desktop, heroHeight.tablet, heroHeight.mobile]);

  useEffect(() => {
    if (!gridConfig) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height, cols, rows, pixelSize: size } = gridConfig;
    const dpr = window.devicePixelRatio || 1;

    // Cân chỉnh độ phân giải canvas để vẽ sắc nét và không bị kéo giãn
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const newPixels: Pixel[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * size;
        const y = r * size;

        // Phân phối ngẫu nhiên 70% pixel màu trắng
        const isActive = Math.random() < pixelDensity;
        const finalBaseOpacity = isActive ? pixelOpacity : 0;

        // Tỉ lệ khoảng cách đứng từ 0.0 ở đỉnh đến 1.0 ở đáy
        const normalizedY = y / height;
        // Các pixel ở dưới sẽ biến mất trước (reversedY nhỏ -> threshold nhỏ); các ô ở trên đỉnh biến mất sau cùng
        const reversedY = 1.0 - normalizedY;
        const threshold = reversedY * 0.75 + Math.random() * 0.25;

        newPixels.push({
          x,
          y,
          size,
          baseOpacity: finalBaseOpacity,
          opacity: finalBaseOpacity,
          threshold
        });
      }
    }

    pixelsRef.current = newPixels;

    // Vòng lặp render
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const pixels = pixelsRef.current;
      const mouse = mouseRef.current;
      const rRad = revealRadius;
      const speed = animationSpeed;
      const interact = enableInteraction;
      const currentScrollProgress = scrollProgressRef.current;

      for (let i = 0; i < pixels.length; i++) {
        const p = pixels[i];

        // Nếu scrollProgress đã vượt qua threshold của ô này, targetOpacity sẽ bằng 0
        const isDissolved = currentScrollProgress >= p.threshold;
        const targetOpacity = isDissolved ? 0 : p.baseOpacity;

        if (interact && mouse.isHovering) {
          const px = p.x + p.size / 2;
          const py = p.y + p.size / 2;
          const dx = px - mouse.x;
          const dy = py - mouse.y;
          const distSq = dx * dx + dy * dy;
          const radSq = rRad * rRad;

          if (distSq < radSq) {
            // Xóa nhanh khi di chuột qua
            p.opacity += (0 - p.opacity) * 0.35;
          } else {
            // Hồi phục mượt mà về targetOpacity (là 0 nếu đã cuộn qua hoặc baseOpacity nếu chưa)
            p.opacity += (targetOpacity - p.opacity) * speed;
          }
        } else {
          // Hồi phục mượt mà về targetOpacity
          p.opacity += (targetOpacity - p.opacity) * speed;
        }

        // Vẽ các ô pixel đè lên nhau 1px để tránh khe hở/lộ viền giữa các ô
        if (p.opacity > 0.01) {
          ctx.fillStyle = pixelColor;
          ctx.globalAlpha = p.opacity;
          ctx.fillRect(p.x, p.y, p.size + 1, p.size + 1);
        }
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gridConfig, pixelDensity, pixelOpacity, pixelColor, revealRadius, animationSpeed, enableInteraction]);

  // Update cursor position inside canvas rect
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseRef.current.x = x;
    mouseRef.current.y = y;
    mouseRef.current.isHovering = true;
  };

  const handleMouseEnter = () => {
    mouseRef.current.isHovering = true;
  };

  const handleMouseLeave = () => {
    mouseRef.current.isHovering = false;
  };

  // Mobile Touch events
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = e.touches[0].clientX - rect.left;
    mouseRef.current.y = e.touches[0].clientY - rect.top;
    mouseRef.current.isHovering = true;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = e.touches[0].clientX - rect.left;
    mouseRef.current.y = e.touches[0].clientY - rect.top;
    mouseRef.current.isHovering = true;
  };

  const handleTouchEnd = () => {
    mouseRef.current.isHovering = false;
  };

  return (
    <div
      ref={containerRef}
      className={cn("w-full relative overflow-hidden z-10 flex flex-col justify-center items-center select-none bg-[#FFFFFF]", marginTop)}
      style={{
        "--hero-height-desktop": heroHeight.desktop || "750px",
        "--hero-height-tablet": heroHeight.tablet || "650px",
        "--hero-height-mobile": heroHeight.mobile || "500px",
        height: gridConfig ? `${gridConfig.height}px` : "var(--hero-height-desktop)",
      } as React.CSSProperties}
    >
      {/* 1. Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 overflow-hidden"
        style={{ opacity: 1 - scrollProgress }}
      >
        {bgImage && bgImage !== bgImagePlaceholder ? (
          <img
            src={bgImage}
            alt="Hero Background"
            className={cn(
              "w-full h-full object-cover select-none pointer-events-none scale-105 transition-transform duration-1000",
              imagePosition === "center" && "object-center",
              imagePosition === "top" && "object-top",
              imagePosition === "bottom" && "object-bottom"
            )}
            loading="lazy"
          />
        ) : (
          <picture className="w-full h-full block">
            <source media="(max-width: 768px)" srcSet={maskGroupMobile} />
            <img
              src={maskGroupDesktop}
              alt="Hero Background"
              className={cn(
                "w-full h-full object-cover select-none pointer-events-none scale-105 transition-transform duration-1000",
                imagePosition === "center" && "object-center",
                imagePosition === "top" && "object-top",
                imagePosition === "bottom" && "object-bottom"
              )}
              loading="lazy"
            />
          </picture>
        )}
        {/* Gritty overlay texture */}
        <div className="absolute inset-0 bg-black/5 mix-blend-overlay pointer-events-none" />
      </div>

      {/* 2. Interactive Pixel Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-10 cursor-none pointer-events-auto"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* 3. Typography Content Overlay (Left-aligned editorial layout) */}
      <div 
        className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 flex flex-col justify-center items-start text-left pointer-events-none select-none h-full"
        style={{ opacity: 1 - scrollProgress }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-start w-full max-w-2xl"
        >
          {/* Editorial Headline */}
          <h1
            className={cn(
              "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-none filter drop-shadow-sm select-none text-left",
              headlineFont
            )}
            style={{ color: textColor }}
          >
            {headline}
          </h1>

          {/* Minimalist Link Row (Arrow Icon + Small Uppercase Text + Thin Horizontal Line) */}
          <div className="flex items-center gap-4 w-full max-w-md mt-8 justify-start select-none pointer-events-auto">
            <span className="text-[10px] tracking-[0.3em] font-mono whitespace-nowrap flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity" style={{ color: textColor }}>
              → LEARN MORE
            </span>
            <div className="h-[1px] flex-grow opacity-30" style={{ backgroundColor: textColor }} />
          </div>
        </motion.div>
      </div>


    </div>
  );
}
