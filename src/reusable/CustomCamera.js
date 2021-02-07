import React, { useEffect } from 'react';
import {PerspectiveCamera} from 'three';
import { useThree } from 'react-three-fiber';

const extent = 10;
const MyCamera = ({near=0.1, far=1000, OnCameraInit}) => {
    const { setDefaultCamera, size } = useThree();
    useEffect(() => {
        const cam = new PerspectiveCamera(70, size.width / size.height, near, far);
        cam.position.z = 2 * extent;
        // cam.up.set(0, 0, 1);
        setDefaultCamera(cam);

        OnCameraInit(cam);
    },[size, setDefaultCamera]);

    return (
        <group></group>
    );
}

export default MyCamera;