import React, { Suspense, useEffect, useMemo, useState, useRef } from 'react';
import { Canvas, useFrame, useLoader, useResource, useThree } from 'react-three-fiber';
import * as useKeyState from 'use-key-state';
import * as THREE from 'three';

import MyCamera from '../../reusable/CustomCamera';
import Stats from '../../reusable/Stats';
import OrbitControls from '../../reusable/OrbitControls';

import { DoubleSide, TextureLoader, RepeatWrapping, BackSide, FogExp2 } from "three";

import floorTex from '../../assets/textures/checkerboard.jpg';

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
    const query = useKeyState.default.useKeyState().keyStateQuery;
    const {r} = useKeyState.default.useKeyState({r: 'r'});

    let mesh = useRef();
    let clock = useMemo(() => { return new THREE.Clock() });

    useEffect(()=>{
        mesh.current.position.set(0, 40, 0);
    },[mesh]);
    useFrame(() => {
        let moveStep = 50 * clock.getDelta();
        let totalMoveX = 0;
        if(query.pressed('left')){
            totalMoveX -= 50;
        }
        if(query.pressed('right')){
            totalMoveX += 50;
        }
        if (query.pressed('a')) {
            totalMoveX -= moveStep;
        }
        if (query.pressed('d')) {
            totalMoveX += moveStep;
        }

        if(r.down){
            mesh.current.material.color = new THREE.Color(0xff0000);
        }

        if(r.up){
            mesh.current.material.color = new THREE.Color(0x0000ff);
        }

        if(totalMoveX !== 0){
            mesh.current.position.set(mesh.current.position.x + totalMoveX, 40, 0);
        }
    })

    const floorTexture = useLoader(TextureLoader, floorTex);
    floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping;
    floorTexture.repeat.set(10, 10);
    return (
        <group>
                <mesh ref={mesh}>
                    <sphereGeometry attach="geometry" args={[30, 32, 16]} />
                    <meshLambertMaterial attach="material" color={0x0000ff}></meshLambertMaterial>
                </mesh>

            {/* Floor */}
            <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry attach="geometry" args={[1000, 1000, 1, 1]}></planeGeometry>
                <meshBasicMaterial attach="material" map={floorTexture} side={DoubleSide}></meshBasicMaterial>
            </mesh>

            {/* Sky */}
            <mesh>
                <boxGeometry attach="geometry" args={[10000, 10000, 10000]}></boxGeometry>
                <meshBasicMaterial color={0x9990ff} side={BackSide}></meshBasicMaterial>
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


function KeyboardEventsPage(props) {

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

export default KeyboardEventsPage;
