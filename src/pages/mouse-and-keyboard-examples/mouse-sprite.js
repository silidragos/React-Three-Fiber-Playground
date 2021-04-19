import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas, useLoader, useThree } from 'react-three-fiber';
import * as THREE from 'three';

import MyCamera from '../../reusable/CustomCamera';
import Stats from '../../reusable/Stats';
import OrbitControls from '../../reusable/OrbitControls';

import { DoubleSide, TextureLoader, RepeatWrapping, BackSide, FogExp2 } from "three";

import floorTex from '../../assets/textures/checkerboard.jpg';
import redballTex from '../../assets/textures/redball.png';


//Not working
//It is possible to implement but most features used here are deprecated
//Preferable to use HTML/CSS elements
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


function Geometry(props) {

    const floorTexture = useLoader(TextureLoader, floorTex);
    floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping;
    floorTexture.repeat.set(10, 10);

    const redballTexture = useLoader(TextureLoader, redballTex);

    const { camera } = useThree();
    //https://stackoverflow.com/questions/36033879/three-js-object-follows-mouse-position
    let pos = useMemo(() => {
        let v = new THREE.Vector3(props.ballPos.x, props.ballPos.y, 0.5);
        v.unproject(camera);
        let dir = v.sub(camera.position).normalize();
        // let distance = - camera.position.z / dir.z;
        // let pos = camera.position.clone().add(dir.multiplyScalar(distance));
        dir = dir.multiplyScalar(150);
        let pos = camera.position.clone().add(dir);
        console.log("pos", dir);
        return dir;
    }, [props.ballPos, camera])
    return (
        <group>
            {pos &&
                <sprite position={[pos.x, pos.y, pos.z]} scale={[32, 32, 1]}>
                    <spriteMaterial attach="material" map={redballTexture}></spriteMaterial>
                </sprite>
            }

            <mesh position={[0, 26, 0]}>
                <boxGeometry attach="geometry" args={[50, 50, 50]}></boxGeometry>
                <meshBasicMaterial attach="material" color={0x000088}></meshBasicMaterial>
            </mesh>


            {/* Floor */}
            <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry attach="geometry" args={[1000, 1000, 1, 1]}></planeGeometry>
                <meshBasicMaterial attach="material" map={floorTexture} side={DoubleSide}></meshBasicMaterial>
            </mesh>

            {/* Sky */}
            <mesh>
                <boxGeometry attach="geometry" args={[10000, 10000, 10000]}></boxGeometry>
                <meshBasicMaterial attach="material" color={0x9990ff} side={BackSide}></meshBasicMaterial>
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

function MouseSpritePage(props) {
    let [ballSpritePos, setBallSpritePos] = useState({ x: 0, y: 0, z: 0 });

    let handleMouseMove = (ev, setter) => {
        setter({ x: ev.clientX, y: ev.clientY, z: 0 });
    }
    return (
        <div className="wrapper" onMouseMove={(ev) => handleMouseMove(ev, setBallSpritePos)}>
            <Canvas>
                <CameraWrapper />
                <OrbitControls />
                <Lights></Lights>
                <Suspense fallback={null}>
                    <Geometry ballPos={ballSpritePos}></Geometry>
                </Suspense>
                <Stats />
            </Canvas>
        </div>
    );
}

export default MouseSpritePage;
