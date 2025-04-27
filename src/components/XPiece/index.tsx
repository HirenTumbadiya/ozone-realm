import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function XPiece({ position = [0, 5, 0] }: { position?: [number, number, number] }) {
  const group = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (group.current.position.y > 0) {
      group.current.position.y -= delta * 2.5;
    } else {
      group.current.position.y = 0;
    }
  });

  return (
    <group ref={group} position={position}>
      {/* First bar */}
      <mesh rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[3, 0.3, 0.3]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Second bar */}
      <mesh rotation={[0, 0, -Math.PI / 4]} castShadow>
        <boxGeometry args={[3, 0.3, 0.3]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
}
