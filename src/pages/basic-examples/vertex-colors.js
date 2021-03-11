import React, { Suspense, useMemo, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useThree, useLoader } from 'react-three-fiber';

import MathUtils from '../../reusable/MathUtils';

import MyCamera from '../../reusable/CustomCamera';
import Stats from '../../reusable/Stats';
import OrbitControls from '../../reusable/OrbitControls';

import floorTex from '../../assets/textures/checkerboard.jpg';

import { BackSide, FogExp2 } from "three";

function CameraWrapper() {
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

//This replaces Face color, as I wasn't really able to find an actual replacement for it, so I used vertex color instead. 
//I guess Faces used this behind the scenes anyway
function NonIndexedFaceColors(props) {
    let [boxGeometry] = useMemo(() => {
        //If it is indexed, the vertices indexes are re-used between triangles.
        //We'll use it like this so we can give different colors to each triangle
        let boxGeometry = new THREE.BoxBufferGeometry(80, 80, 80, props.nrOfFaces, props.nrOfFaces, props.nrOfFaces).toNonIndexed();

        let colors = [];
        const totalTriangles = props.nrOfFaces * props.nrOfFaces * 2 * 6;
        for (let i = 0; i < totalTriangles; i++) {
            let r = Math.random() * 255;
            let g = Math.random() * 255;
            let b = Math.random() * 255;
            //For each vertex in triangle
            for (let j = 0; j < 3; j++) {
                colors.push(r);
                colors.push(g);
                colors.push(b);
            }
        }

        let colorsArr = new Uint8Array(colors);

        boxGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArr, 3, true));
        boxGeometry.attributes.color.needsUpdate = true;

        return [boxGeometry];
    }, [props.nrOfFaces]);

    return (
        <group>
            { boxGeometry !== undefined && <mesh geometry={boxGeometry} position={[-100, 50, 0]}>
                <meshBasicMaterial vertexColors={THREE.VertexColors}></meshBasicMaterial>
            </mesh>}
        </group>
    )
}

function NonIndexedVertexColors(props) {
    let { scene } = useThree();

    let [boxGeometry] = useMemo(() => {
        //If it is indexed, the vertices indexes are re-used between triangles.
        //We'll use it like this so we can give different colors to each triangle
        let boxGeometry = new THREE.BoxBufferGeometry(80, 80, 80, props.nrOfFaces, props.nrOfFaces, props.nrOfFaces).toNonIndexed();

        let colors = [];
        const totalTriangles = props.nrOfFaces * props.nrOfFaces * 2 * 6;
        for (let i = 0; i < totalTriangles * 3; i++) {
            let r = Math.random() * 255;
            let g = Math.random() * 255;
            let b = Math.random() * 255;
            colors.push(r);
            colors.push(g);
            colors.push(b);
        }

        let colorsArr = new Uint8Array(colors);

        boxGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArr, 3, true));
        boxGeometry.attributes.color.needsUpdate = true;

        return [boxGeometry];
    }, [props.nrOfFaces, scene]);

    return (
        <group>
            { boxGeometry !== undefined && <mesh geometry={boxGeometry} position={[0, 50, 0]}>
                <meshBasicMaterial vertexColors={THREE.VertexColors}></meshBasicMaterial>
            </mesh>}
        </group>
    )
}

function RGBColorCube() {
    let { scene } = useThree();

    let [boxGeometry] = useMemo(() => {
        let size = 80;
        let boxGeometry = new THREE.BoxBufferGeometry(size, size, size, 1, 1, 1);
        let colors = [];

        console.log("geo", boxGeometry);
        //24 since vertices are reused / indexed now
        for (let i = 0; i < 24*3; i+=3) {
            const x = boxGeometry.getAttribute("position").array[i];
            const y = boxGeometry.getAttribute("position").array[i+1];
            const z = boxGeometry.getAttribute("position").array[i+2];
            colors.push(MathUtils.Clamp(125 + x * 255.0 / size, 0, 255));
            colors.push(MathUtils.Clamp(125 + y * 255.0 / size, 0, 255));
            colors.push(MathUtils.Clamp(125 + z * 255.0 / size, 0, 255));
            console.log("x", x);
            console.log("xx", 125 + x * 255.0 / size);
        }

        let colorsArr = new Uint8Array(colors);

        boxGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArr, 3, true));
        boxGeometry.attributes.color.needsUpdate = true;

        return [boxGeometry];
    }, [scene]);

    return (
        <group>
            { boxGeometry !== undefined && <mesh geometry={boxGeometry} position={[100, 50, 0]}>
                <meshBasicMaterial vertexColors={THREE.VertexColors}></meshBasicMaterial>
            </mesh>}
        </group>
    )
}

function Geometry() {
    const floorTexture = useLoader(THREE.TextureLoader, floorTex);
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(10, 10);

    let [nrOfFaces] = useState(3);

    return (
        <group>
            <NonIndexedFaceColors nrOfFaces={nrOfFaces}></NonIndexedFaceColors>
            <NonIndexedVertexColors nrOfFaces={nrOfFaces}></NonIndexedVertexColors>
            <RGBColorCube></RGBColorCube>

            {/* Floor */}
            {/* <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry attach="geometry" args={[1000, 1000, 1, 1]}></planeGeometry>
                <meshBasicMaterial attach="material" map={floorTexture} args={{ side: THREE.DoubleSide }}></meshBasicMaterial>
            </mesh> */}

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

function VertexColorsPage(props) {

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

export default VertexColorsPage;
