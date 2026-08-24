import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import img1 from '../assets/anhonhiem/o1.jpg';
import img2 from '../assets/anhonhiem/o2.jpg';
import img4 from '../assets/anhonhiem/o4.webp';
import img6 from '../assets/anhonhiem/o6.webp';
import img8 from '../assets/anhonhiem/o8.jpg';
import {
  Plus,
  Recycle,
  AlertTriangle,
  Trash2,
  Layers,
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  MapPin,
  Hammer
} from "lucide-react";

import PlasticWasteScroll from "../components/PlasticWasteScroll";
import ScatterGallery, { CardData } from "../components/ScatterGallery";
import FluidPixelText from "../components/FluidPixelText";
import NeubrutalismButton from "../components/NeubrutalismButton";
import PageContainer from "../components/PageContainer";
import { cn } from "@/src/lib/utils";

interface HomeProps {
  onNavigate: (page: string) => void;
}

const PlusCorner = ({ className }: { className?: string }) => (
  <div className={cn("absolute w-3 h-3 flex items-center justify-center", className)}>
    <Plus size={12} className="text-black" strokeWidth={3} />
  </div>
);

const IndustrialContainer = ({
  children,
  className,
  title,
  onClick,
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  onClick?: () => void;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ y: -4, boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
    onClick={onClick}
    className={cn(
      "relative bg-white border-2 border-black p-6 flex flex-col group cursor-pointer transition-all",
      className
    )}
  >
    <PlusCorner className="-top-1.5 -left-1.5 bg-[#F5F5F5]" />
    <PlusCorner className="-top-1.5 -right-1.5 bg-[#F5F5F5]" />
    <PlusCorner className="-bottom-1.5 -left-1.5 bg-[#F5F5F5]" />
    <PlusCorner className="-bottom-1.5 -right-1.5 bg-[#F5F5F5]" />

    {title && (
      <div className="flex justify-between items-center mb-4 border-b border-black/10 pb-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">{title}</span>
        <ArrowUpRight size={14} className="group-hover:text-acid transition-colors" />
      </div>
    )}
    {children}
  </motion.div>
);

// ── BẢNG MÀU VÀ NỘI DUNG CHO CÁC Ô POLAROID (CÓ THỂ TỰ ĐIỀU CHỈNH TẠI ĐÂY) ──
// Bạn có thể đổi màu nền (bg-*), màu chữ (text-*), tiêu đề (content), và chữ phụ (subtext) của từng ô.
const POLAROID_CARDS: CardData[] = [
  {
    id: '1',
    type: 'text',
    content: 'WASTE IS A RESOURCE',
    subtext: 'RE_MOLD // PROTOCOL_01',
    color: 'bg-[#D1FF00] text-black', // Xanh lá Acid
    initialPos: { x: -350, y: -200, rotate: -8 }
  },
  {
    id: '2',
    type: 'image',
    content: 'POLLUTION_SCAN_01',
    image: img2,
    initialPos: { x: 50, y: -250, rotate: 5 }
  },
  {
    id: '3',
    type: 'text',
    content: 'RECYCLED PET PLASTIC',
    subtext: 'BOTTLE_REBIRTH_SYS',
    color: 'bg-[#FF009C] text-white', // Hồng thương hiệu
    initialPos: { x: 400, y: -150, rotate: -12 }
  },
  {
    id: '4',
    type: 'image',
    content: 'WASTE_TEXTURE_V.2',
    image: img4,
    initialPos: { x: -100, y: 50, rotate: 10 }
  },
  {
    id: '5',
    type: 'text',
    content: 'CIRCULAR DESIGN',
    subtext: 'NO_WASTE_LEFT_BEHIND',
    color: 'bg-white text-black', // Trắng
    initialPos: { x: -450, y: 150, rotate: 6 }
  },
  {
    id: '6',
    type: 'image',
    content: 'PROCESS_ANomaly',
    image: img6,
    initialPos: { x: 250, y: 50, rotate: -5 }
  },
  {
    id: '7',
    type: 'text',
    content: 'REBUILD THE SYSTEM',
    subtext: 'PLASTIC_PEOPLE_LAB',
    color: 'bg-[#A7F417] text-black', // Xanh lá
    initialPos: { x: 150, y: 250, rotate: 8 }
  },
  {
    id: '8',
    type: 'image',
    content: 'MATERIAL_ARCHIVE',
    image: img8,
    initialPos: { x: -300, y: 300, rotate: -10 }
  }
];

export default function Home({ onNavigate }: HomeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Cảnh 3D sẽ tiến về phía trước theo nhịp cuộn của từ đầu đến cuối trang.
  const heroScrollProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [scrollVal, setScrollVal] = useState(0);

  useEffect(() => {
    return heroScrollProgress.on("change", (latest) => {
      setScrollVal(latest);
    });
  }, [heroScrollProgress]);

  const heroLines = useMemo(() => [
    { text: "RE-LIFE LAB", fontSize: 200, fontFamily: "Malinton", color: "#0000ff", offsetY: -180 },
    { text: "the", fontSize: 120, fontFamily: "AnekDevanagari", color: "#ff009e", offsetY: -2, isItalic: true },
    { text: "OPEN-SOURCE", fontSize: 220, fontFamily: "Malinton", color: "#ff009e", offsetY: 200 }
  ], []);

  return (
    <div ref={containerRef} className="pt-32 min-h-screen relative bg-[#F5F5F5]">
      {/* Nền Giấy Kẻ Ô */}
      <div className="fixed inset-0 grid-paper pointer-events-none z-0"></div>

      {/* Cuộn Rác Thải Nhựa 3D Điện Ảnh - Nền */}
      <PlasticWasteScroll scrollProgress={scrollVal} />

      {/* Phần Hero với Chữ Pixel Dòng Chảy Tương Tác - Lớp Cố Định Phía Sau */}
      <motion.div
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.3, 0.7, 0.75, 0.85, 1], [1, 0.05, 0.05, 0, 0, 1]),
          scale: useTransform(scrollYProgress, [0, 0.3, 0.85, 1], [1, 0.8, 0.8, 1]),
          y: useTransform(scrollYProgress, [0, 0.3, 0.85, 1], [0, -100, -100, 0])
        }}
        className="z-0 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex flex-col items-center justify-center text-center pointer-events-none"
      >
        <FluidPixelText
          lines={heroLines}
          className="pointer-events-auto"
        />
        <div className="mt-6 flex flex-col items-center gap-4">
          {/* Để chỉnh vị trí lên xuống của tọa độ: thay đổi lớp '-translate-y-4' bên dưới (ví dụ: -translate-y-6 để lên thêm, translate-y-2 để xuống) */}
          <div className="font-mono text-xs text-gray-300 flex items-center gap-2 -translate-y-4">
            <MapPin size={12} className="text-burnt-orange" />
            <span>COORD: 10.7626° N, 106.6602° E</span>
          </div>
          <div className="font-mono text-[13px] text-acid uppercase tracking-[0.3em]">
            Trash Outside _ Art On-Chain.
          </div>
        </div>
      </motion.div>

      {/* Các Phần Nội Dung Chính - Z-10 để cuộn ĐÈ LÊN chữ hero */}
      <div className="relative z-10 w-full">

        <PageContainer size="standard" className="relative z-10 py-6 md:py-12 space-y-12">

          {/* Khoảng Trống Phần Hero */}
          <section className="relative h-screen flex flex-col justify-center items-center text-center -mt-20 -mx-6 md:-mx-12 overflow-hidden pointer-events-none">
          </section>

          {/* Khoảng trống để cho phép cuộn qua cảnh 3D */}
          <div className="h-[50vh]"></div>

          {/* Lưới Mô-đun */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* Mô-đun 1: Ô lớn nhất — THỰC TRẠNG RÁC THẢI NHỰA */}
            <IndustrialContainer
              title="VIETNAM_PLASTIC_WASTE"
              className="md:col-span-8"
              onClick={() => onNavigate("about")}
              delay={0.1}
            >
              <div className="flex flex-col justify-between h-full gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Recycle className="text-[#0020D7]" size={28} strokeWidth={2.5} />
                    <span className="font-mono text-xs uppercase tracking-widest text-[#0020D7] font-bold">
                      TOTAL PLASTIC WASTE
                    </span>
                  </div>
                  
                  {/* Con số 3.1 MILLION làm visual chính siêu lớn */}
                  <div className="lcd-text text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-black leading-none my-2">
                    3.1 MILLION <span className="text-xl sm:text-3xl font-sans text-gray-500 font-bold tracking-normal">TONNES</span>
                  </div>
                  
                  <p className="font-mono text-xs sm:text-sm text-gray-600 font-medium">
                    Plastic waste generated on land in Vietnam every year.
                  </p>
                </div>

                {/* 4 Số liệu nhỏ */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-black/10">
                  <div className="bg-[#0020D7]/5 border border-[#0020D7]/20 p-3 flex flex-col justify-between min-h-[90px]">
                    <div className="font-display text-2xl sm:text-3xl text-[#0020D7] font-black">≥10%</div>
                    <p className="font-mono text-[9px] sm:text-[10px] text-gray-600 leading-tight mt-1">
                      Plastic waste that may leak into the ocean.
                    </p>
                  </div>

                  <div className="bg-[#0020D7]/5 border border-[#0020D7]/20 p-3 flex flex-col justify-between min-h-[90px]">
                    <div className="font-display text-2xl sm:text-3xl text-[#0020D7] font-black">94%</div>
                    <p className="font-mono text-[9px] sm:text-[10px] text-gray-600 leading-tight mt-1">
                      Plastic items recorded in surveyed river and coastal areas.
                    </p>
                  </div>

                  <div className="bg-[#0020D7]/5 border border-[#0020D7]/20 p-3 flex flex-col justify-between min-h-[90px]">
                    <div className="font-display text-2xl sm:text-3xl text-[#0020D7] font-black">71%</div>
                    <p className="font-mono text-[9px] sm:text-[10px] text-gray-600 leading-tight mt-1">
                      Share of plastic by weight in recorded waste.
                    </p>
                  </div>

                  <div className="bg-[#0020D7]/5 border border-[#0020D7]/20 p-3 flex flex-col justify-between min-h-[90px]">
                    <div className="font-display text-2xl sm:text-3xl text-[#0020D7] font-black">33%</div>
                    <p className="font-mono text-[9px] sm:text-[10px] text-gray-600 leading-tight mt-1">
                      Estimated recycling rate for PET, HDPE, LDPE/LLDPE, PP.
                    </p>
                  </div>
                </div>
              </div>
            </IndustrialContainer>

            {/* Mô-đun 2: Ô bên phải — NGUY CƠ */}
            <IndustrialContainer title="ENVIRONMENTAL_THREAT" className="md:col-span-4" delay={0.2}>
              <div className="flex flex-col h-full justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-black flex items-center justify-center border-2 border-black shrink-0">
                    <AlertTriangle className="text-[#FF009C]" size={26} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl leading-tight uppercase font-bold text-black">
                      PLASTIC WASTE IS A GROWING THREAT
                    </h3>
                    <p className="font-mono text-xs text-gray-600 mt-2 leading-relaxed">
                      Single-use plastics continue to enter Vietnam's rivers, waterways and oceans.
                    </p>
                  </div>
                </div>

                {/* Flow nhấn mạnh */}
                <div className="bg-[#FF009C]/10 p-3 border border-[#FF009C]/30 my-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-2 font-semibold">
                    IMPACT CHAIN
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] font-bold text-black">
                    <span className="bg-white px-2 py-0.5 border border-black">PLASTIC</span>
                    <span className="text-[#FF009C]">→</span>
                    <span className="bg-white px-2 py-0.5 border border-black">WASTE</span>
                    <span className="text-[#FF009C]">→</span>
                    <span className="bg-white px-2 py-0.5 border border-black">LEAKAGE</span>
                    <span className="text-[#FF009C]">→</span>
                    <span className="bg-black text-white px-2 py-0.5">ENVIRONMENTAL IMPACT</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-[10px] text-gray-500">
                  <Recycle size={14} className="text-[#FF009C]" />
                  <span>ECOSYSTEM_ALERT // URGENT_ACTION</span>
                </div>
              </div>
            </IndustrialContainer>

            {/* Mô-đun 3: Ô bên trái phía dưới — HÀNH TRÌNH TÁI SINH */}
            <IndustrialContainer
              title="THE_REBIRTH_PROCESS"
              className="md:col-span-4"
              onClick={() => onNavigate("workshop")}
              delay={0.3}
            >
              <div className="space-y-4">
                <h3 className="font-display text-xl uppercase font-bold mb-3">THE REBIRTH PROCESS</h3>
                {[
                  { id: "01", label: "COLLECT", desc: "Plastic waste is collected.", icon: Trash2 },
                  { id: "02", label: "SORT", desc: "Plastic is sorted by material.", icon: Layers },
                  { id: "03", label: "REFORM", desc: "Waste plastic is transformed into new material.", icon: Hammer },
                  { id: "04", label: "RECREATE", desc: "The material becomes a new product.", icon: Sparkles },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3 group/step">
                    <div className={cn(
                      "w-8 h-8 shrink-0 flex items-center justify-center brutalist-border mt-0.5",
                      i === 2 ? 'bg-[#FF009C] text-white' : i === 3 ? 'bg-[#0020D7] text-white' : 'bg-black text-white'
                    )}>
                      <step.icon size={14} />
                    </div>
                    <div className="flex-1 border-b border-black/10 pb-2">
                      <div className="font-display text-sm uppercase font-bold">
                        {step.id}. {step.label}
                      </div>
                      <p className="font-mono text-[10px] text-gray-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </IndustrialContainer>

            {/* Mô-đun 4 & 5: Ô hình ảnh & Ô câu chuyện sản phẩm */}
            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Mô-đun 4: Ô hình ảnh — KHÁM PHÁ CHẤT LIỆU */}
              <IndustrialContainer 
                title="FROM_WASTE_TO_MATERIAL" 
                delay={0.4}
                onClick={() => onNavigate("material")}
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="aspect-video bg-[#0020D7]/10 mb-3 overflow-hidden brutalist-border relative">
                      <img
                        src={img1}
                        alt="Recycled plastic material"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                      <div className="absolute top-2 right-2 bg-[#0020D7] text-white font-mono text-[8px] px-2 py-1 brutalist-border font-bold">
                        MATERIAL_TECH
                      </div>
                    </div>

                    <h4 className="font-display text-xl uppercase leading-tight font-bold mb-2">
                      FROM WASTE TO MATERIAL
                    </h4>
                    <div className="font-mono text-[10px] font-semibold text-gray-700 bg-gray-100 p-2 border border-black/10">
                      PET → RECYCLED PLASTIC → 3D PRINTING → NEW OBJECT
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center font-mono text-xs font-bold text-[#0020D7] group-hover:translate-x-1 transition-transform">
                    <span>EXPLORE MATERIALS</span>
                    <span>→</span>
                  </div>
                </div>
              </IndustrialContainer>

              {/* Mô-đun 5: Ô bên phải — CÂU CHUYỆN SẢN PHẨM */}
              <IndustrialContainer 
                title="PRODUCT_STORY" 
                delay={0.5}
                onClick={() => onNavigate("about")}
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h4 className="font-display text-2xl sm:text-3xl uppercase leading-none mb-4 font-bold text-black">
                      EVERY PIECE DESERVES A SECOND LIFE
                    </h4>
                    <p className="font-mono text-xs text-gray-600 leading-relaxed mb-6">
                      What was once plastic waste can become a new object, a new story and a new experience.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-black/10 flex justify-between items-center font-mono text-xs font-bold text-[#FF009C] group-hover:translate-x-1 transition-transform">
                    <span>DISCOVER THE STORY</span>
                    <span>→</span>
                  </div>
                </div>
              </IndustrialContainer>
            </div>

            {/* Mô-đun 6: 4 Ô CTA PHÍA DƯỚI */}
            <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-stretch">
              
              {/* 01 — EXPLORE PRODUCTS */}
              <button
                onClick={() => onNavigate("store")}
                className="bg-white text-black p-6 brutalist-border hover:bg-black hover:text-white transition-all flex flex-col justify-between text-left group min-h-[160px]"
              >
                <div className="flex justify-between items-start w-full mb-2">
                  <span className="font-mono text-xs font-bold text-gray-400 group-hover:text-gray-300">01</span>
                  <ArrowUpRight size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <div>
                  <span className="font-display text-xl uppercase leading-tight font-bold block mb-1">
                    EXPLORE PRODUCTS
                  </span>
                  <p className="font-mono text-[11px] text-gray-500 group-hover:text-gray-300 line-clamp-2">
                    Discover products created from recycled plastic.
                  </p>
                </div>
              </button>

              {/* 02 — EXPLORE MATERIALS */}
              <button
                onClick={() => onNavigate("material")}
                className="bg-white text-black p-6 brutalist-border hover:bg-black hover:text-white transition-all flex flex-col justify-between text-left group min-h-[160px]"
              >
                <div className="flex justify-between items-start w-full mb-2">
                  <span className="font-mono text-xs font-bold text-gray-400 group-hover:text-gray-300">02</span>
                  <ArrowUpRight size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <div>
                  <span className="font-display text-xl uppercase leading-tight font-bold block mb-1">
                    EXPLORE MATERIALS
                  </span>
                  <p className="font-mono text-[11px] text-gray-500 group-hover:text-gray-300 line-clamp-2">
                    Discover how plastic waste becomes new material.
                  </p>
                </div>
              </button>

              {/* 03 — DISCOVER THE STORY */}
              <button
                onClick={() => onNavigate("about")}
                className="bg-white text-black p-6 brutalist-border hover:bg-black hover:text-white transition-all flex flex-col justify-between text-left group min-h-[160px]"
              >
                <div className="flex justify-between items-start w-full mb-2">
                  <span className="font-mono text-xs font-bold text-gray-400 group-hover:text-gray-300">03</span>
                  <ArrowUpRight size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <div>
                  <span className="font-display text-xl uppercase leading-tight font-bold block mb-1">
                    DISCOVER THE STORY
                  </span>
                  <p className="font-mono text-[11px] text-gray-500 group-hover:text-gray-300 line-clamp-2">
                    Follow the journey from waste to product.
                  </p>
                </div>
              </button>

              {/* 04 — CREATE YOUR OWN (Nổi bật nhất) */}
              <button
                onClick={() => onNavigate("workshop")}
                className="bg-[#0020D7] text-white p-6 brutalist-border hover:bg-[#FF009C] transition-all flex flex-col justify-between text-left group min-h-[160px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
              >
                <div className="flex justify-between items-start w-full mb-2">
                  <span className="font-mono text-xs font-bold text-white/70">04 — CUSTOMIZE</span>
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform text-[#D1FF00]" />
                </div>
                <div>
                  <span className="font-display text-xl uppercase leading-tight font-bold block mb-1 text-white">
                    CREATE YOUR OWN
                  </span>
                  <p className="font-mono text-[11px] text-white/80 line-clamp-2">
                    Experience personalized product customization and create your own unique version.
                  </p>
                </div>
              </button>
            </div>

          </div>
        </PageContainer>

        {/* Kết thúc Gallery Phân Tán Tương Tác */}
        <ScatterGallery cards={POLAROID_CARDS} />
      </div>


    </div>
  );
}
