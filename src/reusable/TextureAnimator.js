import * as THREE from 'three';
export default class TextureAnimator{

    //Texture passible to change in the update function
    constructor(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration){
        this.tilesHorizontal = tilesHoriz;
        this.tilesVertical = tilesVert;
        //Not using horiz*vert because sometimes tiles at the bottom can be blank
        this.numberOfTiles = numTiles;
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1/this.tilesHorizontal, 1/this.tilesVertical);
        this.tileDisplayDuration = tileDispDuration;
        this.currentDisplayTime = 0;
        this.currentTile = 0;
        this.texture = texture;
    }

    update(miliSec){
        this.currentDisplayTime += miliSec;
        while(this.currentDisplayTime > this.tileDisplayDuration){
            this.currentDisplayTime -= this.tileDisplayDuration;
            this.currentTile++;
            if(this.currentTile === this.numberOfTiles){
                this.currentTile = 0;
            }

            const currentColumn = this.currentTile % this.tilesHorizontal;
            this.texture.offset.x = currentColumn / this.tilesHorizontal;
            const currentRow = Math.floor(this.currentTile / this.tilesHorizontal);
            this.texture.offset.y = currentRow / this.tilesVertical;
        }
    }
}