"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import XPiece from "../XPiece";
import OPiece from "../OPiece";

export default function XODrop() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[0, 10, 5]} intensity={1} castShadow />
        <XPiece position={[-1.5, 5, 0]} />
        <OPiece position={[1.5, 5, 0]} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
