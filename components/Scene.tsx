import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { ChristmasTree } from './ChristmasTree';

export const Scene: React.FC = () => {
  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ position: [0, 0, 25], fov: 45 }}
        gl={{ antialias: false, toneMappingExposure: 1.5 }}
      >
        <color attach="background" args={['#050510']} />
        
        {/* Environment & Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.0} color="#ffaa00" /> {/* Warm Key */}
        <pointLight position={[-10, 0, -10]} intensity={0.5} color="#4455ff" /> {/* Cool Fill */}
        <spotLight position={[0, 20, 0]} angle={0.5} penumbra={1} intensity={2} color="#ffffff" castShadow />

        <Environment preset="night" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Sparkles count={200} size={4} scale={[20, 20, 20]} opacity={0.4} speed={0.5} />

        <Suspense fallback={null}>
          <ChristmasTree />
        </Suspense>

        <OrbitControls 
            enablePan={false} 
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 1.8}
            minDistance={10}
            maxDistance={50}
        />

        <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.4} />
            <Vignette eskil={false} offset={0.1} darkness={0.6} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
