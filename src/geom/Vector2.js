export default class Vector2 {

    constructor (x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }


    add (vec2) {
        this.x = vec2.x;
        this.y = vec2.y;
        return this;
    }


    subtract (vec2) {
        this.x -= vec2.x;
        this.y -= vec2.y;
        return this;
    }


    multiply (vec2) {
        this.x *= vec2.x;
        this.y *= vec2.y;
        return this;
    }


    divide (vec2) {
        this.x /= vec2.x;
        this.y /= vec2.y;
        return this;
    }


    angle (vec2) {
        return Math.atan2(vec2.y - this.y, vec2.x - this.x);
    }


    distance (vec2) {
        return Math.sqrt(Math.pow(vec2.x - this.x, 2) + Math.pow(vec2.y - this.y, 2));
    }


    distanceSq (vec2) {
        return Math.pow(vec2.x - this.x, 2) + Math.pow(vec2.y - this.y, 2);
    }


    clone () {
        return new Vector2(this.x, this.y);
    }
}