import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, Sparkles, RefreshCw } from 'lucide-react';

// Import rich eco-materials and plastic art assets
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
import flakeImg from '../assets/hatnhua/brown-pet-bottle-flake.jpg';
import pelletImg from '../assets/hatnhua/1000_F_498656287_1lcSsrYuBZWguTdiFvZ2CcePd3Puc1f4.jpg';

// Import 3D Plastic Bottles for the floating surrounding effect
import chai1Model from '../assets/PLASTIC 3D/chai1.glb?url';
import chai2Model from '../assets/PLASTIC 3D/chai2.glb?url';
import chai3Model from '../assets/PLASTIC 3D/chai3.glb?url';

useGLTF.preload(chai1Model);
useGLTF.preload(chai2Model);
useGLTF.preload(chai3Model);

/**
 * ============================================================================
 * 🎛️ BẢNG CẤU HÌNH ĐIỀU CHỈNH SPIRAL 3D SLIDER BẰNG CODE (TÙY CHỈNH DỄ DÀNG)
 * ============================================================================
 */
export const SPIRAL_CONFIG = {
  // 🔄 1. TỰ ĐỘNG XOAY (AUTO-ROTATION)
  autoRotate: true,            // true: Bật tự động xoay | false: Tắt tự động xoay
  rotationSpeed: 0.35,         // Tốc độ xoay tự động (Ví dụ: 0.2: chậm êm ái, 0.5: nhanh hơn)

  // 🌀 2. THÔNG SỐ QUỸ ĐẠO XOẮN ỐC NHIỀU TẦNG DÀY ĐẶC (GIỮ NGUYÊN 16 - 18 ẢNH TRONG KHUNG NHÌN)
  angleStep: 0.62,             // Góc xoay giữa các thẻ liền kề
  heightStep: 1.25,            // 👈 Tăng độ cao bậc thang để kéo dài chiều cao tổng thể của dãy xoắn ốc
  baseRadius: 5.9,             // Bán kính vòng xoắn ốc hình trụ
  visibleLimit: 13.0,          // 👈 Tăng giới hạn hiển thị để thấy thêm nhiều tầng ảnh trên/dưới

  // 🧭 3. CĂN CHỈNH GÓC XOAY ĐỨNG CHUẨN (CÁC CẠNH ẢNH SONG SONG 100%)
  tiltXMultiplier: 0.0,        // 0.0: Thẻ đứng thẳng theo trục, các cạnh đứng song song tuyệt đối 100%
  tiltZMultiplier: 0.0,        // 0.0: Triệt tiêu góc nghiêng lượn sóng để các mép ảnh kế bên luôn song song đều tăm tắp

  // 🎴 4. KÍCH THƯỚC ĐỒNG BỘ & ĐỘ CONG LỒI (UNIFORM CONVEX CARDS)
  cardWidth: 3.2,              // Chiều rộng chuẩn của tất cả thẻ ảnh (GIỮ NGUYÊN KÍCH THƯỚC)
  cardHeight: 2.05,            // Chiều cao chuẩn của tất cả thẻ ảnh (GIỮ NGUYÊN KÍCH THƯỚC)
  curveRadius: 4.8,            // Bán kính cong hình trụ
  curveIntensity: 0.85,        // Độ cong lồi nhẹ tự nhiên hướng về người xem

  // 🍾 5. CẤU HÌNH CHAI NHỰA 3D LƠ LỬNG (FLOATING 3D BOTTLES)
  showFloatingBottles: true,   // true: Bật chai nhựa 3D lơ lửng xung quanh | false: Ẩn
  bottleScaleTopLeft: 1.0,     // Tỉ lệ chai nhựa góc trên - trái
  bottleScaleBottomLeft: 1.1,  // Tỉ lệ chai nhựa góc dưới - trái
  bottleScaleBottomRight: 1.05,// Tỉ lệ chai nhựa góc dưới - phải

  // 📡 6. CẤU HÌNH CÁC CỤM THÔNG TIN & THANH CHỈ DẪN (INFO HUD CALLOUTS CONFIG)
  showInfoCallouts: true,      // true: Bật hiển thị các cụm thông tin | false: Ẩn

  // 🔴 CỤM 1: VẤN NẠN Ô NHIỄM (GÓC TRÁI - MID LEFT) — CHỈNH VỊ TRÍ TẠI ĐÂY
  calloutPlasticCrisis: {
    top: '36%',                // ← Vị trí dọc từ trên xuống (%)
    left: '4%',                // ← Vị trí ngang từ lề trái (%)
    offsetX: -350,                // ← Dịch ngang thêm (px): số âm (-) sang trái, số dương (+) sang phải
    offsetY: 0,                // ← Dịch dọc thêm (px): số âm (-) lên trên, số dương (+) xuống dưới
    scale: 1.0,                // ← Phóng to / thu nhỏ cụm thông tin (1.0 = 100%)
    lineWidth: 90,             // ← Độ dài thanh chỉ line (px)
    lineColor: '#FF009C',      // ← Màu sắc thanh chỉ line đơn sắc
  },

  // 🟢 CỤM 2: TẦM QUAN TRỌNG CỦA TÁI SINH (GÓC PHẢI TRÊN - TOP RIGHT) — CHỈNH VỊ TRÍ TẠI ĐÂY
  calloutWhyRecycle: {
    top: '12%',                // ← Vị trí dọc từ trên xuống (%)
    right: '4%',               // ← Vị trí ngang từ lề phải (%)
    offsetX: 300,                // ← Dịch ngang thêm (px)
    offsetY: 0,                // ← Dịch dọc thêm (px)
    scale: 1.0,                // ← Phóng to / thu nhỏ
    lineWidth: 90,             // ← Độ dài thanh chỉ line (px)
    lineColor: '#0020D7',      // ← Màu sắc thanh chỉ line đơn sắc
  },

  // 🔵 CỤM 3: GIẢI PHÁP RE-LIFE (GÓC PHẢI DƯỚI - BOTTOM RIGHT) — CHỈNH VỊ TRÍ TẠI ĐÂY
  calloutCircularArt: {
    bottom: '10%',             // ← Vị trí dọc từ đáy lên (%)
    right: '4%',               // ← Vị trí ngang từ lề phải (%)
    offsetX: 150,                // ← Dịch ngang thêm (px) 
    offsetY: 0,                // ← Dịch dọc thêm (px)
    scale: 1.0,                // ← Phóng to / thu nhỏ
    lineWidth: 90,             // ← Độ dài thanh chỉ line (px)
    lineColor: '#0020D7',      // ← Màu sắc thanh chỉ line đơn sắc
  },

  // 🌟 7. HIỆU ỨNG TẬP TRUNG 3 ẢNH & LÀM MỜ OPACITY (GIỮ NGUYÊN 100% MÀU GỐC)
  activeCardOpacity: 1.0,         // Độ rõ nét 3 thẻ chính diện (100% - Đậm đặc, rõ nét)
  inactiveCardOpacity: 0.25,      // Độ mờ trong suốt của các thẻ ở xa (25% - Mờ dạng opacity)
  focusPlateau: 1.25,             // Bán kính vùng rõ nét 100% (đảm bảo trọn vẹn 3 thẻ liền kề luôn rõ nét tuyệt đối)
  focusTransition: 1.1,           // Khoảng cách chuyển tiếp mờ dần mượt mà
  focusScaleMultiplier: 1.06,     // Độ phóng nhẹ tinh tế của 3 thẻ khi ở vị trí chính diện

  // 🔍 8. ĐỘ NHẠY CUỘN CHUỘT & KÉO THẢ (INTERACTION SENSITIVITY)
  scrollSensitivity: 0.0035,   // Độ nhạy khi lăn bánh xe chuột
  dragSensitivity: 0.007,      // Độ nhạy khi kéo thả chuột / vuốt cảm ứng

  // 📐 9. CHIỀU CAO KHUNG NHÌN 3D
  containerHeight: 'h-[920px] sm:h-[1020px] md:h-[1140px]',
};

export interface SpiralCardData {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  materialCode: string;
  description: string;
  imageUrl: string;
  color: string;
}

// 🟢 MỞ RỘNG BỘ SƯU TẬP LÊN 20 THẺ ẢNH ĐỂ TẠO DẢI XOẮN ỐC DÀY DẶN & NHIỀU VÒNG XOẮN
const SPIRAL_ITEMS: SpiralCardData[] = [
  {
    id: 'spiral-1',
    title: 'Ocean Plastic Vortex',
    subtitle: 'Supreme Marine Recovery',
    category: 'RE-CIRCULATION',
    materialCode: 'HDPE #2 • Marine Grade',
    description: 'Chất liệu hạt nhựa thu gom từ các xoáy rác đại dương, được xử lý nhiệt hóa sinh học để tạo nên bề mặt phản quang nghệ thuật độc bản.',
    imageUrl: img1,
    color: '#D1FF00',
  },
  {
    id: 'spiral-2',
    title: 'Microplastic Luminescence',
    subtitle: 'Spectral Optical Density',
    category: 'BIO-SYNTHESIS',
    materialCode: 'PET #1 • 0.94 g/cm³',
    description: 'Nghiên cứu cấu trúc quang học của vi hạt nhựa dưới quang phổ tán xạ ánh sáng, ứng dụng vào thiết kế nội thất tương lai.',
    imageUrl: img2,
    color: '#FF009C',
  },
  {
    id: 'spiral-3',
    title: 'Thermodynamic Rebirth',
    subtitle: 'Thermal Compression Matrix',
    category: 'HEAT-CASTING',
    materialCode: 'rPP #5 • Polypropylene',
    description: 'Quá trình đúc nén nhiệt đa tầng ở 240°C tạo nên các thớ hoa văn cẩm thạch tự nhiên từ nắp chai tái sinh.',
    imageUrl: img3,
    color: '#0020D7',
  },
  {
    id: 'spiral-4',
    title: 'Pellet Genesis',
    subtitle: 'Pure Recycled Granules',
    category: 'RAW_MATERIAL',
    materialCode: '100% PCR HDPE',
    description: 'Hạt nhựa nguyên sinh tái chế chất lượng cao, tiền đề cho các mẫu đồ chơi nghệ thuật RELIFE LAB Collectibles.',
    imageUrl: pelletImg,
    color: '#A7F417',
  },
  {
    id: 'spiral-5',
    title: 'Bio-Polymer Hybrid',
    subtitle: 'Algae & Synthetic Bond',
    category: 'HYBRID_LAB',
    materialCode: 'Bio-PET 40%',
    description: 'Thử nghiệm kết hợp giữa sợi tảo biển hữu cơ và nhựa tái chế nhằm giảm tối đa lượng carbon thải ra môi trường.',
    imageUrl: img4,
    color: '#00F0FF',
  },
  {
    id: 'spiral-6',
    title: 'Flake Morphology',
    subtitle: 'Cryogenic Shredding',
    category: 'MECHANICAL',
    materialCode: 'Flaked PET Flakes',
    description: 'Các mảnh vảy nhựa được cắt nghiền siêu mịn qua hệ thống lưỡi dao ly tâm không sinh nhiệt.',
    imageUrl: flakeImg,
    color: '#FFDE00',
  },
  {
    id: 'spiral-7',
    title: 'Chromatic Fusion',
    subtitle: 'Natural Mineral Pigments',
    category: 'COLOR_ART',
    materialCode: 'Non-Toxic Mineral Dye',
    description: 'Phối trộn màu sắc sử dụng khoáng chất tự nhiên không hóa chất độc hại, tôn vinh vẻ đẹp nguyên bản của nhựa tái chế.',
    imageUrl: img7,
    color: '#FF5500',
  },
  {
    id: 'spiral-8',
    title: 'Circular Matrix VII',
    subtitle: 'Multi-layer Molecular Lock',
    category: 'EXPERIMENTAL',
    materialCode: 'LDPE #4 Flexible Film',
    description: 'Màng nhựa dẻo cán mỏng nhiều lớp tạo độ bền uốn dẻo và tính ứng dụng linh hoạt cho các sản phẩm thời trang sinh thái.',
    imageUrl: img8,
    color: '#A7F417',
  },
  {
    id: 'spiral-9',
    title: 'Spectral Waste Art',
    subtitle: 'Contemporary Eco Artifact',
    category: 'GALLERY_PIECE',
    materialCode: 'Composite Mixed Recycled',
    description: 'Tác phẩm nghệ thuật trừu tượng từ hỗn hợp rác thải công nghiệp được chứng nhận On-Chain với chip NFC đính kèm.',
    imageUrl: img9,
    color: '#FF0087',
  },
  {
    id: 'spiral-10',
    title: 'Quantum Eco Horizon',
    subtitle: 'Future Horizon Synthesis',
    category: 'VISION_2030',
    materialCode: 'Circulated Lab Artifact',
    description: 'Biểu tượng của tương lai tuần hoàn không rác thải — nơi nghệ thuật và công nghệ tái chế hội tụ hoàn hảo.',
    imageUrl: img10,
    color: '#D1FF00',
  },
  {
    id: 'spiral-11',
    title: 'Marine Flake Genesis',
    subtitle: 'Ocean Plastic Processing',
    category: 'RE-CIRCULATION',
    materialCode: 'Ocean Bound PET #1',
    description: 'Vảy nhựa cắt từ rác thải bờ biển miền Trung, rửa sấy tiệt trùng bằng công nghệ vi bọt khí nano.',
    imageUrl: img5,
    color: '#00F0FF',
  },
  {
    id: 'spiral-12',
    title: 'Prismatic Resin Cast',
    subtitle: 'Refractive Heat Molding',
    category: 'HEAT-CASTING',
    materialCode: 'rPP Solid Marble',
    description: 'Hỗn hợp nắp chai ép khuôn nhiệt tạo nên vân đá cẩm thạch đa sắc độc bản cho từng tác phẩm sưu tầm.',
    imageUrl: img6,
    color: '#FF009C',
  },
  {
    id: 'spiral-13',
    title: 'Eco Poly-Matrix',
    subtitle: 'High Density Granulation',
    category: 'RAW_MATERIAL',
    materialCode: 'HDPE Granules #2',
    description: 'Hạt nhựa tái sinh dạng viên nén với độ tinh khiết 99.8%, sẵn sàng cho các công đoạn thổi đúc tinh xảo.',
    imageUrl: pelletImg,
    color: '#D1FF00',
  },
  {
    id: 'spiral-14',
    title: 'Sub-Zero Cryo Shred',
    subtitle: 'Thermal-Neutral Granulation',
    category: 'MECHANICAL',
    materialCode: 'PET Flakes Grade A',
    description: 'Mảnh vụn chai nhựa cắt lạnh bảo toàn cấu trúc polyme nguyên thủy, mang lại độ bền cơ học vượt trội.',
    imageUrl: flakeImg,
    color: '#FFDE00',
  },
  {
    id: 'spiral-15',
    title: 'Chromatic Eco Blend',
    subtitle: 'Non-Toxic Pigmentation',
    category: 'COLOR_ART',
    materialCode: 'Mineral Infused rPET',
    description: 'Công thức nhuộm khoáng tự nhiên không phát thải VOCs, tạo dải màu pastel sinh thái dịu mắt.',
    imageUrl: img1,
    color: '#0020D7',
  },
  {
    id: 'spiral-16',
    title: 'Coastal Recovery Wave',
    subtitle: 'Shoreline Plastic Catch',
    category: 'RE-CIRCULATION',
    materialCode: 'Marine HDPE 100%',
    description: 'Chiến dịch thu gom nắp chai và phao nhựa dọc bờ biển, trả lại vẻ đẹp hoang sơ cho đại dương.',
    imageUrl: img2,
    color: '#FF5500',
  },
  {
    id: 'spiral-17',
    title: 'Molecular Re-Bond',
    subtitle: 'Polymer Chain Alignment',
    category: 'BIO-SYNTHESIS',
    materialCode: 'Bio-Enhanced Polymer',
    description: 'Tái liên kết chuỗi phân tử nhựa thông qua xúc tác enzyme sinh học không dùng hóa chất nặng.',
    imageUrl: img3,
    color: '#A7F417',
  },
  {
    id: 'spiral-18',
    title: 'Thermic Form IX',
    subtitle: 'Multi-layer Compression',
    category: 'HEAT-CASTING',
    materialCode: 'rPP High Toughness',
    description: 'Độ bền kéo giãn và khả năng chịu lực đạt chuẩn đồ gia dụng cao cấp và tượng sưu tầm nghệ thuật.',
    imageUrl: img4,
    color: '#FF0087',
  },
  {
    id: 'spiral-19',
    title: 'Future Heritage Artifact',
    subtitle: 'Circular Sculpture',
    category: 'GALLERY_PIECE',
    materialCode: 'Hybrid Recycled Resin',
    description: 'Biểu tượng của kỷ nguyên xanh, nơi mỗi sản phẩm chứa đựng câu chuyện hồi sinh đầy ý nghĩa.',
    imageUrl: img8,
    color: '#00F0FF',
  },
  {
    id: 'spiral-20',
    title: 'Infinity Loop Synthesis',
    subtitle: 'Zero Waste Manifesto',
    category: 'VISION_2030',
    materialCode: 'Closed-Loop Material',
    description: 'Khép kín vòng tuần hoàn rác thải nhựa với 0% phát thải carbon ra môi trường sống.',
    imageUrl: img9,
    color: '#D1FF00',
  },
];

// Helper: Tạo hình học uốn cong lồi ra ngoài hướng về camera (Convex Curve)
function createCurvedPlaneGeometry(width: number, height: number, curveRadius: number = 4.8) {
  const geom = new THREE.PlaneGeometry(width, height, 32, 1);
  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const zOffset = curveRadius - Math.sqrt(Math.max(0.001, curveRadius * curveRadius - x * x));
    // 🟢 Dấu dương giúp tâm ảnh cong lồi ra phía trước người xem
    pos.setZ(i, zOffset * SPIRAL_CONFIG.curveIntensity);
  }
  geom.computeVertexNormals();
  return geom;
}

// ── COMPONENT: FLOATING 3D PLASTIC BOTTLE (CHAI NHỰA 3D LƠ LỬNG XUNG QUANH) ──
function FloatingBottle3D({
  modelUrl,
  initialPosition,
  scale = 1.0,
  rotationSpeed = 0.5,
  floatSpeed = 1.2,
  floatOffset = 0,
}: {
  modelUrl: string;
  initialPosition: [number, number, number];
  scale?: number;
  rotationSpeed?: number;
  floatSpeed?: number;
  floatOffset?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelUrl);
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Chuyển động lơ lửng tự nhiên trong không gian 3D
    groupRef.current.position.y = initialPosition[1] + Math.sin(t * floatSpeed + floatOffset) * 0.22;
    groupRef.current.position.x = initialPosition[0] + Math.cos(t * floatSpeed * 0.7 + floatOffset) * 0.12;

    // Tự động xoay chậm nhẹ nhàng
    groupRef.current.rotation.y = t * rotationSpeed * 0.5;
    groupRef.current.rotation.z = Math.sin(t * 0.7 + floatOffset) * 0.18 + 0.1;
    groupRef.current.rotation.x = Math.cos(t * 0.6 + floatOffset) * 0.15;
  });

  return (
    <group ref={groupRef} position={initialPosition} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
}

// ── COMPONENT: FLOATING 3D PLASTIC FLAKES / PARTICLES (MẢNH NHỰA 3D LƠ LỬNG RỘNG TOÀN MÀN HÌNH DESKTOP) ──
function FloatingPlasticFlakes3D({ count = 140 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Array of 3D plastic flake parameters with brand colors spanning full desktop screen width
  const flakesData = useMemo(() => {
    const palette = ['#FF009C', '#0020D7', '#A7F417', '#00F0FF', '#FFDE00', '#FF5500', '#FF0087', '#00E5FF'];
    return Array.from({ length: count }, (_, i) => ({
      x: (Math.random() - 0.5) * 35.0, // Spans from -17.5 to +17.5 (Full Desktop Screen Width)
      y: (Math.random() - 0.5) * 19.0, // Spans from -9.5 to +9.5 (Full Viewport Height)
      z: (Math.random() - 0.5) * 10.0 - 0.5,
      rotX: Math.random() * Math.PI * 2,
      rotY: Math.random() * Math.PI * 2,
      rotZ: Math.random() * Math.PI * 2,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: 0.15 + Math.random() * 0.4,
      rotSpeedX: (Math.random() - 0.5) * 1.6,
      rotSpeedY: (Math.random() - 0.5) * 2.0,
      rotSpeedZ: (Math.random() - 0.5) * 1.6,
      scale: 0.08 + Math.random() * 0.22,
      color: new THREE.Color(palette[i % palette.length]),
    }));
  }, [count]);

  const flakeGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      -0.45, -0.35, 0.06,
      0.5, -0.25, -0.06,
      0.35, 0.45, 0.08,
      -0.4, 0.35, -0.08,
    ]);
    const indices = [0, 1, 2, 0, 2, 3];
    geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;
    flakesData.forEach((flake, i) => {
      meshRef.current?.setColorAt(i, flake.color);
    });
    meshRef.current.instanceColor!.needsUpdate = true;
  }, [flakesData]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    flakesData.forEach((flake, i) => {
      const curY = flake.y + Math.sin(time * flake.speedY + i * 0.7) * 0.45;
      const curX = flake.x + Math.cos(time * 0.4 + i * 0.5) * 0.35;
      const curZ = flake.z + Math.sin(time * 0.3 + i * 0.9) * 0.25;

      dummy.position.set(curX, curY, curZ);
      dummy.rotation.set(
        flake.rotX + time * flake.rotSpeedX,
        flake.rotY + time * flake.rotSpeedY,
        flake.rotZ + time * flake.rotSpeedZ
      );
      dummy.scale.set(flake.scale, flake.scale, flake.scale);
      dummy.updateMatrix();

      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[flakeGeometry, undefined, count]}>
      <meshStandardMaterial
        side={THREE.DoubleSide}
        roughness={0.15}
        metalness={0.1}
        transparent={true}
        opacity={0.92}
      />
    </instancedMesh>
  );
}

// ── COMPONENT: SINGLE 3D CURVED SPIRAL CARD ──
function SpiralCurvedCard({
  item,
  index,
  totalItems,
  scrollProgressRef,
  onHoverChange,
}: {
  item: SpiralCardData;
  index: number;
  totalItems: number;
  scrollProgressRef: React.MutableRefObject<number>;
  onHoverChange: (isHovered: boolean) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const texture = useTexture(item.imageUrl);
  const prevOffsetRef = useRef<number | null>(null);

  // Cấu hình texture sắc nét tuyệt đối, chuẩn 100% màu gốc nguyên bản sRGB
  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;
      texture.needsUpdate = true;
    }
  }, [texture]);

  // Kích thước chuẩn uốn cong lồi tinh tế từ SPIRAL_CONFIG
  const curvedGeometry = useMemo(
    () => createCurvedPlaneGeometry(SPIRAL_CONFIG.cardWidth, SPIRAL_CONFIG.cardHeight, SPIRAL_CONFIG.curveRadius),
    []
  );

  useFrame((_, delta) => {
    if (!groupRef.current || !meshRef.current) return;

    const progress = scrollProgressRef.current;
    const rawOffset = index - progress;
    // Modulo xoay vòng liên tục trong khoảng [-totalItems/2, totalItems/2]
    const modOffset = (((rawOffset % totalItems) + totalItems + totalItems / 2) % totalItems) - totalItems / 2;

    // 🌀 1. TỌA ĐỘ VÒNG XOẮN ỐC BÁN KÍNH CHUẨN ĐỒNG NHẤT 100%
    const angle = modOffset * SPIRAL_CONFIG.angleStep;
    const radius = SPIRAL_CONFIG.baseRadius;

    const targetX = Math.sin(angle) * radius;
    const targetY = modOffset * SPIRAL_CONFIG.heightStep;
    const targetZ = Math.cos(angle) * radius - 2.2;

    // 🧭 2. GÓC XOAY TIẾP TUYẾN ĐỒNG ĐỀU
    const targetRotY = angle + Math.PI;
    const targetRotX = modOffset * SPIRAL_CONFIG.tiltXMultiplier;
    const targetRotZ = Math.sin(angle) * SPIRAL_CONFIG.tiltZMultiplier;

    // 🎯 3. HIỆU ỨNG TẬP TRUNG 3 ẢNH CHÍNH DIỆN (100% ĐẬM ĐẶC) & MỜ OPACITY CÁC THẺ XA HƠN (GIỮ 100% MÀU GỐC)
    const distFromFocus = Math.abs(modOffset);
    let smoothFocus = 0.0;

    if (distFromFocus <= SPIRAL_CONFIG.focusPlateau) {
      // 3 thẻ liền kề ở trung tâm luôn đạt 100% opacity và 100% màu gốc
      smoothFocus = 1.0;
    } else {
      // Các thẻ xa hơn chuyển tiếp mờ dần mượt mà Smoothstep (3x^2 - 2x^3)
      const decayRatio = THREE.MathUtils.clamp(
        1.0 - (distFromFocus - SPIRAL_CONFIG.focusPlateau) / SPIRAL_CONFIG.focusTransition,
        0.0,
        1.0
      );
      smoothFocus = decayRatio * decayRatio * (3 - 2 * decayRatio);
    }

    // Nếu người dùng hover vào bất kỳ thẻ nào thì thẻ đó cũng sáng rõ 100%
    const currentFocus = hovered ? Math.max(smoothFocus, 0.95) : smoothFocus;

    // Tính độ trong suốt Opacity (3 thẻ chính = 1.0, các thẻ xa = inactiveCardOpacity)
    const baseOpacity = THREE.MathUtils.lerp(
      SPIRAL_CONFIG.inactiveCardOpacity,
      SPIRAL_CONFIG.activeCardOpacity,
      currentFocus
    );

    // 🟢 4. ĐỘ MỜ TAN BIẾN Ở 2 ĐẦU BIÊN TRÊN VÀ DƯỚI
    const cameraZ = 12.0;
    const distToCam = Math.max(1.0, cameraZ - targetZ);
    const frustumHalfHeight = distToCam * 0.44;
    const safeMaxY = Math.max(1.5, frustumHalfHeight - (SPIRAL_CONFIG.cardHeight * 0.7));

    const currentAbsY = Math.abs(targetY);
    const yRatio = THREE.MathUtils.clamp((safeMaxY - currentAbsY) / 2.2, 0.0, 1.0);
    const yFade = yRatio * yRatio * (3 - 2 * yRatio);

    const distFromCenter = Math.abs(modOffset);
    const indexRatio = THREE.MathUtils.clamp((SPIRAL_CONFIG.visibleLimit - distFromCenter) / 2.5, 0.0, 1.0);
    const indexFade = indexRatio * indexRatio * (3 - 2 * indexRatio);

    const edgeDissolve = Math.min(yFade, indexFade);
    const finalOpacity = baseOpacity * edgeDissolve;

    // 🎴 5. TỈ LỆ PHÓNG NHẸ TINH TẾ KHI VÀO TRUNG TÂM HOẶC HOVER
    const hoverScale = hovered ? 1.08 : 1.0;
    const centerScale = 1.0 + (SPIRAL_CONFIG.focusScaleMultiplier - 1.0) * smoothFocus;
    const targetScale = centerScale * hoverScale;

    // 🟢 BẮT ĐIỂM CHUYỂN TIẾP VÒNG LẶP: DỊCH CHUYỂN TỨC THỜI KHI TÀNG HÌNH
    const isWrap = prevOffsetRef.current !== null && Math.abs(modOffset - prevOffsetRef.current) > totalItems / 2;
    prevOffsetRef.current = modOffset;

    if (isWrap || finalOpacity <= 0.005) {
      groupRef.current.position.set(targetX, targetY, targetZ);
      groupRef.current.rotation.set(targetRotX, targetRotY, targetRotZ);
      groupRef.current.scale.setScalar(targetScale);
    } else {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 12 * delta);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 12 * delta);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 12 * delta);

      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 10 * delta);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 10 * delta);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 10 * delta);

      groupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 12 * delta)
      );
    }

    // Cập nhật MeshBasicMaterial: Giữ 100% màu gốc chuẩn (color = #FFFFFF, toneMapped = false), chỉ đổi opacity
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    if (mat) {
      mat.transparent = true;
      mat.opacity = finalOpacity;
      mat.color.setRGB(1, 1, 1); // Luôn luôn giữ 100% màu gốc nguyên bản
      mat.depthWrite = false;
      meshRef.current.visible = finalOpacity > 0.005;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -10]}>
      {/* 🟢 Tấm ảnh thuần túy: GIỮ NGUYÊN 100% MÀU GỐC SẮC NÉT KHÔNG CHỈNH MÀU */}
      <mesh
        ref={meshRef}
        geometry={curvedGeometry}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHoverChange(true);
        }}
        onPointerOut={() => {
          setHovered(false);
          onHoverChange(false);
        }}
      >
        <meshBasicMaterial
          map={texture}
          side={THREE.DoubleSide}
          toneMapped={false}
          transparent={true}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>
    </group>
  );
}

// ── COMPONENT: 3D SPIRAL SCENE ──
function SpiralScene({
  items,
  scrollProgressRef,
  onHoverChange,
}: {
  items: SpiralCardData[];
  scrollProgressRef: React.MutableRefObject<number>;
  onHoverChange: (isHovered: boolean) => void;
}) {
  return (
    <group position={[0, 0, -1.5]}>
      <ambientLight intensity={1.8} />
      <directionalLight position={[10, 15, 10]} intensity={2.4} color="#FFFFFF" />
      <directionalLight position={[-10, -10, -10]} intensity={1.2} color="#0020D7" />
      <pointLight position={[0, 0, 4]} intensity={2.0} color="#D1FF00" distance={15} />
      <pointLight position={[0, 5, 0]} intensity={1.5} color="#FF009C" distance={12} />

      <Suspense fallback={null}>
        {/* 🍃 0. MẢNH NHỰA 3D LƠ LỬNG RỘNG TOÀN MÀN HÌNH DESKTOP */}
        <FloatingPlasticFlakes3D count={140} />

        {/* 🍾 1. CÁC CHAI NHỰA 3D LƠ LỬNG XUNG QUANH THEO BẢN SKETCH */}
        {SPIRAL_CONFIG.showFloatingBottles && (
          <group>
            {/* Chai góc trên - trái (Top-Left) */}
            <FloatingBottle3D
              modelUrl={chai1Model}
              initialPosition={[-7.5, 3.2, 0.4]}
              scale={SPIRAL_CONFIG.bottleScaleTopLeft}
              floatSpeed={1.1}
              floatOffset={0}
              rotationSpeed={0.4}
            />

            {/* Chai góc dưới - trái (Bottom-Left) */}
            <FloatingBottle3D
              modelUrl={chai2Model}
              initialPosition={[-7.8, -3.2, 0.8]}
              scale={SPIRAL_CONFIG.bottleScaleBottomLeft}
              floatSpeed={1.3}
              floatOffset={2.2}
              rotationSpeed={0.5}
            />

            {/* Chai góc dưới - phải (Bottom-Right) */}
            <FloatingBottle3D
              modelUrl={chai3Model}
              initialPosition={[7.6, -3.0, 0.6]}
              scale={SPIRAL_CONFIG.bottleScaleBottomRight}
              floatSpeed={1.0}
              floatOffset={4.1}
              rotationSpeed={0.45}
            />
          </group>
        )}

        {/* 🌀 2. CÁC THẺ ẢNH XOẮN ỐC 3D */}
        {items.map((item, idx) => (
          <SpiralCurvedCard
            key={item.id}
            item={item}
            index={idx}
            totalItems={items.length}
            scrollProgressRef={scrollProgressRef}
            onHoverChange={onHoverChange}
          />
        ))}
      </Suspense>
    </group>
  );
}

// ── MAIN EXPORTED COMPONENT: SPIRAL 3D SLIDER (GIAO DIỆN THUẦN 3D CINEMATIC KHÔNG NÚT BẤM) ──
export default function Spiral3DSlider() {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Cuộn bánh xe chuột (Mouse Wheel Scroll)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * SPIRAL_CONFIG.scrollSensitivity;
      targetProgressRef.current += delta;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Vòng lặp chuyển động & Tự động xoay từ cấu hình SPIRAL_CONFIG
  useEffect(() => {
    let animationId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (SPIRAL_CONFIG.autoRotate && !isDraggingRef.current && !isHovered) {
        targetProgressRef.current += SPIRAL_CONFIG.rotationSpeed * delta;
      }

      scrollProgressRef.current = THREE.MathUtils.lerp(
        scrollProgressRef.current,
        targetProgressRef.current,
        Math.min(1.0, 10 * delta)
      );

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [isHovered]);

  // Kéo thả chuột / Vuốt chạm màn hình (Drag & Swipe)
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    const moveAmount = (-deltaX * SPIRAL_CONFIG.dragSensitivity) + (deltaY * (SPIRAL_CONFIG.dragSensitivity * 0.7));
    targetProgressRef.current += moveAmount;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignore release capture errors
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${SPIRAL_CONFIG.containerHeight} bg-transparent text-black overflow-visible select-none`}
    >

      {/* ── 3D CANVAS VIEWPORT (CHỨA DÒNG XOẮN ỐC & CÁC CHAI 3D LƠ LỬNG) ── */}
      <div
        className="w-full h-full cursor-grab active:cursor-grabbing overflow-visible"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <Canvas
          camera={{ position: [0, 0, 12.0], fov: 48 }}
          gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        >
          <fog attach="fog" args={['#ffffff', 10, 28]} />

          <SpiralScene
            items={SPIRAL_ITEMS}
            scrollProgressRef={scrollProgressRef}
            onHoverChange={setIsHovered}
          />
          <Environment preset="city" />
        </Canvas>
      </div>

      {/* ── 📡 CÁC THANH CHỈ & THÔNG TIN VẤN NẠN Ô NHIỄM (THIẾT KẾ KHÔNG KHUNG BẢNG, CHỈ LINE VÀ VĂN BẢN) ── */}
      {SPIRAL_CONFIG.showInfoCallouts && (
        <div className="absolute inset-0 pointer-events-none z-10">

          {/* 🔴 1. CALLOUT BÊN TRÁI: VẤN NẠN Ô NHIỄM CHAI NHỰA (MID-LEFT) */}
          <div
            className="absolute max-w-[280px] sm:max-w-[340px] pointer-events-auto transition-all duration-300"
            style={{
              top: SPIRAL_CONFIG.calloutPlasticCrisis.top,
              left: SPIRAL_CONFIG.calloutPlasticCrisis.left,
              transform: `translate(${SPIRAL_CONFIG.calloutPlasticCrisis.offsetX}px, ${SPIRAL_CONFIG.calloutPlasticCrisis.offsetY}px) scale(${SPIRAL_CONFIG.calloutPlasticCrisis.scale})`,
              transformOrigin: 'left center',
            }}
          >
            <div className="relative text-left">
              {/* Clean Frameless Info Content (Bỏ khung bảng) */}
              <div className="group">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: SPIRAL_CONFIG.calloutPlasticCrisis.lineColor }} />
                  <span className="font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1" style={{ color: SPIRAL_CONFIG.calloutPlasticCrisis.lineColor }}>
                    <AlertTriangle size={12} /> VẤN NẠN Ô NHIỄM // PLASTIC_CRISIS
                  </span>
                </div>
                <h4 className="font-display text-xl sm:text-2xl font-black uppercase text-black tracking-tight mb-1">
                  450 - 1000 Năm Phân Hủy
                </h4>
                <p className="font-sans text-xs sm:text-sm text-gray-700 leading-relaxed mb-2.5 font-medium">
                  Hơn 1 triệu chai nhựa bị vứt bỏ mỗi phút. Chúng vỡ vụn thành hàng tỷ vi nhựa (microplastics) ngấm vào nguồn nước, hủy hoại đại dương và chuỗi thức ăn con người.
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 backdrop-blur-sm text-[9.5px] font-mono font-bold text-gray-800 border border-black/10">
                  <span style={{ color: SPIRAL_CONFIG.calloutPlasticCrisis.lineColor }}>●</span> 8.3 Tỷ Tấn Rác Toàn Cầu
                </div>
              </div>

              {/* Technical Indicator Line chỉa sang phía 3D spiral */}
              <div className="hidden lg:flex items-center absolute top-1/2 -translate-y-1/2 pointer-events-none" style={{ right: `-${SPIRAL_CONFIG.calloutPlasticCrisis.lineWidth + 8}px` }}>
                <div className="h-[2px]" style={{ width: `${SPIRAL_CONFIG.calloutPlasticCrisis.lineWidth}px`, backgroundColor: SPIRAL_CONFIG.calloutPlasticCrisis.lineColor }} />
                <div className="w-3 h-3 rounded-full border-2 border-black animate-pulse" style={{ backgroundColor: SPIRAL_CONFIG.calloutPlasticCrisis.lineColor }} />
              </div>
            </div>
          </div>

          {/* 🟢 2. CALLOUT BÊN PHẢI TRÊN: TẦM QUAN TRỌNG CỦA TÁI SINH (TOP-RIGHT) */}
          <div
            className="absolute max-w-[280px] sm:max-w-[340px] pointer-events-auto transition-all duration-300"
            style={{
              top: SPIRAL_CONFIG.calloutWhyRecycle.top,
              right: SPIRAL_CONFIG.calloutWhyRecycle.right,
              transform: `translate(${SPIRAL_CONFIG.calloutWhyRecycle.offsetX}px, ${SPIRAL_CONFIG.calloutWhyRecycle.offsetY}px) scale(${SPIRAL_CONFIG.calloutWhyRecycle.scale})`,
              transformOrigin: 'right center',
            }}
          >
            <div className="relative text-left">
              {/* Technical Indicator Line chỉa từ 3D spiral sang */}
              <div className="hidden lg:flex items-center absolute top-1/2 -translate-y-1/2 pointer-events-none" style={{ left: `-${SPIRAL_CONFIG.calloutWhyRecycle.lineWidth + 8}px` }}>
                <div className="w-3 h-3 rounded-full border-2 border-black animate-pulse" style={{ backgroundColor: SPIRAL_CONFIG.calloutWhyRecycle.lineColor }} />
                <div className="h-[2px]" style={{ width: `${SPIRAL_CONFIG.calloutWhyRecycle.lineWidth}px`, backgroundColor: SPIRAL_CONFIG.calloutWhyRecycle.lineColor }} />
              </div>

              {/* Clean Frameless Info Content (Bỏ khung bảng) */}
              <div className="group">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: SPIRAL_CONFIG.calloutWhyRecycle.lineColor }} />
                  <span className="font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1" style={{ color: SPIRAL_CONFIG.calloutWhyRecycle.lineColor }}>
                    <Sparkles size={12} /> TẦM QUAN TRỌNG // WHY_RECYCLE
                  </span>
                </div>
                <h4 className="font-display text-xl sm:text-2xl font-black uppercase text-black tracking-tight mb-1">
                  Giảm 70% Khí Thải Carbon
                </h4>
                <p className="font-sans text-xs sm:text-sm text-gray-700 leading-relaxed mb-2.5 font-medium">
                  Tái chế khép kín giúp tiết kiệm 80% năng lượng so với sản xuất hạt nhựa mới từ dầu mỏ, biến rác thải độc hại thành tài nguyên tuần hoàn bền vững.
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 backdrop-blur-sm text-[9.5px] font-mono font-bold text-gray-800 border border-black/10">
                  <span style={{ color: SPIRAL_CONFIG.calloutWhyRecycle.lineColor }}>●</span> Tiết kiệm 1.5kg CO2 / kg Nhựa
                </div>
              </div>
            </div>
          </div>

          {/* 🔵 3. CALLOUT BÊN PHẢI DƯỚI: GIẢI PHÁP NGHỆ THUẬT RE-LIFE (BOTTOM-RIGHT) */}
          <div
            className="absolute max-w-[280px] sm:max-w-[340px] pointer-events-auto transition-all duration-300"
            style={{
              bottom: SPIRAL_CONFIG.calloutCircularArt.bottom,
              right: SPIRAL_CONFIG.calloutCircularArt.right,
              transform: `translate(${SPIRAL_CONFIG.calloutCircularArt.offsetX}px, ${SPIRAL_CONFIG.calloutCircularArt.offsetY}px) scale(${SPIRAL_CONFIG.calloutCircularArt.scale})`,
              transformOrigin: 'right center',
            }}
          >
            <div className="relative text-left">
              {/* Technical Indicator Line chỉa từ 3D spiral sang */}
              <div className="hidden lg:flex items-center absolute top-1/2 -translate-y-1/2 pointer-events-none" style={{ left: `-${SPIRAL_CONFIG.calloutCircularArt.lineWidth + 8}px` }}>
                <div className="w-3 h-3 rounded-full border-2 border-black animate-pulse" style={{ backgroundColor: SPIRAL_CONFIG.calloutCircularArt.lineColor }} />
                <div className="h-[2px]" style={{ width: `${SPIRAL_CONFIG.calloutCircularArt.lineWidth}px`, backgroundColor: SPIRAL_CONFIG.calloutCircularArt.lineColor }} />
              </div>

              {/* Clean Frameless Info Content (Bỏ khung bảng) */}
              <div className="group">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: SPIRAL_CONFIG.calloutCircularArt.lineColor }} />
                  <span className="font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1" style={{ color: SPIRAL_CONFIG.calloutCircularArt.lineColor }}>
                    <RefreshCw size={12} /> GIẢI PHÁP RE-LIFE // CIRCULAR_ART
                  </span>
                </div>
                <h4 className="font-display text-xl sm:text-2xl font-black uppercase text-black tracking-tight mb-1">
                  91% Chưa Được Tái Chế
                </h4>
                <p className="font-sans text-xs sm:text-sm text-gray-700 leading-relaxed mb-2.5 font-medium">
                  RELIFE LAB thu gom và đúc nén nhiệt nắp chai thành các tác phẩm Art Toys sưu tầm độc bản, tích hợp chip NFC xác thực On-Chain minh bạch.
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 backdrop-blur-sm text-[9.5px] font-mono font-bold text-gray-800 border border-black/10">
                  <span style={{ color: SPIRAL_CONFIG.calloutCircularArt.lineColor }}>●</span> 100% PCR HDPE • NFC On-Chain
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
