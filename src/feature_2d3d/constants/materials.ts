import { MaterialConfig } from "../types";
import { BRAND } from "@/src/lib/brand-colors";

/** Vật liệu tái chế — chỉ dùng bảng màu chính thương hiệu */
export const RECYCLED_MATERIALS: MaterialConfig[] = [
  { id: "hdpe-white", name: "Recycled White HDPE", color: BRAND.white, roughness: 0.85, metalness: 0.0 },
  { id: "hdpe-blue", name: "Recycled Blue HDPE", color: BRAND.blue, roughness: 0.8, metalness: 0.0 },
  { id: "pet-pink", name: "Recycled Pink PET", color: BRAND.pink, roughness: 0.75, metalness: 0.0 },
  { id: "pet-black", name: "Recycled Black PET", color: BRAND.black, roughness: 0.8, metalness: 0.0 },
];
