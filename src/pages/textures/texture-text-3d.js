import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useLoader, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import MyCamera from '../../reusable/CustomCamera';
import Stats from '../../reusable/Stats';
import OrbitControls from '../../reusable/OrbitControls';

//Assets
import floorTex from '../../assets/textures/checkerboard.jpg';
import roboto from '../../assets/fonts/Roboto Black_Regular.json';

import lavaTex from '../../assets/textures/lava.jpg';
import chromeTex from '../../assets/textures/Chrome.png';

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
    const floorTexture = useLoader(THREE.TextureLoader, floorTex);
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(10, 10);

    const lavaTexture = useLoader(THREE.TextureLoader, lavaTex);
    const chromeTexture = useLoader(THREE.TextureLoader, chromeTex);
    lavaTexture.wrapS = lavaTexture.wrapT = THREE.RepeatWrapping;
    lavaTexture.repeat.set(0.05, 0.05);
    chromeTexture.wrapS = chromeTexture.wrapT = THREE.RepeatWrapping;
    chromeTexture.repeat.set(0.5, 0.5);

    let textGeom = useRef();
    let textWidth = 25;

    const font = new THREE.Font(roboto);
    let textSettings = useMemo(() => ({
        font,
        size: 30, height: 4, curveSegments: 3,
        style: "normal",
        bevelThickness: 2, bevelSize: 1, bevelEnabled: true,
        material: 0, extrudeMaterial: 1
    }), [font]);

    
    useEffect(()=>{
        if(textGeom.current === null){
            textWidth = 25;
            return;
        }
        textGeom.current.computeBoundingBox();
        console.log("bb", textGeom.current.boundingBox);
        textWidth = textGeom.current.boundingBox.max.x - textGeom.current.boundingBox.min.x;
    }, [textGeom]);

    let textMat = useMemo(()=>{
        let multiMat = [
            new THREE.MeshBasicMaterial({map:lavaTexture}),
            new THREE.MeshBasicMaterial({map:chromeTexture}),
        ];
        return new THREE.MeshFaceMaterial(multiMat);
    })

    return (
        <group>
            <mesh position={[-0.5 * textWidth, 50, 100]} rotation={[-Math.PI/4, 0, 0]} material={textMat}>
                <textGeometry attach="geometry" ref={textGeom} args={["Hello World!", textSettings]}></textGeometry>
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
            <pointLight position={[0, 250, 0]} args={[0xffffff]}></pointLight>
            <ambientLight args={[0x111111]}></ambientLight>
        </group>
    );
}


function TextureText3DPage(props) {

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

export default TextureText3DPage;
