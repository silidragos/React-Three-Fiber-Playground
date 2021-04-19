import React, { Suspense, useMemo } from 'react';
import { Canvas, useLoader, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';

import MyCamera from '../../reusable/CustomCamera';
import Stats from '../../reusable/Stats';
import OrbitControls from '../../reusable/OrbitControls';
import { TextSpriteObject } from '../../reusable/TextSprite';

import { DoubleSide, TextureLoader, RepeatWrapping, BackSide, FogExp2 } from "three";

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
    const { scene } = useThree();

    let _mGeometry = useMemo(() => {
        //Indexed has in positions attribute faces in the index attribute
        //Without merging vertices, a vertex can repeat once for each face it's part ok
        //The threshold(10) was a bit empirically chosen :-?
        let geometry = BufferGeometryUtils.mergeVertices(new THREE.SphereBufferGeometry(100, 4, 3), 10).toNonIndexed();
        
        //As many mesh accessing methods, DEPRECATED
        // geometry.mergeVertices();
        // geometry.computeCentroids();

        //Vertex labels
        let vertices = geometry.attributes.position.array;
        console.log("vertices",  geometry.attributes);
        
        //TOOD: Merge vertices
        for (let i = 0; i < vertices.length; i+=3) {
            var spritey = TextSpriteObject({
                "message": " " + (i/3) + " ", "parameters": {
                    fontsize: 32, backgroundColor: { r: 255, g: 100, b: 100, a: 1 }
                }
            });
            let pos = new THREE.Vector3(vertices[i], vertices[i+1],vertices[i+2]).multiplyScalar(1.1);
            spritey.position.set(pos.x, pos.y, pos.z);
            scene.add(spritey);
        }

        for (let i = 0; i < vertices.length; i+=9) {
            var spritey = TextSpriteObject({
                "message": " " + (i/3) + " ", "parameters": {
                    fontsize: 32, backgroundColor: { r: 100, g: 100, b: 255, a: 1 }
                }
            });
            let pos1 = new THREE.Vector3(vertices[i], vertices[i+1],vertices[i+2]);
            let pos2 = new THREE.Vector3(vertices[i+3], vertices[i+4],vertices[i+5]);
            let pos3 = new THREE.Vector3(vertices[i+6], vertices[i+7],vertices[i+8]);
            let centroid = pos1.add(pos2).add(pos3).divideScalar(3).multiplyScalar(1.1);
            spritey.position.set(centroid.x, centroid.y, centroid.z);
            scene.add(spritey);
        }

        return geometry;
    }, [scene]);

    return (
        <group>
            <mesh position={[0, 0, 0]} geometry={_mGeometry}>
                <meshNormalMaterial></meshNormalMaterial>
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


function LabeledGeometryPage(props) {

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

export default LabeledGeometryPage;
