import React, { Suspense } from 'react';
import { Canvas, useLoader, useThree } from 'react-three-fiber';
import * as THREE from 'three';

import MyCamera from '../../reusable/CustomCamera';
import Stats from '../../reusable/Stats';
import OrbitControls from '../../reusable/OrbitControls';

import { DoubleSide, TextureLoader, RepeatWrapping, BackSide, FogExp2 } from "three";

import floorTex from '../../assets/textures/checkerboard.jpg';
import redballTex from '../../assets/textures/redball.png';
import crateTex from '../../assets/textures/crate.png';

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

    //DEPRECATED
    //For Screen Space Sprites there is no support anymore
    //Alternatives can be using HTML/CSS or having a new, ortographic scene that is rendered right after our main scene, with world-space sprites
    const ballTexture = useLoader(TextureLoader, redballTex);

    const crateTexture = useLoader(TextureLoader, crateTex);

    return (
        <group>
            <sprite position={[-100, 50, 0]} scale={[64, 64, 1]}>
                <spriteMaterial attach="material" map={crateTexture} color={0xff0000}></spriteMaterial>
            </sprite>
            <sprite position={[-0, 50, 0]} scale={[64, 64, 1]}>
                <spriteMaterial attach="material" map={crateTexture} color={0x00ff00}></spriteMaterial>
            </sprite>
            <sprite position={[100, 50, 0]} scale={[64, 64, 1]}>
                <spriteMaterial attach="material" map={crateTexture} color={0x0000ff}></spriteMaterial>
            </sprite>

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


function SpritesPage(props) {

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

export default SpritesPage;
