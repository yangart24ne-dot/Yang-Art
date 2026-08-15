import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { RefreshCw, Plus, Quote, Camera } from 'lucide-react';
import { cn } from '../lib/utils';

import img1 from '../assets/anhonhiem/o1.jpg';
import img2 from '../assets/anhonhiem/o2.jpg';
import img3 from '../assets/anhonhiem/o3.webp';
import img4 from '../assets/anhonhiem/o4.webp';
import img5 from '../assets/anhonhiem/o5.jpg';
import img6 from '../assets/anhonhiem/o6.webp';
import img7 from '../assets/anhonhiem/o7.webp';
import img8 from '../assets/anhonhiem/o8.jpg';


export interface CardData {
  id: string;
  type: 'text' | 'image';
  content: string;
  subtext?: string;
  image?: string;
  color?: string;
  initialPos: { x: number; y: number; rotate: number };
}

const CARDS: CardData[] = [
  {
    id: '1',
    type: 'text',
    content: 'WASTE IS A RESOURCE',
    subtext: 'RE_MOLD // PROTOCOL_01',
    color: 'bg-[#D1FF00] text-black',
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
    color: 'bg-[#FF009C] text-white',
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
    color: 'bg-white text-black',
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
    color: 'bg-[#A7F417] text-black',
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

const ScatterCard = ({ card, topZ, setTopZ }: { card: CardData; topZ: number; setTopZ: (z: number) => void }) => {
  const [zIndex, setZIndex] = useState(1);
  const [hasTape] = useState(Math.random() > 0.5);
  const [tapePos] = useState({
    top: Math.random() > 0.5 ? -10 : 'auto',
    bottom: Math.random() > 0.5 ? 'auto' : -10,
    left: Math.random() > 0.5 ? -20 : 'auto',
    right: Math.random() > 0.5 ? 'auto' : -20,
    rotate: Math.random() * 40 - 20
  });

  const handleDragStart = () => {
    const newZ = topZ + 1;
    setZIndex(newZ);
    setTopZ(newZ);
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: -400, right: 400, top: -300, bottom: 300 }}
      onDragStart={handleDragStart}
      initial={{ 
        x: card.initialPos.x, 
        y: card.initialPos.y, 
        rotate: card.initialPos.rotate,
        opacity: 0,
        scale: 0.8
      }}
      animate={{ 
        rotate: card.initialPos.rotate,
        opacity: 1,
        scale: 1,
        zIndex: zIndex
      }}
      whileHover={{ 
        scale: 1.02, 
        zIndex: topZ + 1,
        boxShadow: "20px 20px 0px 0px rgba(0,0,0,0.15)"
      }}
      whileTap={{ scale: 0.98, cursor: 'grabbing' }}
      transition={{ type: 'spring', stiffness: 150, damping: 25 }}
      className={cn(
        "absolute cursor-grab active:cursor-grabbing brutalist-border p-3 sm:p-4 select-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]",
        card.type === 'text' 
          ? cn("w-[260px] sm:w-[300px] md:w-[340px] min-h-[180px] sm:min-h-[220px]", card.color) 
          : "w-[280px] sm:w-[340px] md:w-[400px] bg-white"
      )}
    >
      {/* Yếu tố Băng keo Trang trí */}
      {hasTape && (
        <div 
          className="absolute w-20 sm:w-24 h-5 sm:h-7 bg-[#F4EBE1]/40 backdrop-blur-[2px] z-50 pointer-events-none border-y border-white/60 border-x border-white/30 shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
          style={{
            top: tapePos.top,
            bottom: tapePos.bottom,
            left: tapePos.left,
            right: tapePos.right,
            transform: `rotate(${tapePos.rotate}deg)`
          }}
        />
      )}

      {card.type === 'image' ? (
        <div className="space-y-3 sm:space-y-4">
          <div className="aspect-[4/5] bg-gray-100 overflow-hidden brutalist-border border-black">
            <img 
              src={card.image} 
              alt={card.content} 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 hover:scale-100" 
              draggable="false"
            />
          </div>
          <div className="flex justify-between items-center px-1">
            <span className="font-mono text-[9px] sm:text-[10px] font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase">{card.content}</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[8px] opacity-30">SCAN_0{card.id}</span>
              <Camera size={14} className="text-gray-400" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full justify-between gap-6 sm:gap-12 p-1 sm:p-2">
          <div className="flex justify-between items-start">
            <Quote size={20} className="opacity-10" />
            <div className={cn(
              "px-2 py-1 rounded-sm font-mono text-[8px] sm:text-[9px] font-black tracking-widest uppercase",
              !card.color?.includes('text-white') ? "bg-[#FF009C]/15 text-[#FF009C]" : "bg-black/20 text-white"
            )}>
              /RE_MOLD
            </div>
          </div>
          <h3 className="font-display text-2xl sm:text-4xl uppercase leading-none tracking-tighter">
            {card.content}
          </h3>
          <div className="pt-2 sm:pt-4 border-t border-black/20 flex justify-between items-center">
            <span className="font-mono text-[8px] sm:text-[9px] font-black tracking-widest uppercase opacity-60">{card.subtext}</span>
            <Plus size={14} />
          </div>
        </div>
      )}
    </motion.div>
  );
};

interface ScatterGalleryProps {
  cards?: CardData[];
}

const ScatterGallery: React.FC<ScatterGalleryProps> = ({ cards }) => {
  const [topZ, setTopZ] = useState(10);
  const [key, setKey] = useState(0);
  const [screenScale, setScreenScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setScreenScale(0.35);
      } else if (w < 1024) {
        setScreenScale(0.65);
      } else {
        setScreenScale(1);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const shuffle = () => {
    setKey(prev => prev + 1);
  };

  const displayCards = cards || CARDS;

  return (
    <section className="relative min-h-[85vh] sm:min-h-screen w-full bg-[#0020D7] overflow-hidden flex items-center justify-center border-t-4 border-black">
      {/* Hiệu ứng Nhiễu (Noise) */}
      <div className="absolute inset-0 noise-overlay opacity-[0.04] pointer-events-none z-10"></div>
      
      {/* Chữ Quảng cáo lớn - RE_mould */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <motion.h2 
          key={key}
          initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
          animate={{ opacity: 0.15, scale: 1, rotate: 0 }}
          className="font-display text-[28vw] uppercase leading-none text-transparent tracking-tighter select-none whitespace-nowrap"
          style={{ 
            WebkitTextStroke: '2px #FFFFFF',
          }}
        >
          RE_mould
        </motion.h2>
      </div>

      {/* Các đường lưới công nghiệp */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-15">
        {[...Array(6)].map((_, i) => (
          <div key={`h-${i}`} className="absolute w-full h-[1px] bg-white" style={{ top: `${(i + 1) * 16.6}%` }}></div>
        ))}
        {[...Array(6)].map((_, i) => (
          <div key={`v-${i}`} className="absolute h-full w-[1px] bg-white" style={{ left: `${(i + 1) * 16.6}%` }}></div>
        ))}
      </div>

      {/* Container cho các thẻ có thể kéo thả */}
      <div className="relative w-full h-full max-w-[1600px] flex items-center justify-center">
        {displayCards.map((card) => (
          <ScatterCard 
            key={`${key}-${card.id}`} 
            card={{
              ...card,
              initialPos: {
                x: (card.initialPos.x + (Math.random() * 60 - 30)) * screenScale,
                y: (card.initialPos.y + (Math.random() * 60 - 30)) * screenScale,
                rotate: card.initialPos.rotate + (Math.random() * 14 - 7)
              }
            }} 
            topZ={topZ} 
            setTopZ={setTopZ} 
          />
        ))}
      </div>

      {/* Bộ điều khiển Phân tán */}
      <div className="absolute bottom-6 right-4 sm:bottom-16 sm:right-16 z-50">
        <button 
          onClick={shuffle}
          className="group flex items-center gap-3 sm:gap-6 bg-[#FF009C] text-white border-2 border-black px-5 py-3 sm:px-8 sm:py-5 hover:bg-black hover:text-white transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-x-[-3px] translate-y-[-3px] sm:translate-x-[-6px] sm:translate-y-[-6px] hover:translate-x-0 hover:translate-y-0"
        >
          <span className="font-display text-lg sm:text-2xl uppercase tracking-[0.15em] sm:tracking-[0.2em]">Shuffle_Lab</span>
          <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-1000" />
        </button>
      </div>

      {/* Hướng dẫn ở chân trang */}
      <div className="absolute bottom-6 left-4 sm:bottom-16 sm:left-16 z-50 pointer-events-none hidden sm:block">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-[2px] bg-white"></div>
            <div className="font-mono text-[10px] text-white font-bold uppercase tracking-[0.3em]">
              SYSTEM_GALLERY_V2.5
            </div>
          </div>
          <div className="font-display text-lg uppercase text-white/80 tracking-tight">
            Drag to explore the archive
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScatterGallery;
