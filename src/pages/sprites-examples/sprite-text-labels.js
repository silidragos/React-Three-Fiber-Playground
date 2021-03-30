import React, { Suspense } from 'react';
import { Canvas, useLoader, useThree } from 'react-three-fiber';
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

function TextSprite(props) {
    if (props.parameters === undefined) props.parameters = {};

    const fontface = props.parameters.hasOwnProperty("fontface") ? props.parameters["fontface"] : "Arial";
    const fontsize = props.parameters.hasOwnProperty("fontsize") ? props.parameters["fontsize"] : 18;
    const borderThickness = props.parameters.hasOwnProperty("borderThickness") ? props.parameters["borderThickness"] : 4;
    const borderColor = props.parameters.hasOwnProperty("borderColor") ? props.parameters["borderColor"] : { r: 0, g: 0, b: 0, a: 1.0 };
    const backgroundColor = props.parameters.hasOwnProperty("backgroundColor") ? props.parameters["backgroundColor"] : { r: 255, g: 255, b: 255, a: 1.0 };

    //DEPRECATED since giving up screenspace sprites
    // var spriteAlignment = THREE.SpriteAlignment.topLeft
    const canvas = document.createElement("canvas");
    var context = canvas.getContext('2d');
    context.font = "Bold " + fontsize + "px " + fontface;

    var metrics = context.measureText(props.message);
    var textWidth = metrics.width;

    context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
        + backgroundColor.b + "," + backgroundColor.a + ")";
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
        + borderColor.b + "," + borderColor.a + ")";

    context.lineWidth = borderThickness;
    roundRect(context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);

    context.fillStyle = "rgba(0, 0, 0, 1.0)";
    context.fillText(props.message, borderThickness, fontsize + borderThickness);
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;


    return (
        <sprite position={props.position} scale={[100, 50, 1.0]}>
            <spriteMaterial attach="material" map={texture}></spriteMaterial>
        </sprite>
    );
}

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, x + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function Geometry() {
    const floorTexture = useLoader(TextureLoader, floorTex);
    floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping;
    floorTexture.repeat.set(10, 10);

    var style1 = {
        fontsize: 24, borderColor: {r:255, g:0, b:0, a:1.0}, backgroundColor:{r:255, g:100,b:100, a:0.8}
    };

    var style2={
        fontsize: 32, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:1.0}
    };
    return (
        <group>
            <mesh position={[0, 50.1, 0]} name="Cube">
                <boxGeometry attach="geometry" args={[100, 100, 100]}></boxGeometry>
                <meshNormalMaterial attach="material"></meshNormalMaterial>
            </mesh>

            <TextSprite message="Hello, " parameters={style1} position={[-85, 105, 55]}></TextSprite>
            <TextSprite message=" World!" parameters={style2} position={[55, 105, 55]}></TextSprite>
            {/* Floor */}
            <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry attach="geometry" args={[1000, 1000, 1, 1]}></planeGeometry>
                <meshBasicMaterial attach="material" map={floorTexture} args={{ side: DoubleSide }}></meshBasicMaterial>
            </mesh>

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


function SpriteTextLabels(props) {

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

export default SpriteTextLabels;
