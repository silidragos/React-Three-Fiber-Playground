import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three/src/Three';
import { Canvas, useThree, useLoader } from 'react-three-fiber';

import MyCamera from '../reusable/CustomCamera';
import Stats from '../reusable/Stats';
import OrbitControls from '../reusable/OrbitControls';

import floorTex from '../assets/textures/checkerboard.jpg';

import { BackSide, FogExp2 } from "three";

function CameraWrapper() {
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
    const floorTexture = useLoader(THREE.TextureLoader, floorTex);
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(10, 10);

    let [nrOfFaces] = useState(2);

    let boxGeometryRef = useRef();

    let {scene} = useThree();

    useEffect(() => {
        let colors = [];
        //24 * 3
        //nr_of_faces * 4 * channels
        for(let i=0;i<(nrOfFaces + 1) * (nrOfFaces + 1) * 6 * 3;i++){
            colors.push(255 * Math.random());
        }

        let colorsArr = new Uint8Array(colors);

        boxGeometryRef.current.setAttribute('color', new THREE.BufferAttribute(colorsArr, 3, true));
        // boxGeometryRef.current.attributes.color.needsUpdate = true;
        console.log("geo", boxGeometryRef.current);


    }, [boxGeometryRef, scene])
    return (
        <group>
            <mesh position={[-100, 50, 0]}>
                <boxBufferGeometry ref={boxGeometryRef}  args={[80, 80, 80, nrOfFaces, nrOfFaces, nrOfFaces]}></boxBufferGeometry>
                <meshBasicMaterial vertexColors={THREE.VertexColors}></meshBasicMaterial>
            </mesh>

            {/* Floor */}
            {/* <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry attach="geometry" args={[1000, 1000, 1, 1]}></planeGeometry>
                <meshBasicMaterial attach="material" map={floorTexture} args={{ side: THREE.DoubleSide }}></meshBasicMaterial>
            </mesh> */}

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

function VertexColorsPage(props) {

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

export default VertexColorsPage;
