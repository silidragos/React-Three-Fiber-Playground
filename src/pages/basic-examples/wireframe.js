import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import {SceneUtils} from 'three/examples/jsm/utils/SceneUtils';
import { Canvas, useLoader, useThree } from 'react-three-fiber';

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
  const floorTexture = useLoader(TextureLoader, floorTex);
  floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping;
  floorTexture.repeat.set(10, 10);

  let {scene} = useThree();

  let group = useRef();

  const [wireframeMat, darkMat] = useMemo(() => {
    const wireframeMat = new THREE.MeshBasicMaterial({ color: 0x00ee00, wireframe: true, transparent: true });
    const darkMat = new THREE.MeshBasicMaterial({color:0x000088});
    return [wireframeMat, darkMat];
  }, []);

  useEffect(()=>{
    const multiMatSphere = SceneUtils.createMultiMaterialObject(
      new THREE.SphereGeometry( 50, 32, 16 ), [darkMat, wireframeMat]
    );

    multiMatSphere.position.set(150, 50, 0);

    scene.add(multiMatSphere);
  }, [scene, darkMat, wireframeMat]);


  return (
    <group ref={group}>
      <mesh position={[-150, 50, 0]} material={wireframeMat}>
        <sphereGeometry args={[50, 32, 16]}></sphereGeometry>
      </mesh>

      <mesh position={[0, 50, 0]} material={darkMat}>
        <sphereGeometry args={[50, 32, 16]}></sphereGeometry>
      </mesh>
      <mesh position={[0, 50, 0]} material={wireframeMat}>
        <sphereGeometry args={[50, 32, 16]}></sphereGeometry>
      </mesh>

      {/* Floor */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry attach="geometry" args={[1000, 1000, 1, 1]}></planeGeometry>
        <meshBasicMaterial attach="material" map={floorTexture} args={{ side: DoubleSide }}></meshBasicMaterial>
      </mesh>

      {/* Sky */}
      <mesh>
        <boxGeometry attach="geometry" args={[10000, 10000, 10000]}></boxGeometry>
        <meshBasicMaterial args={{ color: 0x9990ff, side: BackSide }}></meshBasicMaterial>
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


function WireframePage(props) {

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

export default WireframePage;
