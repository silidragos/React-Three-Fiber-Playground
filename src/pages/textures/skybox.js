import React, { Suspense, useEffect, useMemo } from 'react';
import { Canvas, useLoader, useThree } from 'react-three-fiber';
import * as THREE from 'three';

import MyCamera from '../../reusable/CustomCamera';
import Stats from '../../reusable/Stats';
import OrbitControls from '../../reusable/OrbitControls';

import { DoubleSide, TextureLoader, RepeatWrapping, BackSide, FogExp2, Texture } from "three";

import floorTex from '../../assets/textures/checkerboard.jpg';

import skyboxXPos from '../../assets/textures/dawnmountain-xpos.png';
import skyboxXNeg from '../../assets/textures/dawnmountain-xneg.png';
import skyboxYPos from '../../assets/textures/dawnmountain-ypos.png';
import skyboxYNeg from '../../assets/textures/dawnmountain-yneg.png';
import skyboxZPos from '../../assets/textures/dawnmountain-zpos.png';
import skyboxZNeg from '../../assets/textures/dawnmountain-zneg.png';

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

    let textures = [];
    textures.push(useLoader(TextureLoader, skyboxXPos));
    textures.push(useLoader(TextureLoader, skyboxXNeg));
    textures.push(useLoader(TextureLoader, skyboxYPos));
    textures.push(useLoader(TextureLoader, skyboxYNeg));
    textures.push(useLoader(TextureLoader, skyboxZPos));
    textures.push(useLoader(TextureLoader, skyboxZNeg));

    //When used MeshFaceMaterial as jsx it acted as a simple material
    //Puting the same image on all faces :-?
    let mat = useMemo(() => {
        let materialArray = [];
        for (let i = 0; i < textures.length; i++) {
            materialArray.push(new THREE.MeshBasicMaterial({
                map: textures[i],
                side: THREE.BackSide
            }));
        }
        return materialArray;
    }, [textures]);
    return (
        <group>

            <mesh material={mat}>
                <boxGeometry attach="geometry" args={[5000, 5000, 5000]}></boxGeometry>
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


function SkyboxPage(props) {

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

export default SkyboxPage;
