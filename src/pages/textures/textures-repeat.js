import React, { Suspense, useRef } from 'react';
import { Canvas, useLoader, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import MyCamera from '../../reusable/CustomCamera';
import Stats from '../../reusable/Stats';
import OrbitControls from '../../reusable/OrbitControls';

//Assets
import floorTex from '../../assets/textures/checkerboard.jpg';
import crateTex from '../../assets/textures/crate.png';
import lavaTex from '../../assets/textures/lava.jpg';
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

    const crateTexture = useLoader(THREE.TextureLoader, crateTex);
    const lavaTexture = useLoader(THREE.TextureLoader, lavaTex);

    let repeatedLavaTexture = lavaTexture.clone();
    repeatedLavaTexture.wrapS = repeatedLavaTexture.wrapT = THREE.RepeatWrapping;
    repeatedLavaTexture.repeat.set(2, 2);
    repeatedLavaTexture.needsUpdate = true;
    
    let repeated3LavaTexture = lavaTexture.clone();
    repeated3LavaTexture.wrapS = repeated3LavaTexture.wrapT = THREE.RepeatWrapping;
    repeated3LavaTexture.repeat.set(3, 3);
    repeated3LavaTexture.needsUpdate = true;
    
    let repeatedCrateTexture = crateTexture.clone();
    repeatedCrateTexture.wrapS = repeatedCrateTexture.wrapT = THREE.RepeatWrapping;
    repeatedCrateTexture.repeat.set(5, 5);
    repeatedCrateTexture.needsUpdate = true;

    return (
        <group ref={groupParent}>
            {/* Basic Lava Ball */}
            <mesh position={[-100, 50, 0]}>
                <sphereGeometry attach="geometry" args={[40, 32, 16]}></sphereGeometry>
                <meshBasicMaterial attach="material" map={lavaTexture}></meshBasicMaterial>
            </mesh>

            <mesh position={[0, 50, 0]}>
                <sphereGeometry attach="geometry" args={[40, 32, 16]}></sphereGeometry>
                <meshLambertMaterial attach="material" map={repeatedLavaTexture}></meshLambertMaterial>
            </mesh>

            <mesh position={[100, 50, 0]}>
                <sphereGeometry attach="geometry" args={[40, 32, 16]}></sphereGeometry>
                <meshLambertMaterial attach="material" map={repeated3LavaTexture} color={0xff8800} ambientLight={0x0000ff}></meshLambertMaterial>
            </mesh>

            <mesh position={[-60, 60, -100]}>
                <boxGeometry attach="geometry" args={[85, 85, 85]}></boxGeometry>
                <meshBasicMaterial map={crateTexture}></meshBasicMaterial>
            </mesh>

            <mesh position={[60, 50, -100]}>
                <boxGeometry attach="geometry" args={[85, 85, 85]}></boxGeometry>
                <meshBasicMaterial map={repeatedCrateTexture}></meshBasicMaterial>
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


function TexturesRepeatPage(props) {

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

export default TexturesRepeatPage;
