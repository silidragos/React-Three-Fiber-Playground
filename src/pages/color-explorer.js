import React, { Suspense, useContext, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three/src/Three'
import { Canvas, useFrame, useLoader, useThree } from 'react-three-fiber';
import DatGui, { DatBoolean, DatColor, DatNumber, DatString } from '@tim-soft/react-dat-gui';

import MyCamera from '../reusable/CustomCamera';
import Stats from '../reusable/Stats';
import OrbitControls from '../reusable/OrbitControls';
import { DatGuiContext } from '../reusable/DatGuiContext';

import floorTex from '../assets/textures/checkerboard.jpg';

import FullScreen from '../libs/THREEx.FullScreen';
import WindowResize from '../libs/THREEx.windowresize';

function CameraWrapper(props) {
    const { scene } = useThree();

    const OnCameraInit = (cam) => {
        cam.position.set(0, 150, 400);
        cam.lookAt(scene.position);
    };

    return (
        <MyCamera OnCameraInit={OnCameraInit} fov={45} near={0.01} far={20000}></MyCamera>
    );
}

function BasicSettings(props) {
    const { scene, gl, camera } = useThree();

    useEffect(() => {
        FullScreen.bindKey({ charCode: 'm'.charCodeAt(0) });
        WindowResize(gl, camera);
        scene.fog = new THREE.FogExp2(0x9999ff, 0.00025);
    }, [gl, camera, scene]);

    return (
        <group />
    );
}

function Geometry(props) {
    const floorTexture = useLoader(THREE.TextureLoader, floorTex);
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(10, 10);

    //BUG: For some reason the whole app crashes when using Materials with args[] + Dat.Gui updates?? That's why the workaround
    const [lightbulbMat, floorMat, skyMat] = useMemo(() => {
        const lightbulbMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });

        const floorTex = floorTexture.clone(true);
        floorTex.needsUpdate = true;
        const floorMat = new THREE.MeshBasicMaterial({ map: floorTex, side: THREE.DoubleSide });

        const skyMat = new THREE.MeshBasicMaterial({ color: 0x9990ff, side: THREE.BackSide });
        return [lightbulbMat, floorMat, skyMat];
    }, [floorTexture]);

    return (
        <group>
            <ControlledSphere data={props.data} />
            {/* Lightbulb */}
            <mesh position={[0, 150, 100]} material={lightbulbMat}>
                <boxBufferGeometry attach="geometry" args={[10, 10, 10]} />
            </mesh>

            {/* Floor */}
            <mesh position={[0, -100, 0]} rotation={[-Math.PI / 2, 0, 0]} material={floorMat}>
                <planeGeometry attach="geometry" args={[1000, 1000, 1, 1]}></planeGeometry>
            </mesh>

            {/* Sky */}
            <mesh material={skyMat}>
                <boxGeometry attach="geometry" args={[10000, 10000, 10000]}></boxGeometry>
            </mesh>

            <axesHelper args={[10]}></axesHelper>
        </group>
    )
}

function Lights() {
    return (
        <group>
            <pointLight position={[-100, 150, 100]} args={[0xffffff]}></pointLight>
            <ambientLight position={[-100, 150, 100]} args={[0x333333]}></ambientLight>
        </group>
    );
}

function GuiControls() {
    const [contextData, setContextData] = useContext(DatGuiContext);

    return (
        <div style={{ position: "absolute", top: 0, right: 0 }}>
            <DatGui data={contextData} onUpdate={setContextData}>
                <DatNumber path='x' label='Pos X' min={-200} max={200} step={1} />
                <DatNumber path='y' label='Pos Y' min={-200} max={200} step={1} />
                <DatNumber path='z' label='Pos Z' min={-200} max={200} step={1} />
                <DatNumber path='opacity' label='Opacity' min={0} max={1} step={0.01} />

                <DatColor path='color' label='Color (Diffuse)' />
                <DatColor path='colorA' label='Color (Ambient)' />
                <DatColor path='colorE' label='Color (Emissive)' />
                <DatColor path='colorS' label='Color (Specular)' />
            </DatGui>
        </div>
    )
}

function ControlledSphere(props) {
    function StringToColor(color){
        return new THREE.Color(color);
    }

    const [sphereMat] = useMemo(() => {
        const sphereMat = new THREE.MeshBasicMaterial({ color: StringToColor(props.data.color), transparent: true, opacity: props.data.opacity });
        return [sphereMat];
    });

    return (<group>
        <mesh position={[props.data.x, props.data.y, props.data.z]} material={sphereMat}>
            <boxGeometry attach="geometry" args={[100, 100, 100]}></boxGeometry>
            {/* <meshBasicMaterial attach="material" color={0xffff00}></meshBasicMaterial> */}
        </mesh>
    </group>);
}

function ColorExplorerPage() {
    const [data, setData] = useState({ x: 0, y: 0, z: 0, opacity: 1, color: "#ff0000", colorA: "#000000", colorE:"#000033", colorS:"#ffff00" });
    return (
        <div className="wrapper">
            <DatGuiContext.Provider value={[data, setData]}>
                {/* Canvas doesn't support Context Providers because of 'Reconcilers' */}
                <Canvas>
                    <BasicSettings />
                    <CameraWrapper />
                    <OrbitControls />
                    <Stats />

                    <Lights></Lights>
                    <Suspense fallback={null}>
                        <Geometry data={data}></Geometry>
                    </Suspense>
                </Canvas>
                <GuiControls />
            </DatGuiContext.Provider>
        </div>
    );
}

export default ColorExplorerPage;