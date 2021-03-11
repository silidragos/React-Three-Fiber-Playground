import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useLoader, useThree } from 'react-three-fiber';
import * as THREE from 'three';

import MyCamera from '../../reusable/CustomCamera';
import Stats from '../../reusable/Stats';
import OrbitControls from '../../reusable/OrbitControls';

import floorTex from '../../assets/textures/checkerboard.jpg';

function CameraWrapper(props) {
    const { scene, gl } = useThree();

    const OnCameraInit = (cam) => {
        console.log("gl", gl.shadowMap);
        // gl.shadowMap.type = THREE.PCFSoftShadowMap;
        // gl.shadowMap.needsUpdate = true;
        cam.position.set(0, 150, 400);
        cam.lookAt(scene.position);

        scene.fog = new THREE.FogExp2(0x9999ff, 0.00025);
    };

    return (
        <MyCamera OnCameraInit={OnCameraInit} fov={45} near={0.01} far={20000}></MyCamera>
    );
}

function Geometry() {
    let parent = useRef();
    let spotLight1 = useRef();
    let spotLight2 = useRef();
    let spotLight3 = useRef();
    useEffect(() => {
        spotLight1.current.shadow.radius = 64;
        spotLight1.current.shadow.mapSize.width = 2048;
        spotLight1.current.shadow.mapSize.height = 2048;
        spotLight1.current.shadow.camera.left = -10;
        spotLight1.current.shadow.camera.right = 10;
        spotLight1.current.shadow.camera.top = 10;
        spotLight1.current.shadow.camera.bottom = -10;
        let helper = new THREE.CameraHelper(spotLight1.current.shadow.camera);
        parent.current.add(helper);
    }, [parent, spotLight1]);
    
    useEffect(() => {
        let helper = new THREE.CameraHelper(spotLight2.current.shadow.camera);
        parent.current.add(helper);
    }, [parent, spotLight2]);
    
    useEffect(() => {
        let helper = new THREE.CameraHelper(spotLight3.current.shadow.camera);
        parent.current.add(helper);

        const target = new THREE.Object3D();
        target.position.set(150, 10, -100);
        parent.current.add(target);
        spotLight3.current.target = target;
    }, [parent, spotLight3]);

    const floorTexture = useLoader(THREE.TextureLoader, floorTex);
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(10, 10);
    floorTexture.encoding = THREE.sRGBEncoding;
    return (
        <group ref={parent}>
            <spotLight penumbra={1} ref={spotLight1} args={[0xffff00]} position={[-60, 150, -30]} intensity={1} castShadow angle={0.5}>
            </spotLight>
            
            <spotLight penumbra={1} ref={spotLight2} args={[0xff0000]} position={[60, 150, -60]} intensity={1} castShadow angle={0.5}>
            </spotLight>
            
            <spotLight penumbra={1} ref={spotLight3} args={[0x0000ff]} position={[150, 80, -100]} intensity={1} castShadow angle={0.5}>
            </spotLight>

            <mesh position={[0, 50, 0]} receiveShadow castShadow>
                <boxGeometry attach="geometry" args={[50, 50, 50]}></boxGeometry>
                <meshLambertMaterial attach="material" color={0x888888}></meshLambertMaterial>
            </mesh>
            
            {/* Floor */}
            {/* 
            * Seems to have problems with Lambert, especially on dimensions > (300,300)
             */}
            <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
                <planeGeometry attach="geometry" args={[500, 500, 1, 1]}></planeGeometry>
                <meshPhongMaterial specular={0x000000} attach="material" map={floorTexture}></meshPhongMaterial>
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
            {/* <pointLight position={[0, 150, 0]} args={[0xff0000]}></pointLight> */}
            {/* <ambientLight args={[0x111111, 0.4]}></ambientLight> */}
        </group>
    );
}


function ShadowPage(props) {
    return (
        <div className="wrapper">
            <Canvas shadowMap>
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

export default ShadowPage;
