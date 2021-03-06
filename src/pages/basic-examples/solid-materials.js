import React, { Suspense, useEffect } from 'react';
import { Canvas, useLoader, useThree } from 'react-three-fiber';

import MyCamera from '../../reusable/CustomCamera';
import Stats from '../../reusable/Stats';
import OrbitControls from '../../reusable/OrbitControls';

import { DoubleSide, TextureLoader, RepeatWrapping, BackSide, FogExp2 } from "three";

import floorTex from '../../assets/textures/checkerboard.jpg';

import FullScreen from '../../libs/THREEx.FullScreen';
import WindowResize from '../../libs/THREEx.windowresize';

function CameraWrapper(props) {
    const { scene } = useThree();

    const OnCameraInit = (cam) => {
        cam.position.set(0, 150, 400);
        cam.lookAt(scene.position);
    };

    return (
        <MyCamera OnCameraInit={OnCameraInit} fov={45} near={0.01} far={20000}></MyCamera>
    );
}

function BasicSettings(props) {
    const { scene, gl, camera } = useThree();

    useEffect(() => {
        FullScreen.bindKey({ charCode: 'm'.charCodeAt(0) });
        WindowResize(gl, camera);
        scene.fog = new FogExp2(0x9999ff, 0.00025);
    }, [gl, camera, scene]);

    return (
        <group />
    );
}

function Geometry() {
    const floorTexture = useLoader(TextureLoader, floorTex);
    floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping;
    floorTexture.repeat.set(10, 10);
    return (
        <group>
            <mesh position={[-150, 50, 0]}>
                <sphereGeometry attach="geometry" args={[50, 32, 16]} />
                <meshBasicMaterial attach="material" args={{ color: 0x000088 }}></meshBasicMaterial>
            </mesh>
            <mesh position={[0, 50, 0]}>
                <sphereGeometry attach="geometry" args={[50, 32, 16]} />
                <meshLambertMaterial attach="material" args={{ color: 0x000088 }}></meshLambertMaterial>
            </mesh>
            <mesh position={[150, 50, 0]}>
                <sphereGeometry attach="geometry" args={[50, 32, 16]} />
                <meshPhongMaterial attach="material" args={{ color: 0x000088 }}></meshPhongMaterial>
            </mesh>

            {/* Lightbulb */}
            <mesh position={[0, 150, 100]}>
                <sphereGeometry attach="geometry" args={[10, 16, 8]} />
                <meshBasicMaterial attach="material" args={{ color: 0xffaa00 }}></meshBasicMaterial>
            </mesh>

            {/* Floor */}
            <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry attach="geometry" args={[1000, 1000, 1, 1]}></planeGeometry>
                <meshBasicMaterial attach="material" map={floorTexture} args={{ side: DoubleSide }}></meshBasicMaterial>
            </mesh>

            {/* Sky */}
            <mesh >
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
            <pointLight position={[0, 150, 100]} args={[0xffffff]}></pointLight>
        </group>
    );
}

function SolidMaterialsPage(props) {
    return (
        <div className="wrapper">
            <Canvas>
                <BasicSettings />
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

export default SolidMaterialsPage;