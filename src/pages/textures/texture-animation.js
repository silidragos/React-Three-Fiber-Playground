import React, { Suspense, useMemo } from 'react';
import { Canvas, useFrame, useLoader, useThree, useUpdate } from 'react-three-fiber';
import * as THREE from 'three';

import MyCamera from '../../reusable/CustomCamera';
import Stats from '../../reusable/Stats';
import OrbitControls from '../../reusable/OrbitControls';
import TextureAnimator from '../../reusable/TextureAnimator';

import { DoubleSide, TextureLoader, RepeatWrapping, BackSide, FogExp2 } from "three";

import floorTex from '../../assets/textures/checkerboard.jpg';
import explosionTex from '../../assets/textures/explosion.jpg';
import runTex from '../../assets/textures/run.png';

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

    const clock = useMemo(()=>{
        return new THREE.Clock();
    },[])
    const runTexture = useLoader(TextureLoader, runTex);
    const annie = useMemo(() => new TextureAnimator(runTexture, 10, 1, 10, 75), [runTexture]);

    const explosionTexture = useLoader(TextureLoader, explosionTex);
    const boomer = useMemo(()=> new TextureAnimator(explosionTexture, 4, 4, 16, 55));
    useFrame(() => {
        let delta = clock.getDelta();
        annie.update(1000 * delta);
        boomer.update(1000 * delta);
    });
    return (
        <group>
            <mesh position={[-100, 25, 0]}>
                <planeGeometry attach="geometry" args={[50, 50, 1, 1]}></planeGeometry>
                <meshBasicMaterial map={runTexture} side={THREE.DoubleSide}></meshBasicMaterial>
            </mesh>
            <mesh position={[0, 26, 0]}>
                <boxGeometry attach="geometry" args={[50, 50, 50]}></boxGeometry>
                <meshBasicMaterial map={explosionTexture} side={THREE.DoubleSide}></meshBasicMaterial>
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


function TextureAnimationPage(props) {

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

export default TextureAnimationPage;
