import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, useResource, useThree } from 'react-three-fiber';
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
  const mySphere = useRef();
  const { camera } = useThree();

  const floorTexture = useLoader(TextureLoader, floorTex);
  floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping;
  floorTexture.repeat.set(10, 10);

  //Check also vertex-colors
  let sphereGeometry = useMemo(() => {
    let sphereGeometry = new THREE.SphereBufferGeometry(80, 32, 16).toNonIndexed();
    //Each vertex is X,Y,Z in array
    const nrOfNonIndexedVertices = sphereGeometry.getAttribute("position").array.length / 3;

    //For each three vertices -> a triangle
    let colors = [];
    for (let i = 0; i < nrOfNonIndexedVertices; i += 3) {
      let r = 0;
      let g = 0;
      let b = 0.8 * Math.random() + 0.2;
      for (let j = 0; j < 3; j++) {
        colors.push(r);
        colors.push(g);
        colors.push(b);
      }
    }

    console.log("Colors length", colors.length);
    sphereGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3, true));
    sphereGeometry.attributes.color.needsUpdate = true;
    return sphereGeometry;
  });

  let [raycaster, mouse] = useMemo(() => {
    return [new THREE.Raycaster(), new THREE.Vector2()]
  });

  document.addEventListener("click", (event) => {
    mouse = {};
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  }, false);

  useFrame(({ gl, scene }) => {
    if (mouse !== undefined) {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(mySphere.current);
      for (let i = 0; i < intersects.length; i++) {
        console.log("Intersects", intersects[i]);
        console.log("Intersects", sphereGeometry.attributes);
        mouse = undefined;

        const colorArray = sphereGeometry.getAttribute("color").array;
        //Each color is 3 floats from 0 to 1
        //Red in RGB: 1 0 0
        //We can also use faceIndex
        //v1
        colorArray[3*intersects[i].face.a] = 1;
        colorArray[3*intersects[i].face.a+1] = 0;
        colorArray[3*intersects[i].face.a+2] = 0;
        //v2
        colorArray[3*intersects[i].face.b] = 1;
        colorArray[3*intersects[i].face.b+1] = 0;
        colorArray[3*intersects[i].face.b+2] = 0;
        //v2
        colorArray[3*intersects[i].face.c] = 1;
        colorArray[3*intersects[i].face.c+1] = 0;
        colorArray[3*intersects[i].face.c+2] = 0;
        sphereGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colorArray, 3, true));
      }
    }
  });

  return (
    <group>
      <mesh ref={mySphere} position={[100, 50, -50]} geometry={sphereGeometry}>
        <meshBasicMaterial attach="material" vertexColors={THREE.VertexColors}></meshBasicMaterial>
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

function OnDocumentMouseDown() {
  console.log("Click!");
}

function MouseClickPage(props) {
  return (
    <div className="wrapper" onClick={() => OnDocumentMouseDown()}>
      <Canvas >
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

export default MouseClickPage;
