import React, { Suspense, useEffect, useRef, useMemo } from 'react';
import { Canvas, useLoader, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import MyCamera from '../../reusable/CustomCamera';
import Stats from '../../reusable/Stats';
import OrbitControls from '../../reusable/OrbitControls';
import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils';

//Assets
import floorTex from '../../assets/textures/checkerboard.jpg';
import moonTex from '../../assets/textures/moon.jpg';
import crateTex from '../../assets/textures/crate.png';

import dice1Tex from '../../assets/textures/Dice-Blue-1.png';
import dice2Tex from '../../assets/textures/Dice-Blue-2.png';
import dice3Tex from '../../assets/textures/Dice-Blue-3.png';
import dice4Tex from '../../assets/textures/Dice-Blue-4.png';
import dice5Tex from '../../assets/textures/Dice-Blue-5.png';
import dice6Tex from '../../assets/textures/Dice-Blue-6.png';

function CameraWrapper(props) {
    const { scene } = useThree();

    const OnCameraInit = (cam) => {
        cam.position.set(0, 150, 400);
        cam.lookAt(scene.position);

        scene.fog = new THREE.FogExp2(0x9999ff, 0.00025);
    };

    return (
        <MyCamera OnCameraInit={OnCameraInit} fov={45} near={0.01} far={20000}></MyCamera>
    );
}

function Geometry() {
    let groupParent = useRef();
    const floorTexture = useLoader(THREE.TextureLoader, floorTex);
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(10, 10);

    const moonTexture = useLoader(THREE.TextureLoader, moonTex);
    const crateTexture = useLoader(THREE.TextureLoader, crateTex);

    const dice1Texture = useLoader(THREE.TextureLoader, dice1Tex);
    const dice2Texture = useLoader(THREE.TextureLoader, dice2Tex);
    const dice3Texture = useLoader(THREE.TextureLoader, dice3Tex);
    const dice4Texture = useLoader(THREE.TextureLoader, dice4Tex);
    const dice5Texture = useLoader(THREE.TextureLoader, dice5Tex);
    const dice6Texture = useLoader(THREE.TextureLoader, dice6Tex);

    let diceFaceMaterial = useMemo(() => {
        const multiMaterial = [
            new THREE.MeshLambertMaterial({ map: dice1Texture }),
            new THREE.MeshLambertMaterial({ map: dice2Texture }),
            new THREE.MeshLambertMaterial({ map: dice3Texture }),
            new THREE.MeshLambertMaterial({ map: dice4Texture }),
            new THREE.MeshLambertMaterial({ map: dice5Texture }),
            new THREE.MeshLambertMaterial({ map: dice6Texture })
        ];

             return new THREE.MeshFaceMaterial(multiMaterial)

    }, [dice1Texture, dice2Texture, dice3Texture, dice4Texture, dice5Texture, dice6Texture]);

    return (
        <group ref={groupParent}>
            <mesh position={[-100, 50, 0]}>
                <sphereGeometry attach="geometry" args={[40, 32, 16]}></sphereGeometry>
                <meshBasicMaterial attach="material" map={moonTexture}></meshBasicMaterial>
            </mesh>

            <mesh position={[0, 50, 0]}>
                <sphereGeometry attach="geometry" args={[40, 32, 16]}></sphereGeometry>
                <meshLambertMaterial attach="material" map={moonTexture}></meshLambertMaterial>
            </mesh>

            <mesh position={[100, 50, 0]}>
                <sphereGeometry attach="geometry" args={[40, 32, 16]}></sphereGeometry>
                <meshLambertMaterial attach="material" map={moonTexture} color={0xff8800} ambientLight={0x0000ff}></meshLambertMaterial>
            </mesh>

            <mesh position={[-60, 60, -100]}>
                <boxGeometry attach="geometry" args={[85, 85, 85]}></boxGeometry>
                <meshBasicMaterial map={crateTexture}></meshBasicMaterial>
            </mesh>

            <mesh position={[60, 50, -100]} material={diceFaceMaterial}>
                <boxGeometry attach="geometry" args={[85, 85, 85]}></boxGeometry>
            </mesh>

            {/* Lightbulb */}
            <mesh position={[0, 150, 0]}>
                <sphereGeometry attach="geometry" args={[10, 16, 8]}></sphereGeometry>
                <meshBasicMaterial attach="material" color={0xffaa00}></meshBasicMaterial>
            </mesh>


            {/* Floor */}
            <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry attach="geometry" args={[1000, 1000, 1, 1]}></planeGeometry>
                <meshBasicMaterial attach="material" map={floorTexture} args={{ side: THREE.DoubleSide }}></meshBasicMaterial>
            </mesh>

            {/* Sky */}
            <mesh>
                <boxGeometry attach="geometry" args={[10000, 10000, 10000]}></boxGeometry>
                <meshBasicMaterial args={{ color: 0x9990ff, side: THREE.BackSide }}></meshBasicMaterial>
            </mesh>

            <axesHelper args={[100]}></axesHelper>
        </group>
    )
}

function Lights() {
    return (
        <group>
            <pointLight position={[0, 150, 0]} args={[0xffffff]}></pointLight>
            <ambientLight args={[0x444444]}></ambientLight>
        </group>
    );
}


function TexturesPage(props) {

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

export default TexturesPage;
