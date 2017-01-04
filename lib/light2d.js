(function (exports) {
'use strict';

class Asset {

    constructor(game) {

        this.game = game;
        
        this.loadedFiles = 0;
        
        this.toLoad = new Map();
        this.image = {};
        this.audio = {};

    }

    loadImage(id, url) {

        if (this.image.hasOwnProperty(id))
            return this;
        
        this.toLoad.set(id, new File('image', id, url));
        return this;

    }

    loadAudio(id, url) {

        if (this.audio.hasOwnProperty(id))
            return this;

        this.toLoad.set(id, new File('audio', id, url));
        return this;

    }

    // private
    startLoad() {

        for (let file of this.toLoad.values()) {

            switch (file.type) {
            case 'image':
                let img = new Image();
                img.src = file.url;
                img.assetId = file.id;
                img.addEventListener('load', loadHanlder.bind(this));
                break;

            case 'audio':
                let aud = new Audio(file.url);
                aud.assetId = file.id;
                aud.addEventListener('load', loadHanlder.bind(this));
                aud.dispatchEvent(new Event('load'));
                break;

            }

        }

    }

    get totalFiles() {
        return this.toLoad.size;
    }
    
    get progressAsPercent() {
        return (this.loadingFiles === 0) ? 0 : this.loadedFiles / this.totalFiles * 100;
    }

}


const loadHanlder = function(event) {

    event.target.removeEventListener('load', loadHanlder);
    
    const file = this.toLoad.get(event.target.assetId);
    
    this[file.type][file.id] = event.target;
    this.loadedFiles++;
    
    if(this.loadedFiles === this.totalFiles) {
        document.dispatchEvent(new CustomEvent('preloaded'));
        this.toLoad.clear();
        this.loadedFiles = 0;
    }

};


class File {

    constructor(type, id, url) {

        this.type = type;
        this.id = id;
        this.url = url;

    }

}

class SceneManager {

    constructor(game) {

        this.game = game;
        this._currentScene = null;

    }

    change(scene) {

        this._currentScene = scene;
        this._currentScene.preload();

        this.game.asset.startLoad();

        document.addEventListener('preloaded', () => {
            this._currentScene.preloaded = true;
            this._currentScene.init();
        });
        
        if (!this.game.inited)
            return;

        //this.game.camera.reset();
        //this.game.physics.reset();

    }

    get current() {
        return this._currentScene;
    }

}

class Keyboard {

    constructor(game) {
    
        this.game = game;
        this.keyPressed = [];
        this.keyCapturing = [];

        window.addEventListener('keydown', this.keyDownHandler.bind(this));
        window.addEventListener('keyup', this.keyUpHandler.bind(this));

    }
    
    keyDownHandler(event) {

        if (this.keyCapturing.includes(event.keyCode))
            event.preventDefault();

        this.keyPressed[event.keyCode] = true;

    }

    keyUpHandler(event) {
        this.keyPressed[event.keyCode] = false;
    }

    pressed(keyCode) {
        console.log(`${keyCode} : ${this.keyPressed[keyCode]}`);
        return this.keyPressed[keyCode];
    }

}


Keyboard.A = 'A'.charCodeAt(0);
Keyboard.B = 'B'.charCodeAt(0);
Keyboard.C = 'C'.charCodeAt(0);
Keyboard.D = 'D'.charCodeAt(0);
Keyboard.E = 'E'.charCodeAt(0);
Keyboard.F = 'F'.charCodeAt(0);
Keyboard.G = 'G'.charCodeAt(0);
Keyboard.H = 'H'.charCodeAt(0);
Keyboard.I = 'I'.charCodeAt(0);
Keyboard.J = 'J'.charCodeAt(0);
Keyboard.K = 'K'.charCodeAt(0);
Keyboard.L = 'L'.charCodeAt(0);
Keyboard.M = 'M'.charCodeAt(0);
Keyboard.N = 'N'.charCodeAt(0);
Keyboard.O = 'O'.charCodeAt(0);
Keyboard.P = 'P'.charCodeAt(0);
Keyboard.Q = 'Q'.charCodeAt(0);
Keyboard.R = 'R'.charCodeAt(0);
Keyboard.S = 'S'.charCodeAt(0);
Keyboard.T = 'T'.charCodeAt(0);
Keyboard.U = 'U'.charCodeAt(0);
Keyboard.V = 'V'.charCodeAt(0);
Keyboard.W = 'W'.charCodeAt(0);
Keyboard.X = 'X'.charCodeAt(0);
Keyboard.Y = 'Y'.charCodeAt(0);
Keyboard.Z = 'Z'.charCodeAt(0);
Keyboard.BACKSPACE = 8;
Keyboard.TAP = 9;
Keyboard.ENTER = 13;
Keyboard.COMMAND = 15;
Keyboard.SHIFT = 16;
Keyboard.CONTROL = 17;
Keyboard.ALTERNATE = 18;
Keyboard.CAPS_LOCK = 20;
Keyboard.ESCAPE = 27;
Keyboard.SPACE = 32;
Keyboard.PAGE_UP = 33;
Keyboard.PAGE_DOWN = 34;
Keyboard.END = 35;
Keyboard.HOME = 36;
Keyboard.LEFT = 37;
Keyboard.UP = 38;
Keyboard.RIGHT = 39;
Keyboard.DOWN = 40;
Keyboard.INSERT = 45;
Keyboard.DELETE = 46;
Keyboard.NUMBER_1 = 49;
Keyboard.NUMBER_2 = 50;
Keyboard.NUMBER_3 = 51;
Keyboard.NUMBER_4 = 52;
Keyboard.NUMBER_5 = 53;
Keyboard.NUMBER_6 = 54;
Keyboard.NUMBER_7 = 55;
Keyboard.NUMBER_8 = 56;
Keyboard.NUMBER_9 = 57;
Keyboard.NUMPAD_0 = 96;
Keyboard.NUMPAD_1 = 97;
Keyboard.NUMPAD_2 = 98;
Keyboard.NUMPAD_3 = 99;
Keyboard.NUMPAD_4 = 100;
Keyboard.NUMPAD_5 = 101;
Keyboard.NUMPAD_6 = 102;
Keyboard.NUMPAD_7 = 103;
Keyboard.NUMPAD_8 = 104;
Keyboard.NUMPAD_9 = 105;
Keyboard.NUMPAD_MULTIPLY = 106;
Keyboard.NUMPAD_ADD = 107;
Keyboard.NUMPAD_ENTER = 108;
Keyboard.NUMPAD_SUBTRACT = 109;
Keyboard.NUMPAD_DEMICAL = 110;
Keyboard.NUMPAD_DIVIDE = 111;
Keyboard.F1 = 112;
Keyboard.F2 = 113;
Keyboard.F3 = 114;
Keyboard.F4 = 115;
Keyboard.F5 = 116;
Keyboard.F6 = 117;
Keyboard.F7 = 118;
Keyboard.F8 = 119;
Keyboard.F9 = 120;
Keyboard.F10 = 121;
Keyboard.F11 = 122;
Keyboard.F12 = 123;
Keyboard.F13 = 124;
Keyboard.F14 = 125;
Keyboard.F15 = 126;
Keyboard.SEMICOLON = 186;
Keyboard.EQUAL = 187;
Keyboard.COMMA = 188;
Keyboard.MINUS = 189;
Keyboard.PERIOD = 190;
Keyboard.SLASH = 191;
Keyboard.BACKQUOTE = 192;
Keyboard.LEFTBRACKET = 219;
Keyboard.BACKSLASH = 220;
Keyboard.RIGHTBRACKET = 221;
Keyboard.QUOTE = 222;

class Vector2 {

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(vec2) {
        this.x = vec2.x;
        this.y = vec2.y;
        return this;
    }

    subtract(vec2) {
        this.x -= vec2.x;
        this.y -= vec2.y;
        return this;
    }

    multiply(vec2) {
        this.x *= vec2.x;
        this.y *= vec2.y;
        return this;
    }

    divide(vec2) {
        this.x /= vec2.x;
        this.y /= vec2.y;
        return this;
    }

    angle(vec2) {
        return Math.atan2(vec2.y - this.y, vec2.x - this.x);
    }

    distance(vec2) {
        return Math.sqrt(Math.pow(vec2.x - this.x, 2) + Math.pow(vec2.y - this.y, 2));
    }

    distanceSq(vec2) {
        return Math.pow(vec2.x - this.x, 2) + Math.pow(vec2.y - this.y, 2);
    }

    clone() {
        return new Vector2(this.x, this.y);
    }
    
}

class Mouse {

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

class Game {

    constructor(canvasId, width = 800, height = 600, backgroundColor = '#fff') {

        this.canvasId = canvasId;
        this.width = width;
        this.height = height;
        this.backgroundColor = backgroundColor;
        
        this.canvas = null;
        this.context = null;

        this.asset = new Asset(this);
        this.scenes = new SceneManager(this);
        this.keyboard = new Keyboard(this);
        this.mouse = new Mouse(this);
        //this.camera = new Camera();
        //this.physics = new Physics();

        this.dt = 0;

        this.inited = false;

        document.addEventListener('DOMContentLoaded', this.init.bind(this), true);

    }

    init() {

        document.removeEventListener('DOMContentLoaded', this.init, true);

        this.canvas = document.getElementById(this.canvasId);

        if (!this.canvas) {
            throw new Error(`${this.canvasId}를 찾을 수 없습니다.`);
            return;
        }

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d');

        this._time = Date.now();
        this._fpsStartTime = Date.now();
        this._fps = 60;

        this.inited = true;
        this._rafId = window.requestAnimationFrame(this.run.bind(this));

    }

    run() {
        
        this.dt = (Date.now() - this._time) / 1000;

        if (Date.now() - this._fpsStartTime > 500) {
            this._fpsStartTime = Date.now();
            this._fps = Math.max(Math.round(1 / this.dt), 60);
        }

        this.update(this.dt);
        this.render(this.context);
        
        this._time = Date.now();
        this._rafId = window.requestAnimationFrame(this.run.bind(this));

    }
    
    update(dt) {

        // this.physics.update(dt);

        if (this.scenes.current && this.scenes.current.preloaded)
            this.scenes.current.update(dt);

    }

    render(context) {

        let targetX = this.width / 2;
        let targetY = this.height / 2;

        context.save();

        context.fillStyle = this.backgroundColor;
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // context.translate(targetX, targetY);
        // context.scale(this.camera.scale.x, this.camera.scale.y);
        // context.translate(-targetX, -targetY);

        // context.translate(-this.camera.x, -this.camera.y);
        
        if (this.scenes.current.preloaded) {
            for (let child of this.scenes.current.children) {
                child.beforeRender(context);
                child.render(context);
                child.afterRender(context);
            }
        }

        context.restore();

    }

    get fps() {
        return this._fps;
    }

}

class Rectangle {

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

class GameObject {

    constructor() {

        this.position = new Vector2();
        this.rotation = 0;
        this.rotationCenter = new Vector2();
        this.scaleCenter = new Vector2();
        this.alpha = 1;
        this.visible = true;
        this.parent = null; 
        this.ignoreGlobalTransform = false;

        this._width = 0;
        this._height = 0;
        this._scale = new Vector2(1, 1);

    }

    beforeRender(context) {

        // 전역 transform을 무시할 경우 - UI등에 사용
        if (this.ignoreGlobalMatrix) {
            this._currentGlobalTransform = context.currentTransform;
            context.setTransform(1, 0, 0, 1, 0, 0); // context의 transform을 identity matrix로 설정

            return;
        }

        context.save();

        // position
        context.translate(this.position.x, this.position.y);

        // rotation
        context.translate(this.rotationCenter.x, this.rotationCenter.y);
        context.rotate(this.rotation);
        context.translate(-this.rotationCenter.x, -this.rotationCenter.y);

        // scale
        context.translate(this.scaleCenter.x, this.scaleCenter.y);
        context.scale(this.scaleX, this.scaleY);
        context.translate(-this.scaleCenter.x, -this.scaleCenter.y);

        // alpha
        context.globalAlpha *= this.alpha;

    }

    render(context) {
        // 하위클래스에서 구현
    }

    afterRender(context) {
        context.restore();

        if (this.ignoreGlobalMatrix)
            context.setTransform(this._currentGlobalTransform);
    }

    update(dt) {
        // 하위클래스에서 구현
    }
    
    intersects(gameObject) {
        return this.bounds.intersects(gameObject); // 트릭: GameObject와 Rectangle 모두 x, y, width, height가 있다는 것을 이용
    }

    intersection(gameObject) {
        return this.bounds.intersection(gameObject); // 트릭
    }

    contains(vec2) {
        return this.bounds.contains(vec2);
    }

    get bounds() {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    get x() {
        return this.position.x;
    }

    set x(value) {
        this.position.x = value;
    }

    get y() {
        return this.position.y;
    }

    set y(value) {
        this.position.y = value;
    }

    get width() {
        return this._width;
    }

    set width(value) {
        this._width = value;
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._height = value;
    }

    get scaleX() {
        return this._scale.x;
    }

    set scaleX(value) {
        this._scale.x = value;
    }

    get scaleY() {
        return this._scale.y;
    }

    set scaleY(value) {
        this._scale.y = value;
    }

}

class Container extends GameObject {
    
    constructor() {
        super();
        this.children = [];
    }

    render(context) {
        for (let child of this.children) {
            child.beforeRender(context);
            child.render(context);
            child.afterRender(context);
        }
    }

    update(dt) {
        for (let child of this.children)
            child.update(dt);
    }

    addChild(child) {
        child.parent = this;
        this.children.push(child);
    }

    removeChild(child) {
        this.children.splice(this.children.indexOf(child), 1);
    }

}

class Scene extends Container{

    constructor() {
        super();
        
        this.ui = new Container();
        this.ui.ignoreGlobalTransform = true;
        this.preloaded = false;
    }

    preload() {

    }

    update(dt) {
        super.update(dt);
    }

}

class Sprite extends Container {
    
    constructor(image) {
        super();

        this.texture = image;
        this._width = image.width;
        this._height = image.height;
    }

    render(context) {
        super.render(context);
        context.drawImage(this.texture, 0, 0);
    }

    get width() {
        return this._width;
    }

    set width(value) {
        this._width = value;
        this._scale.x = value / this.texture.width;
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._height = value;
        this._scale.y = value / this.texture.height;
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

exports.Game = Game;
exports.Keyboard = Keyboard;
exports.Mouse = Mouse;
exports.Vector2 = Vector2;
exports.Rectangle = Rectangle;
exports.Container = Container;
exports.GameObject = GameObject;
exports.Scene = Scene;
exports.Sprite = Sprite;

}((this.light2d = this.light2d || {})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlnaHQyZC5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2NvcmUvQXNzZXQuanMiLCIuLi9zcmMvY29yZS9TY2VuZU1hbmFnZXIuanMiLCIuLi9zcmMvaW5wdXQvS2V5Ym9hcmQuanMiLCIuLi9zcmMvZ2VvbS9WZWN0b3IyLmpzIiwiLi4vc3JjL2lucHV0L01vdXNlLmpzIiwiLi4vc3JjL2NvcmUvR2FtZS5qcyIsIi4uL3NyYy9nZW9tL1JlY3RhbmdsZS5qcyIsIi4uL3NyYy9nYW1lb2JqZWN0cy9HYW1lT2JqZWN0LmpzIiwiLi4vc3JjL2dhbWVvYmplY3RzL0NvbnRhaW5lci5qcyIsIi4uL3NyYy9nYW1lb2JqZWN0cy9TY2VuZS5qcyIsIi4uL3NyYy9nYW1lb2JqZWN0cy9TcHJpdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXNzZXQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGdhbWUpIHtcclxuXHJcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmxvYWRlZEZpbGVzID0gMDtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnRvTG9hZCA9IG5ldyBNYXAoKTtcclxuICAgICAgICB0aGlzLmltYWdlID0ge307XHJcbiAgICAgICAgdGhpcy5hdWRpbyA9IHt9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBsb2FkSW1hZ2UoaWQsIHVybCkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pbWFnZS5oYXNPd25Qcm9wZXJ0eShpZCkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudG9Mb2FkLnNldChpZCwgbmV3IEZpbGUoJ2ltYWdlJywgaWQsIHVybCkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBsb2FkQXVkaW8oaWQsIHVybCkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5hdWRpby5oYXNPd25Qcm9wZXJ0eShpZCkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLnRvTG9hZC5zZXQoaWQsIG5ldyBGaWxlKCdhdWRpbycsIGlkLCB1cmwpKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHJpdmF0ZVxyXG4gICAgc3RhcnRMb2FkKCkge1xyXG5cclxuICAgICAgICBmb3IgKGxldCBmaWxlIG9mIHRoaXMudG9Mb2FkLnZhbHVlcygpKSB7XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKGZpbGUudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdpbWFnZSc6XHJcbiAgICAgICAgICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgICAgICAgICBpbWcuc3JjID0gZmlsZS51cmw7XHJcbiAgICAgICAgICAgICAgICBpbWcuYXNzZXRJZCA9IGZpbGUuaWQ7XHJcbiAgICAgICAgICAgICAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGxvYWRIYW5sZGVyLmJpbmQodGhpcykpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlICdhdWRpbyc6XHJcbiAgICAgICAgICAgICAgICBsZXQgYXVkID0gbmV3IEF1ZGlvKGZpbGUudXJsKTtcclxuICAgICAgICAgICAgICAgIGF1ZC5hc3NldElkID0gZmlsZS5pZDtcclxuICAgICAgICAgICAgICAgIGF1ZC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgbG9hZEhhbmxkZXIuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgICAgICAgICBhdWQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2xvYWQnKSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBnZXQgdG90YWxGaWxlcygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50b0xvYWQuc2l6ZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IHByb2dyZXNzQXNQZXJjZW50KCkge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5sb2FkaW5nRmlsZXMgPT09IDApID8gMCA6IHRoaXMubG9hZGVkRmlsZXMgLyB0aGlzLnRvdGFsRmlsZXMgKiAxMDA7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5cclxuY29uc3QgbG9hZEhhbmxkZXIgPSBmdW5jdGlvbihldmVudCkge1xyXG5cclxuICAgIGV2ZW50LnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgbG9hZEhhbmxkZXIpO1xyXG4gICAgXHJcbiAgICBjb25zdCBmaWxlID0gdGhpcy50b0xvYWQuZ2V0KGV2ZW50LnRhcmdldC5hc3NldElkKTtcclxuICAgIFxyXG4gICAgdGhpc1tmaWxlLnR5cGVdW2ZpbGUuaWRdID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgdGhpcy5sb2FkZWRGaWxlcysrO1xyXG4gICAgXHJcbiAgICBpZih0aGlzLmxvYWRlZEZpbGVzID09PSB0aGlzLnRvdGFsRmlsZXMpIHtcclxuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncHJlbG9hZGVkJykpO1xyXG4gICAgICAgIHRoaXMudG9Mb2FkLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5sb2FkZWRGaWxlcyA9IDA7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5cclxuY2xhc3MgRmlsZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IodHlwZSwgaWQsIHVybCkge1xyXG5cclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLnVybCA9IHVybDtcclxuXHJcbiAgICB9XHJcblxyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NlbmVNYW5hZ2VyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lKSB7XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcbiAgICAgICAgdGhpcy5fY3VycmVudFNjZW5lID0gbnVsbDtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlKHNjZW5lKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRTY2VuZSA9IHNjZW5lO1xyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRTY2VuZS5wcmVsb2FkKCk7XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZS5hc3NldC5zdGFydExvYWQoKTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncHJlbG9hZGVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50U2NlbmUucHJlbG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fY3VycmVudFNjZW5lLmluaXQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoIXRoaXMuZ2FtZS5pbml0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy90aGlzLmdhbWUuY2FtZXJhLnJlc2V0KCk7XHJcbiAgICAgICAgLy90aGlzLmdhbWUucGh5c2ljcy5yZXNldCgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBnZXQgY3VycmVudCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY3VycmVudFNjZW5lO1xyXG4gICAgfVxyXG5cclxufSIsIlxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBLZXlib2FyZCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZSkge1xyXG4gICAgXHJcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcclxuICAgICAgICB0aGlzLmtleVByZXNzZWQgPSBbXTtcclxuICAgICAgICB0aGlzLmtleUNhcHR1cmluZyA9IFtdO1xyXG5cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMua2V5RG93bkhhbmRsZXIuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5rZXlVcEhhbmRsZXIuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBrZXlEb3duSGFuZGxlcihldmVudCkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5rZXlDYXB0dXJpbmcuaW5jbHVkZXMoZXZlbnQua2V5Q29kZSkpXHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIHRoaXMua2V5UHJlc3NlZFtldmVudC5rZXlDb2RlXSA9IHRydWU7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGtleVVwSGFuZGxlcihldmVudCkge1xyXG4gICAgICAgIHRoaXMua2V5UHJlc3NlZFtldmVudC5rZXlDb2RlXSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByZXNzZWQoa2V5Q29kZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGAke2tleUNvZGV9IDogJHt0aGlzLmtleVByZXNzZWRba2V5Q29kZV19YCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMua2V5UHJlc3NlZFtrZXlDb2RlXTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcblxyXG5LZXlib2FyZC5BID0gJ0EnLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLkIgPSAnQicuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuQyA9ICdDJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5EID0gJ0QnLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLkUgPSAnRScuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuRiA9ICdGJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5HID0gJ0cnLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLkggPSAnSCcuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuSSA9ICdJJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5KID0gJ0onLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLksgPSAnSycuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuTCA9ICdMJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5NID0gJ00nLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLk4gPSAnTicuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuTyA9ICdPJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5QID0gJ1AnLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLlEgPSAnUScuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuUiA9ICdSJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5TID0gJ1MnLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLlQgPSAnVCcuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuVSA9ICdVJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5WID0gJ1YnLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLlcgPSAnVycuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuWCA9ICdYJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5ZID0gJ1knLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLlogPSAnWicuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuQkFDS1NQQUNFID0gODtcclxuS2V5Ym9hcmQuVEFQID0gOTtcclxuS2V5Ym9hcmQuRU5URVIgPSAxMztcclxuS2V5Ym9hcmQuQ09NTUFORCA9IDE1O1xyXG5LZXlib2FyZC5TSElGVCA9IDE2O1xyXG5LZXlib2FyZC5DT05UUk9MID0gMTc7XHJcbktleWJvYXJkLkFMVEVSTkFURSA9IDE4O1xyXG5LZXlib2FyZC5DQVBTX0xPQ0sgPSAyMDtcclxuS2V5Ym9hcmQuRVNDQVBFID0gMjc7XHJcbktleWJvYXJkLlNQQUNFID0gMzI7XHJcbktleWJvYXJkLlBBR0VfVVAgPSAzMztcclxuS2V5Ym9hcmQuUEFHRV9ET1dOID0gMzQ7XHJcbktleWJvYXJkLkVORCA9IDM1O1xyXG5LZXlib2FyZC5IT01FID0gMzY7XHJcbktleWJvYXJkLkxFRlQgPSAzNztcclxuS2V5Ym9hcmQuVVAgPSAzODtcclxuS2V5Ym9hcmQuUklHSFQgPSAzOTtcclxuS2V5Ym9hcmQuRE9XTiA9IDQwO1xyXG5LZXlib2FyZC5JTlNFUlQgPSA0NTtcclxuS2V5Ym9hcmQuREVMRVRFID0gNDY7XHJcbktleWJvYXJkLk5VTUJFUl8xID0gNDk7XHJcbktleWJvYXJkLk5VTUJFUl8yID0gNTA7XHJcbktleWJvYXJkLk5VTUJFUl8zID0gNTE7XHJcbktleWJvYXJkLk5VTUJFUl80ID0gNTI7XHJcbktleWJvYXJkLk5VTUJFUl81ID0gNTM7XHJcbktleWJvYXJkLk5VTUJFUl82ID0gNTQ7XHJcbktleWJvYXJkLk5VTUJFUl83ID0gNTU7XHJcbktleWJvYXJkLk5VTUJFUl84ID0gNTY7XHJcbktleWJvYXJkLk5VTUJFUl85ID0gNTc7XHJcbktleWJvYXJkLk5VTVBBRF8wID0gOTY7XHJcbktleWJvYXJkLk5VTVBBRF8xID0gOTc7XHJcbktleWJvYXJkLk5VTVBBRF8yID0gOTg7XHJcbktleWJvYXJkLk5VTVBBRF8zID0gOTk7XHJcbktleWJvYXJkLk5VTVBBRF80ID0gMTAwO1xyXG5LZXlib2FyZC5OVU1QQURfNSA9IDEwMTtcclxuS2V5Ym9hcmQuTlVNUEFEXzYgPSAxMDI7XHJcbktleWJvYXJkLk5VTVBBRF83ID0gMTAzO1xyXG5LZXlib2FyZC5OVU1QQURfOCA9IDEwNDtcclxuS2V5Ym9hcmQuTlVNUEFEXzkgPSAxMDU7XHJcbktleWJvYXJkLk5VTVBBRF9NVUxUSVBMWSA9IDEwNjtcclxuS2V5Ym9hcmQuTlVNUEFEX0FERCA9IDEwNztcclxuS2V5Ym9hcmQuTlVNUEFEX0VOVEVSID0gMTA4O1xyXG5LZXlib2FyZC5OVU1QQURfU1VCVFJBQ1QgPSAxMDk7XHJcbktleWJvYXJkLk5VTVBBRF9ERU1JQ0FMID0gMTEwO1xyXG5LZXlib2FyZC5OVU1QQURfRElWSURFID0gMTExO1xyXG5LZXlib2FyZC5GMSA9IDExMjtcclxuS2V5Ym9hcmQuRjIgPSAxMTM7XHJcbktleWJvYXJkLkYzID0gMTE0O1xyXG5LZXlib2FyZC5GNCA9IDExNTtcclxuS2V5Ym9hcmQuRjUgPSAxMTY7XHJcbktleWJvYXJkLkY2ID0gMTE3O1xyXG5LZXlib2FyZC5GNyA9IDExODtcclxuS2V5Ym9hcmQuRjggPSAxMTk7XHJcbktleWJvYXJkLkY5ID0gMTIwO1xyXG5LZXlib2FyZC5GMTAgPSAxMjE7XHJcbktleWJvYXJkLkYxMSA9IDEyMjtcclxuS2V5Ym9hcmQuRjEyID0gMTIzO1xyXG5LZXlib2FyZC5GMTMgPSAxMjQ7XHJcbktleWJvYXJkLkYxNCA9IDEyNTtcclxuS2V5Ym9hcmQuRjE1ID0gMTI2O1xyXG5LZXlib2FyZC5TRU1JQ09MT04gPSAxODY7XHJcbktleWJvYXJkLkVRVUFMID0gMTg3O1xyXG5LZXlib2FyZC5DT01NQSA9IDE4ODtcclxuS2V5Ym9hcmQuTUlOVVMgPSAxODk7XHJcbktleWJvYXJkLlBFUklPRCA9IDE5MDtcclxuS2V5Ym9hcmQuU0xBU0ggPSAxOTE7XHJcbktleWJvYXJkLkJBQ0tRVU9URSA9IDE5MjtcclxuS2V5Ym9hcmQuTEVGVEJSQUNLRVQgPSAyMTk7XHJcbktleWJvYXJkLkJBQ0tTTEFTSCA9IDIyMDtcclxuS2V5Ym9hcmQuUklHSFRCUkFDS0VUID0gMjIxO1xyXG5LZXlib2FyZC5RVU9URSA9IDIyMjsiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBWZWN0b3IyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih4ID0gMCwgeSA9IDApIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkKHZlYzIpIHtcclxuICAgICAgICB0aGlzLnggPSB2ZWMyLng7XHJcbiAgICAgICAgdGhpcy55ID0gdmVjMi55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHN1YnRyYWN0KHZlYzIpIHtcclxuICAgICAgICB0aGlzLnggLT0gdmVjMi54O1xyXG4gICAgICAgIHRoaXMueSAtPSB2ZWMyLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgbXVsdGlwbHkodmVjMikge1xyXG4gICAgICAgIHRoaXMueCAqPSB2ZWMyLng7XHJcbiAgICAgICAgdGhpcy55ICo9IHZlYzIueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBkaXZpZGUodmVjMikge1xyXG4gICAgICAgIHRoaXMueCAvPSB2ZWMyLng7XHJcbiAgICAgICAgdGhpcy55IC89IHZlYzIueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBhbmdsZSh2ZWMyKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbjIodmVjMi55IC0gdGhpcy55LCB2ZWMyLnggLSB0aGlzLngpO1xyXG4gICAgfVxyXG5cclxuICAgIGRpc3RhbmNlKHZlYzIpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHZlYzIueCAtIHRoaXMueCwgMikgKyBNYXRoLnBvdyh2ZWMyLnkgLSB0aGlzLnksIDIpKTtcclxuICAgIH1cclxuXHJcbiAgICBkaXN0YW5jZVNxKHZlYzIpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5wb3codmVjMi54IC0gdGhpcy54LCAyKSArIE1hdGgucG93KHZlYzIueSAtIHRoaXMueSwgMik7XHJcbiAgICB9XHJcblxyXG4gICAgY2xvbmUoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMueCwgdGhpcy55KTtcclxuICAgIH1cclxuICAgIFxyXG59IiwiaW1wb3J0IFZlY3RvcjIgZnJvbSAnLi4vZ2VvbS9WZWN0b3IyJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW91c2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGdhbWUpIHtcclxuXHJcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcclxuICAgICAgICB0aGlzLmJ1dHRvblByZXNzZWQgPSBbXTtcclxuICAgICAgICB0aGlzLmJ1dHRvblByZXNzZWQubGVuZ3RoID0gMztcclxuXHJcbiAgICAgICAgdGhpcy5fcG9zaXRpb24gPSBuZXcgVmVjdG9yMigpO1xyXG5cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMubW91c2VVcEhhbmRsZXIuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMubW91c2VEb3duSGFuZGxlci5iaW5kKHRoaXMpKTtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5tb3VzZU1vdmVIYW5kbGVyLmJpbmQodGhpcykpO1xyXG5cclxuICAgIH1cclxuICAgIFxyXG4gICAgbW91c2VVcEhhbmRsZXIoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLmJ1dHRvblByZXNzZWRbZXZlbnQuYnV0dG9uXSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdXNlRG93bkhhbmRsZXIoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLmJ1dHRvblByZXNzZWRbZXZlbnQuYnV0dG9uXSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgbW91c2VNb3ZlSGFuZGxlcihldmVudCkge1xyXG4gICAgICAgIGxldCByZWN0ID0gdGhpcy5nYW1lLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICB0aGlzLl9wb3NpdGlvbi54ID0gZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdDtcclxuICAgICAgICB0aGlzLl9wb3NpdGlvbi55ID0gZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wO1xyXG4gICAgfVxyXG5cclxuICAgIHByZXNzZWQoYnV0dG9uKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYnV0dG9uUHJlc3NlZFtidXR0b25dO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB4KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wb3NpdGlvbi54O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB5KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wb3NpdGlvbi55O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBwb3NpdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcG9zaXRpb24uY2xvbmUoKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcblxyXG5Nb3VzZS5MRUZUID0gMDtcclxuTW91c2UuTUlERExFID0gMTtcclxuTW91c2UuUklHSFQgPSAyOyIsImltcG9ydCBBc3NldCBmcm9tICcuL0Fzc2V0J1xyXG5pbXBvcnQgU2NlbmVNYW5hZ2VyIGZyb20gJy4vU2NlbmVNYW5hZ2VyJ1xyXG5pbXBvcnQgQ2FtZXJhIGZyb20gJy4vQ2FtZXJhJ1xyXG5pbXBvcnQgS2V5Ym9hcmQgZnJvbSAnLi4vaW5wdXQvS2V5Ym9hcmQnXHJcbmltcG9ydCBNb3VzZSBmcm9tICcuLi9pbnB1dC9Nb3VzZSdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWUge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNhbnZhc0lkLCB3aWR0aCA9IDgwMCwgaGVpZ2h0ID0gNjAwLCBiYWNrZ3JvdW5kQ29sb3IgPSAnI2ZmZicpIHtcclxuXHJcbiAgICAgICAgdGhpcy5jYW52YXNJZCA9IGNhbnZhc0lkO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICB0aGlzLmJhY2tncm91bmRDb2xvciA9IGJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5hc3NldCA9IG5ldyBBc3NldCh0aGlzKTtcclxuICAgICAgICB0aGlzLnNjZW5lcyA9IG5ldyBTY2VuZU1hbmFnZXIodGhpcyk7XHJcbiAgICAgICAgdGhpcy5rZXlib2FyZCA9IG5ldyBLZXlib2FyZCh0aGlzKTtcclxuICAgICAgICB0aGlzLm1vdXNlID0gbmV3IE1vdXNlKHRoaXMpO1xyXG4gICAgICAgIC8vdGhpcy5jYW1lcmEgPSBuZXcgQ2FtZXJhKCk7XHJcbiAgICAgICAgLy90aGlzLnBoeXNpY3MgPSBuZXcgUGh5c2ljcygpO1xyXG5cclxuICAgICAgICB0aGlzLmR0ID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIHRoaXMuaW5pdC5iaW5kKHRoaXMpLCB0cnVlKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIHRoaXMuaW5pdCwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jYW52YXNJZCk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5jYW52YXMpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMuY2FudmFzSWR966W8IOywvuydhCDsiJgg7JeG7Iq164uI64ukLmApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbiAgICAgICAgdGhpcy5fdGltZSA9IERhdGUubm93KCk7XHJcbiAgICAgICAgdGhpcy5fZnBzU3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcclxuICAgICAgICB0aGlzLl9mcHMgPSA2MDtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0ZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX3JhZklkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJ1bi5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcnVuKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuZHQgPSAoRGF0ZS5ub3coKSAtIHRoaXMuX3RpbWUpIC8gMTAwMDtcclxuXHJcbiAgICAgICAgaWYgKERhdGUubm93KCkgLSB0aGlzLl9mcHNTdGFydFRpbWUgPiA1MDApIHtcclxuICAgICAgICAgICAgdGhpcy5fZnBzU3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcclxuICAgICAgICAgICAgdGhpcy5fZnBzID0gTWF0aC5tYXgoTWF0aC5yb3VuZCgxIC8gdGhpcy5kdCksIDYwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlKHRoaXMuZHQpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKHRoaXMuY29udGV4dCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fdGltZSA9IERhdGUubm93KCk7XHJcbiAgICAgICAgdGhpcy5fcmFmSWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucnVuLmJpbmQodGhpcykpO1xyXG5cclxuICAgIH1cclxuICAgIFxyXG4gICAgdXBkYXRlKGR0KSB7XHJcblxyXG4gICAgICAgIC8vIHRoaXMucGh5c2ljcy51cGRhdGUoZHQpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zY2VuZXMuY3VycmVudCAmJiB0aGlzLnNjZW5lcy5jdXJyZW50LnByZWxvYWRlZClcclxuICAgICAgICAgICAgdGhpcy5zY2VuZXMuY3VycmVudC51cGRhdGUoZHQpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoY29udGV4dCkge1xyXG5cclxuICAgICAgICBsZXQgdGFyZ2V0WCA9IHRoaXMud2lkdGggLyAyO1xyXG4gICAgICAgIGxldCB0YXJnZXRZID0gdGhpcy5oZWlnaHQgLyAyO1xyXG5cclxuICAgICAgICBjb250ZXh0LnNhdmUoKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLmJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGNvbnRleHQudHJhbnNsYXRlKHRhcmdldFgsIHRhcmdldFkpO1xyXG4gICAgICAgIC8vIGNvbnRleHQuc2NhbGUodGhpcy5jYW1lcmEuc2NhbGUueCwgdGhpcy5jYW1lcmEuc2NhbGUueSk7XHJcbiAgICAgICAgLy8gY29udGV4dC50cmFuc2xhdGUoLXRhcmdldFgsIC10YXJnZXRZKTtcclxuXHJcbiAgICAgICAgLy8gY29udGV4dC50cmFuc2xhdGUoLXRoaXMuY2FtZXJhLngsIC10aGlzLmNhbWVyYS55KTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAodGhpcy5zY2VuZXMuY3VycmVudC5wcmVsb2FkZWQpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5zY2VuZXMuY3VycmVudC5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuYmVmb3JlUmVuZGVyKGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgY2hpbGQucmVuZGVyKGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuYWZ0ZXJSZW5kZXIoY29udGV4dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnRleHQucmVzdG9yZSgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBnZXQgZnBzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mcHM7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IFZlY3RvcjIgZnJvbSAnLi9WZWN0b3IyJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjdGFuZ2xlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih4ID0gMCwgeSA9IDAsIHdpZHRoID0gMCwgaGVpZ2h0ID0gMCkge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgaW50ZXJzZWN0cyhyZWN0KSB7XHJcbiAgICAgICAgcmV0dXJuICEodGhpcy54ICsgdGhpcy53aWR0aCA8IHJlY3QueCB8fCB0aGlzLnkgKyB0aGlzLmhlaWdodCA8IHJlY3QueSB8fCByZWN0LnggKyByZWN0LndpZHRoIDwgdGhpcy54IHx8IHJlY3QueSArIHJlY3QuaGVpZ2h0IDwgdGhpcy55KTtcclxuICAgIH1cclxuXHJcbiAgICBpbnRlcnNlY3Rpb24ocmVjdCkge1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaW50ZXJzZWN0cyhyZWN0KSlcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIGxldCB4ID0gTWF0aC5tYXgodGhpcy54LCByZWN0LngpO1xyXG4gICAgICAgIGxldCB5ID0gTWF0aC5tYXgodGhpcy55LCByZWN0LnkpO1xyXG4gICAgICAgIGxldCB3aWR0aCA9IE1hdGgubWluKHRoaXMueCArIHRoaXMud2lkdGgsIHJlY3QueCArIHJlY3Qud2lkdGgpIC0geDtcclxuICAgICAgICBsZXQgaGVpZ2h0ID0gTWF0aC5taW4odGhpcy55ICsgdGhpcy5oZWlnaHQsIHJlY3QueSArIHJlY3QuaGVpZ2h0KSAtIHk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlKHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgIH1cclxuICAgICAgICBcclxuICAgIGNvbnRhaW5zKHZlYzIpIHtcclxuICAgICAgICByZXR1cm4gISh0aGlzLnggPiB2ZWMyLnggfHwgdGhpcy54ICsgdGhpcy53aWR0aCA8IHZlYzIueCB8fCB0aGlzLnkgPiB2ZWMyLnkgfHwgdGhpcy55ICsgdGhpcy5oZWlnaHQgPCB2ZWMyLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsb25lKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlKHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNlbnRlcigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54ICsgdGhpcy53aWR0aCAvIDIsIHRoaXMueSArIHRoaXMuaGVpZ2h0IC8gMik7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IFZlY3RvcjIgZnJvbSAnLi4vZ2VvbS9WZWN0b3IyJ1xyXG5pbXBvcnQgUmVjdGFuZ2xlIGZyb20gJy4uL2dlb20vUmVjdGFuZ2xlJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZU9iamVjdCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVmVjdG9yMigpO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24gPSAwO1xyXG4gICAgICAgIHRoaXMucm90YXRpb25DZW50ZXIgPSBuZXcgVmVjdG9yMigpO1xyXG4gICAgICAgIHRoaXMuc2NhbGVDZW50ZXIgPSBuZXcgVmVjdG9yMigpO1xyXG4gICAgICAgIHRoaXMuYWxwaGEgPSAxO1xyXG4gICAgICAgIHRoaXMudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBudWxsOyBcclxuICAgICAgICB0aGlzLmlnbm9yZUdsb2JhbFRyYW5zZm9ybSA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLl93aWR0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gMDtcclxuICAgICAgICB0aGlzLl9zY2FsZSA9IG5ldyBWZWN0b3IyKDEsIDEpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBiZWZvcmVSZW5kZXIoY29udGV4dCkge1xyXG5cclxuICAgICAgICAvLyDsoITsl60gdHJhbnNmb3Jt7J2EIOustOyLnO2VoCDqsr3smrAgLSBVSeuTseyXkCDsgqzsmqlcclxuICAgICAgICBpZiAodGhpcy5pZ25vcmVHbG9iYWxNYXRyaXgpIHtcclxuICAgICAgICAgICAgdGhpcy5fY3VycmVudEdsb2JhbFRyYW5zZm9ybSA9IGNvbnRleHQuY3VycmVudFRyYW5zZm9ybTtcclxuICAgICAgICAgICAgY29udGV4dC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMCwgMCk7IC8vIGNvbnRleHTsnZggdHJhbnNmb3Jt7J2EIGlkZW50aXR5IG1hdHJpeOuhnCDshKTsoJVcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnRleHQuc2F2ZSgpO1xyXG5cclxuICAgICAgICAvLyBwb3NpdGlvblxyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55KTtcclxuXHJcbiAgICAgICAgLy8gcm90YXRpb25cclxuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZSh0aGlzLnJvdGF0aW9uQ2VudGVyLngsIHRoaXMucm90YXRpb25DZW50ZXIueSk7XHJcbiAgICAgICAgY29udGV4dC5yb3RhdGUodGhpcy5yb3RhdGlvbik7XHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoLXRoaXMucm90YXRpb25DZW50ZXIueCwgLXRoaXMucm90YXRpb25DZW50ZXIueSk7XHJcblxyXG4gICAgICAgIC8vIHNjYWxlXHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUodGhpcy5zY2FsZUNlbnRlci54LCB0aGlzLnNjYWxlQ2VudGVyLnkpO1xyXG4gICAgICAgIGNvbnRleHQuc2NhbGUodGhpcy5zY2FsZVgsIHRoaXMuc2NhbGVZKTtcclxuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZSgtdGhpcy5zY2FsZUNlbnRlci54LCAtdGhpcy5zY2FsZUNlbnRlci55KTtcclxuXHJcbiAgICAgICAgLy8gYWxwaGFcclxuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhICo9IHRoaXMuYWxwaGE7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcihjb250ZXh0KSB7XHJcbiAgICAgICAgLy8g7ZWY7JyE7YG0656Y7Iqk7JeQ7IScIOq1rO2YhFxyXG4gICAgfVxyXG5cclxuICAgIGFmdGVyUmVuZGVyKGNvbnRleHQpIHtcclxuICAgICAgICBjb250ZXh0LnJlc3RvcmUoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaWdub3JlR2xvYmFsTWF0cml4KVxyXG4gICAgICAgICAgICBjb250ZXh0LnNldFRyYW5zZm9ybSh0aGlzLl9jdXJyZW50R2xvYmFsVHJhbnNmb3JtKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZHQpIHtcclxuICAgICAgICAvLyDtlZjsnITtgbTrnpjsiqTsl5DshJwg6rWs7ZiEXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGludGVyc2VjdHMoZ2FtZU9iamVjdCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmJvdW5kcy5pbnRlcnNlY3RzKGdhbWVPYmplY3QpOyAvLyDtirjrpq06IEdhbWVPYmplY3TsmYAgUmVjdGFuZ2xlIOuqqOuRkCB4LCB5LCB3aWR0aCwgaGVpZ2h06rCAIOyeiOuLpOuKlCDqsoPsnYQg7J207JqpXHJcbiAgICB9XHJcblxyXG4gICAgaW50ZXJzZWN0aW9uKGdhbWVPYmplY3QpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ib3VuZHMuaW50ZXJzZWN0aW9uKGdhbWVPYmplY3QpOyAvLyDtirjrpq1cclxuICAgIH1cclxuXHJcbiAgICBjb250YWlucyh2ZWMyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYm91bmRzLmNvbnRhaW5zKHZlYzIpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBib3VuZHMoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBSZWN0YW5nbGUodGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgeCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi54O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB4KHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54ID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb24ueTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgeSh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24ueSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB3aWR0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHdpZHRoKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fd2lkdGggPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaGVpZ2h0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGhlaWdodCh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBzY2FsZVgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NjYWxlLng7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHNjYWxlWCh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX3NjYWxlLnggPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgc2NhbGVZKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zY2FsZS55O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBzY2FsZVkodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9zY2FsZS55ID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IEdhbWVPYmplY3QgZnJvbSAnLi9HYW1lT2JqZWN0J1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGFpbmVyIGV4dGVuZHMgR2FtZU9iamVjdCB7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcihjb250ZXh0KSB7XHJcbiAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICBjaGlsZC5iZWZvcmVSZW5kZXIoY29udGV4dCk7XHJcbiAgICAgICAgICAgIGNoaWxkLnJlbmRlcihjb250ZXh0KTtcclxuICAgICAgICAgICAgY2hpbGQuYWZ0ZXJSZW5kZXIoY29udGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShkdCkge1xyXG4gICAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pXHJcbiAgICAgICAgICAgIGNoaWxkLnVwZGF0ZShkdCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQ2hpbGQoY2hpbGQpIHtcclxuICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlQ2hpbGQoY2hpbGQpIHtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZSh0aGlzLmNoaWxkcmVuLmluZGV4T2YoY2hpbGQpLCAxKTtcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgQ29udGFpbmVyIGZyb20gJy4vQ29udGFpbmVyJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NlbmUgZXh0ZW5kcyBDb250YWluZXJ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnVpID0gbmV3IENvbnRhaW5lcigpO1xyXG4gICAgICAgIHRoaXMudWkuaWdub3JlR2xvYmFsVHJhbnNmb3JtID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnByZWxvYWRlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByZWxvYWQoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShkdCkge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShkdCk7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IENvbnRhaW5lciBmcm9tICcuL0NvbnRhaW5lcidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNwcml0ZSBleHRlbmRzIENvbnRhaW5lciB7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKGltYWdlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy50ZXh0dXJlID0gaW1hZ2U7XHJcbiAgICAgICAgdGhpcy5fd2lkdGggPSBpbWFnZS53aWR0aDtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSBpbWFnZS5oZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKGNvbnRleHQpIHtcclxuICAgICAgICBzdXBlci5yZW5kZXIoY29udGV4dCk7XHJcbiAgICAgICAgY29udGV4dC5kcmF3SW1hZ2UodGhpcy50ZXh0dXJlLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgd2lkdGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB3aWR0aCh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fc2NhbGUueCA9IHZhbHVlIC8gdGhpcy50ZXh0dXJlLndpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBoZWlnaHQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgaGVpZ2h0KHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fc2NhbGUueSA9IHZhbHVlIC8gdGhpcy50ZXh0dXJlLmhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgc2NhbGVYKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zY2FsZS54O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBzY2FsZVgodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl93aWR0aCAqPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9zY2FsZS54ID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHNjYWxlWSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2NhbGUueTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc2NhbGVZKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5faGVpZ2h0ICo9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3NjYWxlLnkgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbn0iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQWUsTUFBTSxLQUFLLENBQUM7O0lBRXZCLFdBQVcsQ0FBQyxJQUFJLEVBQUU7O1FBRWQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7O1FBRWpCLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDOztRQUVyQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7O0tBRW5COztJQUVELFNBQVMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFOztRQUVmLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDO1lBQzdCLE9BQU8sSUFB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QUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDdkIsUUFBUSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDakIsUUFBUSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDcEIsUUFBUSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDdEIsUUFBUSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDcEIsUUFBUSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDdEIsUUFBUSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDeEIsUUFBUSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDeEIsUUFBUSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDckIsUUFBUSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDcEIsUUFBUSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDdEIsUUFBUSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDeEIsUUFBUSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDbEIsUUFBUSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDbkIsUUFBUSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDbkIsUUFBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDakIsUUFBUSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDcEIsUUFBUSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDbkIsUUFBUSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDckIsUUFBUSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDckIsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7QUFDeEIsUUFBUSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7QUFDeEIsUUFBUSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7QUFDeEIsUUFBUSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7QUFDeEIsUUFBUSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7QUFDeEIsUUFBUSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7QUFDeEIsUUFBUSxDQUFDLGVBQWUsR0FBRyxHQUFHLENBQUM7QUFDL0IsUUFBUSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7QUFDMUIsUUFBUSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUM7QUFDNUIsUUFBUSxDQUFDLGVBQWUsR0FBRyxHQUFHLENBQUM7QUFDL0IsUUFBUSxDQUFDLGNBQWMsR0FBRyxHQUFHLENBQUM7QUFDOUIsUUFBUSxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUM7QUFDN0IsUUFBUSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDbEIsUUFBUSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDbEIsUUFBUSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDbEIsUUFBUSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDbEIsUUFBUSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDbEIsUUFBUSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDbEIsUUFBUSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDbEIsUUFBUSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDbEIsUUFBUSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDbEIsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDbkIsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDbkIsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDbkIsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDbkIsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDbkIsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDbkIsUUFBUSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7QUFDekIsUUFBUSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDckIsUUFBUSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDckIsUUFBUSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDckIsUUFBUSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7QUFDdEIsUUFBUSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDckIsUUFBUSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7QUFDekIsUUFBUSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7QUFDM0IsUUFBUSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7QUFDekIsUUFBUSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUM7QUFDNUIsUUFBUSxDQUFDLEtBQUssR0FBRyxHQUFHOztBQ25JTCxNQUFNLE9BQU8sQ0FBQzs7SUFFekIsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUN0QixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2Q7O0lBRUQsR0FBRyxDQUFDLElBQUksRUFBRTtRQUNOLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNoQixJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDaEIsT0FBTyxJQUFJLENBQUM7S0FDZjs7SUFFRCxRQUFRLENBQUMsSUFBSSxFQUFFO1FBQ1gsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNqQixPQUFPLElBQUksQ0FBQztLQUNmOztJQUVELFFBQVEsQ0FBQyxJQUFJLEVBQUU7UUFDWCxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2pCLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7O0lBRUQsTUFBTSxDQUFDLElBQUksRUFBRTtRQUNULElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDakIsT0FBTyxJQUFJLENBQUM7S0FDZjs7SUFFRCxLQUFLLENBQUMsSUFBSSxFQUFFO1FBQ1IsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN2RDs7SUFFRCxRQUFRLENBQUMsSUFBSSxFQUFFO1FBQ1gsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDakY7O0lBRUQsVUFBVSxDQUFDLElBQUksRUFBRTtRQUNiLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDdEU7O0lBRUQsS0FBSyxHQUFHO1FBQ0osT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN0Qzs7OztBQzNDVSxNQUFNLEtBQUssQ0FBQzs7SUFFdkIsV0FBVyxDQUFDLElBQUksRUFBRTs7UUFFZCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7O1FBRTlCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQzs7UUFFL0IsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ25FLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOztLQUUxRTs7SUFFRCxjQUFjLENBQUMsS0FBSyxFQUFFO1FBQ2xCLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQztLQUM1Qzs7SUFFRCxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUU7UUFDcEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDO0tBQzNDOztJQUVELGdCQUFnQixDQUFDLEtBQUssRUFBRTtRQUNwQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQ3BELElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUM3QyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7S0FDL0M7O0lBRUQsT0FBTyxDQUFDLE1BQU0sRUFBRTtRQUNaLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNyQzs7SUFFRCxJQUFJLENBQUMsR0FBRztRQUNKLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7S0FDM0I7O0lBRUQsSUFBSSxDQUFDLEdBQUc7UUFDSixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0tBQzNCOztJQUVELElBQUksUUFBUSxHQUFHO1FBQ1gsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ2pDOztDQUVKOzs7QUFHRCxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUNmLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQzs7QUMvQ0EsTUFBTSxJQUFJLENBQUM7O0lBRXRCLFdBQVcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxHQUFHLEdBQUcsRUFBRSxNQUFNLEdBQUcsR0FBRyxFQUFFLGVBQWUsR0FBRyxNQUFNLEVBQUU7O1FBRXZFLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDOztRQUV2QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUNuQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQzs7UUFFcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQzs7OztRQUk3QixJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQzs7UUFFWixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQzs7UUFFcEIsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDOztLQUU3RTs7SUFFRCxJQUFJLEdBQUc7O1FBRUgsUUFBUSxDQUFDLG1CQUFtQixDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7O1FBRWxFLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7O1FBRXJELElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ2hELE9BQU87U0FDVjs7UUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQy9CLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDakMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7UUFFNUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDaEMsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7O1FBRWYsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7S0FFbkU7O0lBRUQsR0FBRyxHQUFHOztRQUVGLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUM7O1FBRTNDLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxhQUFhLEdBQUcsR0FBRyxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ2hDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDckQ7O1FBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDckIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7O1FBRTFCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7O0tBRW5FOztJQUVELE1BQU0sQ0FBQyxFQUFFLEVBQUU7Ozs7UUFJUCxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVM7WUFDcEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDOztLQUV0Qzs7SUFFRCxNQUFNLENBQUMsT0FBTyxFQUFFOztRQUVaLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOztRQUU5QixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7O1FBRWYsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO1FBQ3pDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzs7Ozs7OztRQVE5RCxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRTtZQUMvQixLQUFLLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRTtnQkFDNUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDNUIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDdEIsS0FBSyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUM5QjtTQUNKOztRQUVELE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7S0FFckI7O0lBRUQsSUFBSSxHQUFHLEdBQUc7UUFDTixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7S0FDcEI7Ozs7QUMvR1UsTUFBTSxTQUFTLENBQUM7O0lBRTNCLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQzdDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztLQUN4Qjs7SUFFRCxVQUFVLENBQUMsSUFBSSxFQUFFO1FBQ2IsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDNUk7O0lBRUQsWUFBWSxDQUFDLElBQUksRUFBRTs7UUFFZixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7WUFDdEIsT0FBTyxJQUFJLENBQUM7O1FBRWhCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkUsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztRQUV0RSxPQUFPLElBQUksU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDOztLQUU3Qzs7SUFFRCxRQUFRLENBQUMsSUFBSSxFQUFFO1FBQ1gsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNqSDs7SUFFRCxLQUFLLEdBQUc7UUFDSixPQUFPLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNqRTs7SUFFRCxJQUFJLE1BQU0sR0FBRztRQUNULE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDekU7Ozs7QUNwQ1UsTUFBTSxVQUFVLENBQUM7O0lBRTVCLFdBQVcsR0FBRzs7UUFFVixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDbEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUNqQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUM7O1FBRW5DLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztLQUVuQzs7SUFFRCxZQUFZLENBQUMsT0FBTyxFQUFFOzs7UUFHbEIsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7WUFDekIsSUFBSSxDQUFDLHVCQUF1QixHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztZQUN4RCxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7O1lBRXZDLE9BQU87U0FDVjs7UUFFRCxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7OztRQUdmLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O1FBR3BELE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM5QixPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7UUFHbEUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFELE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O1FBRzVELE9BQU8sQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQzs7S0FFckM7O0lBRUQsTUFBTSxDQUFDLE9BQU8sRUFBRTs7S0FFZjs7SUFFRCxXQUFXLENBQUMsT0FBTyxFQUFFO1FBQ2pCLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7UUFFbEIsSUFBSSxJQUFJLENBQUMsa0JBQWtCO1lBQ3ZCLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7S0FDMUQ7O0lBRUQsTUFBTSxDQUFDLEVBQUUsRUFBRTs7S0FFVjs7SUFFRCxVQUFVLENBQUMsVUFBVSxFQUFFO1FBQ25CLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDN0M7O0lBRUQsWUFBWSxDQUFDLFVBQVUsRUFBRTtRQUNyQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQy9DOztJQUVELFFBQVEsQ0FBQyxJQUFJLEVBQUU7UUFDWCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3JDOztJQUVELElBQUksTUFBTSxHQUFHO1FBQ1QsT0FBTyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDakU7O0lBRUQsSUFBSSxDQUFDLEdBQUc7UUFDSixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0tBQzFCOztJQUVELElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRTtRQUNULElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztLQUMzQjs7SUFFRCxJQUFJLENBQUMsR0FBRztRQUNKLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7S0FDMUI7O0lBRUQsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFO1FBQ1QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO0tBQzNCOztJQUVELElBQUksS0FBSyxHQUFHO1FBQ1IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0tBQ3RCOztJQUVELElBQUksS0FBSyxDQUFDLEtBQUssRUFBRTtRQUNiLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0tBQ3ZCOztJQUVELElBQUksTUFBTSxHQUFHO1FBQ1QsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0tBQ3ZCOztJQUVELElBQUksTUFBTSxDQUFDLEtBQUssRUFBRTtRQUNkLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0tBQ3hCOztJQUVELElBQUksTUFBTSxHQUFHO1FBQ1QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUN4Qjs7SUFFRCxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUU7UUFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7S0FDekI7O0lBRUQsSUFBSSxNQUFNLEdBQUc7UUFDVCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0tBQ3hCOztJQUVELElBQUksTUFBTSxDQUFDLEtBQUssRUFBRTtRQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztLQUN6Qjs7OztBQy9IVSxNQUFNLFNBQVMsU0FBUyxVQUFVLENBQUM7O0lBRTlDLFdBQVcsR0FBRztRQUNWLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7S0FDdEI7O0lBRUQsTUFBTSxDQUFDLE9BQU8sRUFBRTtRQUNaLEtBQUssSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUM3QixLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzVCLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdEIsS0FBSyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM5QjtLQUNKOztJQUVELE1BQU0sQ0FBQyxFQUFFLEVBQUU7UUFDUCxLQUFLLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxRQUFRO1lBQzNCLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDeEI7O0lBRUQsUUFBUSxDQUFDLEtBQUssRUFBRTtRQUNaLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzdCOztJQUVELFdBQVcsQ0FBQyxLQUFLLEVBQUU7UUFDZixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUN6RDs7OztBQzNCVSxNQUFNLEtBQUssU0FBUyxTQUFTOztJQUV4QyxXQUFXLEdBQUc7UUFDVixLQUFLLEVBQUUsQ0FBQzs7UUFFUixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUM7UUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7S0FDMUI7O0lBRUQsT0FBTyxHQUFHOztLQUVUOztJQUVELE1BQU0sQ0FBQyxFQUFFLEVBQUU7UUFDUCxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ3BCOzs7O0FDaEJVLE1BQU0sTUFBTSxTQUFTLFNBQVMsQ0FBQzs7SUFFMUMsV0FBVyxDQUFDLEtBQUssRUFBRTtRQUNmLEtBQUssRUFBRSxDQUFDOztRQUVSLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7S0FDL0I7O0lBRUQsTUFBTSxDQUFDLE9BQU8sRUFBRTtRQUNaLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUN6Qzs7SUFFRCxJQUFJLEtBQUssR0FBRztRQUNSLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztLQUN0Qjs7SUFFRCxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUU7UUFDYixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7S0FDOUM7O0lBRUQsSUFBSSxNQUFNLEdBQUc7UUFDVCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7S0FDdkI7O0lBRUQsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO1FBQ2QsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDckIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0tBQy9DOztJQUVELElBQUksTUFBTSxHQUFHO1FBQ1QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUN4Qjs7SUFFRCxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUU7UUFDZCxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQztRQUNyQixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7S0FDekI7O0lBRUQsSUFBSSxNQUFNLEdBQUc7UUFDVCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0tBQ3hCOztJQUVELElBQUksTUFBTSxDQUFDLEtBQUssRUFBRTtRQUNkLElBQUksQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztLQUN6Qjs7LDs7Ozs7Ozs7OzssOzsifQ==
