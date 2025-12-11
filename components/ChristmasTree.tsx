import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instance, Instances, Image, Float, Sparkles, Text } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useStore } from '../store/useStore';
import { PARTICLE_COUNT, RIBBON_COUNT, TOTAL_PARTICLE_COUNT, INTERNAL_SPHERE_COUNT, getTreePosition, getNebulaPosition, ORNAMENT_COLORS } from '../utils/geometry';

// Reusable dummy for matrix calculations
const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();
const colorBottom = new THREE.Color('#001040'); // Deep Sapphire
const colorTop = new THREE.Color('#E0FFFF');    // Icy Light Cyan
const colorRibbon = new THREE.Color('#88CCFF'); // Shimmering Light Blue

interface DecorationProps {
  color: string;
  position: [number, number, number];
  phase: string;
}

const DecorationMesh: React.FC<DecorationProps> = ({ color, position, phase }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);
    const nebulaPos = useMemo(() => getNebulaPosition(Math.random() * 100), []);

    useEffect(() => {
        if (!meshRef.current) return;
        
        if (phase === 'blooming') {
            gsap.to(meshRef.current.position, {
                x: nebulaPos.x,
                y: nebulaPos.y,
                z: nebulaPos.z,
                duration: 2,
                ease: "power2.out",
                delay: Math.random() * 0.5
            });
        } else if (phase === 'collapsing') {
            gsap.to(meshRef.current.position, {
                x: initialPos.x,
                y: initialPos.y,
                z: initialPos.z,
                duration: 2,
                ease: "power2.inOut",
                delay: Math.random() * 0.5
            });
        }
    }, [phase, initialPos, nebulaPos]);

    return (
        <mesh ref={meshRef} position={position} scale={0.25}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color={color} roughness={0.1} metalness={0.9} />
        </mesh>
    );
}

// Internal Softly Glowing Spheres
interface GlowingSphereProps {
  position: [number, number, number];
  scale: number;
  phase: string;
}

const GlowingSphere: React.FC<GlowingSphereProps> = ({ position, scale, phase }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);
    const nebulaPos = useMemo(() => getNebulaPosition(Math.random() * 100), []);

    useEffect(() => {
        if (!meshRef.current) return;
        
        if (phase === 'blooming') {
            gsap.to(meshRef.current.position, {
                x: nebulaPos.x,
                y: nebulaPos.y,
                z: nebulaPos.z,
                duration: 2.5,
                ease: "power2.out",
                delay: Math.random() * 0.3
            });
        } else if (phase === 'collapsing') {
            gsap.to(meshRef.current.position, {
                x: initialPos.x,
                y: initialPos.y,
                z: initialPos.z,
                duration: 2.5,
                ease: "power2.inOut",
                delay: Math.random() * 0.3
            });
        }
    }, [phase, initialPos, nebulaPos]);

    return (
        <mesh ref={meshRef} position={position} scale={scale}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial 
                color="#E0FFFF" 
                emissive="#88CCFF" 
                emissiveIntensity={1.5} 
                toneMapped={false}
                transparent
                opacity={0.9}
            />
        </mesh>
    );
}

const PhotoGallery = ({ phase, nebulaRotation }: { phase: string, nebulaRotation: number }) => {
    const groupRef = useRef<THREE.Group>(null);
    
    // ---------------------------------------------------------
    // REPLACE YOUR IMAGES HERE
    // You can replace these URLs with local paths (e.g. "/images/photo1.jpg") 
    // or other external links.
    // ---------------------------------------------------------
    const photoUrls = [
        `https://picsum.photos/400/500?random=0`,
        `https://picsum.photos/400/500?random=1`,
        `https://picsum.photos/400/500?random=2`,
        `https://picsum.photos/400/500?random=3`,
        `https://picsum.photos/400/500?random=4`,
        `https://picsum.photos/400/500?random=5`,
        `https://picsum.photos/400/500?random=6`,
        `https://picsum.photos/400/500?random=7`,
        `https://picsum.photos/400/500?random=8`,
        `https://picsum.photos/400/500?random=9`,
        `https://picsum.photos/400/500?random=10`,
        `https://picsum.photos/400/500?random=11`,
    ];

    const photos = useMemo(() => photoUrls.map((url, i) => ({
        url: url,
        angle: (i / photoUrls.length) * Math.PI * 2,
        radius: 12
    })), [photoUrls]);

    useFrame(() => {
        if (groupRef.current && phase === 'nebula') {
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, nebulaRotation, 0.05);
        }
    });

    return (
        <group ref={groupRef}>
            {photos.map((photo, i) => (
                <group key={i} rotation={[0, photo.angle, 0]} position={[0, 0, 0]}>
                    <group position={[0, 0, photo.radius]}>
                        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                            <mesh 
                                visible={phase === 'nebula' || phase === 'blooming'} 
                                scale={phase === 'tree' ? 0 : 1.5}
                            >
                                <boxGeometry args={[2.2, 2.6, 0.05]} />
                                <meshStandardMaterial color="#fff" />
                                <Image 
                                    url={photo.url} 
                                    position={[0, 0.2, 0.06]} 
                                    scale={[1.8, 1.8]}
                                    side={THREE.DoubleSide}
                                />
                                <Text 
                                    position={[0, -1, 0.06]} 
                                    fontSize={0.2} 
                                    color="black"
                                    font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                                >
                                    Dec 25
                                </Text>
                            </mesh>
                        </Float>
                    </group>
                </group>
            ))}
        </group>
    )
}

export const ChristmasTree: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const phase = useStore((state) => state.phase);
  const setPhase = useStore((state) => state.setPhase);
  const nebulaRotation = useStore((state) => state.nebulaRotation);

  // Pre-calculate fixed positions
  const { treePositions, nebulaPositions, baseColors } = useMemo(() => {
    const total = TOTAL_PARTICLE_COUNT;
    const tree = new Float32Array(total * 3);
    const nebula = new Float32Array(total * 3);
    const cols = new Float32Array(total * 3);

    // 1. Generate Main Tree Body
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const tPos = getTreePosition(i);
      tree[i * 3] = tPos.x;
      tree[i * 3 + 1] = tPos.y;
      tree[i * 3 + 2] = tPos.z;

      const nPos = getNebulaPosition(i);
      nebula[i * 3] = nPos.x;
      nebula[i * 3 + 1] = nPos.y;
      nebula[i * 3 + 2] = nPos.z;

      // Gradient Blue Colors: Top (Light) -> Bottom (Dark)
      // Map Y (-7.5 to 7.5) to 0-1
      const normalizedHeight = (tPos.y + 7.5) / 15;
      
      // Lerp between Deep Blue and Light Cyan
      tempColor.lerpColors(colorBottom, colorTop, normalizedHeight);
      
      // Add subtle variation
      tempColor.offsetHSL(0, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1);

      cols[i * 3] = tempColor.r;
      cols[i * 3 + 1] = tempColor.g;
      cols[i * 3 + 2] = tempColor.b;
    }

    // 2. Generate Ribbon (Initial State)
    for (let i = 0; i < RIBBON_COUNT; i++) {
      const idx = PARTICLE_COUNT + i;
      const nPos = getNebulaPosition(idx);
      nebula[idx * 3] = nPos.x;
      nebula[idx * 3 + 1] = nPos.y;
      nebula[idx * 3 + 2] = nPos.z;

      // Ribbon Color: Shimmering Light Blue
      cols[idx * 3] = colorRibbon.r;
      cols[idx * 3 + 1] = colorRibbon.g;
      cols[idx * 3 + 2] = colorRibbon.b;
    }

    return { treePositions: tree, nebulaPositions: nebula, baseColors: cols };
  }, []);

  const progress = useRef({ value: 0 });

  useEffect(() => {
    if (phase === 'blooming') {
      gsap.to(progress.current, {
        value: 1,
        duration: 3,
        ease: "expo.out",
        onComplete: () => setPhase('nebula'),
      });
    } else if (phase === 'collapsing') {
      gsap.to(progress.current, {
        value: 0,
        duration: 2.5,
        ease: "power4.inOut",
        onComplete: () => setPhase('tree'),
      });
    }
  }, [phase, setPhase]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < TOTAL_PARTICLE_COUNT; i++) {
      let x, y, z, scale;

      // -- RIBBON PARTICLES --
      if (i >= PARTICLE_COUNT) {
          if (progress.current.value < 0.1) { 
             // In Tree Phase (or collapsing), calculate spiral flow
             const ribbonIdx = i - PARTICLE_COUNT;
             const baseT = ribbonIdx / RIBBON_COUNT;
             const flowSpeed = 0.1;
             const t = (baseT + time * flowSpeed) % 1; // Loop 0-1
             
             const height = 15; // TREE_HEIGHT
             const radiusBase = 6; // TREE_RADIUS
             
             const py = (height / 2) - (t * height);
             const radius = (radiusBase * t) + 1.0; // Slightly outside tree
             const angle = t * Math.PI * 12 + (time * 0.2); // Rotates slowly
             
             const px = Math.cos(angle) * radius;
             const pz = Math.sin(angle) * radius;

             const flutter = Math.sin(t * 50 + time * 5) * 0.1;

             x = px + flutter;
             y = py;
             z = pz + flutter;
             scale = 0.12 + Math.sin(time * 10 + i) * 0.05; 
             
          } else {
             // In Nebula Phase
             x = nebulaPositions[i*3];
             y = nebulaPositions[i*3 + 1];
             z = nebulaPositions[i*3 + 2];
             scale = 0.1;
          }
          
          // Transition Logic
          if (progress.current.value > 0) {
              const ribbonIdx = i - PARTICLE_COUNT;
              const baseT = ribbonIdx / RIBBON_COUNT;
              const flowSpeed = 0.1;
              const t = (baseT + time * flowSpeed) % 1;
              const height = 15;
              const radiusBase = 6;
              const py = (height / 2) - (t * height);
              const radius = (radiusBase * t) + 1.0;
              const angle = t * Math.PI * 12 + (time * 0.2);
              const px = Math.cos(angle) * radius;
              const pz = Math.sin(angle) * radius;

              x = THREE.MathUtils.lerp(px, nebulaPositions[i*3], progress.current.value);
              y = THREE.MathUtils.lerp(py, nebulaPositions[i*3+1], progress.current.value);
              z = THREE.MathUtils.lerp(pz, nebulaPositions[i*3+2], progress.current.value);
          }

      } else {
          // -- TREE BODY PARTICLES --
          x = THREE.MathUtils.lerp(treePositions[i * 3], nebulaPositions[i * 3], progress.current.value);
          y = THREE.MathUtils.lerp(treePositions[i * 3 + 1], nebulaPositions[i * 3 + 1], progress.current.value);
          z = THREE.MathUtils.lerp(treePositions[i * 3 + 2], nebulaPositions[i * 3 + 2], progress.current.value);
          
          // Gentle float in tree mode
          if (progress.current.value < 0.1) {
              y += Math.sin(time * 2 + i) * 0.05;
          }
          
          scale = 0.06 + Math.sin(time * 3 + i) * 0.03;
      }

      tempObject.position.set(x, y, z);
      tempObject.scale.set(scale, scale, scale);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);

      // Colors
      tempColor.setRGB(baseColors[i * 3], baseColors[i * 3 + 1], baseColors[i * 3 + 2]);
      
      if (i >= PARTICLE_COUNT) {
         // Boost brightness for ribbon shimmer
         const boost = 0.2 + Math.sin(time * 8 + i) * 0.2;
         tempColor.offsetHSL(0, 0, boost); 
      }

      meshRef.current.setColorAt(i, tempColor);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  // Decorations
  const decorations = useMemo(() => {
      const items = [];
      for(let i=0; i<30; i++) {
          const pos = getTreePosition(i);
          const dist = Math.sqrt(pos.x*pos.x + pos.z*pos.z);
          const factor = 1.1; 
          items.push({
              pos: [pos.x * factor, pos.y, pos.z * factor] as [number, number, number],
              color: ORNAMENT_COLORS[i % ORNAMENT_COLORS.length]
          })
      }
      return items;
  }, []);
  
  // Internal Glowing Spheres
  const internalSpheres = useMemo(() => {
    return new Array(INTERNAL_SPHERE_COUNT).fill(0).map((_, i) => ({
      pos: getTreePosition(i), // Random position inside cone volume
      scale: 0.35 + Math.random() * 0.15
    }));
  }, []);

  // 5-Pointed Star Shape
  const starShape = useMemo(() => {
    const shape = new THREE.Shape();
    const points = 5;
    const outerRadius = 1.2;
    const innerRadius = 0.5;

    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
  }, []);

  return (
    <group>
      {/* Particles Mesh - Transparent enabled for soft glass look */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, TOTAL_PARTICLE_COUNT]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial 
            transparent
            opacity={0.9}
            color="#ffffff" 
            emissive="#44aaff" 
            emissiveIntensity={0.6} 
            roughness={0.1} 
            toneMapped={false}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
        />
      </instancedMesh>

      {/* Standard Ornaments (Outer) */}
      {decorations.map((dec, i) => (
          <DecorationMesh key={`dec-${i}`} color={dec.color} position={dec.pos} phase={phase} />
      ))}
      
      {/* Internal Glowing Spheres */}
      {internalSpheres.map((sphere, i) => (
          <GlowingSphere 
            key={`internal-${i}`} 
            position={[sphere.pos.x, sphere.pos.y, sphere.pos.z]} 
            scale={sphere.scale} 
            phase={phase} 
          />
      ))}

      {/* Top Star (Pentagram) - Enhanced Icy Look */}
      <mesh position={[0, 8, 0]} scale={phase === 'tree' ? 1 : 0}>
          <extrudeGeometry args={[starShape, { depth: 0.4, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.1, bevelSegments: 3 }]} />
          <meshStandardMaterial 
            color="#FFFFFF" 
            emissive="#00FFFF"
            emissiveIntensity={2}
            toneMapped={false}
            roughness={0.1}
            metalness={1}
          />
          <Sparkles count={40} scale={5} size={6} speed={0.4} opacity={1} color="#E0FFFF" />
      </mesh>

      <PhotoGallery phase={phase} nebulaRotation={nebulaRotation} />
    </group>
  );
};