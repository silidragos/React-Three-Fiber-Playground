import {useRef} from 'react';
import { extend, useFrame, useThree } from 'react-three-fiber';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

extend({OrbitControls});

function Controls(){
    const {camera, gl:{domElement}} = useThree();
    const controls = useRef();

    useFrame(()=>{
        controls.current.update();
    });
    return(
        <orbitControls ref={controls} args={[camera, domElement]} enableDamping dampingFactor={0.1} rotateSpeed={0.5}></orbitControls>
    );
}

export default Controls;