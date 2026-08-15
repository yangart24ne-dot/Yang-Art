import React, { useState } from "react";
import { Plus } from "lucide-react";
import GalleryCarousel from "../components/GalleryCarousel";
import PageContainer from "../components/PageContainer";
import Product3DViewer from "../components/Product3DViewer";
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
  // LƯU Ý: File SVG đã có opacity="0.2" bên trong, KHÔNG đặt opacity < 1 ở đây vì sẽ nhân đôi độ mờ!
  layer2Left: {
    offsetX: -120,      // ← Dịch ngang (px) 
    offsetY: 1100,     // ← Dịch dọc  (px)   
    scale: 1.52,      // ← Phóng to / thu nhỏ
    opacity: 1.45,    // ← Để 1.0 — SVG đã tự mờ sẵn rồi (opacity="0.2" trong file)
  },

  // Layer 2.svg — Hình trang trí mờ bên PHẢI
  // LƯU Ý: File SVG đã có opacity="0.2" bên trong, KHÔNG đặt opacity < 1 ở đây vì sẽ nhân đôi độ mờ!
  layer2Right: {
    offsetX: 100,      // ← Dịch ngang (px)   
    offsetY: 1110,      // ← Dịch dọc  (px)  
    scale: 1.45,      // ← Phóng to / thu nhỏ
    opacity: 1.0,    // ← Để 1.0 — SVG đã tự mờ sẵn rồi (opacity="0.2" trong file)
  },

  // Group 39473.svg — Khung viền xanh lá (Green Box Highlight)
  greenBox: {
    offsetX: 0,      // ← Dịch ngang (px)
    offsetY: 1015,    // ← Dịch dọc  (px) 
    scale: 1.2,      // ← Phóng to / thu nhỏ
  },

  // We transform sustainable materials into design legacies..svg — Chữ typography chính
  weTransformText: {
    offsetX: 0,      // ← Dịch ngang (px)
    offsetY: 1050,    // ← Dịch dọc  (px)
    scale: 1.1,      // ← Phóng to / thu nhỏ
  },

  // ─────────────────────────────────────────────────────────────
  // PROCESS CYCLE SECTION — 4 BƯỚC (HUNT / SHRED / COOK / REBIRTH)
  // ─────────────────────────────────────────────────────────────

  // ── BƯỚC 1: THE HUNT ──
  hunt: {
    circle: { offsetX: 0, offsetY: 0, scale: 1.0 },   // Group 13.svg — Vòng tròn icon
    title: { offsetX: 0, offsetY: 0, scale: 1.0 },   // THE HUNT.svg — Tiêu đề
    desc: { offsetX: 0, offsetY: 0, scale: 1.0 },   // hunt_desc.svg — Mô tả
  },

  // ── BƯỚC 2: THE SHRED ──
  shred: {
    circle: { offsetX: 0, offsetY: 0, scale: 1.0 },   // Group 14.svg — Vòng tròn icon
    title: { offsetX: 0, offsetY: 0, scale: 1.0 },   // THE SHRED.svg — Tiêu đề
    desc: { offsetX: 0, offsetY: 0, scale: 1.0 },   // shred_desc.svg — Mô tả
  },

  // ── BƯỚC 3: THE COOK ──
  cook: {
    circle: { offsetX: 0, offsetY: 0, scale: 1.0 },   // Group 15.svg — Vòng tròn icon
    title: { offsetX: 0, offsetY: 0, scale: 1.0 },   // THE COOK.svg — Tiêu đề
    desc: { offsetX: 0, offsetY: 0, scale: 1.0 },   // cook_desc.svg — Mô tả
  },

  // ── BƯỚC 4: THE REBIRTH ──
  rebirth: {
    circle: { offsetX: 0, offsetY: 0, scale: 1.0 },   // Group 16.svg — Vòng tròn icon
    title: { offsetX: 0, offsetY: 0, scale: 1.0 },   // THE REBIRTH.svg — Tiêu đề
    desc: { offsetX: 0, offsetY: 0, scale: 1.0 },   // rebirth_desc.svg — Mô tả
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
  // - offsetY : Dịch lên xuống (px), số âm lên trên (-), số dương xuống dưới (+)
  //             Dùng margin-top nên KHÔNG đè lên section trước
  // - scale   : Phóng to / thu nhỏ nội dung bên trong (không cắt nền xanh)
  processSection: {
    offsetY: 680,      // ← Dịch lên xuống (px)
    scale: 1.0,      // ← Phóng to / thu nhỏ nội dung 
  },
};

export default function Material() {
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(60); // Tốc độ xoay tự động (deg/s)

  return (
    <div className="pb-12 min-h-screen bg-[#FFFFFF] overflow-hidden">

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. HERO SECTION (Sky/Sand Banner & White Typography Area)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="w-full relative bg-[#FFFFFF] flex flex-col items-center">
        {/* Sub-section A: Full-width Sky/Sand graphic collage — chỉ ảnh nền */}
        <div className="w-full relative overflow-hidden">
          <img
            src={maskGroup}
            alt="Re-Life Lab Sky and Sand Banner"
            className="w-full h-auto min-h-[400px] object-cover"
          />
        </div>

        {/* ══════════════════════════════════════════════════════
            CÁC ASSET OVERLAY — nằm TRÊN CÙNG (zIndex: 9999)
            Thoát khỏi overflow-hidden, không bao giờ bị cắt hay đè
            ══════════════════════════════════════════════════════ */}

        {/* Layer 2-1.svg — bên TRÁI — chỉnh trong MATERIAL_ASSETS_CONFIG.layer2Left */}
        <img
          src={layer2_1}
          alt=""
          className="absolute left-[-2%] md:left-[8%] top-1/2 pointer-events-none select-none"
          style={{
            opacity: MATERIAL_ASSETS_CONFIG.layer2Left.opacity,
            transform: `translate(${MATERIAL_ASSETS_CONFIG.layer2Left.offsetX}px, calc(-50% + ${MATERIAL_ASSETS_CONFIG.layer2Left.offsetY}px)) scale(${MATERIAL_ASSETS_CONFIG.layer2Left.scale})`,
            width: `${220 * MATERIAL_ASSETS_CONFIG.layer2Left.scale}px`,
            zIndex: 9999,
          }}
        />

        {/* Layer 2.svg — bên PHẢI — chỉnh trong MATERIAL_ASSETS_CONFIG.layer2Right */}
        <img
          src={layer2}
          alt=""
          className="absolute right-[-2%] md:right-[8%] top-1/2 pointer-events-none select-none"
          style={{
            opacity: MATERIAL_ASSETS_CONFIG.layer2Right.opacity,
            transform: `translate(${MATERIAL_ASSETS_CONFIG.layer2Right.offsetX}px, calc(-50% + ${MATERIAL_ASSETS_CONFIG.layer2Right.offsetY}px)) scale(${MATERIAL_ASSETS_CONFIG.layer2Right.scale})`,
            width: `${220 * MATERIAL_ASSETS_CONFIG.layer2Right.scale}px`,
            zIndex: 9999,
          }}
        />

        {/* Centered Typography layout — Group 39473 + We transform text */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ zIndex: 9999 }}
        >
          <div className="relative w-full max-w-[688px] mx-auto px-4" style={{ aspectRatio: '688/286' }}>
            {/* Group 39473.svg — Khung viền xanh — chỉnh trong MATERIAL_ASSETS_CONFIG.greenBox */}
            <img
              src={group39473}
              alt=""
              className="absolute left-1/2 top-[12.24%] w-[108.72%] h-[54.54%] object-contain"
              style={{
                transform: `translate(calc(-50% + ${MATERIAL_ASSETS_CONFIG.greenBox.offsetX}px), ${MATERIAL_ASSETS_CONFIG.greenBox.offsetY}px) scale(${MATERIAL_ASSETS_CONFIG.greenBox.scale})`,
                transformOrigin: 'center top',
              }}
            />
            {/* We transform...svg — Chữ chính — chỉnh trong MATERIAL_ASSETS_CONFIG.weTransformText */}
            <img
              src={weTransformText}
              alt="We transform sustainable materials into design legacies"
              className="absolute inset-0 w-full h-full object-contain"
              style={{
                transform: `translate(${MATERIAL_ASSETS_CONFIG.weTransformText.offsetX}px, ${MATERIAL_ASSETS_CONFIG.weTransformText.offsetY}px) scale(${MATERIAL_ASSETS_CONFIG.weTransformText.scale})`,
                transformOrigin: 'center center',
              }}
            />
          </div>
        </div>


      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. PROCESS CYCLE SECTION (Solid Blue Background & 4-Step Loop)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        className="w-full bg-[#0020D7] relative overflow-visible flex flex-col items-center"
        style={{ marginTop: `${MATERIAL_ASSETS_CONFIG.processSection.offsetY}px` }}
      >
        {/* Nội dung bên trong — scale được nhưng nền xanh vẫn fill đầy */}
        <div
          className="w-full py-20 px-6 md:px-8 flex flex-col items-center"
          style={{
            transform: `scale(${MATERIAL_ASSETS_CONFIG.processSection.scale})`,
            transformOrigin: 'top center',
          }}
        >
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
          </div> {/* ← Đóng inner scale wrapper (processSection.scale) */}
        </div> {/* ← Đóng outer blue section (processSection.offsetY) */}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          3. 3D MODEL VISUALIZER SECTION (Pushed down from top)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
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
                    This interactive 3D model represents a recycled plastic bottle archetype (`chai1.glb`), processed through our circular fabrication modules. Optimized for high-definition 3D rendering.
                  </p>

                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center p-3.5 bg-gray-50 border-2 border-black rounded-2xl">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Base Material</span>
                      <span className="text-[9px] font-black text-black uppercase font-mono bg-[#A7F417] px-2.5 py-0.5 rounded-full border border-black">rPET / rHDPE</span>
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

      </div> {/* ← Đóng outer blue section (processSection.offsetY) */}

      {/* 4. GALLERY CAROUSEL */}
      <div className="relative mb-24 w-full overflow-hidden">
        <GalleryCarousel />
      </div>

    </div>
  );
}
