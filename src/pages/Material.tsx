import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import PageContainer from "../components/PageContainer";
import Product3DViewer from "../components/Product3DViewer";
import Spiral3DSlider from "../components/Spiral3DSlider";
import chai1Model from "../assets/PLASTIC 3D/chai1.glb?url";

import group39473 from "../assets/infor material/Group 39473.svg";
import weTransformText from "../assets/infor material/We transform sustainable materials into design legacies..svg";

// Hero Section Assets
import maskGroup from "../assets/infor material/Mask group.png";
import layer2 from "../assets/infor material/Layer 2.svg";
import layer2_1 from "../assets/infor material/Layer 2-1.svg";
import image245 from "../assets/infor material/image 245.svg";

// Process Steps Assets (Circles)
import group13 from "../assets/infor material/Group 13.svg";
import group14 from "../assets/infor material/Group 14.svg";
import group15 from "../assets/infor material/Group 15.svg";
import group16 from "../assets/infor material/Group 16.svg";

// Process Titles SVGs
import theHuntTitle from "../assets/infor material/THE HUNT.svg";
import theShredTitle from "../assets/infor material/THE SHRED.svg";
import theCookTitle from "../assets/infor material/THE COOK.svg";
import theRebirthTitle from "../assets/infor material/THE REBIRTH.svg";

// Process Descriptions SVGs (Normalized filenames)
import theHuntDesc from "../assets/infor material/hunt_desc.svg";
import theShredDesc from "../assets/infor material/shred_desc.svg";
import theCookDesc from "../assets/infor material/cook_desc.svg";
import theRebirthDesc from "../assets/infor material/rebirth_desc.svg";

// Background diagram image
import group39472 from "../assets/infor material/Group 39472.png";
import customFooterImg from "../assets/infor material/footer.png";
import lotNenImg from "../assets/infor material/lót nền.png";
import beFirstSvg from "../assets/infor material/BE THE FIRST TO KNOW.svg";
import logoNameFooterSvg from "../assets/infor material/logonamefooter.svg";
import followUsSvg from "../assets/infor material/Group 39477.svg";
import contactUsSvg from "../assets/infor material/Group 39478.svg";
import privacyTextSvg from "../assets/infor material/RE-LIFE Lab respects your privacy as much as we respect the planet. No spam, no selling your data - your secrets are safe in our vault. Drop your email to unlock exclusive lab drops, early collection access, and on-chain events..svg";

/**
 * ============================================================================
 * CẤU HÌNH VỊ TRÍ VÀ KÍCH THƯỚC CÁC ASSET TRONG SECTION TYPOGRAPHY (SUB-B)
 * ============================================================================
 *
 * - offsetX : Dịch ngang (px) — số dương sang phải (+), số âm sang trái (-)
 * - offsetY : Dịch dọc  (px) — số dương xuống dưới (+), số âm lên trên (-)
 * - scale   : Phóng to / thu nhỏ (1.0 = 100%, 1.2 = 120%, 0.8 = 80%)
 * - opacity : Độ trong suốt (0.0 = ẩn hoàn toàn, 1.0 = đục hoàn toàn)
 * ============================================================================
 */
export const MATERIAL_ASSETS_CONFIG = {
  // Layer 2-1.svg — Hình trang trí mờ bên TRÁI
  layer2Left: {
    offsetX: 0,         // ← Dịch ngang (px): số âm (-) sang trái, số dương (+) sang phải
    offsetY: 0,         // ← DỊCH VỊ TRÍ LÊN / XUỐNG (px): Số âm (-) lên trên, số dương (+) xuống dưới
    scale: 1.5,         // ← Phóng to / thu nhỏ
    opacity: 0.8,       // ← Độ trong suốt 
  },

  // Layer 2.svg — Hình trang trí mờ bên PHẢI
  layer2Right: {
    offsetX: 0,         // ← Dịch ngang (px): số âm (-) sang trái, số dương (+) sang phải
    offsetY: 0,         // ← DỊCH VỊ TRÍ LÊN / XUỐNG (px): Số âm (-) lên trên, số dương (+) xuống dưới
    scale: 1.5,         // ← Phóng to / thu nhỏ
    opacity: 0.8,       // ← Độ trong suốt
  },

  // 🏃 BĂNG RÔN CHỮ VÀ LOGO CHẠY (RUNNING TAPE TICKER OVERLAY)
  runningTape: {
    offsetY: 0,        // ← Dịch dọc LÊN / XUỐNG (px): 0 = trùng tuyệt đối với vị trí gốc
    rotation: 0,       // ← Độ nghiêng uốn lượn
    speed: 18,         // ← Tốc độ chạy (giây): số nhỏ hơn chạy nhanh hơn
    scale: 1.0,        // ← Phóng to / thu nhỏ
    opacity: 1.0,      // ← Độ trong suốt
  },

  // 🌟 CỤM TYPOGRAPHY CHÍNH (Dịch chuyển / phóng to THỜI ĐIỂM TỔNG CẢ CỤM CHỮ VÀ KHUNG XANH)
  heroTypographyGroup: {
    offsetX: 0,        // ← Dịch ngang CẢ CỤM (px): số âm (-) sang trái, số dương (+) sang phải
    offsetY: 0,        // ← Dịch dọc LÊN / XUỐNG CẢ CỤM (px): số âm (-) dịch LÊN TRÊN, số dương (+) dịch XUỐNG DƯỚI
    scale: 1.0,        // ← Phóng to / thu nhỏ TỔNG THỂ CẢ CỤM (1.0 = 100%, 1.2 = 120%, 0.8 = 80%)
  },

  // Group 39473.svg — Khung viền xanh lá (Green Box Highlight)
  greenBox: {
    offsetX: 0,        // ← Dịch ngang chi tiết (px)
    offsetY: -24,        // ← Dịch dọc chi tiết (px)  
    scale: 1.2,        // ← Phóng to / thu nhỏ chi tiết 
  },

  // We transform sustainable materials into design legacies..svg — Chữ typography chính
  weTransformText: {
    offsetX: 0,        // ← Dịch ngang chi tiết (px)
    offsetY: 0,        // ← Dịch dọc chi tiết (px)
    scale: 1.0,        // ← Phóng to / thu nhỏ chi tiết
  },

  // ─────────────────────────────────────────────────────────────
  // PROCESS CYCLE SECTION — 4 BƯỚC (HUNT / SHRED / COOK / REBIRTH)
  // ─────────────────────────────────────────────────────────────

  // ── BƯỚC 1: THE HUNT ──
  hunt: {
    circle: { offsetX: 0, offsetY: 0, scale: 1.0 },   // Group 13.svg — Vòng tròn icon
    title: { offsetX: 0, offsetY: 0, scale: 1.0 },    // THE HUNT.svg — Tiêu đề
    desc: { offsetX: 0, offsetY: 0, scale: 1.0 },     // hunt_desc.svg — Mô tả
  },

  // ── BƯỚC 2: THE SHRED ──
  shred: {
    circle: { offsetX: 0, offsetY: 0, scale: 1.0 },   // Group 14.svg — Vòng tròn icon
    title: { offsetX: 0, offsetY: 0, scale: 1.0 },    // THE SHRED.svg — Tiêu đề
    desc: { offsetX: 0, offsetY: 0, scale: 1.0 },     // shred_desc.svg — Mô tả
  },

  // ── BƯỚC 3: THE COOK ──
  cook: {
    circle: { offsetX: 0, offsetY: 0, scale: 1.0 },   // Group 15.svg — Vòng tròn icon
    title: { offsetX: 0, offsetY: 0, scale: 1.0 },    // THE COOK.svg — Tiêu đề
    desc: { offsetX: 0, offsetY: 0, scale: 1.0 },     // cook_desc.svg — Mô tả
  },

  // ── BƯỚC 4: THE REBIRTH ──
  rebirth: {
    circle: { offsetX: 0, offsetY: 0, scale: 1.0 },   // Group 16.svg — Vòng tròn icon
    title: { offsetX: 0, offsetY: 0, scale: 1.0 },    // THE REBIRTH.svg — Tiêu đề
    desc: { offsetX: 0, offsetY: 0, scale: 1.0 },     // rebirth_desc.svg — Mô tả
  },

  // ── Group 39472.png — Ảnh sơ đồ vòng lặp nền ──
  group39472: {
    offsetX: 0,      // ← Dịch ngang (px)
    offsetY: 0,      // ← Dịch dọc  (px) 
    scale: 1.0,      // ← Phóng to / thu nhỏ
    opacity: 1.0,    // ← Độ trong suốt (0.0 – 1.0)
  },

  // ── Ảnh phụ / Icon phụ ──
  image244: { offsetX: 0, offsetY: 0, scale: 1.0 },          // image 244.svg
  image245ornament: { offsetX: 0, offsetY: 0, scale: 1.0 },   // image 245.svg — keychain ornament

  // ────────────────────────────────────────────────────────────
  // KHUNG XANH DƯƠNG ĐẶC (Đoạn 2 — FABRICATION PROCESS)
  // ────────────────────────────────────────────────────────────
  // - offsetY       : Dịch chuyển CẢ KHUNG XANH LÊN / XUỐNG (px)
  //                   👉 Số âm (-) kéo khung xanh LÊN TRÊN (áp sát phần chữ trên)
  //                   👉 Số dương (+) đẩy khung xanh XUỐNG DƯỚI
  // - paddingTop    : Khoảng cách từ mép trên khung xanh đến chữ FABRICATION PROCESS (px)
  // - paddingBottom : Khoảng cách từ các vòng tròn đến mép dưới đáy khung xanh (px)
  // - scale         : Co giãn / phóng to khung xanh
  processSection: {
    offsetY: 300,          // ← DỊCH VỊ TRÍ KHUNG XANH LÊN / XUỐNG (px): ví dụ -50, -100, 0, 50
    paddingTop: 100,      // ← Độ dày khoảng đệm phía TRÊN mép khung xanh (px)
    paddingBottom: 80,   // ← Độ dày khoảng đệm phía DƯỚI đáy khung xanh (px)
    scale: 1.0,          // ← Phóng to / thu nhỏ khung xanh (1.0 = 100%)
  },

  // ────────────────────────────────────────────────────────────
  // SPIRAL 3D SLIDER SECTION (VORTEX 3D MATERIAL GALLERY)
  // ────────────────────────────────────────────────────────────
  spiralSection: {
    offsetX: 0,        // ← Dịch ngang (px)
    offsetY: 0,        // ← Dịch dọc LÊN / XUỐNG (px): số âm (-) LÊN TRÊN, số dương (+) XUỐNG DƯỚI
    scale: 1.0,        // ← Phóng to / thu nhỏ
  },

  // ────────────────────────────────────────────────────────────
  // 3D MODEL VISUALIZER SECTION ([ 3D_PRODUCT_VISUALIZER ] & RECYCLED_BOTTLE)
  // ────────────────────────────────────────────────────────────
  visualizerSection: {
    offsetX: 0,        // ← Dịch ngang (px)
    offsetY: 0,        // ← Dịch dọc LÊN / XUỐNG (px): số âm (-) LÊN TRÊN, số dương (+) XUỐNG DƯỚI
    scale: 1.0,        // ← Phóng to / thu nhỏ
  },

  footer: {
    lotNen: {
      offsetX: 0,        // ← Dịch ngang lót nền (px)
      offsetY: 0,        // ← Dịch DỌC LÊN / XUỐNG lót nền (px) — số âm (-) lên, số dương (+) xuống
      scale: 1.0,        // ← Tỉ lệ phóng to/thu nhỏ lót nền
    },
    background: {
      offsetX: 0,        // ← Dịch ngang footer.png (px)
      offsetY: 0,        // ← Dịch dọc footer.png (px)
      scale: 1.0,        // ← Tỉ lệ phóng to/thu nhỏ footer.png
    },
    beFirst: {
      left: 34.27,       // ← Vị trí phần trăm từ lề trái (%)
      top: 64.9,         // ← Vị trí phần trăm từ lề trên (%)
      scale: 1.0,        // ← Tỷ lệ co giãn
      width: 31.45,      // ← Chiều rộng phần trăm (%)
    },
    emailForm: {
      left: 28.68,
      top: 68.6,
      scale: 1.0,
      width: 42.64,
    },
    privacy: {
      left: 29.86,
      top: 74.93,
      scale: 1.0,
      width: 40.27,
    },
    logo: {
      left: 8.54,
      top: 84.85,
      scale: 1.0,
      width: 29.3,
    },
    followUs: {
      left: 64.3,
      top: 89.97,
      scale: 1.0,
      width: 6.6,
    },
    contactUs: {
      left: 74.5,
      top: 89.97,
      scale: 1.0,
      width: 17.36,
    },
  },
};

const EmailSubscribeForm = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you for subscribing! Registered: ${email}`);
    setEmail("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full flex items-center bg-white rounded-[41px] relative select-none border border-neutral-200/20 overflow-hidden"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="EMAIL ADDRESS"
        className="w-[67.5%] h-full pl-6 pr-2 bg-transparent text-black font-mono text-[8px] sm:text-[10px] md:text-[12px] outline-none border-none placeholder-neutral-400 font-bold rounded-l-[41px]"
        style={{
          WebkitBoxShadow: "0 0 0 100px white inset",
        }}
        required
      />
      <button
        type="submit"
        className="w-[32.5%] h-full bg-[#FF0087] text-white font-mono font-black text-[8px] sm:text-[10px] md:text-[12px] tracking-widest uppercase cursor-pointer hover:bg-[#d6006e] transition-colors flex items-center justify-center rounded-[30px_41px_41px_30px]"
      >
        JOIN NOW !!!
      </button>
    </form>
  );
};

const TypewriterSustainableText = () => {
  const [typedCount, setTypedCount] = useState(0); // 0 to 21 characters ("sustainable materials")
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const TOTAL_CHARS = 21;

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isPaused) {
      // Pause 2.5s when fully typed, 0.6s when empty
      timeout = setTimeout(() => {
        setIsPaused(false);
        if (typedCount === TOTAL_CHARS) {
          setIsDeleting(true);
        } else if (typedCount === 0) {
          setIsDeleting(false);
        }
      }, typedCount === TOTAL_CHARS ? 2500 : 600);
      return () => clearTimeout(timeout);
    }

    if (!isDeleting) {
      // Typing mode — realistic keyboard keypress (~90-140ms per letter)
      if (typedCount < TOTAL_CHARS) {
        const delay = 90 + Math.random() * 50;
        timeout = setTimeout(() => {
          setTypedCount((prev) => prev + 1);
        }, delay);
      } else {
        setIsPaused(true);
      }
    } else {
      // Deleting mode — fast backspacing (~40ms per letter)
      if (typedCount > 0) {
        timeout = setTimeout(() => {
          setTypedCount((prev) => prev - 1);
        }, 40);
      } else {
        setIsPaused(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [typedCount, isDeleting, isPaused]);

  // Exact horizontal bounds of "sustainable materials" in the SVG (2.3% to 99.9%)
  const startPct = 2.3;
  const totalSpan = 97.6;
  const currentPct = startPct + (typedCount / TOTAL_CHARS) * totalSpan;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Layer 1: Static rows 1, 3, 4 (Mask out row 2) */}
      <img
        src={weTransformText}
        alt="We transform sustainable materials into design legacies"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        style={{
          clipPath: "polygon(0% 0%, 100% 0%, 100% 25%, 0% 25%, 0% 45%, 100% 45%, 100% 100%, 0% 100%)",
        }}
      />

      {/* Layer 2: Revealed text layer clipped character-by-character for row 2 */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 ${Math.max(0, 100 - currentPct).toFixed(2)}% 0 0)`,
        }}
      >
        <img
          src={weTransformText}
          alt=""
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{
            clipPath: "polygon(0% 25%, 100% 25%, 100% 45%, 0% 45%)",
          }}
        />
      </div>

      {/* Typewriter Cursor Bar | */}
      <div
        className="absolute top-[26.5%] h-[18.5%] w-[3.5px] bg-[#FF0087] rounded-full shadow-[0_0_10px_#FF0087] transition-all duration-75"
        style={{
          left: `${currentPct.toFixed(2)}%`,
        }}
      >
        {/* Blinking cursor effect when paused */}
        {isPaused && (
          <motion.div
            className="w-full h-full bg-[#FF0087] rounded-full shadow-[0_0_12px_#FF0087]"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>
    </div>
  );
};

export default function Material() {
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(60); // Tốc độ xoay tự động (deg/s)

  return (
    <div className="min-h-screen bg-[#FFFFFF] overflow-hidden">

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. HERO SECTION (Sky/Sand Banner & White Typography Area)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="w-full relative bg-[#FFFFFF] flex flex-col items-center">
        {/* Sub-section A: Full-width Sky/Sand graphic collage — ảnh nền */}
        <div className="w-full relative overflow-hidden">
          <img
            src={maskGroup}
            alt="Re-Life Lab Sky and Sand Banner"
            className="w-full h-auto min-h-[400px] object-cover"
          />
        </div>

        {/* Sub-section B: Hero Typography Area on Clean White Background */}
        <div className="w-full relative bg-[#FFFFFF] py-20 md:py-28 flex items-center justify-center overflow-hidden">
          {/* Layer 2-1.svg — bên TRÁI — chỉnh trong MATERIAL_ASSETS_CONFIG.layer2Left */}
          <div
            className="absolute left-[-2%] md:left-[6%] top-1/2 pointer-events-none select-none"
            style={{
              opacity: MATERIAL_ASSETS_CONFIG.layer2Left.opacity,
              transform: `translate(${MATERIAL_ASSETS_CONFIG.layer2Left.offsetX}px, calc(-50% + ${MATERIAL_ASSETS_CONFIG.layer2Left.offsetY}px)) scale(${MATERIAL_ASSETS_CONFIG.layer2Left.scale})`,
              zIndex: 10,
            }}
          >
            <motion.img
              src={layer2_1}
              alt=""
              animate={{
                y: [0, -16, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                width: `${220 * MATERIAL_ASSETS_CONFIG.layer2Left.scale}px`,
                willChange: "transform",
                transform: "translate3d(0, 0, 0)",
              }}
            />
          </div>

          {/* Layer 2.svg — bên PHẢI — chỉnh trong MATERIAL_ASSETS_CONFIG.layer2Right */}
          <div
            className="absolute right-[-2%] md:right-[6%] top-1/2 pointer-events-none select-none"
            style={{
              opacity: MATERIAL_ASSETS_CONFIG.layer2Right.opacity,
              transform: `translate(${MATERIAL_ASSETS_CONFIG.layer2Right.offsetX}px, calc(-50% + ${MATERIAL_ASSETS_CONFIG.layer2Right.offsetY}px)) scale(${MATERIAL_ASSETS_CONFIG.layer2Right.scale})`,
              zIndex: 10,
            }}
          >
            <motion.img
              src={layer2}
              alt=""
              animate={{
                y: [0, 16, 0],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                width: `${220 * MATERIAL_ASSETS_CONFIG.layer2Right.scale}px`,
                willChange: "transform",
                transform: "translate3d(0, 0, 0)",
              }}
            />
          </div>

          {/* Centered Typography layout — Group 39473 + We transform text */}
          <div
            className="relative w-full max-w-[688px] mx-auto px-4 z-20"
            style={{
              aspectRatio: '688/286',
              transform: `translate(${MATERIAL_ASSETS_CONFIG.heroTypographyGroup.offsetX}px, ${MATERIAL_ASSETS_CONFIG.heroTypographyGroup.offsetY}px) scale(${MATERIAL_ASSETS_CONFIG.heroTypographyGroup.scale})`,
              transformOrigin: 'center center',
            }}
          >
            {/* Group 39473.svg — Khung viền xanh — chỉnh trong MATERIAL_ASSETS_CONFIG.greenBox */}
            <img
              src={group39473}
              alt=""
              className="absolute left-1/2 top-[12.24%] w-[108.72%] h-[54.54%] object-contain pointer-events-none select-none"
              style={{
                transform: `translate(calc(-50% + ${MATERIAL_ASSETS_CONFIG.greenBox.offsetX}px), ${MATERIAL_ASSETS_CONFIG.greenBox.offsetY}px) scale(${MATERIAL_ASSETS_CONFIG.greenBox.scale})`,
                transformOrigin: 'center top',
              }}
            />
            {/* We transform...svg — Chữ chính với hiệu ứng đánh chữ typewriter ở dòng 'sustainable materials' */}
            <div
              className="absolute inset-0 w-full h-full pointer-events-none select-none"
              style={{
                transform: `translate(${MATERIAL_ASSETS_CONFIG.weTransformText.offsetX}px, ${MATERIAL_ASSETS_CONFIG.weTransformText.offsetY}px) scale(${MATERIAL_ASSETS_CONFIG.weTransformText.scale})`,
                transformOrigin: 'center center',
              }}
            >
              {/* Layer 1: Chữ tĩnh các dòng 1, 3, 4 (Mask che dòng 2) */}
              <img
                src={weTransformText}
                alt="We transform sustainable materials into design legacies"
                className="absolute inset-0 w-full h-full object-contain"
                style={{
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 25%, 0% 25%, 0% 45%, 100% 45%, 100% 100%, 0% 100%)',
                }}
              />

              {/* Layer 2: Dòng 2 'sustainable materials' với hiệu ứng gõ từng chữ typewriter chân thực */}
              <TypewriterSustainableText />
            </div>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. PROCESS CYCLE SECTION (Solid Blue Background & 4-Step Loop)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        className="w-full relative overflow-visible flex flex-col items-center bg-[#0020D7]"
        style={{
          marginTop: `${MATERIAL_ASSETS_CONFIG.processSection.offsetY}px`,
          paddingTop: `${MATERIAL_ASSETS_CONFIG.processSection.paddingTop}px`,
          paddingBottom: `${MATERIAL_ASSETS_CONFIG.processSection.paddingBottom}px`,
          transform: `scale(${MATERIAL_ASSETS_CONFIG.processSection.scale})`,
          transformOrigin: 'top center',
        }}
      >
        {/* Nội dung bên trong */}
        <div className="w-full relative z-10 py-20 px-6 md:px-8 flex flex-col items-center">
          {/* Circular Layout Header */}
          <div className="text-center mb-20 relative z-10">
            <div className="flex items-center justify-center gap-2 font-mono text-xs text-[#A7F417] mb-2 uppercase tracking-widest font-bold">
              <Plus size={14} className="text-[#A7F417]" />
              <span>HOW_WE_CIRCULATE // fabrication_cycle</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl text-[#A7F417] uppercase tracking-tight font-black leading-none">
              Fabrication Process
            </h2>
          </div>

          {/* Desktop Circular Diagram (visible on large screen) */}
          <div className="hidden lg:block w-full max-w-[960px] h-[650px] relative mx-auto my-8">
            {/* Group 39472.png — Ảnh sơ đồ nền — chỉnh trong MATERIAL_ASSETS_CONFIG.group39472 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <img
                src={group39472}
                alt=""
                className="w-full h-full object-contain"
                style={{
                  opacity: MATERIAL_ASSETS_CONFIG.group39472.opacity,
                  transform: `translate(${MATERIAL_ASSETS_CONFIG.group39472.offsetX}px, ${MATERIAL_ASSETS_CONFIG.group39472.offsetY}px) scale(${MATERIAL_ASSETS_CONFIG.group39472.scale})`,
                }}
              />
            </div>

            {/* BƯỚC 1: THE HUNT — chỉnh trong MATERIAL_ASSETS_CONFIG.hunt */}
            <div className="absolute left-[-2%] top-[18%] w-[260px] text-center flex flex-col items-center group">
              <div className="relative mb-4" style={{ transform: `translate(${MATERIAL_ASSETS_CONFIG.hunt.circle.offsetX}px, ${MATERIAL_ASSETS_CONFIG.hunt.circle.offsetY}px) scale(${MATERIAL_ASSETS_CONFIG.hunt.circle.scale})`, transformOrigin: 'center' }}>
                <div className="absolute inset-0 bg-[#A7F417] rounded-full scale-95 opacity-0 group-hover:opacity-20 group-hover:scale-105 transition-all duration-300 blur-md"></div>
                <img src={group13} alt="THE HUNT Step" className="w-[180px] h-auto mx-auto relative z-10 transition-transform duration-500 group-hover:scale-105" />
              </div>
              <img src={theHuntTitle} alt="THE HUNT" className="h-6 object-contain mx-auto mb-2.5"
                style={{ transform: `translate(${MATERIAL_ASSETS_CONFIG.hunt.title.offsetX}px, ${MATERIAL_ASSETS_CONFIG.hunt.title.offsetY}px) scale(${MATERIAL_ASSETS_CONFIG.hunt.title.scale})` }} />
              <img src={theHuntDesc} alt="Hunt description" className="h-9 object-contain mx-auto filter brightness-0 invert"
                style={{ transform: `translate(${MATERIAL_ASSETS_CONFIG.hunt.desc.offsetX}px, ${MATERIAL_ASSETS_CONFIG.hunt.desc.offsetY}px) scale(${MATERIAL_ASSETS_CONFIG.hunt.desc.scale})` }} />
            </div>

            {/* BƯỚC 2: THE SHRED — chỉnh trong MATERIAL_ASSETS_CONFIG.shred */}
            <div className="absolute left-[36%] top-[-8%] w-[260px] text-center flex flex-col items-center group">
              <div className="relative mb-4" style={{ transform: `translate(${MATERIAL_ASSETS_CONFIG.shred.circle.offsetX}px, ${MATERIAL_ASSETS_CONFIG.shred.circle.offsetY}px) scale(${MATERIAL_ASSETS_CONFIG.shred.circle.scale})`, transformOrigin: 'center' }}>
                <div className="absolute inset-0 bg-[#A7F417] rounded-full scale-95 opacity-0 group-hover:opacity-20 group-hover:scale-105 transition-all duration-300 blur-md"></div>
                <img src={group14} alt="THE SHRED Step" className="w-[180px] h-auto mx-auto relative z-10 transition-transform duration-500 group-hover:scale-105" />
              </div>
              <img src={theShredTitle} alt="THE SHRED" className="h-6 object-contain mx-auto mb-2.5"
                style={{ transform: `translate(${MATERIAL_ASSETS_CONFIG.shred.title.offsetX}px, ${MATERIAL_ASSETS_CONFIG.shred.title.offsetY}px) scale(${MATERIAL_ASSETS_CONFIG.shred.title.scale})` }} />
              <img src={theShredDesc} alt="Shred description" className="h-9 object-contain mx-auto filter brightness-0 invert"
                style={{ transform: `translate(${MATERIAL_ASSETS_CONFIG.shred.desc.offsetX}px, ${MATERIAL_ASSETS_CONFIG.shred.desc.offsetY}px) scale(${MATERIAL_ASSETS_CONFIG.shred.desc.scale})` }} />
            </div>

            {/* BƯỚC 3: THE COOK — chỉnh trong MATERIAL_ASSETS_CONFIG.cook */}
            <div className="absolute right-[-2%] top-[18%] w-[260px] text-center flex flex-col items-center group">
              <div className="relative mb-4" style={{ transform: `translate(${MATERIAL_ASSETS_CONFIG.cook.circle.offsetX}px, ${MATERIAL_ASSETS_CONFIG.cook.circle.offsetY}px) scale(${MATERIAL_ASSETS_CONFIG.cook.circle.scale})`, transformOrigin: 'center' }}>
                <div className="absolute inset-0 bg-[#A7F417] rounded-full scale-95 opacity-0 group-hover:opacity-20 group-hover:scale-105 transition-all duration-300 blur-md"></div>
                <img src={group15} alt="THE COOK Step" className="w-[180px] h-auto mx-auto relative z-10 transition-transform duration-500 group-hover:scale-105" />
              </div>
              <img src={theCookTitle} alt="THE COOK" className="h-6 object-contain mx-auto mb-2.5"
                style={{ transform: `translate(${MATERIAL_ASSETS_CONFIG.cook.title.offsetX}px, ${MATERIAL_ASSETS_CONFIG.cook.title.offsetY}px) scale(${MATERIAL_ASSETS_CONFIG.cook.title.scale})` }} />
              <img src={theCookDesc} alt="Cook description" className="h-9 object-contain mx-auto filter brightness-0 invert"
                style={{ transform: `translate(${MATERIAL_ASSETS_CONFIG.cook.desc.offsetX}px, ${MATERIAL_ASSETS_CONFIG.cook.desc.offsetY}px) scale(${MATERIAL_ASSETS_CONFIG.cook.desc.scale})` }} />
            </div>

            {/* BƯỚC 4: THE REBIRTH — chỉnh trong MATERIAL_ASSETS_CONFIG.rebirth */}
            <div className="absolute left-[38%] bottom-[-5%] w-[230px] text-center flex flex-col items-center group">
              <div className="relative mb-4" style={{ transform: `translate(${MATERIAL_ASSETS_CONFIG.rebirth.circle.offsetX}px, ${MATERIAL_ASSETS_CONFIG.rebirth.circle.offsetY}px) scale(${MATERIAL_ASSETS_CONFIG.rebirth.circle.scale})`, transformOrigin: 'center' }}>
                <div className="absolute inset-0 bg-[#A7F417] rounded-full scale-95 opacity-0 group-hover:opacity-20 group-hover:scale-105 transition-all duration-300 blur-md"></div>
                <img src={group16} alt="THE REBIRTH Step" className="w-[160px] h-auto mx-auto relative z-10 transition-transform duration-500 group-hover:scale-105" />
              </div>
              <img src={theRebirthTitle} alt="THE REBIRTH" className="h-6 object-contain mx-auto mb-2.5"
                style={{ transform: `translate(${MATERIAL_ASSETS_CONFIG.rebirth.title.offsetX}px, ${MATERIAL_ASSETS_CONFIG.rebirth.title.offsetY}px) scale(${MATERIAL_ASSETS_CONFIG.rebirth.title.scale})` }} />
              <img src={theRebirthDesc} alt="Rebirth description" className="h-9 object-contain mx-auto filter brightness-0 invert"
                style={{ transform: `translate(${MATERIAL_ASSETS_CONFIG.rebirth.desc.offsetX}px, ${MATERIAL_ASSETS_CONFIG.rebirth.desc.offsetY}px) scale(${MATERIAL_ASSETS_CONFIG.rebirth.desc.scale})` }} />
            </div>
          </div>

          {/* Mobile Grid Layout (< lg screens) */}
          <div className="lg:hidden w-full max-w-md flex flex-col gap-16 mt-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <img src={group13} alt="THE HUNT Step" className="w-[180px] h-auto mb-4 transition-transform duration-300 group-hover:scale-105" />
              <img src={theHuntTitle} alt="THE HUNT" className="h-6 object-contain mb-2 mx-auto" />
              <img src={theHuntDesc} alt="Hunt description" className="h-8 object-contain mx-auto filter brightness-0 invert" />
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <img src={group14} alt="THE SHRED Step" className="w-[180px] h-auto mb-4 transition-transform duration-300 group-hover:scale-105" />
              <img src={theShredTitle} alt="THE SHRED" className="h-6 object-contain mb-2 mx-auto" />
              <img src={theShredDesc} alt="Shred description" className="h-8 object-contain mx-auto filter brightness-0 invert" />
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <img src={group15} alt="THE COOK Step" className="w-[180px] h-auto mb-4 transition-transform duration-300 group-hover:scale-105" />
              <img src={theCookTitle} alt="THE COOK" className="h-6 object-contain mb-2 mx-auto" />
              <img src={theCookDesc} alt="Cook description" className="h-8 object-contain mx-auto filter brightness-0 invert" />
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center group">
              <img src={group16} alt="THE REBIRTH Step" className="w-[160px] h-auto mb-4 transition-transform duration-300 group-hover:scale-105" />
              <img src={theRebirthTitle} alt="THE REBIRTH" className="h-6 object-contain mb-2 mx-auto" />
              <img src={theRebirthDesc} alt="Rebirth description" className="h-8 object-contain mx-auto filter brightness-0 invert" />
            </div>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          3. SPIRAL 3D MOTION GALLERY (CINEMATIC MATERIAL VORTEX SLIDER)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        className="w-full relative py-16 sm:py-20 md:py-24 bg-[#000000] text-white flex flex-col items-center border-t-4 border-[#D1FF00] border-b-4 border-[#0020D7] overflow-visible"
        style={{
          transform: `translate(${MATERIAL_ASSETS_CONFIG.spiralSection.offsetX}px, ${MATERIAL_ASSETS_CONFIG.spiralSection.offsetY}px) scale(${MATERIAL_ASSETS_CONFIG.spiralSection.scale})`,
          transformOrigin: 'top center',
        }}
      >
        <PageContainer size="wide" className="bg-transparent px-4 sm:px-6 lg:px-8 overflow-visible">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8 sm:mb-10">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-[#D1FF00] mb-2 uppercase tracking-widest font-bold">
                <Plus size={14} className="text-[#D1FF00]" />
                <span>SPIRAL_3D_MOTION // material_vortex_gallery</span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight font-black text-white leading-none">
                Spiral 3D Slider
              </h2>
            </div>

            <div className="max-w-md text-xs sm:text-sm font-sans text-gray-400 leading-relaxed">
              Quỹ đạo xoắn ốc 3D điện ảnh hiển thị hành trình vật liệu tuần hoàn. Cuộn chuột hoặc kéo thả để tương tác với các thẻ ảnh uốn cong trong không gian đa chiều.
            </div>
          </div>

          {/* Interactive Spiral 3D Slider Canvas Component */}
          <Spiral3DSlider />
        </PageContainer>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          4. 3D MODEL VISUALIZER SECTION ([ 3D_PRODUCT_VISUALIZER ] & RECYCLED_BOTTLE)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        className="w-full"
        style={{
          transform: `translate(${MATERIAL_ASSETS_CONFIG.visualizerSection.offsetX}px, ${MATERIAL_ASSETS_CONFIG.visualizerSection.offsetY}px) scale(${MATERIAL_ASSETS_CONFIG.visualizerSection.scale})`,
          transformOrigin: 'top center',
        }}
      >
        <PageContainer size="wide" className="bg-transparent px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col gap-8 mb-16">
            {/* Header */}
            <div className="w-full">
              <div className="flex items-center gap-2 font-mono text-xs mb-4">
                <Plus size={14} className="text-acid" />
                <span>PORTFOLIO_V.4.0 // 3D_MATERIAL_INVENTORY</span>
              </div>
            </div>

            {/* 3D Model Visualizer Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 3D Viewer Card */}
              <div className="lg:col-span-2 bg-white border-2 border-black rounded-[30px] p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col justify-between h-[600px]">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#A7F417] animate-pulse"></span>
                    <span className="font-mono text-xs font-black uppercase tracking-wider text-gray-500">[ 3D_PRODUCT_VISUALIZER ]</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase text-gray-400 font-mono">Speed:</span>
                      <input
                        type="range"
                        min="10"
                        max="180"
                        step="5"
                        value={rotationSpeed}
                        onChange={(e) => setRotationSpeed(parseInt(e.target.value))}
                        className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0020D7] outline-none"
                      />
                      <span className="text-[9px] font-black text-black font-mono w-8 text-right">{rotationSpeed}°/s</span>
                    </div>
                    <button
                      onClick={() => setAutoRotate(!autoRotate)}
                      className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] ${autoRotate ? 'bg-[#A7F417]' : 'bg-white'}`}
                    >
                      {autoRotate ? "Pause Spin" : "Auto Rotate"}
                    </button>
                  </div>
                </div>

                <div className="flex-1 relative rounded-[20px] overflow-hidden border-2 border-black bg-gradient-to-br from-gray-900 via-gray-800 to-black h-full">
                  <Product3DViewer
                    modelPath={chai1Model}
                    autoRotate={autoRotate}
                    autoRotateSpeed={`${rotationSpeed}deg`}
                    className="h-full w-full"
                  />
                </div>
              </div>

              {/* Info Card */}
              <div className="bg-white border-2 border-black rounded-[30px] p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] flex flex-col justify-between h-[600px]">
                <div>
                  <div className="text-[10px] font-mono font-black text-[#0020D7] uppercase tracking-widest mb-4">
                    [ SPECIFICATIONS_&_DATA ]
                  </div>
                  <h2 className="font-display text-4xl text-black uppercase tracking-tight mb-4 leading-none">
                    RECYCLED_BOTTLE
                  </h2>
                  <p className="text-xs text-gray-500 leading-relaxed font-sans mb-6 uppercase">
                    THIS INTERACTIVE 3D MODEL REPRESENTS A RECYCLED PLASTIC BOTTLE ARCHETYPE (CHAI1.GLB), PROCESSED THROUGH OUR CIRCULAR FABRICATION MODULES. OPTIMIZED FOR HIGH-DEFINITION 3D RENDERING.
                  </p>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3.5 bg-gray-50 border-2 border-black rounded-2xl">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Base Material</span>
                      <span className="text-[10px] font-black text-[#0020D7] bg-[#A7F417] px-2.5 py-1 rounded-full border border-black font-mono">rPET / rHDPE</span>
                    </div>
                    <div className="flex justify-between items-center p-3.5 bg-gray-50 border-2 border-black rounded-2xl">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Density Code</span>
                      <span className="text-[10px] font-black text-black font-mono">0.95 g/cm³</span>
                    </div>
                    <div className="flex justify-between items-center p-3.5 bg-gray-50 border-2 border-black rounded-2xl">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Melting Temp</span>
                      <span className="text-[10px] font-black text-black font-mono">220°C - 250°C</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t-2 border-gray-100 flex flex-col gap-3">
                  <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest font-mono">
                    * Drag mouse/touch to orbit, scroll/pinch to zoom in 3D viewport.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>
    </div>
  );
}
