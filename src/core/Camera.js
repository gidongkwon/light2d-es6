import GameObject from '../gameobjects/GameObject'
import Vector2 from '../geom/Vector2'

export default class Camera extends GameObject {

    constructor(game) {
        super();

        this.game = game;
        this.moveBounds = null;
        this.offset = null;
        this.width = this.game.width;
        this.height = this.game.height;
        this.target = null;

        this.smoothFollowFactor = 1;
        this.smoothZoomFactor = 1;
        this._targetScale = new Vector2(1, 1);

    }

    reset() {

        this.position.set(0, 0);
        this.unfollow();
        this.smoothFollowFactor = 1;
        this.smoothZoomFactor = 1;
        this._targetScale.set(1, 1);

    }

    follow(gameObject, offset = new Vector2()) {
        this.target = gameObject;
        this.offset = offset;
    }

    unfollow() {
        this.target = null;
        this.offset = null;
    }

    zoom(scaleX, scaleY) {
        this._targetScale.x = scaleX;
        this._targetScale.y = scaleY;
    }

    localToCamera(vec2) {
        let p = vec2.clone();
        p.subtract(this.position).multiplyVector(this.scale);

        return p;
    }

    cameraToLocal(vec2) {
        let p = vec2.clone();
        p.divideVector(this.scale).add(this.position);

        return p;
    }

    update(dt) {

        this._scale.x += (this._targetScale.x - this._scale.x) / this.smoothZoomFactor;
        this._scale.y += (this._targetScale.y - this._scale.y) / this.smoothZoomFactor;

        if (this.moveBounds) {

            let value;

            value = this.moveBounds.x;
            if (this.x <= value) {
                this.x = value;
            }

            value = this.moveBounds.width - this.width;
            if (this.x >= value) {
                this.x = value;
            }

            value = this.moveBounds.y;
            if (this.y <= value) {
                this.y = value;
            }

            value = this.moveBounds.height - this.height;
            if (this.y >= value) {
                this.y = value;
            }

        }

        if (this.target) {
            this.x += (this.target.x + this.target.width / 2 - this.width / 2 - this.offset.x - this.x) / this.smoothFollowFactor;
            this.y += (this.target.y + this.target.height / 2 - this.height / 2 - this.offset.y - this.y) / this.smoothFollowFactor;
        }

    }
    
}