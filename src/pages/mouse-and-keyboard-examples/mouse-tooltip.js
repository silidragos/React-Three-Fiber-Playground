import React, { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useLoader, useThree, useFrame } from 'react-three-fiber';
import * as THREE from 'three';

import MyCamera from '../../reusable/CustomCamera';
import Stats from '../../reusable/Stats';
import OrbitControls from '../../reusable/OrbitControls';

import { DoubleSide, TextureLoader, RepeatWrapping, BackSide, FogExp2, SpriteMaterial, Vector3, Raycaster } from "three";

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

function ToolTip(props) {
    const { camera } = useThree();
    const [spritePos, setSpritePos] = useState([50, 50, 0]);
    const [intersected, setIntersected] = useState(null);

    let [canvasTex] = useMemo(() => {
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        context.font = "Bold 20px Arial";
        context.fillStyle = "rgba(0,0,0,0.95)";
        context.fillText('Hello World!', 0, 20);

        let texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return [texture];
    });

    let [raycaster, mouse] = useMemo(() => {
        return [new THREE.Raycaster(), {x:0,y:0}]
    }, []);

    useEffect(()=>{
        document.addEventListener("mousemove", (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        }, false);
    });

    useFrame(({ gl, scene }) => {
        if (mouse !== undefined && props.raycastableParent !== null) {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(props.raycastableParent.children);
            if (intersects.length > 0) {
                if (intersects[0].object !== intersected) {
                    if (intersected) {
                        intersected.material.color.setHex(intersected.currentHex);
                    }
                    intersects[0].object.currentHex = intersects[0].object.material.color.getHex();
                    intersects[0].object.material.color.setHex(0xffff00);
                    setIntersected(intersects[0].object);
                }
                setSpritePos([intersects[0].point.x, intersects[0].point.y, intersects[0].point.z]);
            } else {
                if (intersected) {
                    intersected.material.color.setHex(intersected.currentHex);
                }
                console.log("else");
                setIntersected(null);
            }
        }
    });

    return (
        <group>
            {/* Screen Coordinates is deprecated. Maybe use HTML instead? */}
            {/* Therefore, I'll place the canvas in space */}
            <sprite scale={[200, 100, 1]} position={spritePos} >
                <spriteMaterial attach="material" map={canvasTex}></spriteMaterial>
            </sprite >
        </group>
    );
}

function Geometry() {
    let raycastable = useRef();
    const [count, setCount] = useState(0);

    const floorTexture = useLoader(TextureLoader, floorTex);
    floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping;
    floorTexture.repeat.set(10, 10);

    useEffect(() => {
        setCount(count + 1);
    }, [raycastable]);

    return (
        <group>
            {raycastable.current && count >= 0 &&
                <ToolTip raycastableParent={raycastable.current} count={count}></ToolTip>
            }
            <group ref={raycastable}>
                <mesh position={[0, 26, 0]}>
                    <boxGeometry attach="geometry" args={[50, 50, 50]} />
                    <meshBasicMaterial attach="material" color={0x000088}></meshBasicMaterial>
                </mesh>

                {/* Floor */}
                <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry attach="geometry" args={[1000, 1000, 1, 1]}></planeGeometry>
                    <meshBasicMaterial attach="material" map={floorTexture} side={DoubleSide}></meshBasicMaterial>
                </mesh>
            </group>

            {/* Sky */}
            <mesh>
                <boxGeometry attach="geometry" args={[1000, 1000, 1000]}></boxGeometry>
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


function MouseTooltipPage(props) {

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

export default MouseTooltipPage;
