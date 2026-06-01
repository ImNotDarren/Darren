import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useIdentity } from "@/theme/IdentityContext";

const COUNT = 2600;

function Particles({ musician }: { musician: boolean }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, meshTarget, waveTarget } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const meshTarget = new Float32Array(COUNT * 3);
    const waveTarget = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      // sphere shell (researcher)
      const phi = Math.acos(2 * (i / COUNT) - 1);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 3.2;
      meshTarget[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      meshTarget[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      meshTarget[i * 3 + 2] = r * Math.cos(phi);
      // waveform grid plane (musician)
      const gx = (i % 64) / 64 - 0.5;
      const gz = Math.floor(i / 64) / Math.ceil(COUNT / 64) - 0.5;
      waveTarget[i * 3] = gx * 9;
      waveTarget[i * 3 + 1] = 0;
      waveTarget[i * 3 + 2] = gz * 9;
      positions.set(meshTarget.subarray(i * 3, i * 3 + 3), i * 3);
    }
    return { positions, meshTarget, waveTarget };
  }, []);

  const color = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    const pts = ref.current;
    if (!pts) return;
    const t = state.clock.elapsedTime;
    const attr = pts.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const k = musician ? 1 : 0;
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      const tx = THREE.MathUtils.lerp(meshTarget[ix], waveTarget[ix], k);
      let ty = THREE.MathUtils.lerp(meshTarget[ix + 1], waveTarget[ix + 1], k);
      const tz = THREE.MathUtils.lerp(meshTarget[ix + 2], waveTarget[ix + 2], k);
      if (musician) ty += Math.sin(tx * 1.2 + t * 2) * Math.cos(tz * 0.8 + t) * 0.9;
      arr[ix] += (tx - arr[ix]) * 0.05;
      arr[ix + 1] += (ty - arr[ix + 1]) * 0.05;
      arr[ix + 2] += (tz - arr[ix + 2]) * 0.05;
    }
    attr.needsUpdate = true;
    pts.rotation.y = t * 0.06;

    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue("--c-accent")
      .trim();
    if (accent) {
      color.set(accent);
      (pts.material as THREE.PointsMaterial).color.lerp(color, 0.08);
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} sizeAttenuation transparent opacity={0.9} />
    </points>
  );
}

export default function HeroCanvas() {
  const { identity } = useIdentity();
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 60 }} dpr={[1, 1.8]}>
      <Particles musician={identity === "musician"} />
    </Canvas>
  );
}
