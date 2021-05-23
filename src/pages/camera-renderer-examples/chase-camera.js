import React, { Suspense, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from 'react-three-fiber';
import * as THREE from 'three';

import * as useKeyState from 'use-key-state';

import MyCamera from '../../reusable/CustomCamera';
import Stats from '../../reusable/Stats';
import OrbitControls from '../../reusable/OrbitControls';

import { DoubleSide, TextureLoader, RepeatWrapping, BackSide, FogExp2 } from "three";

import floorTex from '../../assets/textures/checkerboard.jpg';
import faceXPos from '../../assets/textures/xpos.png';
import faceXNeg from '../../assets/textures/xneg.png';
import faceYPos from '../../assets/textures/ypos.png';
import faceYNeg from '../../assets/textures/yneg.png';
import faceZPos from '../../assets/textures/zpos.png';
import faceZNeg from '../../assets/textures/zneg.png';

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
    const { camera } = useThree();

    const query = useKeyState.default.useKeyState().keyStateQuery;
    const { z } = useKeyState.default.useKeyState({ z: 'z' });

    const floorTexture = useLoader(TextureLoader, floorTex);
    floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping;
    floorTexture.repeat.set(10, 10);

    const face1Texture = useLoader(THREE.TextureLoader, faceXPos);
    const face2Texture = useLoader(THREE.TextureLoader, faceXNeg);
    const face3Texture = useLoader(THREE.TextureLoader, faceYNeg);
    const face4Texture = useLoader(THREE.TextureLoader, faceYPos);
    const face5Texture = useLoader(THREE.TextureLoader, faceZNeg);
    const face6Texture = useLoader(THREE.TextureLoader, faceZPos);

    let boxFaceMaterial = useMemo(() => {
        const multiMaterial = [
            new THREE.MeshLambertMaterial({ map: face1Texture }),
            new THREE.MeshLambertMaterial({ map: face2Texture }),
            new THREE.MeshLambertMaterial({ map: face3Texture }),
            new THREE.MeshLambertMaterial({ map: face4Texture }),
            new THREE.MeshLambertMaterial({ map: face5Texture }),
            new THREE.MeshLambertMaterial({ map: face6Texture })
        ];

        return multiMaterial;

    }, [face1Texture, face2Texture, face3Texture, face4Texture, face5Texture, face6Texture]);

    let clock = useMemo(() => { return new THREE.Clock() });
    let mesh = useRef();

    useEffect(() => {
        mesh.current.position.set(0, 25.1, 0);
    }, [mesh]);

    useFrame(() => {
        const delta = clock.getDelta();
        let moveStep = 200 * delta;

        //Move
        let deltaPos = new THREE.Vector3(0, 0, 0);
        if (query.pressed('w')) {
            deltaPos.add(new THREE.Vector3(0, 0, -moveStep));
        }
        if (query.pressed('s')) {
            deltaPos.add(new THREE.Vector3(0, 0, moveStep));
        }
        if (query.pressed('q')) {
            deltaPos.add(new THREE.Vector3(-moveStep, 0, 0));
        }
        if (query.pressed('e')) {
            deltaPos.add(new THREE.Vector3(moveStep, 0, 0));
        }

        if (!(deltaPos.x === 0 && deltaPos.y === 0 && deltaPos.z === 0)) {
            mesh.current.translateZ(deltaPos.z);
            mesh.current.translateX(deltaPos.x);
        }

        //Rotate
        let rotateAngleY = 0;
        let rotateAngleX = 0;
        let angle = Math.PI / 2 * delta;
        if (query.pressed('a')) {
            rotateAngleY += angle;
        }
        if (query.pressed('d')) {
            rotateAngleY -= angle;
        }
        if (query.pressed('r')) {
            rotateAngleX += angle;
        }
        if (query.pressed('f')) {
            rotateAngleX -= angle;
        }

        if (rotateAngleY !== 0) {
            mesh.current.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngleY);
        }
        if (rotateAngleX !== 0) {
            mesh.current.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotateAngleX);
        }
        //Reset
        if (z.up) {
            mesh.current.position.set(0, 25.1, 0);
            mesh.current.rotation.set(0, 0, 0);
        }

        let relativeCameraOffset = new THREE.Vector3(0, 50, 200);
        let cameraOffset = relativeCameraOffset.applyMatrix4(mesh.current.matrixWorld);

        camera.position.set(cameraOffset.x, cameraOffset.y, cameraOffset.z);
        camera.lookAt(mesh.current.position);
    });

    return (
        <group>
            <mesh ref={mesh} material={boxFaceMaterial}>
                <boxGeometry attach="geometry" args={[50, 50, 50, 1, 1, 1]}></boxGeometry>
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


function ChaseCameraPage(props) {

    return (
        <div className="wrapper">
            <Canvas>
                <CameraWrapper />
                {/* <OrbitControls /> */}
                <Lights></Lights>
                <Suspense fallback={null}>
                    <Geometry></Geometry>
                </Suspense>
                <Stats />
            </Canvas>
        </div>
    );
}

export default ChaseCameraPage;
