import React, { useState } from "react";
import { DrawingCanvas } from "../feature_2d3d/components/DrawingCanvas";
import { Viewer3D } from "../feature_2d3d/components/Viewer3D";
import { ModifierToolbar } from "../feature_2d3d/components/ModifierToolbar";
import { RECYCLED_MATERIALS } from "../feature_2d3d/constants/materials";
import { ExtrudeSettings, GeometryStyle, MaterialConfig, StrokeData } from "../feature_2d3d/types";
import PageContainer from "../components/PageContainer";
import { BRAND } from "@/src/lib/brand-colors";
import heroMascotImg from "../assets/mascot active/Asset 87.svg";

export type Material = {
  id: string;
  name: string;
  color: string;
  roughness: number;
  metalness: number;
};

export const MATERIALS: Material[] = [
  { id: "hdpe_blue", name: "HDPE_BLUE", color: BRAND.blue, roughness: 0.8, metalness: 0.0 },
  { id: "petg_pink", name: "PETG_PINK", color: BRAND.pink, roughness: 0.75, metalness: 0.0 },
  { id: "pp_white", name: "PP_WHITE", color: BRAND.white, roughness: 0.85, metalness: 0.0 },
];

/**
 * ============================================================================
 * CẤU HÌNH VỊ TRÍ VÀ KÍCH THƯỚC CHI TIẾT CHO TỪNG ASSET TRONG TRANG WORKSHOP
 * (INDIVIDUAL CONFIGURATION FOR EACH ASSET POSITION & SCALE)
 * 
 * - `offsetX`: Dịch ngang (số dương sang phải (+), số âm sang trái (-) | đơn vị: px)
 * - `offsetY`: Dịch dọc (số dương dịch xuống (+), số âm dịch lên (-) | đơn vị: px)
 * - `scale`: Phóng to / thu nhỏ (ví dụ: 1.0 = 100%, 1.2 = 120%, 0.8 = 80%)
 * ============================================================================
 */
export const WORKSHOP_ASSETS_CONFIG = {
  // --- 🌟 HERO CONTENT ĐẦU TRANG (SELF-DESIGNED HERO - CÁC THÔNG TIN CHỮ MÀU ĐEN) ---
  hero: {
    // 1. Toàn bộ cụm Hero
    container: { offsetX: 0, offsetY: 0, scale: 1.0 },

    // 2. Chữ tiêu đề lớn (đã tách riêng "Self" và "-Designed" để chỉnh vị trí độc lập)
    titleSelf: { offsetX: -380, offsetY: 0, scale: 1.3 },       // Chữ "Self"
    titleDesigned: { offsetX: 240, offsetY: 0, scale: 1.3 },   // Chữ "-Designed"

    // 3. Chữ phụ đề "TURNING WASTE INTO POSSIBILITY." ngay dưới Self-Designed
    subtitleTurningWaste: { offsetX: -380, offsetY: 30, scale: 1.0 },

    // --- CỘT BÊN TRÁI (LEFT COLUMN) ---
    // Khung bao toàn bộ cột bên trái
    leftColumn: { offsetX: 0, offsetY: 0, scale: 1.0 },
    // Dòng chữ số "01" và tỷ lệ "1/2"
    numbers: { offsetX: 0, offsetY: 0, scale: 1.0 },
    // Dòng chữ tiêu đề "FROM PLASTIC TO PURPOSE"
    leftHeading: { offsetX: 0, offsetY: 0, scale: 1.0 },
    // Đoạn chữ mô tả "Every plastic bottle you use..."
    leftParagraph: { offsetX: 0, offsetY: 0, scale: 1.0 },
    // Nút bấm chữ "[ YOUR TURN ]"
    yourTurnButton: { offsetX: 0, offsetY: 0, scale: 1.0 },

    // --- HÌNH ẢNH MASCOT Ở GIỮA (Asset 87.svg) ---
    artistImage: { offsetX: 0, offsetY: 0, scale: 1.0 },

    // --- CỘT BÊN PHẢI (RIGHT COLUMN) ---
    // Khung bao toàn bộ cột bên phải
    rightColumn: { offsetX: 0, offsetY: 0, scale: 1.0 },
    // Dòng chữ tiêu đề "ABOUT RELIFE LAB"
    rightHeading: { offsetX: 0, offsetY: 0, scale: 1.0 },
    // Đoạn chữ mô tả "Relife Lab realizes your experience..."
    rightParagraph: { offsetX: 0, offsetY: 0, scale: 1.0 },
  },

  // --- 2D DRAWING CANVAS ASSETS (KHUNG VẼ 2D) ---
  canvas: {
    // Tiêu đề Bước 1 (Choose Base Shape - Asset 28.svg)
    chooseBaseHeader: { offsetX: -580, offsetY: 0, scale: 2.5 },

    // Tiêu đề Bước 2 (Draw Details - Asset 29.svg)
    drawDetailsHeader: { offsetX: 1060, offsetY: 240, scale: 3.5 },

    // Nút Chế độ Chọn (Select Mode - Asset 36.svg)
    selectModeButton: { offsetX: -125, offsetY: 250, scale: 2.3 },

    // Nút Tô màu (Paint Bucket - Asset 37.svg)
    paintBucketButton: { offsetX: -125, offsetY: 290, scale: 2.3 },

    // Chữ nhãn "Size" (Asset 38.svg)
    sizeLabel: { offsetX: -235, offsetY: 320, scale: 2.4 },

    // Dải màu chọn vẽ
    colorsPalette: { offsetX: -235, offsetY: 330, scale: 2.3 },

    // Nút Thùng rác (Trash Icon - Asset 40.svg)
    trashIcon: { offsetX: -225, offsetY: 370, scale: 1.6 },

    // Nút Hoàn tác (Undo Icon - Asset 41.svg)
    undoIcon: { offsetX: -20, offsetY: 375, scale: 1.8 },

    // Nút Làm lại (Redo Icon - Asset 42.svg)
    redoIcon: { offsetX: 14, offsetY: 375, scale: 1.8 },

    // Linh vật Mascot Yang (Asset 84.svg) ở góc trái dưới thanh công cụ
    mascot: { offsetX: -30, offsetY: 520, scale: 3.9 },

    // Gợi ý chọn hình khi chưa bắt đầu vẽ (Asset 44.svg)
    selectBasePrompt: { offsetX: 0, offsetY: 0, scale: 1.0 },

    // Nút GENERATE 3D màu hồng tràn góc (Asset 47.svg)
    generate3DButton: { offsetX: 50, offsetY: 140, scale: 2.0 },

    // Khung viền vẽ 2D (Asset 46.svg)
    canvasFrame: { offsetX: 120, offsetY: 290, scale: 1.2, aspectRatio: '1.8 / 1.3' },

    // --- CÁC HÌNH NÚT CHỌN HÌNH ĐẾ DƯỚI BƯỚC 1 (BASE PRESETS - Asset 30.svg đến 35.svg) ---
    // Điều chỉnh chung cho toàn bộ các ô vuông chọn hình đế (tịnh tiến, tỷ lệ scale, khoảng cách giữa các ô và hình vẽ bên trong)
    basePresets: {
      offsetX: -107,
      offsetY: 150,
      cardScale: 3.0,
      imageWidth: 80,  // Chiều rộng hình vẽ bên trong ô vuông (đơn vị: px, mặc định 56px)
      imageHeight: 80, // Chiều cao hình vẽ bên trong ô vuông (đơn vị: px, mặc định 56px)
      gap: 285// Khoảng cách giữa các ô vuông (đơn vị: px) để tránh đè lên nhau khi scale to 
    },
  },

  // --- 3D VIEWPORT ASSETS (KHUNG HÌNH 3D) ---
  viewer3d: {
    // Nút xuất file STL (Asset 49.svg)
    stlButton: { offsetX: 0, offsetY: 0, scale: 1.0 },

    // Nút xuất file GLB (Asset 48.svg)
    glbButton: { offsetX: 0, offsetY: 0, scale: 1.0 },

    // Nút bật/tắt khung dây Wireframe (Asset 50.svg)
    wireframeButton: { offsetX: 0, offsetY: 0, scale: 1.0 },

    // Khung viền 3D (Asset 51.svg)
    viewerFrame: { offsetX: -100, offsetY: 320, scale: 1.645, aspectRatio: '1.8 / 1.0' },

    // Khung chữ nhắc chờ dữ liệu (Asset 52.svg)
    waitingPrompt: { offsetX: 0, offsetY: 0, scale: 1.0 },

    // Khung điều khiển màu và độ dày (khung xanh dương)
    slidersCard: { offsetX: 0, offsetY: 540, scale: 1.375 },

    // Khung tùy chỉnh nâng cao (Advanced 3D Tuning - Khung màu nâu/đen nhạt)
    advancedTuningCard: { offsetX: 0, offsetY: 260, scale: 1.375 }
  }
};

interface WorkshopProps {
  onNavigate?: (page: string) => void;
}

export default function Workshop({ onNavigate }: WorkshopProps) {

  const [strokes, setStrokes] = useState<StrokeData[]>([]);
  const [baseShapeId, setBaseShapeId] = useState<string | null>(null);
  const [baseMaterialId, setBaseMaterialId] = useState<string>(RECYCLED_MATERIALS[0].id);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialConfig>(RECYCLED_MATERIALS[0]);
  const [geometryStyle, setGeometryStyle] = useState<GeometryStyle>('smooth');
  const [smoothActive, setSmoothActive] = useState(false);
  const [smoothRadius, setSmoothRadius] = useState(20);
  const [smoothStrength, setSmoothStrength] = useState(0.1);
  const [subdivisionLevel, setSubdivisionLevel] = useState(0);
  const [retopologyDecimate, setRetologyDecimate] = useState(0);

  const [extrudeSettings, setExtrudeSettings] = useState<ExtrudeSettings>({
    depth: 10,
    detailThickness: 4,
    bevelEnabled: true,
    bevelThickness: 2,
    bevelSize: 2,
    bevelOffset: 0,
    bevelSegments: 5,
    artistMark: { type: 'none' },
    scaleX: 1.0,
    scaleY: 1.0
  });

  const handleGenerate = (newStrokes: StrokeData[], newBaseShapeId: string | null) => {
    // Preserve actual colors — only set materialId on base strokes that don't have one yet
    const processedStrokes = newStrokes.map(s =>
      s.layer === 'base' && !s.materialId ? { ...s, materialId: baseMaterialId } : s
    );
    setStrokes(processedStrokes);
    setBaseShapeId(newBaseShapeId);
  };

  const handleUpdateBaseMaterial = (materialId: string) => {
    setBaseMaterialId(materialId);
    // Also update the active selected material so 3D viewer shows the correct color immediately
    const mat = RECYCLED_MATERIALS.find(m => m.id === materialId);
    if (mat) setSelectedMaterial(mat);
  };

  const updateStrokeMaterial = (id: string, color: string, materialId: string) => {
    if (id.startsWith('base-') || id === 'base-shape') {
      setBaseMaterialId(materialId);
    }
    setStrokes(prev => prev.map(s => s.id === id ? { ...s, color, materialId } : s));
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] relative z-10 font-sans">
      {/* Grid Paper Background Pattern */}
      <div className="fixed inset-0 grid-paper pointer-events-none z-0"></div>

      {/* Workshop Page Content */}
      <PageContainer
        size="full"
        className="pt-24 sm:pt-28 pb-[500px] relative z-10"
      >
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-16">

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* 🌟 HERO SECTION: SELF-DESIGNED (CONTENT ĐẦU TRANG)                 */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <section
            className="w-full relative flex flex-col pt-2 sm:pt-4"
            style={{
              transform: `translate(${WORKSHOP_ASSETS_CONFIG.hero.container.offsetX}px, ${WORKSHOP_ASSETS_CONFIG.hero.container.offsetY}px) scale(${WORKSHOP_ASSETS_CONFIG.hero.container.scale})`,
              transformOrigin: 'top center'
            }}
          >
            {/* Huge Headline: "Self" & "-Designed" (Sử dụng Font Malinton) */}
            <div className="w-full select-none flex flex-wrap items-baseline">
              <span
                className="inline-block text-[13vw] sm:text-[13.5vw] md:text-[13vw] lg:text-[145px] xl:text-[165px] font-black tracking-[-0.03em] leading-[0.86]"
                style={{
                  fontFamily: "'Malinton', sans-serif",
                  color: BRAND.blue,
                  transform: `translate(${WORKSHOP_ASSETS_CONFIG.hero.titleSelf.offsetX}px, ${WORKSHOP_ASSETS_CONFIG.hero.titleSelf.offsetY}px) scale(${WORKSHOP_ASSETS_CONFIG.hero.titleSelf.scale})`,
                  transformOrigin: 'left top'
                }}
              >
                Self
              </span>
              <span
                className="inline-block text-[13vw] sm:text-[13.5vw] md:text-[13vw] lg:text-[145px] xl:text-[165px] font-black tracking-[-0.03em] leading-[0.86]"
                style={{
                  fontFamily: "'Malinton', sans-serif",
                  color: BRAND.pink,
                  transform: `translate(${WORKSHOP_ASSETS_CONFIG.hero.titleDesigned.offsetX}px, ${WORKSHOP_ASSETS_CONFIG.hero.titleDesigned.offsetY}px) scale(${WORKSHOP_ASSETS_CONFIG.hero.titleDesigned.scale})`,
                  transformOrigin: 'left top'
                }}
              >
                -Designed
              </span>
            </div>

            {/* Sub-heading directly beneath "Self-": "TURNING WASTE INTO POSSIBILITY." */}
            <div
              className="w-full mt-2 sm:mt-3"
              style={{
                transform: `translate(${WORKSHOP_ASSETS_CONFIG.hero.subtitleTurningWaste.offsetX}px, ${WORKSHOP_ASSETS_CONFIG.hero.subtitleTurningWaste.offsetY}px) scale(${WORKSHOP_ASSETS_CONFIG.hero.subtitleTurningWaste.scale})`,
                transformOrigin: 'left top'
              }}
            >
              <p
                className="text-xs sm:text-sm md:text-[15px] font-black tracking-wider uppercase leading-tight"
                style={{ color: BRAND.blue }}
              >
                TURNING WASTE<br />
                INTO POSSIBILITY.
              </p>
            </div>

            {/* 3-Column Content & Artist Portrait Layout */}
            <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mt-6 sm:mt-8 items-end">

              {/* Left Column: 01 1/2 + FROM PLASTIC TO PURPOSE + Description + [ YOUR TURN ] */}
              <div
                className="md:col-span-4 flex flex-col justify-between"
                style={{
                  transform: `translate(${WORKSHOP_ASSETS_CONFIG.hero.leftColumn.offsetX}px, ${WORKSHOP_ASSETS_CONFIG.hero.leftColumn.offsetY}px) scale(${WORKSHOP_ASSETS_CONFIG.hero.leftColumn.scale})`,
                  transformOrigin: 'top left'
                }}
              >
                {/* Numbers Row: 01 & 1/2 */}
                <div
                  className="flex items-baseline justify-between max-w-[240px] mb-2 sm:mb-3"
                  style={{
                    transform: `translate(${WORKSHOP_ASSETS_CONFIG.hero.numbers.offsetX}px, ${WORKSHOP_ASSETS_CONFIG.hero.numbers.offsetY}px) scale(${WORKSHOP_ASSETS_CONFIG.hero.numbers.scale})`,
                    transformOrigin: 'top left'
                  }}
                >
                  <span className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: BRAND.blue }}>01</span>
                  <span className="text-xl sm:text-2xl font-black" style={{ color: BRAND.blue }}>1/2</span>
                </div>

                {/* Subtitle: FROM PLASTIC TO PURPOSE */}
                <div
                  style={{
                    transform: `translate(${WORKSHOP_ASSETS_CONFIG.hero.leftHeading.offsetX}px, ${WORKSHOP_ASSETS_CONFIG.hero.leftHeading.offsetY}px) scale(${WORKSHOP_ASSETS_CONFIG.hero.leftHeading.scale})`,
                    transformOrigin: 'top left'
                  }}
                >
                  <h3 className="text-sm sm:text-[15px] font-black uppercase tracking-wider mb-2 sm:mb-3" style={{ color: BRAND.blue }}>
                    FROM PLASTIC TO PURPOSE
                  </h3>
                </div>

                {/* Description Paragraph: Every plastic bottle you use... */}
                <div
                  style={{
                    transform: `translate(${WORKSHOP_ASSETS_CONFIG.hero.leftParagraph.offsetX}px, ${WORKSHOP_ASSETS_CONFIG.hero.leftParagraph.offsetY}px) scale(${WORKSHOP_ASSETS_CONFIG.hero.leftParagraph.scale})`,
                    transformOrigin: 'top left'
                  }}
                >
                  <p
                    className="text-xs sm:text-[13px] lg:text-sm font-semibold leading-[1.65] max-w-[310px] whitespace-pre-line"
                    style={{ color: BRAND.blue }}
                  >
                    {`Every plastic bottle you use
doesn't have to become waste.
Imagine it transformed—
designed by you,
into something meaningful,
something you can touch,
experience, and be proud of.
Reuse. Redesign. Recreate.
It starts with you.`}
                  </p>
                </div>

                {/* Action CTA Button: [ YOUR TURN ] */}
                <div
                  className="mt-5 sm:mt-7"
                  style={{
                    transform: `translate(${WORKSHOP_ASSETS_CONFIG.hero.yourTurnButton.offsetX}px, ${WORKSHOP_ASSETS_CONFIG.hero.yourTurnButton.offsetY}px) scale(${WORKSHOP_ASSETS_CONFIG.hero.yourTurnButton.scale})`,
                    transformOrigin: 'top left'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      const studioEl = document.getElementById("workshop-studio");
                      if (studioEl) {
                        studioEl.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="inline-block text-sm sm:text-base font-black tracking-widest hover:bg-[#0020D7] hover:text-white px-2.5 py-1 border border-transparent hover:border-[#0020D7] transition-all duration-200 cursor-pointer"
                    style={{ color: BRAND.blue }}
                  >
                    [ YOUR TURN ]
                  </button>
                </div>
              </div>

              {/* Center Column: Mascot Asset Image (Asset 87.svg) */}
              <div
                className="md:col-span-4 flex justify-center items-center"
                style={{
                  transform: `translate(${WORKSHOP_ASSETS_CONFIG.hero.artistImage.offsetX}px, ${WORKSHOP_ASSETS_CONFIG.hero.artistImage.offsetY}px) scale(${WORKSHOP_ASSETS_CONFIG.hero.artistImage.scale})`,
                  transformOrigin: 'center center'
                }}
              >
                <div className="w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[380px] aspect-square flex items-center justify-center">
                  <img
                    src={heroMascotImg}
                    alt="Self-Designed Workshop Mascot Asset 87"
                    className="w-full h-full object-contain select-none"
                    draggable={false}
                  />
                </div>
              </div>

              {/* Right Column: ABOUT RELIFE LAB + Mission description */}
              <div
                className="md:col-span-4 flex flex-col justify-end items-start md:items-end text-left"
                style={{
                  transform: `translate(${WORKSHOP_ASSETS_CONFIG.hero.rightColumn.offsetX}px, ${WORKSHOP_ASSETS_CONFIG.hero.rightColumn.offsetY}px) scale(${WORKSHOP_ASSETS_CONFIG.hero.rightColumn.scale})`,
                  transformOrigin: 'bottom right'
                }}
              >
                <div className="max-w-[280px]">
                  {/* About Title */}
                  <div
                    style={{
                      transform: `translate(${WORKSHOP_ASSETS_CONFIG.hero.rightHeading.offsetX}px, ${WORKSHOP_ASSETS_CONFIG.hero.rightHeading.offsetY}px) scale(${WORKSHOP_ASSETS_CONFIG.hero.rightHeading.scale})`,
                      transformOrigin: 'bottom left'
                    }}
                  >
                    <h3 className="text-sm sm:text-[15px] font-black uppercase tracking-wider mb-2" style={{ color: BRAND.blue }}>
                      ABOUT RELIFE LAB
                    </h3>
                  </div>

                  {/* About Description Paragraph */}
                  <div
                    style={{
                      transform: `translate(${WORKSHOP_ASSETS_CONFIG.hero.rightParagraph.offsetX}px, ${WORKSHOP_ASSETS_CONFIG.hero.rightParagraph.offsetY}px) scale(${WORKSHOP_ASSETS_CONFIG.hero.rightParagraph.scale})`,
                      transformOrigin: 'bottom left'
                    }}
                  >
                    <p
                      className="text-xs sm:text-[13px] lg:text-sm font-semibold leading-[1.65] whitespace-pre-line"
                      style={{ color: BRAND.blue }}
                    >
                      {`Relife Lab realizes your experience
into real art products.
Our mission is clear:
art products, sustainable materials.`}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* 🛠️ SECTION 2: INTERACTIVE CAD & 3D STUDIO (DỜI XUỐNG PHÍA DƯỚI)  */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <div
            id="workshop-studio"
            className="workshop-viewport flex flex-col gap-10 w-full pt-10"
          >
            {/* 2D Sketching & Base Shapes */}
            <div
              className="w-full relative z-20"
              style={{
                marginBottom: WORKSHOP_ASSETS_CONFIG.canvas.canvasFrame.offsetY > 0
                  ? `${WORKSHOP_ASSETS_CONFIG.canvas.canvasFrame.offsetY}px`
                  : undefined
              }}
            >
              <DrawingCanvas
                onGenerate={handleGenerate}
                bucketMaterial={selectedMaterial}
                onUpdateBaseMaterial={handleUpdateBaseMaterial}
                assetsConfig={WORKSHOP_ASSETS_CONFIG.canvas}
              />
            </div>

            {/* 3D Visualizer Viewport */}
            <div
              className="w-full relative z-10"
              style={{
                marginBottom: WORKSHOP_ASSETS_CONFIG.viewer3d.viewerFrame.offsetY > 0
                  ? `${WORKSHOP_ASSETS_CONFIG.viewer3d.viewerFrame.offsetY}px`
                  : undefined
              }}
            >
              <Viewer3D
                strokes={strokes}
                baseShapeId={baseShapeId}
                onUpdateStrokeMaterial={updateStrokeMaterial}
                activeMaterial={selectedMaterial}
                extrudeSettings={extrudeSettings}
                setExtrudeSettings={setExtrudeSettings}
                style={geometryStyle}
                smoothBrushActive={smoothActive}
                smoothRadius={smoothRadius}
                smoothStrength={smoothStrength}
                subdivisionLevel={subdivisionLevel}
                retopologyDecimate={retopologyDecimate}
                assetsConfig={WORKSHOP_ASSETS_CONFIG.viewer3d}
                onSelectMaterial={setSelectedMaterial}
              />
            </div>

            {/* Properties and Customization Grid */}
            <div
              className="w-full"
              style={{
                transform: `translate(${WORKSHOP_ASSETS_CONFIG.viewer3d.advancedTuningCard.offsetX}px, ${WORKSHOP_ASSETS_CONFIG.viewer3d.advancedTuningCard.offsetY}px) scale(${WORKSHOP_ASSETS_CONFIG.viewer3d.advancedTuningCard.scale})`,
                transformOrigin: 'top center'
              }}
            >
              {/* Advanced 3D Tuning modifiers */}
              <div className="w-full">
                <ModifierToolbar
                  settings={extrudeSettings}
                  setSettings={setExtrudeSettings}
                  style={geometryStyle}
                  setStyle={setGeometryStyle}
                  smoothActive={smoothActive}
                  setSmoothActive={setSmoothActive}
                  smoothRadius={smoothRadius}
                  setSmoothRadius={setSmoothRadius}
                  smoothStrength={smoothStrength}
                  setSmoothStrength={setSmoothStrength}
                  subdivisionLevel={subdivisionLevel}
                  setSubdivisionLevel={setSubdivisionLevel}
                  retopologyDecimate={retopologyDecimate}
                  setRetologyDecimate={setRetologyDecimate}
                />
              </div>
            </div>
          </div>

        </div>
      </PageContainer>
    </div>
  );
}

