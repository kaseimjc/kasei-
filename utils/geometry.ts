import * as THREE from 'three';

export const PARTICLE_COUNT = 5000;
export const RIBBON_COUNT = 2000;
export const TOTAL_PARTICLE_COUNT = PARTICLE_COUNT + RIBBON_COUNT;
export const INTERNAL_SPHERE_COUNT = 40;

const TREE_HEIGHT = 15;
const TREE_RADIUS = 6;

// Helper to get random point in a cone volume
export const getTreePosition = (i: number): THREE.Vector3 => {
  const y = Math.random() * TREE_HEIGHT - (TREE_HEIGHT / 2); // -7.5 to 7.5
  const relativeY = (y + (TREE_HEIGHT / 2)) / TREE_HEIGHT; // 0 to 1 (bottom to top)
  
  // Radius gets smaller as we go up
  const radiusAtHeight = TREE_RADIUS * (1 - relativeY);
  
  const angle = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.random()) * radiusAtHeight; // Uniform distribution in circle
  
  const x = Math.cos(angle) * r;
  const z = Math.sin(angle) * r;
  
  return new THREE.Vector3(x, y, z);
};

// Helper to get spiral ribbon position (Static reference)
// NOTE: Dynamic position is calculated in useFrame, this is just for initial bounds or fallback
export const getRibbonPosition = (i: number): THREE.Vector3 => {
  const t = i / RIBBON_COUNT; // 0 to 1
  
  const height = TREE_HEIGHT;
  const y = (height / 2) - (t * height); 
  const radius = (TREE_RADIUS * t) + 1.0; 
  const angle = t * Math.PI * 12; 
  
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  return new THREE.Vector3(x, y, z);
};

// Helper to get random point in a Nebula ring/torus
export const getNebulaPosition = (i: number): THREE.Vector3 => {
  const angle = Math.random() * Math.PI * 2;
  const ringRadius = 15 + Math.random() * 5; // Wide ring
  const ringHeightSpread = 4;
  
  const x = Math.cos(angle) * ringRadius;
  const z = Math.sin(angle) * ringRadius;
  const y = (Math.random() - 0.5) * ringHeightSpread;
  
  return new THREE.Vector3(x, y, z);
};

export const ORNAMENT_COLORS = [
  // Gold removed
  '#C0C0C0', // Silver
  '#E0FFFF', // Light Cyan
  '#4682B4', // Steel Blue
  '#FFFFFF', // White
];

export const getRandomOrnamentColor = () => {
  return new THREE.Color(ORNAMENT_COLORS[Math.floor(Math.random() * ORNAMENT_COLORS.length)]);
};