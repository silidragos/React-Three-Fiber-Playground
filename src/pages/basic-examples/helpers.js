import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from 'react-three-fiber';

import MyCamera from '../../reusable/CustomCamera';
import Stats from '../../reusable/Stats';
import OrbitControls from '../../reusable/OrbitControls';

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
    let [origin, terminus, direction] = useMemo(()=>{
        let origin = new THREE.Vector3(50, 100, 50);
        let terminus = new THREE.Vector3(75, 75, 75);
        let direction = new THREE.Vector3().subVectors(terminus, origin).normalize();
        return [origin, terminus, direction];
    })
    return (
        <group>
            <mesh position={[40, 40, 40]}>
                <sphereGeometry args={[30, 32, 16]}></sphereGeometry>
                <meshLambertMaterial color={0x000088}></meshLambertMaterial>
            </mesh>

            <axesHelper args={[50]} position={[40, 40, 40]}>
            </axesHelper>

            <gridHelper args={[200, 10, new THREE.Color(0x006600), new THREE.Color(0x006600)]} position={[100, 0, 100]}></gridHelper>
            <gridHelper args={[200, 10, new THREE.Color(0x000066), new THREE.Color(0x000066)]} position={[100, 100, 0]} rotation={[Math.PI/2, 0, 0]}></gridHelper>
            <gridHelper args={[200, 10, new THREE.Color(0x660000), new THREE.Color(0x660000)]} position={[0, 100, 100]} rotation={[0, 0, Math.PI/2]}></gridHelper>

            <arrowHelper args={[direction, origin, 50, 0x884400]}></arrowHelper>


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

function HelpersPage(props) {

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

export default HelpersPage;
