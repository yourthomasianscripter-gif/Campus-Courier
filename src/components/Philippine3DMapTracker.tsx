import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useNews } from '../context/NewsContext';
import { DisasterItem, HazardType, HazardSeverity } from '../types';
import { 
  RotateCw, 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  Eye, 
  Wind, 
  Flame, 
  Activity, 
  Waves, 
  Mountain,
  Maximize2,
  Info,
  Radio
} from 'lucide-react';
import { getStatusBadgeClass } from './CrisisWatchBanner';

interface Philippine3DMapTrackerProps {
  onSelectHazard?: (item: DisasterItem) => void;
}

export const Philippine3DMapTracker: React.FC<Philippine3DMapTrackerProps> = () => {
  const { disasterItems, selectedHazard, setSelectedHazard } = useNews();
  const containerRef = useRef<HTMLDivElement>(null);

  // HUD and view controls state
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [viewPerspective, setViewPerspective] = useState<'3d-oblique' | 'satellite-top'>('3d-oblique');
  const [hoveredHazard, setHoveredHazard] = useState<DisasterItem | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
  const [activeLayer, setActiveLayer] = useState<'all' | 'par' | 'radar'>('all');

  // Internal Three.js refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const pinsGroupRef = useRef<THREE.Group | null>(null);
  const effectsGroupRef = useRef<THREE.Group | null>(null);
  const radarSweepRef = useRef<THREE.Mesh | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Interaction tracking refs
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetRotationRef = useRef<{ x: number; y: number }>({ x: 0.25, y: -0.1 });
  const currentRotationRef = useRef<{ x: number; y: number }>({ x: 0.25, y: -0.1 });
  const zoomDistanceRef = useRef<number>(260);
  const targetZoomDistanceRef = useRef<number>(260);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(-999, -999));
  const pinMeshesMapRef = useRef<Map<THREE.Object3D, DisasterItem>>(new Map());

  // Spherical coordinate math for Philippines center (12.8797° N, 121.7740° E)
  const GLOBE_RADIUS = 160;
  const PH_CENTER_LAT = 12.8797;
  const PH_CENTER_LNG = 121.7740;

  const latLngToVector3 = useCallback((lat: number, lng: number, altitudeOffset = 0): THREE.Vector3 => {
    // Map relative to Philippines center so archipelago faces camera cleanly
    const dLat = (lat - PH_CENTER_LAT) * (Math.PI / 180);
    const dLng = (lng - PH_CENTER_LNG) * (Math.PI / 180);
    const r = GLOBE_RADIUS + altitudeOffset;

    // Local spherical coordinate projection on globe surface
    const x = r * Math.cos(dLat) * Math.sin(dLng) * 2.8;
    const y = r * Math.sin(dLat) * 2.8;
    const z = r * Math.cos(dLat) * Math.cos(dLng) - GLOBE_RADIUS;

    return new THREE.Vector3(x, y, z);
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x0a0a0c, 0.0018);

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 1, 2000);
    camera.position.set(0, 40, zoomDistanceRef.current);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Groups
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    const pinsGroup = new THREE.Group();
    globeGroup.add(pinsGroup);
    pinsGroupRef.current = pinsGroup;

    const effectsGroup = new THREE.Group();
    globeGroup.add(effectsGroup);
    effectsGroupRef.current = effectsGroup;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x2d3748, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight1.position.set(150, 200, 250);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf59e0b, 0.8);
    dirLight2.position.set(-200, -100, 150);
    scene.add(dirLight2);

    const oceanicLight = new THREE.PointLight(0x0ea5e9, 2.0, 500);
    oceanicLight.position.set(0, -50, 120);
    scene.add(oceanicLight);

    // 1. Globe Base (Ocean Curvature)
    const globeGeom = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0x070c14,
      roughness: 0.85,
      metalness: 0.15,
      wireframe: false,
    });
    const globeMesh = new THREE.Mesh(globeGeom, globeMat);
    globeMesh.position.set(0, 0, -GLOBE_RADIUS);
    globeGroup.add(globeMesh);

    // Oceanic Wireframe Latitude/Longitude Graticule
    const graticuleGeom = new THREE.SphereGeometry(GLOBE_RADIUS + 0.3, 36, 36);
    const graticuleMat = new THREE.MeshBasicMaterial({
      color: 0x1e293b,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const graticuleMesh = new THREE.Mesh(graticuleGeom, graticuleMat);
    graticuleMesh.position.set(0, 0, -GLOBE_RADIUS);
    globeGroup.add(graticuleMesh);

    // 2. PAR (Philippine Area of Responsibility) 3D Glowing Boundary
    // Coordinates: (25°N, 120°E), (25°N, 135°E), (5°N, 135°E), (5°N, 115°E), (15°N, 115°E), (21°N, 120°E), (25°N, 120°E)
    const parCoords = [
      { lat: 25.0, lng: 120.0 },
      { lat: 25.0, lng: 135.0 },
      { lat: 5.0, lng: 135.0 },
      { lat: 5.0, lng: 115.0 },
      { lat: 15.0, lng: 115.0 },
      { lat: 21.0, lng: 120.0 },
      { lat: 25.0, lng: 120.0 },
    ];
    const parPoints = parCoords.map(c => latLngToVector3(c.lat, c.lng, 1.2));
    const parGeometry = new THREE.BufferGeometry().setFromPoints(parPoints);
    const parMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.7,
    });
    const parLine = new THREE.Line(parGeometry, parMaterial);
    globeGroup.add(parLine);

    // 3. 3D Archipelago Landmass Polygons & Relief Shapes
    // Detailed stylized 3D landmasses matching Philippine islands with 3D elevation
    const islandsData: { name: string; path: { lat: number; lng: number }[]; elevation: number; color: number }[] = [
      // Northern & Central Luzon
      {
        name: 'Luzon',
        path: [
          { lat: 18.5, lng: 121.5 },
          { lat: 18.4, lng: 122.3 },
          { lat: 17.5, lng: 122.5 },
          { lat: 16.0, lng: 121.8 },
          { lat: 15.3, lng: 121.5 },
          { lat: 14.5, lng: 121.1 }, // Manila Bay
          { lat: 14.8, lng: 120.4 }, // Bataan
          { lat: 15.8, lng: 119.8 }, // Zambales
          { lat: 16.3, lng: 120.3 }, // Lingayen Gulf
          { lat: 17.5, lng: 120.4 }, // Ilocos
          { lat: 18.5, lng: 120.7 },
        ],
        elevation: 2.5,
        color: 0x223028,
      },
      // Bicol Peninsula & Southern Luzon
      {
        name: 'Bicol',
        path: [
          { lat: 14.2, lng: 121.4 },
          { lat: 14.2, lng: 122.8 },
          { lat: 13.8, lng: 123.8 },
          { lat: 13.1, lng: 124.0 }, // Albay / Mayon
          { lat: 12.6, lng: 124.1 }, // Sorsogon
          { lat: 12.8, lng: 123.5 },
          { lat: 13.5, lng: 122.8 },
          { lat: 13.7, lng: 121.5 },
        ],
        elevation: 2.2,
        color: 0x223028,
      },
      // Mindoro
      {
        name: 'Mindoro',
        path: [
          { lat: 13.5, lng: 120.8 },
          { lat: 13.4, lng: 121.5 },
          { lat: 12.5, lng: 121.4 },
          { lat: 12.3, lng: 121.1 },
          { lat: 12.8, lng: 120.6 },
        ],
        elevation: 1.8,
        color: 0x1f2b24,
      },
      // Palawan Island Chain
      {
        name: 'Palawan',
        path: [
          { lat: 11.4, lng: 119.5 },
          { lat: 10.8, lng: 119.3 },
          { lat: 9.8, lng: 118.7 },
          { lat: 8.8, lng: 117.8 },
          { lat: 8.5, lng: 117.3 },
          { lat: 8.8, lng: 117.2 },
          { lat: 9.9, lng: 118.2 },
          { lat: 11.2, lng: 119.2 },
        ],
        elevation: 1.5,
        color: 0x1f2b24,
      },
      // Panay & Guimaras
      {
        name: 'Panay',
        path: [
          { lat: 11.8, lng: 122.0 },
          { lat: 11.6, lng: 123.1 },
          { lat: 10.8, lng: 123.0 },
          { lat: 10.5, lng: 122.1 },
          { lat: 11.0, lng: 121.9 },
        ],
        elevation: 1.7,
        color: 0x223028,
      },
      // Negros
      {
        name: 'Negros',
        path: [
          { lat: 11.0, lng: 123.2 },
          { lat: 10.7, lng: 123.5 },
          { lat: 9.8, lng: 123.2 },
          { lat: 9.1, lng: 123.0 },
          { lat: 9.6, lng: 122.5 },
          { lat: 10.3, lng: 122.8 }, // Kanlaon
        ],
        elevation: 2.1,
        color: 0x24332a,
      },
      // Cebu & Bohol
      {
        name: 'Cebu-Bohol',
        path: [
          { lat: 11.2, lng: 124.0 },
          { lat: 10.4, lng: 123.9 },
          { lat: 9.6, lng: 123.3 },
          { lat: 9.5, lng: 123.4 },
          { lat: 10.0, lng: 124.3 },
          { lat: 10.8, lng: 124.4 },
        ],
        elevation: 1.6,
        color: 0x1f2b24,
      },
      // Samar & Leyte
      {
        name: 'Samar-Leyte',
        path: [
          { lat: 12.5, lng: 124.5 },
          { lat: 12.0, lng: 125.4 },
          { lat: 11.1, lng: 125.7 },
          { lat: 10.2, lng: 125.2 },
          { lat: 10.5, lng: 124.8 },
          { lat: 11.4, lng: 124.8 },
        ],
        elevation: 1.8,
        color: 0x223028,
      },
      // Mindanao Mainland
      {
        name: 'Mindanao',
        path: [
          { lat: 9.8, lng: 125.5 }, // Surigao
          { lat: 9.0, lng: 126.3 }, // Davao Oriental
          { lat: 7.0, lng: 126.6 },
          { lat: 6.2, lng: 126.2 },
          { lat: 5.6, lng: 125.3 }, // Sarangani
          { lat: 6.0, lng: 124.3 }, // Cotabato
          { lat: 7.2, lng: 124.2 },
          { lat: 7.8, lng: 122.2 }, // Zamboanga Peninsula
          { lat: 6.9, lng: 122.1 },
          { lat: 8.2, lng: 122.8 },
          { lat: 8.6, lng: 124.5 }, // Iligan/Cagayan de Oro
          { lat: 9.0, lng: 125.3 },
        ],
        elevation: 2.8,
        color: 0x24332a,
      },
      // Batanes & Babuyan Islands
      {
        name: 'Batanes-Babuyan',
        path: [
          { lat: 20.8, lng: 121.9 },
          { lat: 20.4, lng: 122.0 },
          { lat: 19.3, lng: 121.5 },
          { lat: 18.9, lng: 121.3 },
          { lat: 18.9, lng: 121.8 },
          { lat: 20.5, lng: 122.2 },
        ],
        elevation: 1.5,
        color: 0x223028,
      },
    ];

    // Build 3D relief meshes for each island
    islandsData.forEach(island => {
      const pts3D = island.path.map(p => latLngToVector3(p.lat, p.lng, 0.4));
      
      // Island outline ribbon
      const outlineGeom = new THREE.BufferGeometry().setFromPoints([...pts3D, pts3D[0]]);
      const outlineMat = new THREE.LineBasicMaterial({
        color: 0x4ade80,
        linewidth: 1,
        transparent: true,
        opacity: 0.6,
      });
      const outlineLine = new THREE.Line(outlineGeom, outlineMat);
      globeGroup.add(outlineLine);

      // Filled extruded planar polygon shape
      const shape = new THREE.Shape();
      island.path.forEach((p, idx) => {
        const v = latLngToVector3(p.lat, p.lng, 0.5);
        if (idx === 0) shape.moveTo(v.x, v.y);
        else shape.lineTo(v.x, v.y);
      });
      shape.closePath();

      const extrudeSettings = {
        depth: island.elevation,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.4,
        bevelThickness: 0.4,
      };

      try {
        const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const mat = new THREE.MeshStandardMaterial({
          color: island.color,
          roughness: 0.7,
          metalness: 0.1,
          bumpScale: 0.2,
        });
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.z = 0.5;
        globeGroup.add(mesh);
      } catch (err) {
        console.warn('Extrude geometry fallback for island', island.name, err);
      }
    });

    // 4. Volumetric Rotating Radar Sweep Wedge (PAGASA Radar Simulation)
    const sweepGeom = new THREE.ConeGeometry(85, 12, 32, 1, true, 0, Math.PI / 3);
    const sweepMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const radarSweep = new THREE.Mesh(sweepGeom, sweepMat);
    radarSweep.rotation.x = Math.PI / 2;
    radarSweep.position.set(0, 20, 2);
    globeGroup.add(radarSweep);
    radarSweepRef.current = radarSweep;

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera dampening
      if (cameraRef.current) {
        zoomDistanceRef.current += (targetZoomDistanceRef.current - zoomDistanceRef.current) * 0.1;
        cameraRef.current.position.z = zoomDistanceRef.current;
      }

      // Smooth globe rotation dampening
      if (globeGroupRef.current) {
        if (autoRotate && !isDraggingRef.current) {
          targetRotationRef.current.y += delta * 0.12;
        }

        currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.1;
        currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.1;

        globeGroupRef.current.rotation.x = currentRotationRef.current.x;
        globeGroupRef.current.rotation.y = currentRotationRef.current.y;
      }

      // Rotate radar sweep
      if (radarSweepRef.current) {
        radarSweepRef.current.rotation.z += delta * 1.5;
      }

      // Animate hazard pulsing effects (shockwave rings, cyclones, smoke particles)
      if (effectsGroupRef.current) {
        effectsGroupRef.current.children.forEach((child, index) => {
          // Dynamic scale pulses for shockwave rings
          if (child.name.startsWith('ring-')) {
            const scale = 1 + (Math.sin(elapsedTime * 3 + index) * 0.35 + 0.35);
            child.scale.set(scale, scale, scale);
            const mat = (child as THREE.Mesh).material as THREE.Material;
            if (mat && 'opacity' in mat) {
              (mat as THREE.MeshBasicMaterial).opacity = Math.max(0.1, 0.8 - scale * 0.4);
            }
          }

          // Spin typhoon spiral vortices counter-clockwise (Northern hemisphere cyclonic rotation)
          if (child.name.startsWith('typhoon-vortex-')) {
            child.rotation.z -= delta * 3.5;
          }

          // Volcanic smoke plume pulsation
          if (child.name.startsWith('volcano-plume-')) {
            child.position.z = 8 + Math.sin(elapsedTime * 2 + index) * 2;
          }
        });
      }

      // Raycaster check for hover
      if (cameraRef.current && sceneRef.current) {
        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        const intersectables = Array.from(pinMeshesMapRef.current.keys());
        const intersects = raycasterRef.current.intersectObjects(intersectables, true);

        if (intersects.length > 0) {
          let topObj: THREE.Object3D | null = intersects[0].object;
          let matchedItem: DisasterItem | undefined;

          while (topObj && !matchedItem) {
            matchedItem = pinMeshesMapRef.current.get(topObj);
            topObj = topObj.parent;
          }

          if (matchedItem) {
            setHoveredHazard(matchedItem);
          }
        } else {
          setHoveredHazard(null);
        }
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.remove();
        rendererRef.current.dispose();
      }
    };
  }, [latLngToVector3, autoRotate]);

  // Update 3D Pins & Weather Hazard Features when disasterItems or selectedHazard changes
  useEffect(() => {
    const pinsGroup = pinsGroupRef.current;
    const effectsGroup = effectsGroupRef.current;
    if (!pinsGroup || !effectsGroup) return;

    // Clear existing
    while (pinsGroup.children.length > 0) {
      pinsGroup.remove(pinsGroup.children[0]);
    }
    while (effectsGroup.children.length > 0) {
      effectsGroup.remove(effectsGroup.children[0]);
    }
    pinMeshesMapRef.current.clear();

    disasterItems.forEach((item) => {
      const pos = latLngToVector3(item.coordinates.lat, item.coordinates.lng, 1.5);
      const isSelected = selectedHazard?.id === item.id;

      // Color scheme based on severity and hazard type
      let hexColor = 0xf59e0b; // default amber
      if (item.currentStatus === 'ALERT' || item.severity === 'Critical') {
        hexColor = 0xef4444; // crimson red
      } else if (item.currentStatus === 'MONITORING') {
        hexColor = 0x38bdf8; // cyan / sky
      } else if (item.currentStatus === 'RESOLVED') {
        hexColor = 0x10b981; // emerald
      }

      // Pin Container Group
      const pinSubGroup = new THREE.Group();
      pinSubGroup.position.copy(pos);

      // 1. Vertical Atmospheric Light Beam (Beacon Column)
      const columnHeight = isSelected ? 30 : 18;
      const columnGeom = new THREE.CylinderGeometry(0.35, 0.8, columnHeight, 16);
      const columnMat = new THREE.MeshBasicMaterial({
        color: hexColor,
        transparent: true,
        opacity: isSelected ? 0.9 : 0.6,
      });
      const columnMesh = new THREE.Mesh(columnGeom, columnMat);
      columnMesh.rotation.x = Math.PI / 2;
      columnMesh.position.z = columnHeight / 2;
      pinSubGroup.add(columnMesh);

      // 2. Glowing Head / Beacon Core
      const headGeom = new THREE.SphereGeometry(isSelected ? 3.2 : 2.2, 16, 16);
      const headMat = new THREE.MeshStandardMaterial({
        color: hexColor,
        emissive: hexColor,
        emissiveIntensity: isSelected ? 1.5 : 0.8,
        roughness: 0.2,
      });
      const headMesh = new THREE.Mesh(headGeom, headMat);
      headMesh.position.z = columnHeight;
      pinSubGroup.add(headMesh);

      // Register for raycaster hover/click
      pinMeshesMapRef.current.set(headMesh, item);
      pinMeshesMapRef.current.set(columnMesh, item);
      pinMeshesMapRef.current.set(pinSubGroup, item);

      pinsGroup.add(pinSubGroup);

      // 3. Dynamic Shockwave Rings (Expanding Radar Rings at Ground Level)
      const ringGeom = new THREE.RingGeometry(2.5, 3.8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: hexColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.position.z += 0.5;
      ringMesh.name = `ring-${item.id}`;
      effectsGroup.add(ringMesh);

      // 4. Hazard-Specific 3D Atmospheric Effects
      // TYPHOON: Swirling cyclonic particle vortex
      if (item.hazardType === 'Typhoon') {
        const vortexGroup = new THREE.Group();
        vortexGroup.position.copy(pos);
        vortexGroup.position.z += 12;
        vortexGroup.name = `typhoon-vortex-${item.id}`;

        const particleCount = 200;
        const particleGeom = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let p = 0; p < particleCount; p++) {
          const arm = p % 3;
          const dist = 3 + Math.random() * 16;
          const angle = (p / particleCount) * Math.PI * 4 + (arm * (Math.PI * 2 / 3));
          positions[p * 3] = Math.cos(angle) * dist;
          positions[p * 3 + 1] = Math.sin(angle) * dist;
          positions[p * 3 + 2] = (Math.random() - 0.5) * 3;

          colors[p * 3] = 0.9;
          colors[p * 3 + 1] = 0.95;
          colors[p * 3 + 2] = 1.0;
        }

        particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMat = new THREE.PointsMaterial({
          size: 1.2,
          vertexColors: true,
          transparent: true,
          opacity: 0.7,
          blending: THREE.AdditiveBlending,
        });

        const particles = new THREE.Points(particleGeom, particleMat);
        vortexGroup.add(particles);

        // Central Eye of the Storm ring
        const eyeRingGeom = new THREE.RingGeometry(1.5, 2.5, 24);
        const eyeRingMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8,
        });
        const eyeRing = new THREE.Mesh(eyeRingGeom, eyeRingMat);
        vortexGroup.add(eyeRing);

        effectsGroup.add(vortexGroup);
      }

      // VOLCANIC ACTIVITY: Volcanic plume column with fiery amber sparks
      if (item.hazardType === 'Volcanic Activity') {
        const plumeGroup = new THREE.Group();
        plumeGroup.position.copy(pos);
        plumeGroup.name = `volcano-plume-${item.id}`;

        const smokeCount = 70;
        const smokeGeom = new THREE.BufferGeometry();
        const smokePositions = new Float32Array(smokeCount * 3);
        for (let s = 0; s < smokeCount; s++) {
          const spread = (s / smokeCount) * 6;
          smokePositions[s * 3] = (Math.random() - 0.5) * spread;
          smokePositions[s * 3 + 1] = (Math.random() - 0.5) * spread;
          smokePositions[s * 3 + 2] = 4 + (s / smokeCount) * 18;
        }
        smokeGeom.setAttribute('position', new THREE.BufferAttribute(smokePositions, 3));
        const smokeMat = new THREE.PointsMaterial({
          color: 0xf97316,
          size: 1.8,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending,
        });
        const smoke = new THREE.Points(smokeGeom, smokeMat);
        plumeGroup.add(smoke);
        effectsGroup.add(plumeGroup);
      }

      // EARTHQUAKE: Multi-layered seismic epicentral rings
      if (item.hazardType === 'Earthquake') {
        [6, 12, 18].forEach((radius, i) => {
          const seismicGeom = new THREE.RingGeometry(radius - 0.4, radius, 36);
          const seismicMat = new THREE.MeshBasicMaterial({
            color: 0xf43f5e,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5 - i * 0.12,
          });
          const seismicRing = new THREE.Mesh(seismicGeom, seismicMat);
          seismicRing.position.copy(pos);
          seismicRing.position.z += 0.2;
          effectsGroup.add(seismicRing);
        });
      }
    });
  }, [disasterItems, selectedHazard, latLngToVector3]);

  // When selectedHazard changes from outside, gently focus camera
  useEffect(() => {
    if (!selectedHazard) return;
    const dLat = (selectedHazard.coordinates.lat - PH_CENTER_LAT) * (Math.PI / 180);
    const dLng = (selectedHazard.coordinates.lng - PH_CENTER_LNG) * (Math.PI / 180);

    // Gently rotate towards hazard
    targetRotationRef.current = {
      x: -dLat * 0.8 + 0.1,
      y: -dLng * 0.8,
    };
    targetZoomDistanceRef.current = 220; // focus zoom
  }, [selectedHazard]);

  // Mouse & Touch Drag Event Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      setHoverPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }

    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    targetRotationRef.current.y += deltaX * 0.007;
    targetRotationRef.current.x = Math.max(-0.6, Math.min(0.8, targetRotationRef.current.x + deltaY * 0.007));

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleClick = () => {
    if (hoveredHazard) {
      setSelectedHazard(hoveredHazard);
    }
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
    const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

    targetRotationRef.current.y += deltaX * 0.007;
    targetRotationRef.current.x = Math.max(-0.6, Math.min(0.8, targetRotationRef.current.x + deltaY * 0.007));

    previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    targetZoomDistanceRef.current = Math.max(140, Math.min(420, targetZoomDistanceRef.current + e.deltaY * 0.3));
  };

  // HUD Action buttons
  const resetToCenter = () => {
    targetRotationRef.current = { x: 0.25, y: -0.1 };
    targetZoomDistanceRef.current = 260;
  };

  const togglePerspective = () => {
    if (viewPerspective === '3d-oblique') {
      setViewPerspective('satellite-top');
      targetRotationRef.current = { x: 0.0, y: 0.0 };
    } else {
      setViewPerspective('3d-oblique');
      targetRotationRef.current = { x: 0.35, y: -0.15 };
    }
  };

  const zoomIn = () => {
    targetZoomDistanceRef.current = Math.max(140, targetZoomDistanceRef.current - 40);
  };

  const zoomOut = () => {
    targetZoomDistanceRef.current = Math.min(420, targetZoomDistanceRef.current + 40);
  };

  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] bg-gradient-to-b from-neutral-950 via-[#070b12] to-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl select-none group">
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Top Floating HUD: Telemetry & Orientation Readout */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none gap-2">
        <div className="flex items-center gap-2 bg-neutral-950/85 backdrop-blur-md border border-neutral-800/80 px-2.5 py-1.5 rounded-xl shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="text-[11px] font-mono font-bold text-neutral-200 tracking-wider">
            3D SPATIAL ARCHIPELAGO GLOBE
          </span>
          <span className="text-[10px] font-mono text-neutral-500 hidden sm:inline">
            PAR 120°-135°E · 5°-25°N
          </span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
              autoRotate
                ? 'yellow-gradient-btn shadow-[0_0_15px_rgba(250,204,21,0.5)]'
                : 'bg-neutral-900/90 text-neutral-300 border border-neutral-700 hover:text-white'
            }`}
            title="Toggle Cinematic Auto-Orbit"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin text-neutral-950' : ''}`} />
            <span className="hidden md:inline">{autoRotate ? 'Orbit: ON' : 'Orbit: OFF'}</span>
          </button>
        </div>
      </div>

      {/* Right Floating Control Pad: 3D Camera Controls */}
      <div className="absolute top-14 right-3 flex flex-col items-center gap-1.5 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 p-1.5 rounded-xl shadow-xl z-20">
        <button
          onClick={zoomIn}
          className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={zoomOut}
          className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-full h-px bg-neutral-800 my-0.5" />
        <button
          onClick={togglePerspective}
          className="p-2 rounded-lg bg-neutral-900 hover:bg-amber-500 hover:text-neutral-950 text-neutral-200 transition-colors"
          title={`Switch perspective (Current: ${viewPerspective})`}
        >
          <Compass className="w-4 h-4" />
        </button>
        <button
          onClick={resetToCenter}
          className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white transition-colors"
          title="Reset to Center Philippines"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive 3D Hover Tooltip Card */}
      {hoveredHazard && hoverPosition && (
        <div
          style={{
            left: `${Math.min(hoverPosition.x + 12, (containerRef.current?.clientWidth || 300) - 220)}px`,
            top: `${Math.max(hoverPosition.y - 60, 20)}px`,
          }}
          className="absolute z-30 pointer-events-none bg-neutral-950/95 border border-amber-500/80 rounded-xl p-2.5 shadow-2xl max-w-[210px] space-y-1 animate-in fade-in zoom-in-95 backdrop-blur-md"
        >
          <div className="flex items-center gap-1.5">
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${getStatusBadgeClass(hoveredHazard.currentStatus)}`}>
              {hoveredHazard.currentStatus}
            </span>
            <span className="text-[10px] font-mono text-neutral-400">
              {hoveredHazard.hazardType}
            </span>
          </div>
          <h5 className="font-serif font-bold text-xs text-white line-clamp-1">
            {hoveredHazard.eventName}
          </h5>
          <p className="text-[10px] text-neutral-400 line-clamp-2">
            📍 {hoveredHazard.location}
          </p>
          <div className="text-[9px] font-mono text-amber-400 font-semibold pt-0.5">
            Click marker to inspect full briefing →
          </div>
        </div>
      )}

      {/* Bottom Floating Legend & Gesture Instructions */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="bg-neutral-950/90 backdrop-blur-md border border-neutral-800 rounded-xl px-3 py-2 text-[10px] text-neutral-300 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>Alert / Critical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Developing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            <span>Monitoring</span>
          </div>
        </div>

        <div className="bg-neutral-950/90 backdrop-blur-md border border-neutral-800 rounded-xl px-2.5 py-1.5 text-[10px] font-mono text-neutral-400 hidden sm:flex items-center gap-2">
          <span>🖐️ Drag to orbit</span>
          <span>·</span>
          <span>🔍 Scroll to zoom</span>
        </div>
      </div>
    </div>
  );
};
