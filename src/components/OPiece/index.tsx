import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function OPiece({ position = [0, 5, 0] }: { position?: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (mesh.current.position.y > 0) {
      mesh.current.position.y -= delta * 2;
    } else {
      mesh.current.position.y = 0;
    }
  });

  return (
    <mesh ref={mesh} position={position} castShadow>
      <torusGeometry args={[1, 0.3, 16, 100]} />
      <meshStandardMaterial color="indigo" />
    </mesh>
  );
}
