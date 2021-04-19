import React from 'react';
import * as THREE from 'three';

function TextSprite(props) {
    let texture = prepareCanvas(props);

    return (
        <sprite position={props.position} scale={[100, 50, 1.0]}>
            <spriteMaterial attach="material" map={texture}></spriteMaterial>
        </sprite>
    );
}

export function TextSpriteObject(props){
    let texture = prepareCanvas(props);
    let spriteMaterial = new THREE.SpriteMaterial(
      {map: texture}  
    );
    let sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(100, 50, 1.0);
    return sprite;
}

function prepareCanvas(props){
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

    return texture;
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

export default TextSprite;