import Vector2 from '../geom/Vector2'

export default class Mouse {

    constructor(game) {

        this.game = game;
        this.buttonPressed = [];
        this.buttonPressed.length = 3;

        this._position = new Vector2();

        window.addEventListener('mouseup', this.mouseUpHandler.bind(this));
        window.addEventListener('mousedown', this.mouseDownHandler.bind(this));
        window.addEventListener('mousemove', this.mouseMoveHandler.bind(this));

    }
    
    mouseUpHandler(event) {
        this.buttonPressed[event.button] = false;
    }

    mouseDownHandler(event) {
        this.buttonPressed[event.button] = true;
    }

    mouseMoveHandler(event) {
        let rect = this.game.canvas.getBoundingClientRect();
        this._position.x = event.clientX - rect.left;
        this._position.y = event.clientY - rect.top;
    }

    pressed(button) {
        return this.buttonPressed[button];
    }

    get x() {
        return this._position.x;
    }

    get y() {
        return this._position.y;
    }

    get position() {
        return this._position.clone();
    }

}


Mouse.LEFT = 0;
Mouse.MIDDLE = 1;
Mouse.RIGHT = 2;