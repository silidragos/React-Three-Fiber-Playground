import React, { Suspense } from 'react';
import { Canvas, useLoader, useThree } from 'react-three-fiber';
import * as THREE from 'three';

import MyCamera from '../../reusable/CustomCamera';
import Stats from '../../reusable/Stats';
import OrbitControls from '../../reusable/OrbitControls';

import { DoubleSide, TextureLoader, RepeatWrapping, BackSide, FogExp2 } from "three";

import floorTex from '../../assets/textures/checkerboard.jpg';
import moonTex from '../../assets/textures/moon.jpg';
import ballTex from '../../assets/textures/redball.png';

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

    const moonTexture = useLoader(TextureLoader, moonTex);
    const ballTexture = useLoader(TextureLoader, ballTex);
    return (
        <group>
            {/* RGB */}
            <mesh position={[-100, 50, 50]}>
                <sphereGeometry attach="geometry" args={[40, 32, 16]} />
                <meshBasicMaterial attach="material" color={0xff0000} transparent={true} opacity={0.5}></meshBasicMaterial>
            </mesh>

            <mesh position={[-100, 50, -50]}>
                <sphereGeometry attach="geometry" args={[40, 32, 16]} />
                <meshBasicMaterial attach="material" color={0x00ff00} transparent={true} opacity={0.5}></meshBasicMaterial>
            </mesh>

            <mesh position={[-100, 50, -150]}>
                <sphereGeometry attach="geometry" args={[40, 32, 16]} />
                <meshBasicMaterial attach="material" color={0x0000ff} transparent={true} opacity={0.5}></meshBasicMaterial>
            </mesh>

            {/* Basic Material Translucence */}
            <mesh position={[0, 50, 0]}>
                <sphereGeometry attach="geometry" args={[40, 32, 16]} />
                <meshBasicMaterial attach="material" color={0x333333} transparent={true} opacity={0.95}></meshBasicMaterial>
            </mesh>

            {/* Phong Translucence */}
            <mesh position={[100, 50, 0]}>
                <sphereGeometry attach="geometry" args={[40, 32, 16]} />
                <meshPhongMaterial attach="material" color={0x333333} transparent={true} opacity={0.95}></meshPhongMaterial>
            </mesh>

            {/* Image Material Translucence */}
            <mesh position={[200, 50, 0]}>
                <sphereGeometry attach="geometry" args={[40, 32, 16]} />
                <meshLambertMaterial attach="material" map={moonTexture} transparent={true} opacity={0.75}></meshLambertMaterial>
            </mesh>

            {/* Translucence + Additive Blending */}
            <mesh position={[0, 50, -100]}>
                <sphereGeometry attach="geometry" args={[40, 32, 16]} />
                <meshBasicMaterial attach="material" color={0x0000ff} transparent={true} opacity={0.8} blending={THREE.AdditiveBlending}></meshBasicMaterial>
            </mesh>

            {/* Translucence + Blending + Phong */}
            <ambientLight args={[0x444444]}></ambientLight>
            <mesh position={[100, 50, -100]}>
                <sphereGeometry attach="geometry" args={[40, 32, 16]} />
                <meshBasicMaterial attach="material" color={0x0000ff} ambient={0xff0000} transparent={true} blending={THREE.AdditiveBlending}></meshBasicMaterial>
            </mesh>

            {/* Image with transparency on a plane */}
            <mesh position={[200, 50, -100]}>
                <planeGeometry attach="geometry" args={[100, 100, 1, 1]} />
                <meshBasicMaterial attach="material" map={ballTexture} transparent={true} side={THREE.DoubleSide}></meshBasicMaterial>
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


function TranslucencePage(props) {

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

export default TranslucencePage;
