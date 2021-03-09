import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three/src/Three';
import { Canvas, useThree } from 'react-three-fiber';

import MyCamera from '../../reusable/CustomCamera';
import Stats from '../../reusable/Stats';
import OrbitControls from '../../reusable/OrbitControls';

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

function Geometry() {
    let lineRef = useRef();
    let lineRef2 = useRef();

    useEffect(() => {
        lineRef.current.computeLineDistances();
        lineRef2.current.computeLineDistances();
    }, [lineRef, lineRef2]);

    let [lineGeometry, lineMat, dashedLineGeometry, dashedLineMat] = useMemo(() => {
        //Simple Line
        let lineGeometry = new THREE.BufferGeometry();
        const points = [
            new THREE.Vector3(-150, -100, 0),
            new THREE.Vector3(-150, 100, 0)
        ];
        lineGeometry.setFromPoints(points);

        const lineMat = new THREE.LineBasicMaterial({ color: 0xcc0000 });

        //Dotted Line
        let dashedLineGeometry = new THREE.BufferGeometry();
        const dashedLinePoints = [
            new THREE.Vector3(-100, -100, 0),
            new THREE.Vector3(-100, 100, 0)
        ];
        dashedLineGeometry.setFromPoints(dashedLinePoints);

        const dashedLineMat = new THREE.LineDashedMaterial({ color: 0x00cc00, dashSize: 4, gapSize: 2, linewidth: 4 });

        return [lineGeometry, lineMat, dashedLineGeometry, dashedLineMat];
    });

    return (
        <group>
            <line ref={lineRef} geometry={lineGeometry} material={lineMat}></line>
            <line ref={lineRef2} geometry={dashedLineGeometry} material={dashedLineMat}></line>

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

function DashedLinesPage(props) {

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

export default DashedLinesPage;
