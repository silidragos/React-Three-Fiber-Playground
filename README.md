Currently trying to reply (these)[http://stemkoski.github.io/Three.js/] examples but in R3F to get used to the framework.

Changes:
 - faces/vertices attribute is not anymore accessible in that way, so examples including that are now accessed through attributes. [documentation](https://threejs.org/docs/#api/en/core/BufferGeometry.attributes)
 -  I think screen space sprites are no longer available, so this can be done either through HTML, or where I didn't find it so relevant, I just left the sprites in 3D space. I also found a better solution, using a new Orthographic camera, [here](https://github.com/mrdoob/three.js/blob/master/examples/webgl_sprites.html) and [here](https://codesandbox.io/s/react-three-fiber-multiple-scene-test-k7ei0)

