import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useLoader, useThree } from 'react-three-fiber';
import * as THREE from 'three/src/Three';
import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils';

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

  var shapesParent = useRef();

  useEffect(() => {
    var darkMaterial = new THREE.MeshBasicMaterial({ color: 0xffffcc });
    var wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, transparent: true });
    var multiMaterial = [darkMaterial, wireframeMaterial];

    //ROW 1
    var boxShape = SceneUtils.createMultiMaterialObject(
      new THREE.BoxGeometry(50, 50, 50, 1, 1, 1),
      multiMaterial
    );
    boxShape.position.set(-200, 50, 100);
    shapesParent.current.add(boxShape);

    var icosahedronShape = SceneUtils.createMultiMaterialObject(
      new THREE.IcosahedronGeometry(40, 0),
      multiMaterial
    );
    icosahedronShape.position.set(-100, 50, 100);
    shapesParent.current.add(icosahedronShape);

    var octahedronShape = SceneUtils.createMultiMaterialObject(
      new THREE.OctahedronGeometry(40, 0),
      multiMaterial
    );
    octahedronShape.position.set(0, 50, 100);
    shapesParent.current.add(octahedronShape);

    var tetrahedronShape = SceneUtils.createMultiMaterialObject(
      new THREE.TetrahedronGeometry(40, 0),
      multiMaterial
    );
    tetrahedronShape.position.set(100, 50, 100);
    shapesParent.current.add(tetrahedronShape);

    var sphereShape = SceneUtils.createMultiMaterialObject(
      new THREE.SphereGeometry(40, 32, 16),
      multiMaterial
    );
    sphereShape.position.set(200, 50, 100);
    shapesParent.current.add(sphereShape);


    //ROW 2
    boxShape = SceneUtils.createMultiMaterialObject(
      new THREE.BoxGeometry(50, 50, 50, 2, 2, 2),
      multiMaterial
    );
    boxShape.position.set(-200, 50, 0);
    shapesParent.current.add(boxShape);

    icosahedronShape = SceneUtils.createMultiMaterialObject(
      new THREE.IcosahedronGeometry(40, 1),
      multiMaterial
    );
    icosahedronShape.position.set(-100, 50, 0);
    shapesParent.current.add(icosahedronShape);

    octahedronShape = SceneUtils.createMultiMaterialObject(
      new THREE.OctahedronGeometry(40, 1),
      multiMaterial
    );
    octahedronShape.position.set(0, 50, 0);
    shapesParent.current.add(octahedronShape);

    tetrahedronShape = SceneUtils.createMultiMaterialObject(
      new THREE.TetrahedronGeometry(40, 1),
      multiMaterial
    );
    tetrahedronShape.position.set(100, 50, 0);
    shapesParent.current.add(tetrahedronShape);

    sphereShape = SceneUtils.createMultiMaterialObject(
      new THREE.SphereGeometry(40, 32, 16, 0, 2*Math.PI, 0, Math.PI / 2),
      multiMaterial
    );
    sphereShape.position.set(200, 50, 0);
    shapesParent.current.add(sphereShape);


    //ROW 3
    var cylinderShape = SceneUtils.createMultiMaterialObject(
      new THREE.CylinderGeometry(30, 30, 80, 20, 4),
      multiMaterial
    );
    cylinderShape.position.set(-200, 50, -100);
    shapesParent.current.add(cylinderShape);

    var coneShape = SceneUtils.createMultiMaterialObject(
      new THREE.CylinderGeometry(0, 30, 80, 20, 4),
      multiMaterial
    );
    coneShape.position.set(-100, 50, -100);
    shapesParent.current.add(coneShape);

    var pyramidShape = SceneUtils.createMultiMaterialObject(
      new THREE.CylinderGeometry(0, 30, 100, 4, 4),
      multiMaterial
    );
    pyramidShape.position.set(0, 50, -100);
    shapesParent.current.add(pyramidShape);

    var torusShape = SceneUtils.createMultiMaterialObject(
      new THREE.TorusGeometry(25, 10, 8, 4),
      multiMaterial
    );
    torusShape.position.set(100, 50, -100);
    shapesParent.current.add(torusShape);

    var torusKnotShape = SceneUtils.createMultiMaterialObject(
      new THREE.TorusKnotGeometry(30, 8, 60, 10, 2, 3),
      multiMaterial
    );
    torusKnotShape.position.set(200, 50, -100);
    shapesParent.current.add(torusKnotShape);

    //ROW 4
    var prismShape = SceneUtils.createMultiMaterialObject(
      new THREE.CylinderGeometry(30, 30, 80, 6, 4),
      multiMaterial
    );
    prismShape.position.set(-200, 50, -200);
    shapesParent.current.add(prismShape);

    var truncatedConeShape = SceneUtils.createMultiMaterialObject(
      new THREE.CylinderGeometry(10, 30, 100, 20, 4),
      multiMaterial
    );
    truncatedConeShape.position.set(-100, 50, -200);
    shapesParent.current.add(truncatedConeShape);

    var truncatedPyramidShape = SceneUtils.createMultiMaterialObject(
      new THREE.CylinderGeometry(15, 30, 100, 6, 4),
      multiMaterial
    );
    truncatedPyramidShape.position.set(0, 50, -200);
    shapesParent.current.add(truncatedPyramidShape);

    torusShape = SceneUtils.createMultiMaterialObject(
      new THREE.TorusGeometry(30, 20, 16, 40),
      multiMaterial
    );
    torusShape.position.set(100, 50, -200);
    shapesParent.current.add(torusShape);

    torusKnotShape = SceneUtils.createMultiMaterialObject(
      new THREE.TorusKnotGeometry(30, 6, 160, 10, 3, 7),
      multiMaterial
    );
    torusKnotShape.position.set(200, 50, -200);
    shapesParent.current.add(torusKnotShape);
  })

  return (
    <group>

      <group ref={shapesParent}>

      </group>
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


function ShapesPage(props) {

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

export default ShapesPage;
