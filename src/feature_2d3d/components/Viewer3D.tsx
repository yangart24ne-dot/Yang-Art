import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useThree, events } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, useCursor } from '@react-three/drei';
import * as THREE from 'three';
// @ts-ignore
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
// @ts-ignore
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { RotateCcw, Download, Box } from 'lucide-react';
import { cn } from '../lib/utils';
import { MaterialConfig, ExtrudeSettings, GeometryStyle, StrokeData, ArtistMark } from '../types';
import { pointsToShape, svgPathToShapes, getGlobalTransform, applyLaplacianSmoothing, smoothPoints, simplifyPathRDP } from '../lib/three-utils';
import { refineGeometry } from '../lib/mesh-processor';

import { RECYCLED_MATERIALS } from '../constants/materials';

/** Lighten a hex color by a given amount (0-1) for hover highlight */
const lightenColor = (hex: string, amount: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + Math.round(255 * amount));
  const g = Math.min(255, ((num >> 8) & 0xff) + Math.round(255 * amount));
  const b = Math.min(255, (num & 0xff) + Math.round(255 * amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};


// Pop-Art SVG imports
import assetGLBButton from '../../assets/info workshop/SVG/Asset 48.svg';
import assetSTLButton from '../../assets/info workshop/SVG/Asset 49.svg';
import assetBoxIcon from '../../assets/info workshop/SVG/Asset 50.svg';
import assetViewerFrame from '../../assets/info workshop/SVG/Asset 51.svg';
import assetWaitingPrompt from '../../assets/info workshop/SVG/Asset 52.svg';
import assetThicknessLabel from '../../assets/info workshop/SVG/Asset 54.svg';
import assetDepthLabel from '../../assets/info workshop/SVG/Asset 55.svg';

export interface ViewerAssetsConfig {
  stlButton: { offsetX: number; offsetY: number; scale: number };
  glbButton: { offsetX: number; offsetY: number; scale: number };
  wireframeButton: { offsetX: number; offsetY: number; scale: number };
  viewerFrame: { offsetX: number; offsetY: number; scale: number; aspectRatio?: string };
  waitingPrompt: { offsetX: number; offsetY: number; scale: number };
  slidersCard?: { offsetX: number; offsetY: number; scale: number };
}

const DEFAULT_VIEWER_CONFIG: ViewerAssetsConfig = {
  stlButton: { offsetX: 0, offsetY: 0, scale: 1.0 },
  glbButton: { offsetX: 0, offsetY: 0, scale: 1.0 },
  wireframeButton: { offsetX: 0, offsetY: 0, scale: 1.0 },
  viewerFrame: { offsetX: 0, offsetY: 0, scale: 1.0 },
  waitingPrompt: { offsetX: 0, offsetY: 0, scale: 1.0 },
  slidersCard: { offsetX: 0, offsetY: 0, scale: 1.0 },
};

interface Viewer3DProps {
  strokes: StrokeData[];
  baseShapeId: string | null;
  onUpdateStrokeMaterial: (id: string, color: string, materialId: string) => void;
  activeMaterial: MaterialConfig;
  extrudeSettings: ExtrudeSettings;
  setExtrudeSettings: (settings: ExtrudeSettings) => void;
  style: GeometryStyle;
  smoothBrushActive: boolean;
  smoothRadius: number;
  smoothStrength: number;
  subdivisionLevel: number;
  retopologyDecimate: number;
  assetsConfig?: ViewerAssetsConfig;
  onSelectMaterial?: (material: MaterialConfig) => void;
}

const CANVAS_SIZE = 500;

/**
 * Checks if a point is inside the base shape boundary.
 * Points are already mapped to centered system (-250 to 250)
 */
const isPointInsideBase = (p: { x: number; y: number }, shapeId: string | null) => {
  if (!shapeId) return true;

  const x = p.x;
  const y = p.y;

  switch (shapeId) {
    case 'circle':
      return Math.sqrt(x * x + y * y) <= 150;
    case 'square':
      return Math.abs(x) <= 150 && Math.abs(y) <= 150;
    case 'heart':
      // Bounding box for heart
      return Math.abs(x) <= 150 && y <= 150 && y >= -150;
    case 'star':
      return Math.sqrt(x * x + y * y) <= 200;
    case 'shield':
      return Math.abs(x) <= 150 && y <= 200 && y >= -200;
    default:
      return true;
  }
};
const BackSideMark: React.FC<{
  mark: ArtistMark;
  activeMaterial: MaterialConfig;
}> = ({ mark, activeMaterial }) => {
  const texture = useMemo(() => {
    if (!mark || mark.type === 'none' || !mark.text) return null;

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Fill background with solid black (0 in alphaMap = transparent)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 1024, 1024);

    // Styling the engraving (white = 1 in alphaMap = opaque text)
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'black 120px "Courier New", monospace';

    ctx.save();
    ctx.translate(512, 512);
    ctx.scale(-1, 1);

    ctx.fillText(mark.text, 0, 0);
    ctx.font = 'bold 40px "Courier New", monospace';
    ctx.fillText("AUTHENTICITY MARK // RECYCLE_3D", 0, 120);
    ctx.fillText(`PRODUCED BY DRAND // ${activeMaterial.name.toUpperCase()}`, 0, 180);

    ctx.restore();

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [mark, activeMaterial]);

  if (!texture) return null;

  return (
    <mesh position={[0, 0, -0.05]} rotation={[0, 0, 0]}>
      <planeGeometry args={[300, 300]} />
      <meshStandardMaterial
        transparent
        alphaMap={texture}
        color="#000000"
        roughness={1}
        metalness={0}
        opacity={0.6}
        depthWrite={false}
      />
    </mesh>
  );
};

const MeshPart: React.FC<{
  stroke: StrokeData,
  baseShapeId: string | null,
  index: number,
  activeMaterial: MaterialConfig,
  extrudeSettings: ExtrudeSettings,
  style: GeometryStyle,
  onMeshClick: (id: string) => void,
  smoothBrushActive: boolean,
  smoothRadius: number,
  smoothStrength: number,
  showWireframe?: boolean,
  subdivisionLevel: number,
  retopologyDecimate: number
}> = ({ stroke, baseShapeId, index, activeMaterial, extrudeSettings, style, onMeshClick, smoothBrushActive, smoothRadius, smoothStrength, showWireframe = false, subdivisionLevel, retopologyDecimate }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [brushPos, setBrushPos] = useState<THREE.Vector3 | null>(null);
  useCursor(hovered && !smoothBrushActive);

  // MATERIAL LOOKUP: Pull realistic plastic properties for each specific part
  const materialProps = useMemo(() => {
    // 1. Tìm theo materialId trước
    let mat = RECYCLED_MATERIALS.find(m => m.id === stroke.materialId);
    
    // 2. Nếu không có materialId, tự động đối chiếu stroke.color với bảng màu vật liệu chính thức
    if (!mat && stroke.color) {
      mat = RECYCLED_MATERIALS.find(m => 
        m.color.toLowerCase() === stroke.color.toLowerCase()
      );
    }
    
    // 3. Nếu vẫn không khớp (ví dụ màu tự do khác), dùng trực tiếp stroke.color để hiển thị đúng màu thay vì đổi sang màu xám
    if (!mat) {
      return { 
        id: 'custom', 
        name: 'Custom', 
        color: stroke.color || '#888888', 
        roughness: 0.8, 
        metalness: 0.1 
      };
    }
    return mat;
  }, [stroke.materialId, stroke.color]);

  const isBase = stroke.layer === 'base';
  const tubeRadius = 3.0;

  // DYNAMIC Z-PLACEMENT:
  let zPosition = 0;
  if (!isBase) {
    const baseFrontZ = extrudeSettings.depth / 2 + (extrudeSettings.bevelEnabled ? extrudeSettings.bevelThickness : 0);
    if (stroke.pathData) {
      const detailHalfDepth = extrudeSettings.detailThickness / 2;
      zPosition = baseFrontZ + detailHalfDepth - 0.1;
    } else {
      zPosition = baseFrontZ + tubeRadius - 0.1;
    }
  }

  const geometry = useMemo(() => {
    let rawGeo: THREE.BufferGeometry | null = null;
    if (isBase || (stroke.layer === 'detail' && stroke.pathData)) {
      let rawShapes: THREE.Shape[] = [];
      if (stroke.pathData) {
        rawShapes = svgPathToShapes(stroke.pathData);
      }
      if (rawShapes.length === 0) {
        const fallbackShape = pointsToShape(stroke.points);
        if (fallbackShape) rawShapes = [fallbackShape];
      }
      if (rawShapes.length === 0) return null;

      const depth = isBase ? extrudeSettings.depth : extrudeSettings.detailThickness;
      const geo = new THREE.ExtrudeGeometry(rawShapes, {
        ...extrudeSettings,
        depth,
        bevelEnabled: isBase ? extrudeSettings.bevelEnabled : false,
        bevelThickness: isBase ? extrudeSettings.bevelThickness : 0,
        bevelSize: isBase ? extrudeSettings.bevelSize : 0,
        bevelSegments: isBase ? extrudeSettings.bevelSegments : 0,
        steps: 1
      });
      geo.scale(1, -1, 1);
      geo.translate(-250, 250, 0);
      geo.computeBoundingBox();
      if (geo.boundingBox) {
        const center = new THREE.Vector3();
        geo.boundingBox.getCenter(center);
        geo.translate(0, 0, -center.z);
      }
      rawGeo = geo;
    } else {
      if (!stroke.points || stroke.points.length === 0) return null;
      const simplifiedPoints = simplifyPathRDP(stroke.points, 1.0);
      if (simplifiedPoints.length === 1) {
        const p = simplifiedPoints[0];
        const geo = new THREE.CylinderGeometry(tubeRadius, tubeRadius, 1, 16);
        geo.rotateX(Math.PI / 2);
        geo.translate(p.x - 250, 250 - p.y, 0);
        rawGeo = geo;
      } else {
        const filteredPoints = simplifiedPoints.filter((p, i, arr) => {
          if (i === 0) return true;
          const prev = arr[i - 1];
          const distSq = Math.pow(p.x - prev.x, 2) + Math.pow(p.y - prev.y, 2);
          return distSq > 0.01;
        });
        if (filteredPoints.length < 2) {
          const p = filteredPoints[0] || simplifiedPoints[0];
          const geo = new THREE.CylinderGeometry(tubeRadius, tubeRadius, 1, 16);
          geo.rotateX(Math.PI / 2);
          geo.translate(p.x - 250, 250 - p.y, 0);
          rawGeo = geo;
        } else {
          const curvePoints = filteredPoints.map(p => new THREE.Vector3(p.x - 250, 250 - p.y, 0));
          try {
            const curve = new THREE.CatmullRomCurve3(curvePoints);
            rawGeo = new THREE.TubeGeometry(curve, 64, tubeRadius, 8, false);
          } catch (err) {
            console.error("CatmullRomCurve3/TubeGeometry failed:", err);
            return null;
          }
        }
      }
    }
    if (!rawGeo) return null;
    return refineGeometry(rawGeo, subdivisionLevel, retopologyDecimate);
  }, [stroke, extrudeSettings, isBase, subdivisionLevel, retopologyDecimate]);

  if (!geometry) return null;

  const handlePointerMove = (e: any) => {
    if (!smoothBrushActive || !meshRef.current) return;
    const point = e.point;
    setBrushPos(point);
    if (e.buttons) {
      const localPoint = meshRef.current.worldToLocal(point.clone());
      applyLaplacianSmoothing(meshRef.current.geometry, localPoint, smoothRadius, smoothStrength);
    }
  };

  const meshColor = materialProps.color || '#FFFFFF';

  return (
    <group onPointerMove={handlePointerMove} onPointerOut={() => setBrushPos(null)}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        castShadow
        receiveShadow
        position={[0, 0, zPosition]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
        onClick={(e) => {
          e.stopPropagation();
          if (!smoothBrushActive) onMeshClick(stroke.id); // Gọi callback đổi màu khi click
        }}
      >
        <meshStandardMaterial
          color={meshColor}                 // Màu gốc chính xác 100% của vật liệu
          roughness={materialProps.roughness ?? 0.5}  // Độ nhám tự nhiên
          metalness={materialProps.metalness ?? 0.0}  // Độ ánh kim
          flatShading={style === 'lowpoly'}
          envMapIntensity={0.4}
          side={THREE.DoubleSide}
        />
        {showWireframe && (
          <meshBasicMaterial wireframe color="#ffffff" transparent opacity={0.1} />
        )}
      </mesh>

      {/* ARTIST MARK / SIGNATURE ON BACK SIDE */}
      {isBase && extrudeSettings.artistMark && (
        <BackSideMark mark={extrudeSettings.artistMark} activeMaterial={activeMaterial} />
      )}

      {smoothBrushActive && brushPos && (
        <mesh position={brushPos} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[smoothRadius - 0.5, smoothRadius, 64]} />
          <meshBasicMaterial color="#D1FF00" transparent opacity={0.8} depthTest={false} />
        </mesh>
      )}
    </group>
  );
};




// AUTO-FRAME: Reads model bounding box and positions camera + OrbitControls target
// so the model is always perfectly centered in the viewport after each Generate.
const SceneFitter: React.FC<{
  groupRef: React.RefObject<THREE.Group>;
  controlsRef: React.RefObject<any>;
  strokesVersion: number;
}> = ({ groupRef, controlsRef, strokesVersion }) => {
  const { camera, size } = useThree();

  useEffect(() => {
    // Give React + Three.js one frame to finish building geometries before measuring
    const timeout = setTimeout(() => {
      if (!groupRef.current || !controlsRef.current) return;
      if (groupRef.current.children.length === 0) return;

      const box = new THREE.Box3().setFromObject(groupRef.current);
      if (box.isEmpty()) return;

      const center = new THREE.Vector3();
      box.getCenter(center);

      const boxSize = new THREE.Vector3();
      box.getSize(boxSize);

      // Compute camera distance that fits the model in the viewport with some padding
      const maxDim = Math.max(boxSize.x, boxSize.y);
      const vFov = ((camera as THREE.PerspectiveCamera).fov * Math.PI) / 180;
      const aspect = size.width / size.height;
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
      const fitFov = Math.min(vFov, hFov);
      const distance = (maxDim / 2 / Math.tan(fitFov / 2)) * 1.4; // 1.4 = padding factor

      // Place camera directly in front of the model center (facing directly, front-facing center)
      camera.position.set(center.x, center.y, center.z + distance);
      (camera as THREE.PerspectiveCamera).updateProjectionMatrix();

      // Sync OrbitControls target
      controlsRef.current.target.copy(center);
      controlsRef.current.update();
    }, 120);

    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strokesVersion]);

  return null;
};

export const Viewer3D: React.FC<Viewer3DProps> = ({
  strokes,
  baseShapeId,
  onUpdateStrokeMaterial,
  activeMaterial,
  extrudeSettings,
  setExtrudeSettings,
  style,
  smoothBrushActive,
  smoothRadius,
  smoothStrength,
  subdivisionLevel,
  retopologyDecimate,
  assetsConfig,
  onSelectMaterial
}) => {
  const cfg = assetsConfig || DEFAULT_VIEWER_CONFIG;
  const groupRef = useRef<THREE.Group>(null);
  const [showWireframe, setShowWireframe] = useState(false);
  // Increment each time strokes change to trigger SceneFitter inside Canvas
  const [strokesVersion, setStrokesVersion] = useState(0);

  useEffect(() => {
    setStrokesVersion(v => v + 1);
  }, [strokes]);


  // Use refs to always read latest values inside mesh click handler
  // This avoids stale closure issues when activeMaterial changes
  const activeMaterialRef = useRef(activeMaterial);
  const onUpdateStrokeMaterialRef = useRef(onUpdateStrokeMaterial);
  const smoothBrushActiveRef = useRef(smoothBrushActive);
  activeMaterialRef.current = activeMaterial;
  onUpdateStrokeMaterialRef.current = onUpdateStrokeMaterial;
  smoothBrushActiveRef.current = smoothBrushActive;

  // handleMeshClick: called from MeshPart's R3F onClick.
  // Reads refs so it always has the latest activeMaterial without re-registration race conditions.
  const handleMeshClick = (id: string) => {
    const mat = activeMaterialRef.current;
    const updateFn = onUpdateStrokeMaterialRef.current;
    console.log('3D Mesh clicked — applying material:', mat.id, mat.color, 'to:', id);
    updateFn(id, mat.color, mat.id);
  };


  // UNIFIED 1:1 SCALE SYSTEM:
  // Instead of calculating scale based on bounding box, use a stable scale
  // that maps the 500px canvas to a reasonable 3D size (e.g., 100 units).
  const globalTransform = useMemo(() => {
    return {
      scale: 100 / CANVAS_SIZE,
      center: new THREE.Vector3(0, 0, 0)
    };
  }, []);

  const exportToSTL = () => {
    if (!groupRef.current) return;

    const exporter = new STLExporter();
    const result = exporter.parse(groupRef.current);

    const blob = new Blob([result], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.href = URL.createObjectURL(blob);
    link.download = `recycled-${activeMaterial.id}.stl`;
    link.click();
    document.body.removeChild(link);
  };

  const exportToGLB = () => {
    if (!groupRef.current) return;

    const exporter = new GLTFExporter();
    exporter.parse(
      groupRef.current,
      (gltf) => {
        const blob = new Blob([gltf as ArrayBuffer], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.href = URL.createObjectURL(blob);
        link.download = `recycled-${activeMaterial.id}.glb`;
        link.click();
        document.body.removeChild(link);
      },
      (error) => {
        console.error('An error happened during GLB export:', error);
      },
      { binary: true }
    );
  };

  const controlsRef = useRef<any>(null);

  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col md:flex-row gap-6 w-full items-stretch mt-1 overflow-visible">
        {/* LEFT PLACEHOLDER (Matches Drawing Canvas Sidebar width to align the viewports perfectly) */}
        <div className="hidden md:block md:w-44 shrink-0" />

        {/* 3D Canvas Box (Framed in Blue Border Container, matching drawing canvas layout) */}
        <div 
          className="flex-1 relative overflow-visible self-center w-full flex flex-col justify-between"
          style={{
            aspectRatio: cfg.viewerFrame.aspectRatio || '1753.91 / 1580.04',
            transform: `translate(${cfg.viewerFrame.offsetX}px, ${cfg.viewerFrame.offsetY}px) scale(${cfg.viewerFrame.scale})`,
            transformOrigin: 'center',
            containerType: 'size'
          }}
        >
          {/* Asset 51 Viewer Frame */}
          <div 
            className="absolute pointer-events-none z-0"
            style={{
              top: `${3 / cfg.viewerFrame.scale}px`,
              left: `${3 / cfg.viewerFrame.scale}px`,
              right: `${3 / cfg.viewerFrame.scale}px`,
              bottom: `${3 / cfg.viewerFrame.scale}px`,
            }}
          >
            <svg 
              className="w-full h-full select-none overflow-visible"
            >
              <rect 
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="#fff" 
                stroke="blue" 
                strokeMiterlimit={10} 
                strokeWidth={6 / cfg.viewerFrame.scale} 
                rx={`${5.2 / cfg.viewerFrame.scale}cqmin`}
                ry={`${5.2 / cfg.viewerFrame.scale}cqmin`}
              />
            </svg>
          </div>

          <div 
            className="absolute bg-[#F8F9FA] overflow-hidden z-10"
            style={{
              left: `${5.4 / cfg.viewerFrame.scale}cqmin`,
              right: `${5.4 / cfg.viewerFrame.scale}cqmin`,
              top: `${5.4 / cfg.viewerFrame.scale}cqmin`,
              bottom: `${5.4 / cfg.viewerFrame.scale}cqmin`,
              borderRadius: `${4.7 / cfg.viewerFrame.scale}cqmin`
            }}
          >
            {/* 3D Canvas (occupies 100% height & width, perfectly centered) */}
            <div className="absolute inset-0 z-0 canvas-container">
              <Canvas
                shadows
                dpr={[1, 2]}
                gl={{ 
                  antialias: true, 
                  preserveDrawingBuffer: true,
                  toneMapping: THREE.ACESFilmicToneMapping,
                  toneMappingExposure: 1.05
                }}
                events={(state) => ({
                  ...events(state),
                  compute: (event, state) => {
                    const canvas = state.gl.domElement;
                    const rect = canvas.getBoundingClientRect();
                    const x = event.clientX - rect.left;
                    const y = event.clientY - rect.top;

                    state.pointer.set((x / rect.width) * 2 - 1, -(y / rect.height) * 2 + 1);
                    state.raycaster.setFromCamera(state.pointer, state.camera);
                  }
                })}
              >
                {/* Auto-frame camera to model bounding box after each Generate */}
                <SceneFitter
                  groupRef={groupRef}
                  controlsRef={controlsRef}
                  strokesVersion={strokesVersion}
                />
                <PerspectiveCamera makeDefault position={[0, 0, 125]} fov={45} />
                {/* Ánh sáng Studio trung tính dịu mắt — Giữ nguyên 100% màu gốc, sáng rõ nổi khối */}
                <ambientLight intensity={0.85} />
                <directionalLight position={[80, 120, 100]} intensity={0.85} castShadow shadow-bias={-0.0001} />
                <directionalLight position={[-80, 40, -50]} intensity={0.35} />
                <Environment preset="studio" environmentIntensity={0.4} />
                <group
                  ref={groupRef}
                  scale={[globalTransform.scale, globalTransform.scale, globalTransform.scale]}
                  position={[0, 0, 0]}
                >
                  {strokes.map((stroke, index) => (
                    <MeshPart
                      key={stroke.id}
                      stroke={stroke}
                      baseShapeId={baseShapeId}
                      index={index}
                      activeMaterial={activeMaterial}
                      extrudeSettings={extrudeSettings}
                      style={style}
                      onMeshClick={handleMeshClick}
                      smoothBrushActive={smoothBrushActive}
                      smoothRadius={smoothRadius}
                      smoothStrength={smoothStrength}
                      showWireframe={showWireframe}
                      subdivisionLevel={subdivisionLevel}
                      retopologyDecimate={retopologyDecimate}
                    />
                  ))}
                </group>
                <OrbitControls
                  ref={controlsRef}
                  makeDefault
                  enabled={!smoothBrushActive}
                  minPolarAngle={0}
                  maxPolarAngle={Math.PI}
                  enableDamping
                  dampingFactor={0.05}
                />
              </Canvas>
            </div>

            {/* Action Buttons & Status Controls (Top Left) */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2.5">
              <button
                onClick={handleReset}
                className="w-8 h-8 flex items-center justify-center bg-white border-2 border-black rounded-lg hover:scale-110 active:scale-90 transition-transform shadow-md cursor-pointer shrink-0"
                title="Reset Camera"
              >
                <RotateCcw size={16} className="text-black" />
              </button>
              <div
                style={{
                  transform: `translate(${cfg.stlButton.offsetX}px, ${cfg.stlButton.offsetY}px) scale(${cfg.stlButton.scale})`,
                  transformOrigin: 'center',
                  display: 'inline-block'
                }}
              >
                <button
                  onClick={exportToSTL}
                  disabled={strokes.length === 0}
                  className="w-14 transition-transform active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer border-none bg-transparent p-0"
                  title="Download STL Model"
                >
                  <img src={assetSTLButton} className="w-full h-auto pointer-events-none select-none" alt="STL" />
                </button>
              </div>
              <div
                style={{
                  transform: `translate(${cfg.glbButton.offsetX}px, ${cfg.glbButton.offsetY}px) scale(${cfg.glbButton.scale})`,
                  transformOrigin: 'center',
                  display: 'inline-block'
                }}
              >
                <button
                  onClick={exportToGLB}
                  disabled={strokes.length === 0}
                  className="w-14 transition-transform active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer border-none bg-transparent p-0"
                  title="Download GLB Model"
                >
                  <img src={assetGLBButton} className="w-full h-auto pointer-events-none select-none" alt="GLB" />
                </button>
              </div>
              <div
                style={{
                  transform: `translate(${cfg.wireframeButton.offsetX}px, ${cfg.wireframeButton.offsetY}px) scale(${cfg.wireframeButton.scale})`,
                  transformOrigin: 'center',
                  display: 'inline-block'
                }}
              >
                <button
                  onClick={() => setShowWireframe(!showWireframe)}
                  disabled={strokes.length === 0}
                  className="w-8 transition-transform active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer border-none bg-transparent p-0"
                  title="Toggle Wireframe Overlay"
                >
                  <img src={assetBoxIcon} className="w-full h-auto pointer-events-none select-none" alt="Wireframe" />
                </button>
              </div>
            </div>

            {/* Waiting Prompt Overlay (z-10, blocks Canvas interaction when empty) */}
            {strokes.length === 0 && (
              <div className="absolute inset-0 bg-[#F9F9F9] flex flex-col items-center justify-center z-10 pointer-events-none select-none p-8">
                <div
                  style={{
                    transform: `translate(${cfg.waitingPrompt.offsetX}px, ${cfg.waitingPrompt.offsetY}px) scale(${cfg.waitingPrompt.scale})`,
                    transformOrigin: 'center'
                  }}
                >
                  <img src={assetWaitingPrompt} className="w-72 h-auto object-contain pointer-events-none select-none" alt="Waiting for Input" />
                </div>
              </div>
            )}

            {/* Wireframe Overlay Close-up (Subtle, floating) */}
            {showWireframe && strokes.length > 0 && (
              <div className="absolute bottom-36 right-6 w-32 h-32 rounded-xl border border-acid/30 bg-acid/5 backdrop-blur-md overflow-hidden pointer-events-none z-20 animate-in zoom-in-95 duration-300">
                <div className="absolute inset-0 opacity-20">
                  <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#D1FF00 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-[8px] font-black text-acid uppercase tracking-tighter text-center px-2">
                    Clean Topology<br />Verified
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sliders Card - Below the 3D canvas, never overlapping it */}
      <div 
        className="w-full mt-3"
        style={{
          transform: cfg.slidersCard ? `translate(${cfg.slidersCard.offsetX}px, ${cfg.slidersCard.offsetY}px) scale(${cfg.slidersCard.scale})` : undefined,
          transformOrigin: 'center'
        }}
      >
        <div className="flex flex-col gap-4 bg-[#0020D7] border-2 border-black rounded-[20px] p-4 shadow-md text-white">
          {/* Material Color Selector */}
          <div className="flex flex-col gap-1.5 w-full pb-2 border-b border-white/10">
            <div className="text-[9px] font-black uppercase tracking-widest text-[#A7F417] select-none">
              Material Color
            </div>
            <div className="flex flex-nowrap gap-3 items-center">
              {RECYCLED_MATERIALS.map((material) => (
                <button
                  key={material.id}
                  onClick={() => onSelectMaterial?.(material)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all duration-150 hover:scale-110 shadow-sm relative cursor-pointer",
                    activeMaterial.id === material.id
                      ? "border-[#A7F417] scale-110 ring-2 ring-[#A7F417]/20"
                      : "border-white/30 hover:border-white/80"
                  )}
                  style={{ backgroundColor: material.color }}
                  title={material.name}
                >
                  {activeMaterial.id === material.id && (
                    <span className="absolute inset-1 border border-[#0020D7] rounded-full pointer-events-none" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Extrusion Depth Slider */}
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center">
              <img src={assetDepthLabel} className="h-3.5 w-auto select-none pointer-events-none" alt="Extrusion Depth" />
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={extrudeSettings.depth}
              onChange={(e) => setExtrudeSettings({ ...extrudeSettings, depth: parseInt(e.target.value) })}
              className="w-full h-[5px] bg-[#FF009C]/30 rounded-full appearance-none cursor-pointer accent-[#A7F417]"
              style={{ outline: 'none' }}
            />
          </div>

          {/* Detail Thickness Slider */}
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center">
              <img src={assetThicknessLabel} className="h-3.5 w-auto select-none pointer-events-none" alt="Detail Thickness" />
            </div>
            <input
              type="range"
              min="1"
              max="25"
              value={extrudeSettings.detailThickness}
              onChange={(e) => setExtrudeSettings({ ...extrudeSettings, detailThickness: parseInt(e.target.value) })}
              className="w-full h-[5px] bg-[#FF009C]/30 rounded-full appearance-none cursor-pointer accent-[#A7F417]"
              style={{ outline: 'none' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

