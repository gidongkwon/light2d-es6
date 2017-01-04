import Vector2 from './Vector2'

export default class Rectangle {

    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    intersects(rect) {
        return !(this.x + this.width < rect.x || this.y + this.height < rect.y || rect.x + rect.width < this.x || rect.y + rect.height < this.y);
    }

    intersection(rect) {

        if (!this.intersects(rect))
            return null;

        let x = Math.max(this.x, rect.x);
        let y = Math.max(this.y, rect.y);
        let width = Math.min(this.x + this.width, rect.x + rect.width) - x;
        let height = Math.min(this.y + this.height, rect.y + rect.height) - y;

        return new Rectangle(x, y, width, height);

    }
        
    contains(vec2) {
        return !(this.x > vec2.x || this.x + this.width < vec2.x || this.y > vec2.y || this.y + this.height < vec2.y);
    }

    clone() {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    get center() {
        return new Vector2(this.x + this.width / 2, this.y + this.height / 2);
    }

}