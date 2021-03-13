import React, { Suspense, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, render, useFrame, useLoader, useThree } from 'react-three-fiber';
import * as THREE from 'three';

import DatGui, { DatNumber } from '@tim-soft/react-dat-gui';

import MyCamera from '../../reusable/CustomCamera';
import Stats from '../../reusable/Stats';
import OrbitControls from '../../reusable/OrbitControls';

import { DoubleSide, TextureLoader, RepeatWrapping, BackSide, FogExp2, Texture } from "three";

import { DatGuiContext } from '../../reusable/DatGuiContext';

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

function ReflectiveSphere(props) {
    let cubeMap = useRef();
    let mirrorSphere = useRef();
    const [renderTarget] = useState(new THREE.WebGLCubeRenderTarget(512, { format: THREE.RGBFormat, generateMipmaps: true, encoding: THREE.sRGBEncoding }));
    useEffect(() => {
        cubeMap.current.renderTarget.texture.mapping = THREE.CubeRefractionMapping;
    }, [cubeMap]);
    useFrame(({ gl, scene }) => {
        mirrorSphere.current.visible = false;
        cubeMap.current.update(gl, scene);
        mirrorSphere.current.visible = true;
    });

    return (
        <group>
            <mesh ref={mirrorSphere} position={[0, 50, 0]}>
                <sphereGeometry args={[80, 64, 32]}></sphereGeometry>
                <meshBasicMaterial color={[0xccccff]} envMap={renderTarget.texture} refractionRatio={props.data.refractionRatio} reflectivity={props.data.reflectivity}></meshBasicMaterial>
            </mesh>

            <cubeCamera position={[0, 50, 0]} ref={cubeMap} args={[0.1, 5000, renderTarget]}></cubeCamera>
        </group>
    )
}
function Geometry(props) {
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

    // // When used MeshFaceMaterial as jsx it acted as a simple material
    // // Puting the same image on all faces :-?
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
            <ReflectiveSphere data={props.data}></ReflectiveSphere>
            {/* Skybox */}
            <mesh material={mat}>
                <boxGeometry attach="geometry" args={[5000, 5000, 5000]}></boxGeometry>
            </mesh>

            {/* Floor */}
            <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry attach="geometry" args={[1000, 1000, 1, 1]}></planeGeometry>
                <meshBasicMaterial attach="material" map={floorTexture}></meshBasicMaterial>
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


function GuiControls(props) {
    const [contextData, setContextData] = useContext(DatGuiContext);
    return (
        <div style={{ position: "absolute", top: 0, right: 0 }}>
            <DatGui data={contextData} onUpdate={setContextData}>
                <DatNumber path="refractionRatio" min={0} max={1} step={0.01}></DatNumber>
                <DatNumber path="reflectivity" min={0.6} max={1} step={0.01}></DatNumber>
            </DatGui>
        </div>
    );
}

function RefractionPage(props) {
    const [data, setData] = useState({ refractionRatio: 0.99, reflectivity: 0.9 });
    return (
        <div className="wrapper">
            <DatGuiContext.Provider value={[data, setData]}>
                <Canvas>
                    <CameraWrapper />
                    <OrbitControls />
                    <Lights></Lights>
                    <Suspense fallback={null}>
                        <Geometry data={data}></Geometry>
                    </Suspense>
                    <Stats />
                </Canvas>
                <GuiControls></GuiControls>
            </DatGuiContext.Provider>
        </div>
    );
}

export default RefractionPage;
