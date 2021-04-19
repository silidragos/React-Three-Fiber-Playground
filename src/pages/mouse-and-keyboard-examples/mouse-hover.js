import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useLoader, useThree, useFrame } from 'react-three-fiber';
import * as THREE from 'three';

import MyCamera from '../../reusable/CustomCamera';
import Stats from '../../reusable/Stats';
import OrbitControls from '../../reusable/OrbitControls';

import { DoubleSide, TextureLoader, RepeatWrapping, BackSide, FogExp2 } from "three";

import floorTex from '../../assets/textures/checkerboard.jpg';

function CameraWrapper(props) {
  const { scene } = useThree();

  const OnCameraInit = (cam) => {
    cam.position.set(0, 150, 400);
    cam.lookAt(scene.position);

    scene.fog = new FogExp2(0x9999ff, 0.00025);
  };

  return (
    <MyCamera OnCameraInit={OnCameraInit} fov={45} near={0.01} far={20000}></MyCamera>
  );
}

function Geometry() {
  const { camera } = useThree();
  const parentGroup = useRef();

  const floorTexture = useLoader(TextureLoader, floorTex);
  floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping;
  floorTexture.repeat.set(10, 10);

  let [raycaster, mouse] = useMemo(() => {
    return [new THREE.Raycaster(), new THREE.Vector2()]
  });

  document.addEventListener("mousemove", (event) => {
    mouse = {};
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  }, false);

  let INTERSECTED = null;
  useFrame(({ gl, scene }) => {
    if (mouse !== undefined && parentGroup.current !== null) {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(parentGroup.current.children);
      if (intersects.length > 0) {
        if (intersects[0].object !== INTERSECTED) {
          if (INTERSECTED) {
            INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
          }
          INTERSECTED = intersects[0].object;
          INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
          INTERSECTED.material.color.setHex(0xffff00);
        }
      } else {
        if(INTERSECTED){
          INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
        }
        INTERSECTED = null;
      }
    }
  });

  return (
    <group ref={parentGroup}>
      <mesh position={[0, 26, 0]}>
        <boxGeometry attach="geometry" args={[50, 50, 50]} />
        <meshBasicMaterial attach="material" args={{ color: 0x000088 }}></meshBasicMaterial>
      </mesh>

      {/* Floor */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry attach="geometry" args={[1000, 1000, 1, 1]}></planeGeometry>
        <meshBasicMaterial attach="material" map={floorTexture} side={DoubleSide}></meshBasicMaterial>
      </mesh>

      {/* Sky */}
      <mesh>
        <boxGeometry attach="geometry" args={[10000, 10000, 10000]}></boxGeometry>
        <meshBasicMaterial color={0x9990ff} side={BackSide}></meshBasicMaterial>
      </mesh>

      <axesHelper args={[100]}></axesHelper>
    </group>
  )
}

function Lights() {
  return (
    <group>
      <pointLight position={[0, 250, 0]} args={[0xffffff]}></pointLight>
      <ambientLight args={[0x111111]}></ambientLight>
    </group>
  );
}


function MouseHoverPage(props) {

  return (
    <div className="wrapper">
      <Canvas>
        <CameraWrapper />
        <OrbitControls />
        <Lights></Lights>
        <Suspense fallback={null}>
          <Geometry></Geometry>
        </Suspense>
        <Stats />
      </Canvas>
    </div>
  );
}

export default MouseHoverPage;
