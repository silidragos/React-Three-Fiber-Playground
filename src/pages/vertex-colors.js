import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three/src/Three';
import { Canvas, useThree } from 'react-three-fiber';

import MyCamera from '../reusable/CustomCamera';
import Stats from '../reusable/Stats';
import OrbitControls from '../reusable/OrbitControls';

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

    return (
        <group>
            <mesh position={[-60, 55, 0]}>
                <sphereGeometry args={[50, 32, 16]}></sphereGeometry>
                <meshNormalMaterial></meshNormalMaterial>
            </mesh>

            <mesh position={[-60, 55, 0]} scale={[1.05, 1.05, 1.05]}>
                <sphereGeometry args={[50, 32, 16]}></sphereGeometry>
                <meshBasicMaterial color={0xff0000} side={THREE.BackSide}></meshBasicMaterial>
            </mesh>

            <mesh position={[60, 60, 0]}>
                <boxGeometry args={[80, 80, 80]}></boxGeometry>
                <meshNormalMaterial></meshNormalMaterial>
            </mesh>

            <mesh position={[60, 60, 0]} scale={[1.05, 1.05, 1.05]}>
                <boxGeometry args={[80, 80, 80]}></boxGeometry>
                <meshBasicMaterial color={0x00ff00} side={THREE.BackSide}></meshBasicMaterial>
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
