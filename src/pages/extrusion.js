import React, { Suspense, useEffect, useState, useRef } from 'react';
import { Canvas, useLoader, useResource, useThree } from 'react-three-fiber';
import * as THREE from 'three/src/Three';
import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils';

import MyCamera from '../reusable/CustomCamera';
import Stats from '../reusable/Stats';
import OrbitControls from '../reusable/OrbitControls';

import { DoubleSide, TextureLoader, RepeatWrapping, BackSide, FogExp2 } from "three";

import floorTex from '../assets/textures/checkerboard.jpg';

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

function Star() {

  let groupParent = useRef();

  let extrusionSettings = {
    size: 30, height: 4, curveSegments: 3,
    bevelThickness: 1, bevelSize: 2, bevelEnabled: false,
    material: 0, extrudeMaterial: 1
  };

  var starPoints = [];

  starPoints.push(new THREE.Vector2(0, 50));
  starPoints.push(new THREE.Vector2(10, 10));
  starPoints.push(new THREE.Vector2(40, 10));
  starPoints.push(new THREE.Vector2(20, -10));
  starPoints.push(new THREE.Vector2(30, -50));
  starPoints.push(new THREE.Vector2(0, -20));
  starPoints.push(new THREE.Vector2(-30, -50));
  starPoints.push(new THREE.Vector2(-20, -10));
  starPoints.push(new THREE.Vector2(-40, 10));
  starPoints.push(new THREE.Vector2(-10, 10));

  let starShape = new THREE.Shape(starPoints);
  
  const materialFront = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const materialSide = new THREE.MeshBasicMaterial({ color: 0xff8800 });

  let multiMaterial = [materialFront, materialSide];

  useEffect(() => {
    var starShapeGeometry = SceneUtils.createMultiMaterialObject(
      new THREE.ExtrudeGeometry(starShape, extrusionSettings),
      multiMaterial
    );
    starShapeGeometry.position.set(0, 50, 0);
    groupParent.current.add(starShapeGeometry);
  }, [groupParent, starShape, extrusionSettings])

  return (
    <group ref={groupParent}>
      <mesh position={[0, 50, 0]}>
        <extrudeGeometry attach="geometry" args={[starShape, extrusionSettings]}></extrudeGeometry>
        <meshBasicMaterial args={{ color: 0x000000, wireframe: true, transparent: true }}></meshBasicMaterial>
      </mesh>
    </group>
  )
}

function Geometry() {
  const floorTexture = useLoader(TextureLoader, floorTex);
  floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping;
  floorTexture.repeat.set(10, 10);
  return (
    <group>
      <Star></Star>

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


function ExtrusionPage(props) {

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

export default ExtrusionPage;
