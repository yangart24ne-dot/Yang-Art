import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Image, Environment, useGLTF, Center, Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Sparkles, CheckCircle2, ShieldCheck, X, ShoppingBag, Layers, ChevronDown } from 'lucide-react';
import { BRAND, BRAND_SECONDARY } from '../lib/brand-colors';

// Import local 3D toy character assets
import toychaiModel from '../assets/store/toychai.glb?url';
import dennonModel from '../assets/store/dennon.glb?url';
import toyracModel from '../assets/store/toyrac.glb?url';
import toyProstachekImg from '../assets/store/toy_prostachek.png';
import toyNastileImg from '../assets/store/toy_nastile.png';
import toyBossImg from '../assets/store/toy_boss.png';

// Preload 3D Models
useGLTF.preload(toychaiModel);
useGLTF.preload(dennonModel);
useGLTF.preload(toyracModel);

// ── COMPONENT: AUTO-SCALED 3D TOY MODEL (TỰ ĐỘNG TÍNH TOÁN BOUNDING BOX ĐỂ TO RÕ ĐẸP MẮT & KHÔNG BỊ CẮT) ──
function AutoScaledToyModel({ 
  modelUrl, 
  targetSize = 2.45, 
  scaleMultiplier = 1.0,
  yOffset = 0
}: { 
  modelUrl: string; 
  targetSize?: number; 
  scaleMultiplier?: number;
  yOffset?: number;
}) {
  const { scene } = useGLTF(modelUrl);
  
  const { clonedScene, calculatedScale } = useMemo(() => {
    const clone = scene.clone();
    
    // Tối ưu hóa màu sắc và chất liệu bề mặt 3D
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
          if (mat instanceof THREE.MeshStandardMaterial) {
            mat.roughness = Math.min(mat.roughness ?? 0.35, 0.45);
            mat.metalness = Math.max(mat.metalness ?? 0.05, 0.08);
            mat.envMapIntensity = 1.4;
            mat.needsUpdate = true;
          }
        }
      }
    });

    // Ensure all transforms and matrices are evaluated
    clone.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Auto-normalize scale so every 3D model fits within targetSize with safety padding
    const autoScale = maxDim > 0.0001 ? (targetSize / maxDim) * scaleMultiplier : 1.0;
    
    return { clonedScene: clone, calculatedScale: autoScale };
  }, [scene, targetSize, scaleMultiplier]);

  return (
    <group position={[0, yOffset, 0]}>
      <Center>
        <primitive object={clonedScene} scale={calculatedScale} />
      </Center>
    </group>
  );
}

// ── COMPONENT: INTERACTIVE CARD / HERO / MODAL 3D PRODUCT VIEWER ──
function InteractiveProductToy3D({ 
  modelUrl, 
  targetSize = 2.45, 
  scaleMultiplier = 1.0,
  yOffset = 0,
  enableZoom = false,
  autoRotateSpeed = 2.2
}: { 
  modelUrl: string; 
  targetSize?: number; 
  scaleMultiplier?: number;
  yOffset?: number;
  showBadge?: boolean;
  enableZoom?: boolean;
  autoRotateSpeed?: number;
}) {
  return (
    <div 
      className="relative z-10 w-full h-full cursor-grab active:cursor-grabbing select-none overflow-visible"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <Canvas
        camera={{ position: [0, 0.15, 5.0], fov: 42 }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <ambientLight intensity={2.5} />
        <directionalLight position={[5, 8, 5]} intensity={2.2} />
        <directionalLight position={[-5, -4, -5]} intensity={1.2} color="#FF009C" />
        <pointLight position={[0, 4, 3]} intensity={1.8} color="#D1FF00" />
        
        <Suspense fallback={null}>
          <AutoScaledToyModel 
            modelUrl={modelUrl} 
            targetSize={targetSize} 
            scaleMultiplier={scaleMultiplier} 
            yOffset={yOffset}
          />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          enableZoom={enableZoom}
          enablePan={false}
          autoRotate
          autoRotateSpeed={autoRotateSpeed}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI - Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}

// Import local gallery images for 3D Tunnel
import img1 from '../assets/anhonhiem/o1.jpg';
import img2 from '../assets/anhonhiem/o2.jpg';
import img3 from '../assets/anhonhiem/o3.webp';
import img4 from '../assets/anhonhiem/o4.webp';
import img5 from '../assets/anhonhiem/o5.jpg';
import img6 from '../assets/anhonhiem/o6.webp';
import img7 from '../assets/anhonhiem/o7.webp';
import img8 from '../assets/anhonhiem/o8.jpg';
import img9 from '../assets/anhonhiem/o9.jpg';
import img10 from '../assets/anhonhiem/o10.webp';

const ASSETS = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];

// --- PRODUCT DATA FOR PLAYFUL TOY SHOWCASE ---
interface ToyProduct {
  id: string;
  name: string;
  russianName: string;
  subtitle: string;
  category: string;
  price: string;
  rawPrice: number;
  originalPrice?: string;
  image: string;
  model3d: string;
  modelScale?: number;
  targetSize?: number;      // 🟢 [VỊ TRÍ 3D]: Kích thước tổng thể của mô hình 3D trong card (mặc định 2.45)
  scaleMultiplier?: number; // 🟢 [VỊ TRÍ 3D]: Hệ số phóng to/thu nhỏ (mặc định 1.0)
  yOffset?: number;         // 🟢 [VỊ TRÍ 3D]: Nâng lên (dương) hoặc hạ xuống (âm) vị trí 3D (mặc định 0)
  description: string;
  recycledMaterial: string;
  nfcEnabled: boolean;
  capsEquivalent: number;
  tag: string;
}

const TOY_PRODUCTS: ToyProduct[] = [
  {
    id: 'toychai',
    name: 'Chai Tái Sinh',
    russianName: 'Mô hình Chai Nhựa',
    subtitle: 'Classic Street Vinyl',
    category: '3d-toys',
    price: '250.000₫',
    rawPrice: 250000,
    originalPrice: '320.000₫',
    image: toyProstachekImg,
    model3d: toychaiModel,
    targetSize: 2.45,
    scaleMultiplier: 1.0,
    yOffset: -0.05, // Chỉnh độ cao mô hình Chai Tái Sinh
    description: 'Phiên bản gấu đúc thủ công từ 100% nhựa nắp chai HDPE tái chế thu gom biển. Xử lý định hình nhiệt cao cấp, màu sắc tươi sáng độc bản.',
    recycledMaterial: 'HDPE #2 (Nắp chai thu gom biển)',
    nfcEnabled: true,
    capsEquivalent: 14,
    tag: 'BEST SELLER',
  },
  {
    id: 'dennon',
    name: 'Đèn Nón Nghệ Thuật',
    russianName: 'Phong cách Thời Thượng',
    subtitle: 'Cyber Cone Lamp',
    category: 'limited',
    price: '500.000₫',
    rawPrice: 500000,
    originalPrice: '650.000₫',
    image: toyNastileImg,
    model3d: dennonModel,
    targetSize: 2.35,
    scaleMultiplier: 0.95,
    yOffset: -0.15, // Chỉnh độ cao mô hình Đèn Nón (hạ thấp để không bị cao quá đỉnh card)
    description: 'Thiết kế đèn nón phong cách nghệ thuật đương đại cá tính, chế tác tinh xảo từ hỗn hợp hạt nhựa nguyên khối ép nhiệt.',
    recycledMaterial: 'PET + HDPE hỗn hợp ép nhiệt',
    nfcEnabled: true,
    capsEquivalent: 28,
    tag: 'LIMITED 100',
  },
  {
    id: 'toyrac',
    name: 'Rác Nghệ Thuật',
    russianName: 'Thủ Lĩnh Tái Sinh',
    subtitle: 'Supreme Waste Art',
    category: 'blind-box',
    price: '890.000₫',
    rawPrice: 890000,
    originalPrice: '1.100.000₫',
    image: toyBossImg,
    model3d: toyracModel,
    targetSize: 2.45,
    scaleMultiplier: 1.0,
    yOffset: -0.05, // Chỉnh độ cao mô hình Rác Nghệ Thuật
    description: 'Mô hình nghệ thuật rác tái chế cao cấp kết cấu đa tầng, kèm huy hiệu dây chuyền mạ vàng và chip NFC bảo chứng On-Chain.',
    recycledMaterial: '100% Rác thải nhựa công nghiệp xử lý vi sinh',
    nfcEnabled: true,
    capsEquivalent: 42,
    tag: 'EXCLUSIVE',
  },
];

// --- GLOBAL CONFIGURATION FOR 3D TUNNEL ---
const GLOBAL_SCALE = 2;
const TUNNEL_LENGTH = 160 * GLOBAL_SCALE; // 320 units
const CELL_SIZE = 4 * GLOBAL_SCALE;       // 8 units
const TUNNEL_WIDTH = 20 * GLOBAL_SCALE;    // 40 units
const TUNNEL_HEIGHT = 12 * GLOBAL_SCALE;   // 24 units

// --- HELPER: GRID TEXTURE ---
function createGridTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#D1FF00';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, 512, 512);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 16;
  return tex;
}

// --- FIXED LAYOUT GENERATOR FOR 3D TUNNEL ---
const FIXED_LAYOUT = (() => {
  const layout: any[] = [];
  const numZCells = Math.round(TUNNEL_LENGTH / CELL_SIZE);
  const xCenters = [-16, -8, 0, 8, 16]; 
  const yCenters = [-8, 0, 8];         
  const occupied: Record<number, Set<string>> = { 0: new Set(), 1: new Set(), 2: new Set(), 3: new Set() };

  for (let z = 0; z < numZCells; z++) {
    const zPos = -z * CELL_SIZE - (CELL_SIZE / 2);

    for (let wall = 0; wall < 4; wall++) {
      const isHorizontal = (wall === 0 || wall === 1);
      const centers = isHorizontal ? xCenters : yCenters;

      centers.forEach((pos, i) => {
        const spawnChance = 0.18;
        
        if (Math.random() < spawnChance) {
          const neighbors = [
            `${z}-${i - 1}`,
            `${z}-${i + 1}`,
            `${z - 1}-${i}`,
            `${z - 2}-${i}`
          ];
          
          const isNeighborOccupied = neighbors.some(n => occupied[wall].has(n));

          if (!isNeighborOccupied) {
            occupied[wall].add(`${z}-${i}`);
            
            layout.push({
              pos: isHorizontal 
                ? [pos, (wall === 0 ? 1 : -1) * (TUNNEL_HEIGHT / 2), zPos]
                : [(wall === 2 ? -1 : 1) * (TUNNEL_WIDTH / 2), pos, zPos],
              rot: isHorizontal
                ? [(wall === 0 ? 1 : -1) * (Math.PI / 2), 0, 0]
                : [0, (wall === 2 ? 1 : -1) * (Math.PI / 2), 0],
              url: ASSETS[Math.floor(Math.random() * ASSETS.length)]
            });
          }
        }
      });
    }
  }
  return layout;
})();

function ImageTile({ position, rotation, url }: { position: [number, number, number], rotation: [number, number, number], url: string }) {
  const [hovered, setHovered] = useState(false);
  const scaleRef = useRef(new THREE.Vector3(1, 1, 1));

  useFrame((_, delta) => {
    const target = hovered ? 1.1 : 1;
    scaleRef.current.lerp(new THREE.Vector3(target, target, target), 10 * delta);
  });

  return (
    <group position={position} rotation={rotation}>
      <group
        scale={scaleRef.current}
        position={[0, 0, 0.05]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <Image
          url={url}
          scale={[CELL_SIZE, CELL_SIZE]}
          toneMapped={false}
          transparent
          side={THREE.DoubleSide}
        />
        {hovered && (
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[CELL_SIZE, CELL_SIZE]} />
            <meshBasicMaterial color="#D1FF00" transparent opacity={0.4} />
          </mesh>
        )}
      </group>
    </group>
  );
}

function TunnelBlock({ offsetZ }: { offsetZ: number }) {
  const gridTexture = useMemo(() => createGridTexture(), []);

  const floorTex = useMemo(() => {
    const t = gridTexture.clone();
    t.repeat.set(TUNNEL_WIDTH / CELL_SIZE, TUNNEL_LENGTH / CELL_SIZE);
    return t;
  }, [gridTexture]);

  const wallTex = useMemo(() => {
    const t = gridTexture.clone();
    t.repeat.set(TUNNEL_LENGTH / CELL_SIZE, TUNNEL_HEIGHT / CELL_SIZE);
    return t;
  }, [gridTexture]);

  return (
    <group position={[0, 0, offsetZ]}>
      {/* Tường TRÊN */}
      <mesh position={[0, TUNNEL_HEIGHT / 2, -TUNNEL_LENGTH / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[TUNNEL_WIDTH, TUNNEL_LENGTH]} />
        <meshStandardMaterial map={floorTex} roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Tường DƯỚI */}
      <mesh position={[0, -TUNNEL_HEIGHT / 2, -TUNNEL_LENGTH / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[TUNNEL_WIDTH, TUNNEL_LENGTH]} />
        <meshStandardMaterial map={floorTex} roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Tường TRÁI */}
      <mesh position={[-TUNNEL_WIDTH / 2, 0, -TUNNEL_LENGTH / 2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[TUNNEL_LENGTH, TUNNEL_HEIGHT]} />
        <meshStandardMaterial map={wallTex} roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Tường PHẢI */}
      <mesh position={[TUNNEL_WIDTH / 2, 0, -TUNNEL_LENGTH / 2]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[TUNNEL_LENGTH, TUNNEL_HEIGHT]} />
        <meshStandardMaterial map={wallTex} roughness={0.5} metalness={0.5} />
      </mesh>

      {FIXED_LAYOUT.map((item, i) => (
        <ImageTile
          key={`${offsetZ}-${i}`}
          position={item.pos}
          rotation={item.rot}
          url={item.url}
        />
      ))}
    </group>
  );
}

function InfiniteTunnelController() {
  const scrollRef = useRef(0);
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      scrollRef.current -= e.deltaY * 0.05;
    };

    const onMouseDown = () => { isDragging.current = true; };
    const onMouseUp = () => { isDragging.current = false; targetRotation.current = { x: 0, y: 0 }; };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      targetRotation.current.y += e.movementX * 0.002;
      targetRotation.current.x += e.movementY * 0.002;
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  useFrame((state, delta) => {
    if (!isDragging.current) {
      scrollRef.current += 10 * delta;
    }

    const z = -(scrollRef.current % TUNNEL_LENGTH);
    state.camera.position.z = z + 50;

    currentRotation.current.x = THREE.MathUtils.lerp(currentRotation.current.x, targetRotation.current.x, 5 * delta);
    currentRotation.current.y = THREE.MathUtils.lerp(currentRotation.current.y, targetRotation.current.y, 5 * delta);
    state.camera.rotation.x = -currentRotation.current.x;
    state.camera.rotation.y = -currentRotation.current.y;
  });

  return (
    <group>
      <TunnelBlock offsetZ={TUNNEL_LENGTH} />
      <TunnelBlock offsetZ={0} />
      <TunnelBlock offsetZ={-TUNNEL_LENGTH} />
      <TunnelBlock offsetZ={-TUNNEL_LENGTH * 2} />
    </group>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function Store() {
  const [activeFilter, setActiveFilter] = useState<'all' | '3d-toys' | 'blind-box' | 'limited'>('all');
  const [selectedProduct, setSelectedProduct] = useState<ToyProduct | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const tunnelRef = useRef<HTMLDivElement>(null);

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'all') return TOY_PRODUCTS;
    return TOY_PRODUCTS.filter(p => p.category === activeFilter);
  }, [activeFilter]);

  const handleAddToCart = (product: ToyProduct) => {
    setToastMessage(`Đã thêm "${product.name}" vào giỏ hàng thành công!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const scrollToTunnel = () => {
    tunnelRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] text-black overflow-x-hidden font-sans select-none">

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: PLAYFUL DESIGNER TOY SHOWCASE (IMAGE LAYOUT)
      ═══════════════════════════════════════════════════════════ */}
      <div className="relative w-full bg-[#FFFFFF] pt-24 sm:pt-28 md:pt-32 pb-0 flex flex-col items-center">
        
        {/* CONTAINER CHÍNH */}
        <div className="w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">

          {/* ── HERO HEADLINE & OVERLAPPING 3D ART TOY (BỐ CỤC EDITORIAL THEO THAM CHIẾU ẢNH) ── */}
          <div className="relative pt-2 pb-8 sm:pb-12 flex flex-col items-center justify-between min-h-[500px] sm:min-h-[560px] w-full select-none">
            
            {/* 1. HUGE DECORATIVE BACKGROUND TYPOGRAPHY (CHỮ KHỔNG LỒ NỀN PHÍA TRÊN SÁNG TẠO ĐỒ CHƠI) */}
            <div className="w-full text-center relative z-0 pointer-events-none select-none px-2 pt-2">
              <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-[120px] xl:text-[140px] text-[#FF5500] uppercase tracking-tighter leading-[0.85] whitespace-nowrap drop-shadow-sm">
                SÁNG TẠO ĐỒ CHƠI
              </h1>
              <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-[85px] xl:text-[100px] text-[#FF009C] uppercase tracking-tighter leading-[0.9] whitespace-nowrap mt-1">
                & NGHỆ THUẬT TÁI SINH
              </h1>
            </div>

            {/* 2. OVERLAPPING CENTER 3D TOY CHARACTER (MÔ HÌNH 3D ĐÈ CHÍNH GIỮA LÊN CHỮ KHỔNG LỒ) */}
            <div className="absolute top-[38%] sm:top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[360px] md:w-[420px] h-[280px] sm:h-[360px] md:h-[400px] flex items-center justify-center z-20 pointer-events-auto">
              {/* Soft Flower Blob Background đằng sau ArtToy (như trong ảnh mẫu) */}
              <svg
                viewBox="0 0 200 200"
                className="absolute inset-0 w-full h-full pointer-events-none scale-125 opacity-25"
                fill="#FFB0D0"
              >
                <path d="M48,-62C61,-53,70,-38,74,-22C78,-6,77,11,70,25C63,39,50,50,36,58C22,66,7,71,-9,72C-25,73,-41,70,-53,60C-65,50,-73,33,-75,16C-77,-1,-73,-18,-64,-32C-55,-46,-41,-57,-26,-65C-11,-73,6,-78,22,-74C38,-70,35,-71,48,-62Z" transform="translate(100 100)" />
              </svg>

              {/* 3D Canvas Model Viewer */}
              <div className="relative z-10 w-full h-full">
                <InteractiveProductToy3D
                  modelUrl={toychaiModel}
                  targetSize={3.0}
                />
              </div>
            </div>

            {/* 3. SIDE ANNOTATIONS & CTA BUTTON (CÁC THÔNG TIN & NÚT BẤM HAI BÊN THEO ẢNH MẪU) */}
            <div className="w-full relative z-30 pointer-events-auto mt-auto pt-24 sm:pt-28 md:pt-32">
              
              {/* Top-Left Caption Note */}
              <div className="hidden md:block absolute -top-44 lg:-top-52 left-0 max-w-[230px] text-left">
                <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest block font-bold mb-1">
                  Chế tác thủ công // Từ 2026
                </span>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0020D7]/10 text-[#0020D7] font-mono text-[10px] font-bold uppercase">
                  <Sparkles size={12} /> 100% Eco-Plastic Art
                </div>
              </div>

              {/* Top-Right Subtext */}
              <div className="hidden md:block absolute -top-44 lg:-top-52 right-0 max-w-[260px] text-right">
                <p className="font-sans text-xs text-gray-600 leading-relaxed font-medium">
                  Mô hình đồ chơi độc bản đúc nhiệt nguyên khối từ nắp chai nhựa & rác thải đại dương.
                </p>
              </div>

              {/* Middle-Left Action Pill Box & Button */}
              <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 w-full">
                
                {/* Left Side Pill Callout CTA Button */}
                <div className="max-w-[300px] text-left">
                  <p className="font-sans text-xs text-gray-700 leading-relaxed font-medium mb-3">
                    Các mô hình đồ chơi tái sinh độc bản sở hữu sắc màu ngẫu nhiên & chip NFC bảo chứng On-Chain.
                  </p>
                  <button 
                    onClick={scrollToTunnel}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FF009C] text-white font-mono text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#000000] hover:bg-[#0020D7] hover:scale-105 transition-all cursor-pointer border-2 border-black"
                  >
                    <span>+ KHÁM PHÁ BỘ SƯU TẬP</span>
                  </button>
                </div>

                {/* Mobile layout caption */}
                <div className="block md:hidden text-center text-xs text-gray-500 font-mono">
                  RELIFE LAB // ECO PLASTIC TOY SERIES
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            WAVE CARD SECTION (NỀN XANH DƯƠNG THƯƠNG HIỆU #0020D7)
        ═══════════════════════════════════════════════════════════ */}
        {/* 🔵 [1. VỊ TRÍ TOÀN KHU VỰC NỀN XANH DƯƠNG]: pt-16 (khoảng cách trên), pb-0 (khoảng cách dưới), px-4 (lề hai bên) */}
        <div 
          className="relative w-full pt-14 sm:pt-16 pb-0 px-4 sm:px-6 lg:px-8 flex flex-col items-center shadow-inner"
          style={{ backgroundColor: BRAND.blue }}
        >
          {/* Top Wavy SVG Mask Edge (Hiệu ứng sóng lượn viền trên) */}
          <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none z-10 -translate-y-[99%]">
            <svg
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              className="relative block w-full h-10 sm:h-16 lg:h-20"
              fill={BRAND.blue}
            >
              <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,60 L1200,120 L0,120 Z" />
            </svg>
          </div>

          {/* 🔵 [2. VỊ TRÍ KHUNG NỘI DUNG CHÍNH (MAX WIDTH 1240PX)] */}
          <div className="w-full max-w-[1240px] relative z-20">
            
            {/* 🔵 [3. VỊ TRÍ TIÊU ĐỀ SECTION & MÔ TẢ PHỤ BÊN PHẢI]: mb-6 (khoảng cách với thanh tab phía dưới) */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-4 sm:mb-6">
              <div>
                {/* 3.1. Dòng chữ nhỏ bên trên tiêu đề */}
                <span className="font-mono text-xs text-white/80 font-bold uppercase tracking-widest block mb-1">
                  RELIFE LAB COLLECTIBLE SERIES
                </span>
                {/* 3.2. Tiêu đề lớn BỘ SƯU TẬP ĐẶC BIỆT */}
                <h3 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white drop-shadow-[2px_2px_0px_#000000]">
                  BỘ SƯU TẬP ĐẶC BIỆT
                </h3>
              </div>

              {/* 3.3. Đoạn mô tả phụ bên phải: w-[340px] (độ rộng khối text) */}
              <div className="w-full md:w-[340px] text-xs font-sans text-white/90 font-medium leading-relaxed">
                Mỗi mô hình đều được tích hợp chip NFC xác thực chuỗi cung ứng nhựa, số series đúc thủ công và chứng nhận tái chế On-Chain.
              </div>
            </div>

            {/* 🟡 [4. VỊ TRÍ THANH FILTER TABS (CÁC NÚT BẤM CHUYỂN DANH MỤC)]:
                - gap-2.5 sm:gap-3 (khoảng cách giữa các nút)
                - pb-4 (khoảng cách đáy với các Card bên dưới)
            */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap pb-4 pt-1">
              {/* Option 1: Tất cả */}
              <button
                onClick={() => setActiveFilter('all')}
                style={{
                  backgroundColor: activeFilter === 'all' ? BRAND_SECONDARY.green : '#FFFFFF',
                  color: BRAND.black,
                }}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-mono text-xs font-black uppercase transition-all flex items-center gap-2 border-2 border-black cursor-pointer ${
                  activeFilter === 'all' 
                    ? 'shadow-[3px_3px_0px_#000000] scale-105' 
                    : 'hover:bg-gray-100 shadow-[2px_2px_0px_#000000]'
                }`}
              >
                <span>TẤT CẢ</span>
                <span className={`w-2 h-2 rounded-full ${activeFilter === 'all' ? 'bg-black' : 'bg-gray-300'}`} />
              </button>

              {/* Option 2: Đồ chơi 3D */}
              <button
                onClick={() => setActiveFilter('3d-toys')}
                style={{
                  backgroundColor: activeFilter === '3d-toys' ? BRAND_SECONDARY.green : '#FFFFFF',
                  color: BRAND.black,
                }}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-mono text-xs font-black uppercase transition-all flex items-center gap-2 border-2 border-black cursor-pointer ${
                  activeFilter === '3d-toys' 
                    ? 'shadow-[3px_3px_0px_#000000] scale-105' 
                    : 'hover:bg-gray-100 shadow-[2px_2px_0px_#000000]'
                }`}
              >
                <span>ĐỒ CHƠI 3D</span>
                <span className={`w-2 h-2 rounded-full ${activeFilter === '3d-toys' ? 'bg-black' : 'bg-gray-300'}`} />
              </button>

              {/* Option 3: Giới hạn */}
              <button
                onClick={() => setActiveFilter('limited')}
                style={{
                  backgroundColor: activeFilter === 'limited' ? BRAND_SECONDARY.green : '#FFFFFF',
                  color: BRAND.black,
                }}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-mono text-xs font-black uppercase transition-all flex items-center gap-2 border-2 border-black cursor-pointer ${
                  activeFilter === 'limited' 
                    ? 'shadow-[3px_3px_0px_#000000] scale-105' 
                    : 'hover:bg-gray-100 shadow-[2px_2px_0px_#000000]'
                }`}
              >
                <span>GIỚI HẠN</span>
                <span className={`w-2 h-2 rounded-full ${activeFilter === 'limited' ? 'bg-black' : 'bg-gray-300'}`} />
              </button>

              {/* Option 4: Triển lãm 3D */}
              <button
                onClick={scrollToTunnel}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-mono text-xs font-black uppercase transition-all flex items-center gap-2 border-2 border-black bg-[#0020D7] text-white hover:bg-[#FF009C] cursor-pointer shadow-[3px_3px_0px_#000000]"
              >
                <span>TRIỂN LÃM 3D</span>
                <ChevronDown size={14} />
              </button>
            </div>

            {/* 🟡 [5. VỊ TRÍ LƯỚI 3 CARD SẢN PHẨM (GRID 3 CỘT)]:
                - pt-20 sm:pt-28 (khoảng cách trên tạo không gian cho 3D mascot nhô lên mà KHÔNG bị đè vào các tab)
                - gap-8 sm:gap-6 lg:gap-8 (khoảng cách giữa các Card)
            */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-6 lg:gap-8 pt-20 sm:pt-28">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  /* 🟢 [5.1. KHUNG CARD CHÍNH]:
                      - rounded-[36px] sm:rounded-[44px] (độ bo tròn góc)
                      - p-6 sm:p-7 (khoảng cách đệm viền trong card)
                      - hover:-translate-y-2 (độ nhấc bổng khi rê chuột)
                  */
                  className="group relative bg-[#FFFFFF] rounded-[36px] sm:rounded-[44px] p-6 sm:p-7 flex flex-col justify-between shadow-[0_15px_35px_rgba(0,0,0,0.08)] border-2 border-black/5 hover:border-black transition-all duration-300 hover:shadow-[8px_8px_0px_#000000] hover:-translate-y-2 cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  {/* 🟢 [5.2. VỊ TRÍ BADGE TAG (BEST SELLER / LIMITED 100 / EXCLUSIVE)]:
                      - top-5 right-5 (vị trí góc trên bên phải card, không bị đè ra ngoài)
                      - px-3 py-1 (độ dày viền badge)
                  */}
                  <div className="absolute top-5 right-5 px-3 py-1 rounded-full bg-black text-white font-mono text-[9px] font-black uppercase tracking-wider shadow-sm pointer-events-none z-20">
                    {product.tag}
                  </div>

                  {/* 🟢 [5.3. VỊ TRÍ KHUNG MÔ HÌNH 3D NỔI (3D MASCOT)]:
                      - -mt-24 sm:-mt-32 (độ nhô cao ra khỏi đỉnh card)
                      - h-60 sm:h-72 (chiều cao khu vực hiển thị 3D)
                      - mb-1 (khoảng cách dưới đến tiêu đề)
                  */}
                  <div className="relative -mt-24 sm:-mt-32 mb-1 h-60 sm:h-72 flex items-center justify-center cursor-grab active:cursor-grabbing overflow-visible z-10">
                    <InteractiveProductToy3D
                      modelUrl={product.model3d || toychaiModel}
                      targetSize={product.targetSize || 2.45}
                      scaleMultiplier={product.scaleMultiplier || 1.0}
                      yOffset={product.yOffset || 0}
                    />
                  </div>

                  {/* 🟢 [5.4. KHỐI THÔNG TIN SẢN PHẨM BÊN TRONG CARD] */}
                  <div className="flex-1 flex flex-col justify-between z-10">
                    <div>
                      {/* Tên sản phẩm: mb-1 (khoảng cách dưới), text-3xl sm:text-4xl (kích thước font) */}
                      <h4 className="font-display font-black text-3xl sm:text-4xl text-black tracking-tight uppercase leading-tight mb-1 group-hover:text-[#0020D7] transition-colors">
                        {product.name}
                      </h4>
                      {/* Phụ đề / Tên tiếng: mb-3 (khoảng cách dưới), text-[11px] */}
                      <p className="font-mono text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-3">
                        {product.russianName} • {product.subtitle}
                      </p>
                      {/* Mô tả sản phẩm: mb-4 (khoảng cách dưới), line-clamp-3 (tối đa 3 dòng) */}
                      <p className="font-sans text-xs text-gray-600 leading-relaxed mb-4 line-clamp-3">
                        {product.description}
                      </p>

                      {/* 🟢 [5.5. VỊ TRÍ CÁC BADGE THÔNG SỐ TÁI CHẾ (NẮP CHAI, NFC)]: mb-6 (khoảng cách với thanh giá) */}
                      <div className="flex items-center gap-2 mb-6">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 font-mono text-[10px] font-bold">
                          <Layers size={12} className="text-[#0020D7]" /> {product.capsEquivalent} nắp chai
                        </span>
                        {product.nfcEnabled && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#A7F417]/20 text-black font-mono text-[10px] font-bold">
                            <ShieldCheck size={12} className="text-green-700" /> NFC Verified
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 🟢 [5.6. VỊ TRÍ THANH MUA HÀNG DƯỚI ĐÁY (NÚT BẤM + GIÁ TIỀN)]: pt-3 (khoảng cách đệm trên) */}
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
                      {/* Nút SỞ HỮU NGAY: py-3 px-4 (độ cao và rộng nút) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        style={{ backgroundColor: BRAND_SECONDARY.green, color: BRAND.black }}
                        className="flex-1 py-3 px-4 rounded-full font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
                      >
                        <ShoppingBag size={14} />
                        <span>SỞ HỮU NGAY</span>
                      </button>

                      {/* Khối hiển thị Giá tiền & Giá gốc: text-right */}
                      <div className="text-right">
                        <span className="font-display font-black text-xl sm:text-2xl text-black tracking-tight block leading-none">
                          {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="font-mono text-[10px] text-gray-400 line-through block mt-0.5">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── BOTTOM WAVE CALL-TO-ACTION DOME (HÌNH VÒM TRẮNG UỐN LƯỢN CHUẨN ẢNH MẪU) ── */}
          <div className="w-full max-w-[1240px] mt-16 sm:mt-24">
            <div className="relative bg-[#FFFFFF] rounded-t-[80px] sm:rounded-t-[140px] md:rounded-t-[180px] pt-12 sm:pt-16 pb-14 px-6 sm:px-12 text-center shadow-xl border-t-2 border-black/5 flex flex-col items-center">
              <h3 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-[#FF5500] uppercase tracking-tight max-w-[800px] leading-snug mb-3">
                Tham gia cùng RELIFE LAB kiến tạo thế giới xanh & mở ra vũ trụ đồ chơi tái chế!
              </h3>
              <p className="font-sans text-xs sm:text-sm text-gray-600 max-w-[580px] mb-8">
                Mỗi mảnh ghép là một hành trình tái sinh, kết hợp sự tỉ mỉ của nghệ nhân và công nghệ đúc nén hạt nhựa nguyên chất.
              </p>

              <button
                onClick={() => setSelectedProduct(TOY_PRODUCTS[0])}
                style={{ backgroundColor: BRAND_SECONDARY.green, color: BRAND.black }}
                className="px-10 py-4 rounded-full font-mono text-sm font-black uppercase tracking-widest shadow-[4px_4px_0px_#000000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer flex items-center gap-2"
              >
                <span>TỰ THIẾT KẾ MÔ HÌNH (CUSTOM DROP)</span>
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: 3D KINETIC TUNNEL EXPERIENCE (GIỮ NGUYÊN CODE CŨ)
      ═══════════════════════════════════════════════════════════ */}
      <div 
        ref={tunnelRef}
        id="kinetic-tunnel-section"
        className="relative w-full h-screen bg-[#000000] text-white overflow-hidden border-t-4 border-[#D1FF00]"
      >
        {/* Section Header Overlay */}
        <div className="absolute top-8 left-8 sm:top-12 sm:left-12 z-20 pointer-events-none mix-blend-difference text-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#D1FF00] animate-ping" />
            <span className="font-mono text-xs text-[#D1FF00] uppercase tracking-widest font-bold">
              3D Interactive Space
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl uppercase tracking-tighter leading-none mb-2 text-white">
            KINETIC<br />TUNNEL_V2
          </h2>
          <p className="font-mono text-[11px] text-gray-400 uppercase tracking-widest max-w-xs leading-relaxed">
            Cuộn chuột để bay xuyên đường hầm • Kéo thả chuột để điều khiển góc nhìn
          </p>
        </div>

        {/* Top-Right Gallery Jump-back */}
        <div className="absolute top-8 right-8 z-20">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-4 py-2 rounded-full bg-[#D1FF00] text-black font-mono text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#FFFFFF] hover:bg-white transition-all cursor-pointer"
          >
            ↑ Xem Danh Mục Đồ Chơi
          </button>
        </div>

        {/* 3D Canvas Tunnel */}
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
          style={{ width: '100%', height: '100%' }}
        >
          <color attach="background" args={["#000000"]} />
          <fog attach="fog" args={["#000000", 10, 220]} />
          <ambientLight intensity={1.5} />
          <pointLight position={[0, 0, 0]} intensity={1} color="#D1FF00" />
          <PerspectiveCamera makeDefault position={[0, 0, 50]} fov={85} near={0.1} far={10000} />
          <InfiniteTunnelController />
          <Environment preset="night" />
        </Canvas>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          INTERACTIVE QUICK VIEW MODAL
      ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[36px] p-6 sm:p-8 shadow-[8px_8px_0px_#000000] border-3 border-black text-black overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-5 right-5 w-10 h-10 rounded-full bg-gray-100 border-2 border-black flex items-center justify-center font-bold hover:bg-[#FF009C] hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Product 3D Figure Viewer (Mô hình 3D tương tác xoay 360 độ, không bị cắt viền) */}
                <div className="w-56 h-56 sm:w-64 sm:h-64 bg-gray-50 rounded-2xl border-2 border-black/10 flex items-center justify-center p-2 cursor-grab active:cursor-grabbing relative overflow-hidden">
                  <InteractiveProductToy3D
                    modelUrl={selectedProduct.model3d || toychaiModel}
                    targetSize={2.45}
                    enableZoom={true}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 text-left">
                  <span className="font-mono text-[10px] text-[#FF5500] font-black uppercase tracking-wider block mb-1">
                    {selectedProduct.category.toUpperCase()} • {selectedProduct.tag}
                  </span>
                  <h3 className="font-display font-black text-3xl uppercase tracking-tight text-black mb-1">
                    {selectedProduct.name}
                  </h3>
                  <p className="font-mono text-xs text-gray-500 font-bold mb-3">
                    {selectedProduct.russianName} • {selectedProduct.subtitle}
                  </p>
                  <p className="font-sans text-xs text-gray-600 leading-relaxed mb-4">
                    {selectedProduct.description}
                  </p>

                  <div className="space-y-1.5 mb-5 font-mono text-[11px] bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Chất liệu tái chế:</span>
                      <span className="font-bold text-black">{selectedProduct.recycledMaterial}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Quy đổi tương đương:</span>
                      <span className="font-bold text-[#0020D7]">{selectedProduct.capsEquivalent} nắp chai</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Xác thực On-Chain:</span>
                      <span className="font-bold text-green-600">NFC Chip Tagged</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="font-display font-black text-2xl text-black">
                      {selectedProduct.price}
                    </span>
                    <button
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      style={{ backgroundColor: BRAND_SECONDARY.green, color: BRAND.black }}
                      className="px-6 py-3 rounded-full font-mono text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#000000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <ShoppingBag size={14} />
                      <span>THÊM VÀO GIỎ</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── TOAST NOTIFICATION ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[10001] px-6 py-3 rounded-full bg-black text-white border-2 border-[#D1FF00] shadow-[4px_4px_0px_#D1FF00] font-mono text-xs font-bold flex items-center gap-2"
          >
            <CheckCircle2 size={16} className="text-[#D1FF00]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
