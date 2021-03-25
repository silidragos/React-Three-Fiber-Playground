import React, { Suspense, useEffect, useRef, useMemo } from 'react';
import { Canvas, useLoader, useThree } from 'react-three-fiber';
import * as THREE from 'three';

import MyCamera from '../../reusable/CustomCamera';
import Stats from '../../reusable/Stats';
import OrbitControls from '../../reusable/OrbitControls';

import { DoubleSide, TextureLoader, RepeatWrapping, BackSide, FogExp2 } from "three";

import floorTex from '../../assets/textures/checkerboard.jpg';
import diceTex from '../../assets/textures/Dice-Blue-1.png';

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

function Canvas2D() {
    let parentRef = useRef();

    //Text Canvas
    let [mat1, canvas1] = useMemo(() => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext('2d');
        ctx.font = "Bold 40px Arial";
        ctx.fillStyle = "rgba(255, 0, 0, 0.95)";
        ctx.fillText('Hello World!', 0, 50);

        let tex = new THREE.Texture(canvas);
        tex.needsUpdate = true;
        return [new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, transparent: true }), canvas];
    });

    //Image Canvas
    let [mat2, canvas2] = useMemo(() => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const tex = new THREE.Texture(canvas);
        tex.needsUpdate = true;

        var imageObj = new Image();
        imageObj.src = diceTex;
        imageObj.onload = () => {
            ctx.drawImage(imageObj, 0, 0);
            if (tex) {
                tex.needsUpdate = true;
            }
        };

        return [new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, transparent: true }), canvas];
    }, []);

    return (
        <group ref={parentRef}>
            <mesh material={mat1} position={[0, 50, 0]}>
                <planeGeometry attach="geometry" args={[canvas1.width, canvas1.height]}></planeGeometry>
            </mesh>

            <mesh material={mat2} position={[0, 50, -50]}>
                <planeGeometry attach="geometry" args={[canvas2.width, canvas2.height]}></planeGeometry>
            </mesh>
        </group>
    );
}

function Geometry() {
    const floorTexture = useLoader(TextureLoader, floorTex);
    floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping;
    floorTexture.repeat.set(10, 10);
    return (
        <group>
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


function TextureFromCanvasPage(props) {

    return (
        <div className="wrapper">
            <Canvas>
                <CameraWrapper />
                <OrbitControls />
                <Lights></Lights>
                <Canvas2D></Canvas2D>
                <Suspense fallback={null}>
                    <Geometry></Geometry>
                </Suspense>
                <Stats />
            </Canvas>
        </div>
    );
}

export default TextureFromCanvasPage;
