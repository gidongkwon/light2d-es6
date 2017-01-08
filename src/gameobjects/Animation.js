import Sprite from './Sprite'

export default class Animation extends Sprite {
    
    constructor(spriteSheet, frameRect, totalFrame, frameSpeed = 60) {
        super(spriteSheet);

        this.frameRect = frameRect;
        this.totalFrame = totalFrame;
        this.framesPerRow = Math.floor(this.texture.width / frameRect.width);
        this.frameSpeed = frameSpeed;

        this.isLoop = true;
        this.frameSpeed = 60;

        this._width = frameRect.width;
        this._height = frameRect.height;
        this._frameCount = 0;
        this._isPlaying = false;

    }

    play(isLoop = true, frameSpeed = 60) {

        this.isLoop = isLoop;
        this.frameSpeed = frameSpeed;
        this._isPlaying = true;

    }

    stop(reset = false) {

        if (reset)
            this._frameCount = 0;
        this._isPlaying = false;

    }

    update(dt) {

        if (!this._isPlaying)
            return;
        
        this._frameCount += this.frameSpeed * dt;
        
        if (this._frameCount >= this.totalFrame) {
            if (this.isLoop)
                this._frameCount = 0;
            else
                this.frameCount = this.totalFrame - 1;
        }

    }

    render(context) {

        context.drawImage(
            this.texture,
            this.width * Math.floor(this._frameCount % this.framesPerRow),
            this.height * Math.floor(this._frameCount / this.framesPerRow),
            this.width,
            this.height,
            0,
            0,
            this.width,
            this.height
            );

    }

    get currentFrame() {
        return this._frameCount;
    }

    get isPlaying() {
        return this._isPlaying;
    }

    get width() {
        return this._width;
    }

    set width(value) {
        this._width = value;
        this._scale.x = value / this.frameRect.width;
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._height = value;
        this._scale.y = value / this.frameRect.height;
    }

    get scaleX() {
        return this._scale.x;
    }

    set scaleX(value) {
        this._width *= value;
        this._scale.x = value;
    }

    get scaleY() {
        return this._scale.y;
    }

    set scaleY(value) {
        this._height *= value;
        this._scale.y = value;
    }

}
