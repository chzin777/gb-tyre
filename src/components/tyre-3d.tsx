"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL = "/models/car-tyre.glb";

useGLTF.preload(MODEL);

/**
 * The tyre itself. The model arrives standing on the floor with its axle along
 * X, so it gets recentred, normalised to a diameter of one unit, then scaled by
 * the real overall diameter the visitor picked. Bigger tyre, bigger object.
 */
function Tyre({
  diameterMm,
  spin,
  dragRef,
}: {
  diameterMm: number;
  spin: boolean;
  dragRef: React.RefObject<number>;
}) {
  const { scene } = useGLTF(MODEL);
  const axle = useRef<THREE.Group>(null);

  const model = useMemo(() => {
    const clone = scene.clone(true);

    const rubber = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#2a303a"),
      roughness: 0.52,
      metalness: 0.25,
    });

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = rubber;
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });

    // Recentre on the origin and normalise so one unit equals the tyre diameter.
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const centre = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(centre);
    clone.position.set(-centre.x, -centre.y, -centre.z);

    const wrapper = new THREE.Group();
    wrapper.add(clone);
    wrapper.scale.setScalar(1 / Math.max(size.y, size.z));

    return wrapper;
  }, [scene]);

  useFrame((_, delta) => {
    if (!axle.current) return;
    if (spin) axle.current.rotation.x += delta * 0.32;
    axle.current.rotation.x += dragRef.current;
    dragRef.current *= 0.9;
  });

  // 205/55 R16 is 632mm across and sits at scale 1. Everything else follows.
  const scale = diameterMm / 632;

  return (
    <group rotation={[0.3, Math.PI / 2 - 0.55, 0.1]} scale={scale}>
      <group ref={axle}>
        <primitive object={model} />
      </group>
    </group>
  );
}

/**
 * Canvas wrapper. Kept clear of Motion components: React Three Fiber runs its
 * own render loop and the two libraries should not share a subtree.
 */
export default function Tyre3D({
  diameterMm,
  reduced,
}: {
  diameterMm: number;
  reduced: boolean;
}) {
  const dragRef = useRef(0);
  const pointerDownRef = useRef(false);
  const lastXRef = useRef(0);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = hostRef.current;
    if (!node) return;

    function onDown(event: PointerEvent) {
      pointerDownRef.current = true;
      lastXRef.current = event.clientX;
      node?.setPointerCapture(event.pointerId);
    }
    function onMove(event: PointerEvent) {
      if (!pointerDownRef.current) return;
      dragRef.current += (event.clientX - lastXRef.current) * 0.0016;
      lastXRef.current = event.clientX;
    }
    function onUp(event: PointerEvent) {
      pointerDownRef.current = false;
      if (node?.hasPointerCapture(event.pointerId)) {
        node.releasePointerCapture(event.pointerId);
      }
    }

    node.addEventListener("pointerdown", onDown);
    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerup", onUp);
    node.addEventListener("pointercancel", onUp);

    return () => {
      node.removeEventListener("pointerdown", onDown);
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerup", onUp);
      node.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
    >
      <Canvas
        camera={{ position: [0.2, 0.3, 2.05], fov: 40 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 5]} intensity={2.4} />
        <directionalLight position={[-5, 1, -2]} intensity={1.9} color="#f97316" />
        <pointLight position={[1.5, -2, 2.5]} intensity={9} color="#9fb2cc" />

        {/*
          Reflections come from light shapes built in the scene, not a downloaded
          HDRI, so nothing is fetched from a third party at runtime.
        */}
        <Environment resolution={256}>
          <Lightformer
            intensity={3.4}
            position={[0, 3, 2]}
            scale={[8, 3, 1]}
            color="#dfe7f2"
          />
          <Lightformer
            intensity={1.3}
            position={[-4, 0, 1]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[6, 4, 1]}
            color="#f97316"
          />
          <Lightformer
            intensity={1.4}
            position={[4, -1, 1]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={[6, 4, 1]}
            color="#7d8ea6"
          />
        </Environment>

        <Tyre diameterMm={diameterMm} spin={!reduced} dragRef={dragRef} />
      </Canvas>
    </div>
  );
}
