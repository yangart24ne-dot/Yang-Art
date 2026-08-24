import React, { useEffect, useRef, useState, useCallback } from "react";
import Matter from "matter-js";
import { cn } from "@/src/lib/utils";

// --- DATA STRUCTURE FOR FALLING PLASTIC & BRAND SHAPES ---
export interface PlasticShapeData {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  category: "waste" | "tech" | "impact" | "circular";
  colorBadge: string;
  width: number;
  height: number;
  // Shape drawing type
  shapeType:
    | "bottle"
    | "crushed"
    | "notched_block"
    | "starburst"
    | "wavy_capsule"
    | "cloud"
    | "stepped_stack"
    | "peanut"
    | "shield"
    | "organic_bean"
    | "clover"
    | "cap_octagon"
    | "spool"
    | "ticket";
  // Detailed modal content
  description: string;
  stats: string;
  metricLabel: string;
  initialXFactor: number; // 0.1 to 0.9 across screen
  initialYOffset: number; // Staggered drop height
  initialRotation: number;
}

export const SHAPES_DATA: PlasticShapeData[] = [
  {
    id: "shape-1",
    title: "1.8 TRIỆU TẤN",
    subtitle: "RÁC THẢI NHỰA / NĂM TẠI VIỆT NAM",
    tag: "PET WASTE CRISIS",
    category: "waste",
    colorBadge: "#FF009E",
    width: 230,
    height: 115,
    shapeType: "bottle",
    description:
      "Việt Nam thuộc top những quốc gia phát sinh lượng rác thải nhựa lớn nhất thế giới, với hơn 1.8 triệu tấn mỗi năm. Trong đó, chai nhựa đồ uống PET chỉ có một tỷ lệ nhỏ được thu gom và tái chế chuẩn công nghiệp.",
    stats: "1,800,000+",
    metricLabel: "Tấn rác thải nhựa phát sinh hàng năm",
    initialXFactor: 0.08,
    initialYOffset: -180,
    initialRotation: -0.12,
  },
  {
    id: "shape-2",
    title: "500+ NĂM",
    subtitle: "ĐỂ PHÂN HỦY MỘT CHAI NHỰA",
    tag: "DECOMPOSITION TIME",
    category: "waste",
    colorBadge: "#0020D7",
    width: 220,
    height: 125,
    shapeType: "crushed",
    description:
      "Một chiếc chai nhựa dùng trong 15 phút cần từ 450 đến 500 năm để vỡ vụn thành các hạt vi nhựa trong lòng đất và đại dương, gây ô nhiễm vĩnh viễn chuỗi thức ăn sinh học.",
    stats: "500 Năm",
    metricLabel: "Thời gian tồn tại ngoài môi trường",
    initialXFactor: 0.22,
    initialYOffset: -280,
    initialRotation: 0.15,
  },
  {
    id: "shape-3",
    title: "THU GOM → VẨY NHỰA",
    subtitle: "QUY TRÌNH PHÂN LOẠI & SÚC RỬA ĐA TẦNG",
    tag: "RECYCLING PIPELINE",
    category: "circular",
    colorBadge: "#A7F417",
    width: 240,
    height: 145,
    shapeType: "notched_block",
    description:
      "Quy trình xử lý khép kín tại RELIFE LAB: Thu gom vỏ chai PET đã qua sử dụng, loại bỏ nhãn và nắp, băm vụn thành vẩy nhựa đồng nhất, ngâm tẩy rửa sinh học và sấy nóng chân không.",
    stats: "4 Giai đoạn",
    metricLabel: "Khử khuẩn & tinh chế hạt rPET",
    initialXFactor: 0.36,
    initialYOffset: -200,
    initialRotation: -0.08,
  },
  {
    id: "shape-4",
    title: "100% SỢI rPET",
    subtitle: "FILAMENT IN 3D TÁI SINH CAO CẤP",
    tag: "YANG 3D MATERIAL",
    category: "tech",
    colorBadge: "#A7F417",
    width: 195,
    height: 195,
    shapeType: "starburst",
    description:
      "YANG Studio tự chủ công nghệ đùn sợi 3D filament từ 100% nhựa rPET tái sinh. Sợi in có độ bóng quang học đặc trưng, độ dẻo dai cao và độ bám dính lớp hoàn hảo.",
    stats: "1.75 mm",
    metricLabel: "Chuẩn đường kính sợi in chính xác cao",
    initialXFactor: 0.50,
    initialYOffset: -380,
    initialRotation: 0.14,
  },
  {
    id: "shape-5",
    title: "TÁC PHẨM BỀN VỮNG",
    subtitle: "BIẾN RÁC THẢI THÀNH NGHỆ THUẬT VĨNH CỬU",
    tag: "ZERO-WASTE ART",
    category: "circular",
    colorBadge: "#FF009E",
    width: 250,
    height: 110,
    shapeType: "wavy_capsule",
    description:
      "Mỗi tác phẩm ra đời tại xưởng mang linh hồn của sự hồi sinh. Rác thải dùng một lần được tái cấu trúc thành các bức tượng nghệ thuật, đồ nội thất và đồ chơi thiết kế độc bản.",
    stats: "100%",
    metricLabel: "Giá trị thẩm mỹ và độ bền dài lâu",
    initialXFactor: 0.64,
    initialYOffset: -260,
    initialRotation: -0.18,
  },
  {
    id: "shape-6",
    title: "CHẶN ĐỨNG VI NHỰA",
    subtitle: "BẢO VỆ NGUỒN NƯỚC & ĐẠI DƯƠNG",
    tag: "OCEAN DEFENSE",
    category: "impact",
    colorBadge: "#0020D7",
    width: 230,
    height: 135,
    shapeType: "cloud",
    description:
      "Bằng cách thu hồi và cố định nhựa vào các sản phẩm in 3D có tuổi thọ hàng thập kỷ, chúng tôi ngăn hàng tỷ hạt vi nhựa (microplastics) phân rã và trôi dạt ra đại dương.",
    stats: "0% Thải bỏ",
    metricLabel: "Khóa chặt nhựa vào chu trình tái sử dụng",
    initialXFactor: 0.78,
    initialYOffset: -460,
    initialRotation: 0.10,
  },
  {
    id: "shape-7",
    title: "CỨU 15 CHAI PET",
    subtitle: "TRÊN MỖI TÁC PHẨM IN 3D CỠ VỪA",
    tag: "3D IMPACT METRIC",
    category: "impact",
    colorBadge: "#A7F417",
    width: 220,
    height: 155,
    shapeType: "stepped_stack",
    description:
      "Một bức tượng decor nặng 300g tương đương với lượng nhựa của 15 vỏ chai nước suối 500ml. Càng nhiều sản phẩm được tạo ra, lượng rác được giải cứu khỏi bãi chôn lấp càng nhân rộng.",
    stats: "15 Chai PET",
    metricLabel: "Lượng rác được tái sinh trên 1 sản phẩm",
    initialXFactor: 0.92,
    initialYOffset: -540,
    initialRotation: -0.15,
  },
  {
    id: "shape-8",
    title: "THIẾT KẾ TUẦN HOÀN",
    subtitle: "KHÔNG TẠO PHÔI THỪA NHƯ GIA CÔNG TRUYỀN THỐNG",
    tag: "CIRCULAR DESIGN",
    category: "circular",
    colorBadge: "#FF009E",
    width: 235,
    height: 115,
    shapeType: "peanut",
    description:
      "Công nghệ in 3D bồi đắp FDM chỉ lắng đọng vật liệu chính xác tại vị trí cần thiết. Không sinh phoi bào, không cắt gọt thừa thải, tối ưu hóa triệt để 100% nguyên liệu đầu vào.",
    stats: "95%",
    metricLabel: "Giảm lãng phí nguyên liệu so với CNC",
    initialXFactor: 0.14,
    initialYOffset: -620,
    initialRotation: 0.16,
  },
  {
    id: "shape-9",
    title: "GIẢM 75% CO2",
    subtitle: "SO VỚI SẢN XUẤT NHỰA NGUYÊN SINH TỪ DẦU MỎ",
    tag: "CARBON FOOTPRINT",
    category: "impact",
    colorBadge: "#0020D7",
    width: 215,
    height: 140,
    shapeType: "shield",
    description:
      "Tái chế nhựa PET tiêu thụ ít hơn 70% năng lượng và giảm 75% lượng khí thải carbon so với việc khoan chưng cất dầu mỏ để tạo ra hạt nhựa nguyên sinh mới.",
    stats: "-75% CO2",
    metricLabel: "Mức giảm phát thải khí nhà kính",
    initialXFactor: 0.28,
    initialYOffset: -700,
    initialRotation: -0.14,
  },
  {
    id: "shape-10",
    title: "YANG STUDIO",
    subtitle: "XƯỞNG TỰ TẠO MÔ HÌNH 2D/3D TỨC THÌ",
    tag: "BRAND MISSION",
    category: "tech",
    colorBadge: "#A7F417",
    width: 225,
    height: 125,
    shapeType: "organic_bean",
    description:
      "Tại YANG Studio & RELIFE LAB, bất kỳ ai cũng có thể vẽ phác thảo 2D, chọn chất liệu nhựa tái chế và theo dõi hệ thống in 3D biến ý tưởng thành hiện thực ngay trước mắt.",
    stats: "Real-Time",
    metricLabel: "Chuyển hóa từ bản vẽ 2D sang 3D thực thể",
    initialXFactor: 0.44,
    initialYOffset: -780,
    initialRotation: 0.12,
  },
  {
    id: "shape-11",
    title: "TÁI CHẾ VÔ TẬN",
    subtitle: "IN LẠI BẤT KỲ KHI NÀO BẠN MUỐN ĐỔI MỚI",
    tag: "INFINITE RE-LIFE",
    category: "circular",
    colorBadge: "#FF009E",
    width: 210,
    height: 145,
    shapeType: "clover",
    description:
      "Tác phẩm in 3D sau nhiều năm sử dụng có thể được mang trở lại xưởng để nghiền vụn và nấu chảy in lại thành một hình dạng hoàn toàn mới. Một vòng đời vô tận không có điểm kết thúc.",
    stats: "∞ Lần",
    metricLabel: "Khả năng tái nghiền và in lại nhiều lần",
    initialXFactor: 0.58,
    initialYOffset: -860,
    initialRotation: -0.10,
  },
  {
    id: "shape-12",
    title: "NẮP CHAI & PHỤ KIỆN",
    subtitle: "TÁI CHẾ ĐA DẠNG DÒNG NHỰA HDPE / PP",
    tag: "MULTI-POLYMER",
    category: "tech",
    colorBadge: "#0020D7",
    width: 200,
    height: 130,
    shapeType: "cap_octagon",
    description:
      "Ngoài thân chai PET, phần nắp chai (HDPE/PP) và nhãn mác cũng được phân loại riêng biệt để ép nhiệt tạo thành các đế lót ly, tấm ốp tường và chi tiết màu sắc nổi bật.",
    stats: "100% Bộ Phận",
    metricLabel: "Không bỏ sót bất kỳ thành phần nào của chai",
    initialXFactor: 0.72,
    initialYOffset: -940,
    initialRotation: 0.15,
  },
  {
    id: "shape-13",
    title: "MÁY ĐÙN SỢI IN",
    subtitle: "CÔNG NGHỆ NỘI ĐỊA TỐI ƯU HÓA RÁC ĐỊA PHƯƠNG",
    tag: "HARDWARE LAB",
    category: "tech",
    colorBadge: "#A7F417",
    width: 210,
    height: 130,
    shapeType: "spool",
    description:
      "Hệ thống máy đùn sợi khép kín do đội ngũ kỹ sư YANG Studio tự nghiên cứu và chế tạo, kiểm soát chính xác nhiệt độ và dung sai đường kính sợi in dưới 0.03mm.",
    stats: "±0.03 mm",
    metricLabel: "Dung sai độ dày sợi in tiêu chuẩn",
    initialXFactor: 0.86,
    initialYOffset: -1020,
    initialRotation: -0.12,
  },
  {
    id: "shape-14",
    title: "HÀNH ĐỘNG HÔM NAY",
    subtitle: "THAM GIA CÙNG CHÚNG TÔI ĐỔI THAY ĐỊA CẦU",
    tag: "JOIN THE REVOLUTION",
    category: "impact",
    colorBadge: "#FF009E",
    width: 220,
    height: 130,
    shapeType: "ticket",
    description:
      "Tương lai không rác thải nhựa bắt đầu từ việc thay đổi cách chúng ta nhìn nhận rác. Hãy biến đồ bỏ đi thành nguồn tài nguyên sáng tạo bất tận cho thế hệ tương lai.",
    stats: "Cùng Bạn",
    metricLabel: "Kiến tạo phong cách sống xanh & duy mỹ",
    initialXFactor: 0.30,
    initialYOffset: -1100,
    initialRotation: 0.10,
  },
];

// --- SVG SILHOUETTE SHAPES RENDERER ---
const renderShapeSvg = (shape: PlasticShapeData, isHovered: boolean) => {
  const strokeColor = isHovered ? shape.colorBadge : "#000000";
  const strokeWidth = isHovered ? 4 : 1.5;
  const fillColor = "#000000"; // Pure brutalist black as in reference poster

  switch (shape.shapeType) {
    // 1. PET Bottle
    case "bottle":
      return (
        <svg
          viewBox="0 0 230 115"
          className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] overflow-visible"
        >
          <path
            d="M 22,57.5 C 22,46 32,40 45,40 L 60,40 L 70,24 C 74,18 84,15 95,15 L 180,15 C 202,15 218,32 218,57.5 C 218,83 202,100 180,100 L 95,100 C 84,100 74,97 70,91 L 60,75 L 45,75 C 32,75 22,69 22,57.5 Z M 12,47 L 22,47 L 22,68 L 12,68 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      );

    // 2. Crushed / Jagged compacted polygon
    case "crushed":
      return (
        <svg
          viewBox="0 0 220 125"
          className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] overflow-visible"
        >
          <polygon
            points="20,25 75,10 135,28 190,12 210,48 195,95 212,115 155,122 95,110 38,122 8,85 24,48"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      );

    // 3. Notched Mass Consolidation Block (Poster style)
    case "notched_block":
      return (
        <svg
          viewBox="0 0 240 145"
          className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] overflow-visible"
        >
          <path
            d="M 15,10 L 225,10 L 225,35 L 205,42 L 225,50 L 225,75 L 205,82 L 225,90 L 225,115 L 205,122 L 225,130 L 225,138 L 15,138 L 15,122 L 35,115 L 15,108 L 15,82 L 35,75 L 15,68 L 15,42 L 35,35 L 15,28 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      );

    // 4. Starburst / 24-point stamp badge (Poster style)
    case "starburst": {
      const cx = 97.5;
      const cy = 97.5;
      const points: string[] = [];
      const numPoints = 20;
      for (let i = 0; i < numPoints * 2; i++) {
        const r = i % 2 === 0 ? 90 : 76;
        const angle = (i * Math.PI) / numPoints;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
      return (
        <svg
          viewBox="0 0 195 195"
          className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] overflow-visible"
        >
          <polygon
            points={points.join(" ")}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    // 5. Wavy Capsule (Poster style "A Real Benefit")
    case "wavy_capsule":
      return (
        <svg
          viewBox="0 0 250 110"
          className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] overflow-visible"
        >
          <path
            d="M 28,55 C 28,25 45,15 65,15 C 80,15 88,35 102,35 C 116,35 124,15 138,15 C 152,15 160,35 174,35 C 188,35 196,15 210,15 C 230,15 242,30 242,55 C 242,80 230,95 210,95 C 196,95 188,75 174,75 C 160,75 152,95 138,95 C 124,95 116,75 102,75 C 88,75 80,95 65,95 C 45,95 28,85 28,55 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      );

    // 6. Bubble / Cloud Cluster (Poster style "Reason Behind")
    case "cloud":
      return (
        <svg
          viewBox="0 0 230 135"
          className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] overflow-visible"
        >
          <path
            d="M 45,75 C 25,75 15,55 25,38 C 35,22 62,20 72,32 C 82,15 112,12 128,25 C 142,12 175,15 188,32 C 205,25 222,42 218,62 C 228,78 215,105 195,112 C 182,125 155,125 142,118 C 128,128 98,128 82,118 C 65,125 38,118 32,102 C 18,92 25,78 45,75 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      );

    // 7. Layered Stepped 3D Stack (Poster style "Creativity to Check Boxes")
    case "stepped_stack":
      return (
        <svg
          viewBox="0 0 220 155"
          className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] overflow-visible"
        >
          <path
            d="M 45,15 L 175,15 L 175,32 L 205,32 L 205,52 L 185,52 L 210,65 L 210,85 L 190,85 L 215,102 L 215,122 L 195,122 L 195,142 L 25,142 L 25,122 L 10,122 L 10,102 L 30,102 L 5,85 L 5,65 L 35,65 L 15,52 L 15,32 L 45,32 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      );

    // 8. Peanut Dumbbell (Poster style "Creativity Ad Infinitum")
    case "peanut":
      return (
        <svg
          viewBox="0 0 235 115"
          className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] overflow-visible"
        >
          <path
            d="M 55,15 C 85,15 100,42 117.5,42 C 135,42 150,15 180,15 C 210,15 228,35 228,57.5 C 228,80 210,100 180,100 C 150,100 135,73 117.5,73 C 100,73 85,100 55,100 C 25,100 8,80 8,57.5 C 8,35 25,15 55,15 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      );

    // 9. Brutalist Shield (Poster style "Uniquely Thoughtful")
    case "shield":
      return (
        <svg
          viewBox="0 0 215 140"
          className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] overflow-visible"
        >
          <path
            d="M 40,12 L 175,12 L 205,42 L 205,95 L 175,128 L 140,118 L 107.5,135 L 75,118 L 40,128 L 10,95 L 10,42 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      );

    // 10. Organic Angled Bean (Poster style "Sparring Partners")
    case "organic_bean":
      return (
        <svg
          viewBox="0 0 225 125"
          className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] overflow-visible"
        >
          <path
            d="M 45,20 C 85,8 145,15 190,35 C 220,50 225,85 205,105 C 180,125 130,122 85,110 C 45,100 12,85 12,55 C 12,32 25,25 45,20 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      );

    // 11. 4-Lobed Clover (Poster style "Truth and Authenticity")
    case "clover":
      return (
        <svg
          viewBox="0 0 210 145"
          className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] overflow-visible"
        >
          <path
            d="M 60,15 C 80,15 95,30 105,45 C 115,30 130,15 150,15 C 180,15 198,35 198,60 C 198,80 180,95 165,105 C 180,115 195,130 175,140 C 155,150 135,135 105,115 C 75,135 55,150 35,140 C 15,130 30,115 45,105 C 30,95 12,80 12,60 C 12,35 30,15 60,15 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      );

    // 12. Octagonal Cap
    case "cap_octagon":
      return (
        <svg
          viewBox="0 0 200 130"
          className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] overflow-visible"
        >
          <polygon
            points="55,10 145,10 190,40 190,90 145,120 55,120 10,90 10,40"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      );

    // 13. Spool / Torus Filament Reel
    case "spool":
      return (
        <svg
          viewBox="0 0 210 130"
          className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] overflow-visible"
        >
          <path
            d="M 25,20 L 185,20 C 198,20 205,32 205,45 L 180,45 L 180,85 L 205,85 C 205,98 198,110 185,110 L 25,110 C 12,110 5,98 5,85 L 30,85 L 30,45 L 5,45 C 5,32 12,20 25,20 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      );

    // 14. Brutalist Corner-cut Ticket
    case "ticket":
    default:
      return (
        <svg
          viewBox="0 0 220 130"
          className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] overflow-visible"
        >
          <polygon
            points="28,8 212,8 212,102 184,122 8,122 8,28"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      );
  }
};

const SHAPES_MAP = new Map<string, PlasticShapeData>(
  SHAPES_DATA.map((shape) => [shape.id, shape])
);

export default function PlasticFallingShapesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const physicsCanvasRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<Map<string, HTMLDivElement>>(new Map());

  // Matter.js engine refs
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const bodiesMapRef = useRef<Map<string, Matter.Body>>(new Map());
  const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null);
  const wallsRef = useRef<Matter.Body[]>([]);
  const scaleMultiplierRef = useRef<number>(1.0);
  const isZeroGravityRef = useRef<boolean>(false);

  // State
  const [selectedShape, setSelectedShape] = useState<PlasticShapeData | null>(null);
  const [hoveredShapeId, setHoveredShapeId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hasTriggeredDrop, setHasTriggeredDrop] = useState<boolean>(false);

  // Initialize and run Matter.js physics
  const initPhysics = useCallback(() => {
    if (!physicsCanvasRef.current) return;
    const container = physicsCanvasRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 750;

    // Clean up old engine if any
    if (runnerRef.current && engineRef.current) {
      Matter.Runner.stop(runnerRef.current);
      Matter.World.clear(engineRef.current.world, false);
      Matter.Engine.clear(engineRef.current);
    }

    // Create Matter engine with realistic gravity
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 1.2, scale: 0.001 },
    });
    const world = engine.world;
    engineRef.current = engine;

    // Responsive scaling
    const scaleMultiplier = width < 640 ? 0.72 : width < 1024 ? 0.85 : 1.0;
    scaleMultiplierRef.current = scaleMultiplier;

    // Wall thickness
    const wallThick = 200;
    const floor = Matter.Bodies.rectangle(
      width / 2,
      height + wallThick / 2 - 4,
      width * 3,
      wallThick,
      { isStatic: true, friction: 0.95, restitution: 0.2 }
    );
    const leftWall = Matter.Bodies.rectangle(
      -wallThick / 2 + 10,
      height / 2,
      wallThick,
      height * 8,
      { isStatic: true, friction: 0.5, restitution: 0.3 }
    );
    const rightWall = Matter.Bodies.rectangle(
      width + wallThick / 2 - 10,
      height / 2,
      wallThick,
      height * 8,
      { isStatic: true, friction: 0.5, restitution: 0.3 }
    );
    wallsRef.current = [floor, leftWall, rightWall];
    Matter.World.add(world, [floor, leftWall, rightWall]);

    // Create bodies for all 14 shapes
    bodiesMapRef.current.clear();
    const bodiesToAdd: Matter.Body[] = [];

    SHAPES_DATA.forEach((shape) => {
      const bW = shape.width * scaleMultiplier;
      const bH = shape.height * scaleMultiplier;

      // Spawn location staggered across the full screen width and staggered in height
      const spawnX = Math.max(
        bW / 2 + 20,
        Math.min(width - bW / 2 - 20, width * shape.initialXFactor + (Math.random() - 0.5) * 60)
      );
      const spawnY = shape.initialYOffset * 1.5 - Math.random() * 100;

      // Create rounded rectangle body
      const body = Matter.Bodies.rectangle(spawnX, spawnY, bW, bH, {
        chamfer: { radius: 14 },
        angle: shape.initialRotation + (Math.random() - 0.5) * 0.1,
        density: 0.002,
        friction: 0.7,
        frictionAir: 0.02,
        restitution: 0.42, // Bouncy brutalist feel
        label: shape.id,
      });

      bodiesMapRef.current.set(shape.id, body);
      bodiesToAdd.push(body);
    });

    Matter.World.add(world, bodiesToAdd);

    // Mouse control for dragging & throwing
    const mouse = Matter.Mouse.create(container);
    // Unbind wheel to allow normal page scroll
    mouse.element.removeEventListener("mousewheel", (mouse as any).mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", (mouse as any).mousewheel);

    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.25,
        render: { visible: false },
      },
    });
    mouseConstraintRef.current = mouseConstraint;
    Matter.World.add(world, mouseConstraint);

    Matter.Events.on(mouseConstraint, "startdrag", () => {
      setIsDragging(true);
    });
    Matter.Events.on(mouseConstraint, "enddrag", () => {
      setTimeout(() => setIsDragging(false), 50);
    });

    // Start runner
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    // Sync loop: update DOM element transforms directly
    let animationFrameId: number;
    const updateTransforms = () => {
      const s = scaleMultiplierRef.current;
      bodiesMapRef.current.forEach((body, id) => {
        // Natural self-righting pendulum torque (keeps cards upright and readable)
        const rawAngle = body.angle;
        const normAngle = ((rawAngle % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
        const restoringTorque = -0.007 * Math.sin(normAngle);
        Matter.Body.setAngularVelocity(body, body.angularVelocity * 0.96 + restoringTorque);

        const domEl = shapesRef.current.get(id);
        const shape = SHAPES_MAP.get(id);
        if (domEl && shape) {
          const { x, y } = body.position;
          const halfW = shape.width / 2;
          const halfH = shape.height / 2;
          domEl.style.transform = `translate3d(${x - halfW}px, ${y - halfH}px, 0) rotate(${rawAngle}rad) scale(${s})`;
        }
      });
      animationFrameId = requestAnimationFrame(updateTransforms);
    };
    updateTransforms();

    return () => {
      cancelAnimationFrame(animationFrameId);
      Matter.Runner.stop(runner);
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
    };
  }, []);

  // Handle intersection observer to drop shapes on scroll into view + fallback timer
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggeredDrop) {
            setHasTriggeredDrop(true);
            initPhysics();
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);

    // Fallback: auto init if observer doesn't fire immediately
    const timer = setTimeout(() => {
      if (!hasTriggeredDrop) {
        setHasTriggeredDrop(true);
        initPhysics();
      }
    }, 600);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [hasTriggeredDrop, initPhysics]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      if (hasTriggeredDrop) {
        initPhysics();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [hasTriggeredDrop, initPhysics]);

  // Handle shape click
  const handleShapeClick = (shape: PlasticShapeData) => {
    if (!isDragging) {
      setSelectedShape(shape);
    }
  };

  return (
    <section
      ref={containerRef}
      id="plastic-study-section"
      className="relative w-full min-h-screen bg-[#0020D7] text-white overflow-hidden flex flex-col items-center justify-between pt-16 pb-12 select-none border-t-4 border-black"
    >
      {/* Background Subtle Halftone / Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15 z-0"
        style={{
          backgroundImage: `radial-gradient(#FFFFFF 1.2px, transparent 1.2px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* --- TOP HEADER SECTION (Poster Brutalist Typography) --- */}
      <div className="relative z-10 w-full max-w-6xl px-4 sm:px-8 text-center flex flex-col items-center gap-3">
        {/* Top Mini Brand Stamp */}
        <div className="flex items-center gap-2 px-3.5 py-1 bg-black text-[#A7F417] text-xs font-mono font-bold tracking-widest uppercase rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          <span className="w-2 h-2 rounded-full bg-[#FF009E] animate-ping" />
          THE PLASTIC REVOLUTION // YANG STUDIO x RELIFE LAB
        </div>

        {/* Big Bold Headline */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase font-['DFVNMalinton',sans-serif] leading-[0.9] text-white drop-shadow-md mt-1">
          WHAT HAPPENS TO 1.8M TONS OF PET BOTTLES?
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl font-bold font-['AnekDevanagari',sans-serif] max-w-3xl text-white/90 tracking-tight uppercase mt-1">
          Hành trình giải cứu rác thải nhựa PET và tái sinh thành các tác phẩm in 3D nghệ thuật bền vững
        </p>

        {/* Tip caption */}
        <div className="text-[11px] sm:text-xs font-mono tracking-widest text-[#A7F417] font-bold uppercase mt-2">
          ✦ Click & Kéo thả (drag) hoặc ném (fling) các khối hình để tương tác ✦
        </div>
      </div>

      {/* --- MATTER.JS INTERACTIVE PHYSICS STAGE CONTAINER (FULL SCREEN WIDTH) --- */}
      <div
        ref={physicsCanvasRef}
        className="relative z-10 w-full h-[680px] sm:h-[760px] lg:h-[820px] xl:h-[880px] overflow-hidden touch-none my-2 px-2"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        {/* Render Dynamic HTML DOM Shapes synced to Matter bodies */}
        {SHAPES_DATA.map((shape) => {
          const isHovered = hoveredShapeId === shape.id;

          return (
            <div
              key={shape.id}
              ref={(el) => {
                if (el) shapesRef.current.set(shape.id, el);
                else shapesRef.current.delete(shape.id);
              }}
              onClick={() => handleShapeClick(shape)}
              onMouseEnter={() => setHoveredShapeId(shape.id)}
              onMouseLeave={() => setHoveredShapeId(null)}
              className="absolute top-0 left-0 will-change-transform select-none cursor-pointer group transition-opacity duration-300"
              style={{
                width: `${shape.width}px`,
                height: `${shape.height}px`,
                transformOrigin: "center center",
                transform: "translate3d(0, -9999px, 0)",
              }}
            >
              {/* Outer SVG Silhouette Vector */}
              <div className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-200 group-hover:scale-105">
                {renderShapeSvg(shape, isHovered)}
              </div>

              {/* Inner Bold Typography (rotated with shape & crisp) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3 text-white pointer-events-none z-10">
                {/* Mini Tag Badge */}
                <span
                  className="text-[9px] sm:text-[10px] font-mono font-black tracking-widest px-1.5 py-0.2 rounded mb-0.5"
                  style={{
                    backgroundColor: shape.colorBadge,
                    color: shape.colorBadge === "#A7F417" ? "#000000" : "#FFFFFF",
                  }}
                >
                  {shape.tag}
                </span>

                {/* Main Big Title */}
                <span className="text-xs sm:text-sm md:text-base font-black tracking-tight leading-tight uppercase font-['DFVNMalinton',sans-serif] px-2 drop-shadow-md">
                  {shape.title}
                </span>

                {/* Subtitle / Stat */}
                <span className="text-[9px] sm:text-[10px] font-bold text-white/90 font-['AnekDevanagari',sans-serif] max-w-[85%] leading-tight uppercase tracking-tight mt-0.5">
                  {shape.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- BOTTOM POSTER FOOTER --- */}
      <div className="relative z-10 w-full max-w-6xl px-4 text-center flex flex-col items-center gap-1 mt-2">
        <p className="text-xs sm:text-sm md:text-base font-bold font-mono tracking-wider uppercase text-white/90">
          WE ASKED THE WORLD TO RETHINK PLASTIC — WE RECREATE THE FUTURE WITH 3D PRINTING
        </p>
        <div className="flex items-center gap-4 text-xs font-mono font-bold tracking-widest text-[#A7F417] uppercase">
          <span>MADE IN VIETNAM</span>
          <span>•</span>
          <span>100% RECYCLED rPET</span>
          <span>•</span>
          <span>YANG-STUDIO.COM</span>
        </div>
      </div>

      {/* --- DETAIL MODAL CARD POPUP ON SHAPE CLICK --- */}
      {selectedShape && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-md bg-white border-4 border-black p-6 rounded-2xl shadow-[8px_8px_0px_#000] flex flex-col gap-4 text-black animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedShape(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black text-white font-bold flex items-center justify-center hover:bg-[#FF009E] transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* Header Badge */}
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded text-[11px] font-mono font-black uppercase tracking-wider"
                style={{
                  backgroundColor: selectedShape.colorBadge,
                  color: selectedShape.colorBadge === "#A7F417" ? "#000" : "#FFF",
                }}
              >
                {selectedShape.tag}
              </span>
              <span className="text-xs font-mono font-bold text-black/50 uppercase">
                // {selectedShape.category}
              </span>
            </div>

            {/* Modal Title */}
            <h3 className="text-2xl sm:text-3xl font-black font-['DFVNMalinton',sans-serif] uppercase tracking-tight leading-none">
              {selectedShape.title}
            </h3>
            <p className="text-sm font-bold font-mono text-black/70 uppercase -mt-2">
              {selectedShape.subtitle}
            </p>

            {/* Key Metric Box */}
            <div className="bg-[#0020D7]/10 border-2 border-black p-3.5 rounded-xl flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-black/80">
                {selectedShape.metricLabel}
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-black">
                {selectedShape.stats}
              </span>
            </div>

            {/* Description Body */}
            <p className="text-sm font-['AnekDevanagari',sans-serif] leading-relaxed text-black/90 font-medium">
              {selectedShape.description}
            </p>

            {/* CTA Button */}
            <button
              onClick={() => setSelectedShape(null)}
              className="w-full py-3 bg-black text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#A7F417] hover:text-black border-2 border-black shadow-[4px_4px_0px_#000] transition-all cursor-pointer mt-1"
            >
              ĐÓNG & TIẾP TỤC KHÁM PHÁ
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
