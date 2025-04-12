'use client';
import { OrbitControls } from '@react-three/drei';
import { Model } from '../models/Robot';
import { Canvas } from '@react-three/fiber';

export default function RobotRender() {
  return (
    <Canvas>
      <ambientLight intensity={1} />
      <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
        <Model position={[3, -2, -0.5]} scale={2}/>
    </Canvas>
  );
}
