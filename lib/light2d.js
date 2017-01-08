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

class Vector2 {

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
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

    multiplyVector(vec2) {
        this.x *= vec2.x;
        this.y *= vec2.y;
        return this;
    }

    multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    divideVector(vec2) {
        this.x /= vec2.x;
        this.y /= vec2.y;
        return this;
    }

    divideScalar(scalar) {
        this.x /= scalar;
        this.y /= scalar;
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

class Camera extends GameObject {

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
        this.keyboard = null;
        this.mouse = null;
        this.camera = null;
        //this.physics = new Physics();

        this.dt = 0;

        this.inited = false;

        document.addEventListener('DOMContentLoaded', this.init.bind(this), true);

    }

    init() {

        document.removeEventListener('DOMContentLoaded', this.init, true);

        this.canvas = document.getElementById(this.canvasId);

        this.keyboard = new Keyboard(this);
        this.mouse = new Mouse(this);
        this.camera = new Camera(this);

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

        this.camera.update(dt);
        // this.physics.update(dt);

        if (this.scenes.current && this.scenes.current.preloaded)
            this.scenes.current.update(dt);

    }

    render(context) {

        let targetX = this.camera.width / 2;
        let targetY = this.camera.height / 2;

        context.save();

        context.fillStyle = this.backgroundColor;
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        context.translate(targetX, targetY);
        context.scale(this.camera.scaleX, this.camera.scaleY);
        context.translate(-targetX, -targetY);

        context.translate(-this.camera.x, -this.camera.y);
        
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

class Animation extends Sprite {
    
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

exports.Game = Game;
exports.Camera = Camera;
exports.Keyboard = Keyboard;
exports.Mouse = Mouse;
exports.Vector2 = Vector2;
exports.Rectangle = Rectangle;
exports.Container = Container;
exports.GameObject = GameObject;
exports.Scene = Scene;
exports.Sprite = Sprite;
exports.Animation = Animation;

}((this.light2d = this.light2d || {})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlnaHQyZC5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2NvcmUvQXNzZXQuanMiLCIuLi9zcmMvY29yZS9TY2VuZU1hbmFnZXIuanMiLCIuLi9zcmMvZ2VvbS9WZWN0b3IyLmpzIiwiLi4vc3JjL2dlb20vUmVjdGFuZ2xlLmpzIiwiLi4vc3JjL2dhbWVvYmplY3RzL0dhbWVPYmplY3QuanMiLCIuLi9zcmMvY29yZS9DYW1lcmEuanMiLCIuLi9zcmMvaW5wdXQvS2V5Ym9hcmQuanMiLCIuLi9zcmMvaW5wdXQvTW91c2UuanMiLCIuLi9zcmMvY29yZS9HYW1lLmpzIiwiLi4vc3JjL2dhbWVvYmplY3RzL0NvbnRhaW5lci5qcyIsIi4uL3NyYy9nYW1lb2JqZWN0cy9TY2VuZS5qcyIsIi4uL3NyYy9nYW1lb2JqZWN0cy9TcHJpdGUuanMiLCIuLi9zcmMvZ2FtZW9iamVjdHMvQW5pbWF0aW9uLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIEFzc2V0IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lKSB7XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5sb2FkZWRGaWxlcyA9IDA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy50b0xvYWQgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IHt9O1xyXG4gICAgICAgIHRoaXMuYXVkaW8gPSB7fTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEltYWdlKGlkLCB1cmwpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UuaGFzT3duUHJvcGVydHkoaWQpKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnRvTG9hZC5zZXQoaWQsIG5ldyBGaWxlKCdpbWFnZScsIGlkLCB1cmwpKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEF1ZGlvKGlkLCB1cmwpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYXVkaW8uaGFzT3duUHJvcGVydHkoaWQpKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy50b0xvYWQuc2V0KGlkLCBuZXcgRmlsZSgnYXVkaW8nLCBpZCwgdXJsKSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8vIHByaXZhdGVcclxuICAgIHN0YXJ0TG9hZCgpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgZmlsZSBvZiB0aGlzLnRvTG9hZC52YWx1ZXMoKSkge1xyXG5cclxuICAgICAgICAgICAgc3dpdGNoIChmaWxlLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAnaW1hZ2UnOlxyXG4gICAgICAgICAgICAgICAgbGV0IGltZyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgICAgICAgICAgaW1nLnNyYyA9IGZpbGUudXJsO1xyXG4gICAgICAgICAgICAgICAgaW1nLmFzc2V0SWQgPSBmaWxlLmlkO1xyXG4gICAgICAgICAgICAgICAgaW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBsb2FkSGFubGRlci5iaW5kKHRoaXMpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAnYXVkaW8nOlxyXG4gICAgICAgICAgICAgICAgbGV0IGF1ZCA9IG5ldyBBdWRpbyhmaWxlLnVybCk7XHJcbiAgICAgICAgICAgICAgICBhdWQuYXNzZXRJZCA9IGZpbGUuaWQ7XHJcbiAgICAgICAgICAgICAgICBhdWQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGxvYWRIYW5sZGVyLmJpbmQodGhpcykpO1xyXG4gICAgICAgICAgICAgICAgYXVkLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdsb2FkJykpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHRvdGFsRmlsZXMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudG9Mb2FkLnNpemU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBwcm9ncmVzc0FzUGVyY2VudCgpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMubG9hZGluZ0ZpbGVzID09PSAwKSA/IDAgOiB0aGlzLmxvYWRlZEZpbGVzIC8gdGhpcy50b3RhbEZpbGVzICogMTAwO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuXHJcbmNvbnN0IGxvYWRIYW5sZGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcbiAgICBldmVudC50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcsIGxvYWRIYW5sZGVyKTtcclxuICAgIFxyXG4gICAgY29uc3QgZmlsZSA9IHRoaXMudG9Mb2FkLmdldChldmVudC50YXJnZXQuYXNzZXRJZCk7XHJcbiAgICBcclxuICAgIHRoaXNbZmlsZS50eXBlXVtmaWxlLmlkXSA9IGV2ZW50LnRhcmdldDtcclxuICAgIHRoaXMubG9hZGVkRmlsZXMrKztcclxuICAgIFxyXG4gICAgaWYodGhpcy5sb2FkZWRGaWxlcyA9PT0gdGhpcy50b3RhbEZpbGVzKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3ByZWxvYWRlZCcpKTtcclxuICAgICAgICB0aGlzLnRvTG9hZC5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMubG9hZGVkRmlsZXMgPSAwO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuXHJcbmNsYXNzIEZpbGUge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHR5cGUsIGlkLCB1cmwpIHtcclxuXHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XHJcblxyXG4gICAgfVxyXG5cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjZW5lTWFuYWdlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZSkge1xyXG5cclxuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRTY2VuZSA9IG51bGw7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZShzY2VuZSkge1xyXG5cclxuICAgICAgICB0aGlzLl9jdXJyZW50U2NlbmUgPSBzY2VuZTtcclxuICAgICAgICB0aGlzLl9jdXJyZW50U2NlbmUucHJlbG9hZCgpO1xyXG5cclxuICAgICAgICB0aGlzLmdhbWUuYXNzZXQuc3RhcnRMb2FkKCk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3ByZWxvYWRlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fY3VycmVudFNjZW5lLnByZWxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRTY2VuZS5pbml0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKCF0aGlzLmdhbWUuaW5pdGVkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8vdGhpcy5nYW1lLmNhbWVyYS5yZXNldCgpO1xyXG4gICAgICAgIC8vdGhpcy5nYW1lLnBoeXNpY3MucmVzZXQoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGN1cnJlbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRTY2VuZTtcclxuICAgIH1cclxuXHJcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBWZWN0b3IyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih4ID0gMCwgeSA9IDApIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0KHgsIHkpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkKHZlYzIpIHtcclxuICAgICAgICB0aGlzLnggPSB2ZWMyLng7XHJcbiAgICAgICAgdGhpcy55ID0gdmVjMi55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHN1YnRyYWN0KHZlYzIpIHtcclxuICAgICAgICB0aGlzLnggLT0gdmVjMi54O1xyXG4gICAgICAgIHRoaXMueSAtPSB2ZWMyLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgbXVsdGlwbHlWZWN0b3IodmVjMikge1xyXG4gICAgICAgIHRoaXMueCAqPSB2ZWMyLng7XHJcbiAgICAgICAgdGhpcy55ICo9IHZlYzIueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBtdWx0aXBseVNjYWxhcihzY2FsYXIpIHtcclxuICAgICAgICB0aGlzLnggKj0gc2NhbGFyO1xyXG4gICAgICAgIHRoaXMueSAqPSBzY2FsYXI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgZGl2aWRlVmVjdG9yKHZlYzIpIHtcclxuICAgICAgICB0aGlzLnggLz0gdmVjMi54O1xyXG4gICAgICAgIHRoaXMueSAvPSB2ZWMyLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgZGl2aWRlU2NhbGFyKHNjYWxhcikge1xyXG4gICAgICAgIHRoaXMueCAvPSBzY2FsYXI7XHJcbiAgICAgICAgdGhpcy55IC89IHNjYWxhcjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBhbmdsZSh2ZWMyKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbjIodmVjMi55IC0gdGhpcy55LCB2ZWMyLnggLSB0aGlzLngpO1xyXG4gICAgfVxyXG5cclxuICAgIGRpc3RhbmNlKHZlYzIpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHZlYzIueCAtIHRoaXMueCwgMikgKyBNYXRoLnBvdyh2ZWMyLnkgLSB0aGlzLnksIDIpKTtcclxuICAgIH1cclxuXHJcbiAgICBkaXN0YW5jZVNxKHZlYzIpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5wb3codmVjMi54IC0gdGhpcy54LCAyKSArIE1hdGgucG93KHZlYzIueSAtIHRoaXMueSwgMik7XHJcbiAgICB9XHJcblxyXG4gICAgY2xvbmUoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMueCwgdGhpcy55KTtcclxuICAgIH1cclxuICAgIFxyXG59IiwiaW1wb3J0IFZlY3RvcjIgZnJvbSAnLi9WZWN0b3IyJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjdGFuZ2xlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih4ID0gMCwgeSA9IDAsIHdpZHRoID0gMCwgaGVpZ2h0ID0gMCkge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgaW50ZXJzZWN0cyhyZWN0KSB7XHJcbiAgICAgICAgcmV0dXJuICEodGhpcy54ICsgdGhpcy53aWR0aCA8IHJlY3QueCB8fCB0aGlzLnkgKyB0aGlzLmhlaWdodCA8IHJlY3QueSB8fCByZWN0LnggKyByZWN0LndpZHRoIDwgdGhpcy54IHx8IHJlY3QueSArIHJlY3QuaGVpZ2h0IDwgdGhpcy55KTtcclxuICAgIH1cclxuXHJcbiAgICBpbnRlcnNlY3Rpb24ocmVjdCkge1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaW50ZXJzZWN0cyhyZWN0KSlcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIGxldCB4ID0gTWF0aC5tYXgodGhpcy54LCByZWN0LngpO1xyXG4gICAgICAgIGxldCB5ID0gTWF0aC5tYXgodGhpcy55LCByZWN0LnkpO1xyXG4gICAgICAgIGxldCB3aWR0aCA9IE1hdGgubWluKHRoaXMueCArIHRoaXMud2lkdGgsIHJlY3QueCArIHJlY3Qud2lkdGgpIC0geDtcclxuICAgICAgICBsZXQgaGVpZ2h0ID0gTWF0aC5taW4odGhpcy55ICsgdGhpcy5oZWlnaHQsIHJlY3QueSArIHJlY3QuaGVpZ2h0KSAtIHk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlKHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgIH1cclxuICAgICAgICBcclxuICAgIGNvbnRhaW5zKHZlYzIpIHtcclxuICAgICAgICByZXR1cm4gISh0aGlzLnggPiB2ZWMyLnggfHwgdGhpcy54ICsgdGhpcy53aWR0aCA8IHZlYzIueCB8fCB0aGlzLnkgPiB2ZWMyLnkgfHwgdGhpcy55ICsgdGhpcy5oZWlnaHQgPCB2ZWMyLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsb25lKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlKHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNlbnRlcigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54ICsgdGhpcy53aWR0aCAvIDIsIHRoaXMueSArIHRoaXMuaGVpZ2h0IC8gMik7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IFZlY3RvcjIgZnJvbSAnLi4vZ2VvbS9WZWN0b3IyJ1xyXG5pbXBvcnQgUmVjdGFuZ2xlIGZyb20gJy4uL2dlb20vUmVjdGFuZ2xlJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZU9iamVjdCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVmVjdG9yMigpO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24gPSAwO1xyXG4gICAgICAgIHRoaXMucm90YXRpb25DZW50ZXIgPSBuZXcgVmVjdG9yMigpO1xyXG4gICAgICAgIHRoaXMuc2NhbGVDZW50ZXIgPSBuZXcgVmVjdG9yMigpO1xyXG4gICAgICAgIHRoaXMuYWxwaGEgPSAxO1xyXG4gICAgICAgIHRoaXMudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBudWxsOyBcclxuICAgICAgICB0aGlzLmlnbm9yZUdsb2JhbFRyYW5zZm9ybSA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLl93aWR0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gMDtcclxuICAgICAgICB0aGlzLl9zY2FsZSA9IG5ldyBWZWN0b3IyKDEsIDEpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBiZWZvcmVSZW5kZXIoY29udGV4dCkge1xyXG5cclxuICAgICAgICAvLyDsoITsl60gdHJhbnNmb3Jt7J2EIOustOyLnO2VoCDqsr3smrAgLSBVSeuTseyXkCDsgqzsmqlcclxuICAgICAgICBpZiAodGhpcy5pZ25vcmVHbG9iYWxNYXRyaXgpIHtcclxuICAgICAgICAgICAgdGhpcy5fY3VycmVudEdsb2JhbFRyYW5zZm9ybSA9IGNvbnRleHQuY3VycmVudFRyYW5zZm9ybTtcclxuICAgICAgICAgICAgY29udGV4dC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMCwgMCk7IC8vIGNvbnRleHTsnZggdHJhbnNmb3Jt7J2EIGlkZW50aXR5IG1hdHJpeOuhnCDshKTsoJVcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnRleHQuc2F2ZSgpO1xyXG5cclxuICAgICAgICAvLyBwb3NpdGlvblxyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55KTtcclxuXHJcbiAgICAgICAgLy8gcm90YXRpb25cclxuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZSh0aGlzLnJvdGF0aW9uQ2VudGVyLngsIHRoaXMucm90YXRpb25DZW50ZXIueSk7XHJcbiAgICAgICAgY29udGV4dC5yb3RhdGUodGhpcy5yb3RhdGlvbik7XHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoLXRoaXMucm90YXRpb25DZW50ZXIueCwgLXRoaXMucm90YXRpb25DZW50ZXIueSk7XHJcblxyXG4gICAgICAgIC8vIHNjYWxlXHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUodGhpcy5zY2FsZUNlbnRlci54LCB0aGlzLnNjYWxlQ2VudGVyLnkpO1xyXG4gICAgICAgIGNvbnRleHQuc2NhbGUodGhpcy5zY2FsZVgsIHRoaXMuc2NhbGVZKTtcclxuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZSgtdGhpcy5zY2FsZUNlbnRlci54LCAtdGhpcy5zY2FsZUNlbnRlci55KTtcclxuXHJcbiAgICAgICAgLy8gYWxwaGFcclxuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhICo9IHRoaXMuYWxwaGE7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcihjb250ZXh0KSB7XHJcbiAgICAgICAgLy8g7ZWY7JyE7YG0656Y7Iqk7JeQ7IScIOq1rO2YhFxyXG4gICAgfVxyXG5cclxuICAgIGFmdGVyUmVuZGVyKGNvbnRleHQpIHtcclxuICAgICAgICBjb250ZXh0LnJlc3RvcmUoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaWdub3JlR2xvYmFsTWF0cml4KVxyXG4gICAgICAgICAgICBjb250ZXh0LnNldFRyYW5zZm9ybSh0aGlzLl9jdXJyZW50R2xvYmFsVHJhbnNmb3JtKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZHQpIHtcclxuICAgICAgICAvLyDtlZjsnITtgbTrnpjsiqTsl5DshJwg6rWs7ZiEXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGludGVyc2VjdHMoZ2FtZU9iamVjdCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmJvdW5kcy5pbnRlcnNlY3RzKGdhbWVPYmplY3QpOyAvLyDtirjrpq06IEdhbWVPYmplY3TsmYAgUmVjdGFuZ2xlIOuqqOuRkCB4LCB5LCB3aWR0aCwgaGVpZ2h06rCAIOyeiOuLpOuKlCDqsoPsnYQg7J207JqpXHJcbiAgICB9XHJcblxyXG4gICAgaW50ZXJzZWN0aW9uKGdhbWVPYmplY3QpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ib3VuZHMuaW50ZXJzZWN0aW9uKGdhbWVPYmplY3QpOyAvLyDtirjrpq1cclxuICAgIH1cclxuXHJcbiAgICBjb250YWlucyh2ZWMyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYm91bmRzLmNvbnRhaW5zKHZlYzIpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBib3VuZHMoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBSZWN0YW5nbGUodGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgeCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi54O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB4KHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54ID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb24ueTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgeSh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24ueSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB3aWR0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHdpZHRoKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fd2lkdGggPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaGVpZ2h0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGhlaWdodCh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBzY2FsZVgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NjYWxlLng7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHNjYWxlWCh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX3NjYWxlLnggPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgc2NhbGVZKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zY2FsZS55O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBzY2FsZVkodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9zY2FsZS55ID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IEdhbWVPYmplY3QgZnJvbSAnLi4vZ2FtZW9iamVjdHMvR2FtZU9iamVjdCdcclxuaW1wb3J0IFZlY3RvcjIgZnJvbSAnLi4vZ2VvbS9WZWN0b3IyJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FtZXJhIGV4dGVuZHMgR2FtZU9iamVjdCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcbiAgICAgICAgdGhpcy5tb3ZlQm91bmRzID0gbnVsbDtcclxuICAgICAgICB0aGlzLm9mZnNldCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHRoaXMuZ2FtZS53aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IHRoaXMuZ2FtZS5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy50YXJnZXQgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLnNtb290aEZvbGxvd0ZhY3RvciA9IDE7XHJcbiAgICAgICAgdGhpcy5zbW9vdGhab29tRmFjdG9yID0gMTtcclxuICAgICAgICB0aGlzLl90YXJnZXRTY2FsZSA9IG5ldyBWZWN0b3IyKDEsIDEpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICByZXNldCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbi5zZXQoMCwgMCk7XHJcbiAgICAgICAgdGhpcy51bmZvbGxvdygpO1xyXG4gICAgICAgIHRoaXMuc21vb3RoRm9sbG93RmFjdG9yID0gMTtcclxuICAgICAgICB0aGlzLnNtb290aFpvb21GYWN0b3IgPSAxO1xyXG4gICAgICAgIHRoaXMuX3RhcmdldFNjYWxlLnNldCgxLCAxKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZm9sbG93KGdhbWVPYmplY3QsIG9mZnNldCA9IG5ldyBWZWN0b3IyKCkpIHtcclxuICAgICAgICB0aGlzLnRhcmdldCA9IGdhbWVPYmplY3Q7XHJcbiAgICAgICAgdGhpcy5vZmZzZXQgPSBvZmZzZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgdW5mb2xsb3coKSB7XHJcbiAgICAgICAgdGhpcy50YXJnZXQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMub2Zmc2V0ID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICB6b29tKHNjYWxlWCwgc2NhbGVZKSB7XHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0U2NhbGUueCA9IHNjYWxlWDtcclxuICAgICAgICB0aGlzLl90YXJnZXRTY2FsZS55ID0gc2NhbGVZO1xyXG4gICAgfVxyXG5cclxuICAgIGxvY2FsVG9DYW1lcmEodmVjMikge1xyXG4gICAgICAgIGxldCBwID0gdmVjMi5jbG9uZSgpO1xyXG4gICAgICAgIHAuc3VidHJhY3QodGhpcy5wb3NpdGlvbikubXVsdGlwbHlWZWN0b3IodGhpcy5zY2FsZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBwO1xyXG4gICAgfVxyXG5cclxuICAgIGNhbWVyYVRvTG9jYWwodmVjMikge1xyXG4gICAgICAgIGxldCBwID0gdmVjMi5jbG9uZSgpO1xyXG4gICAgICAgIHAuZGl2aWRlVmVjdG9yKHRoaXMuc2NhbGUpLmFkZCh0aGlzLnBvc2l0aW9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHA7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGR0KSB7XHJcblxyXG4gICAgICAgIHRoaXMuX3NjYWxlLnggKz0gKHRoaXMuX3RhcmdldFNjYWxlLnggLSB0aGlzLl9zY2FsZS54KSAvIHRoaXMuc21vb3RoWm9vbUZhY3RvcjtcclxuICAgICAgICB0aGlzLl9zY2FsZS55ICs9ICh0aGlzLl90YXJnZXRTY2FsZS55IC0gdGhpcy5fc2NhbGUueSkgLyB0aGlzLnNtb290aFpvb21GYWN0b3I7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm1vdmVCb3VuZHMpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCB2YWx1ZTtcclxuXHJcbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy5tb3ZlQm91bmRzLng7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnggPD0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMueCA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMubW92ZUJvdW5kcy53aWR0aCAtIHRoaXMud2lkdGg7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnggPj0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMueCA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMubW92ZUJvdW5kcy55O1xyXG4gICAgICAgICAgICBpZiAodGhpcy55IDw9IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnkgPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLm1vdmVCb3VuZHMuaGVpZ2h0IC0gdGhpcy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnkgPj0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMueSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMueCArPSAodGhpcy50YXJnZXQueCArIHRoaXMudGFyZ2V0LndpZHRoIC8gMiAtIHRoaXMud2lkdGggLyAyIC0gdGhpcy5vZmZzZXQueCAtIHRoaXMueCkgLyB0aGlzLnNtb290aEZvbGxvd0ZhY3RvcjtcclxuICAgICAgICAgICAgdGhpcy55ICs9ICh0aGlzLnRhcmdldC55ICsgdGhpcy50YXJnZXQuaGVpZ2h0IC8gMiAtIHRoaXMuaGVpZ2h0IC8gMiAtIHRoaXMub2Zmc2V0LnkgLSB0aGlzLnkpIC8gdGhpcy5zbW9vdGhGb2xsb3dGYWN0b3I7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIFxyXG59IiwiXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEtleWJvYXJkIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lKSB7XHJcbiAgICBcclxuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xyXG4gICAgICAgIHRoaXMua2V5UHJlc3NlZCA9IFtdO1xyXG4gICAgICAgIHRoaXMua2V5Q2FwdHVyaW5nID0gW107XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5rZXlEb3duSGFuZGxlci5iaW5kKHRoaXMpKTtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLmtleVVwSGFuZGxlci5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGtleURvd25IYW5kbGVyKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmtleUNhcHR1cmluZy5pbmNsdWRlcyhldmVudC5rZXlDb2RlKSlcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5rZXlQcmVzc2VkW2V2ZW50LmtleUNvZGVdID0gdHJ1ZTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAga2V5VXBIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5rZXlQcmVzc2VkW2V2ZW50LmtleUNvZGVdID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJlc3NlZChrZXlDb2RlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYCR7a2V5Q29kZX0gOiAke3RoaXMua2V5UHJlc3NlZFtrZXlDb2RlXX1gKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5rZXlQcmVzc2VkW2tleUNvZGVdO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuXHJcbktleWJvYXJkLkEgPSAnQScuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuQiA9ICdCJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5DID0gJ0MnLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLkQgPSAnRCcuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuRSA9ICdFJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5GID0gJ0YnLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLkcgPSAnRycuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuSCA9ICdIJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5JID0gJ0knLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLkogPSAnSicuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuSyA9ICdLJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5MID0gJ0wnLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLk0gPSAnTScuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuTiA9ICdOJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5PID0gJ08nLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLlAgPSAnUCcuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuUSA9ICdRJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5SID0gJ1InLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLlMgPSAnUycuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuVCA9ICdUJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5VID0gJ1UnLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLlYgPSAnVicuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuVyA9ICdXJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5YID0gJ1gnLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLlkgPSAnWScuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuWiA9ICdaJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5CQUNLU1BBQ0UgPSA4O1xyXG5LZXlib2FyZC5UQVAgPSA5O1xyXG5LZXlib2FyZC5FTlRFUiA9IDEzO1xyXG5LZXlib2FyZC5DT01NQU5EID0gMTU7XHJcbktleWJvYXJkLlNISUZUID0gMTY7XHJcbktleWJvYXJkLkNPTlRST0wgPSAxNztcclxuS2V5Ym9hcmQuQUxURVJOQVRFID0gMTg7XHJcbktleWJvYXJkLkNBUFNfTE9DSyA9IDIwO1xyXG5LZXlib2FyZC5FU0NBUEUgPSAyNztcclxuS2V5Ym9hcmQuU1BBQ0UgPSAzMjtcclxuS2V5Ym9hcmQuUEFHRV9VUCA9IDMzO1xyXG5LZXlib2FyZC5QQUdFX0RPV04gPSAzNDtcclxuS2V5Ym9hcmQuRU5EID0gMzU7XHJcbktleWJvYXJkLkhPTUUgPSAzNjtcclxuS2V5Ym9hcmQuTEVGVCA9IDM3O1xyXG5LZXlib2FyZC5VUCA9IDM4O1xyXG5LZXlib2FyZC5SSUdIVCA9IDM5O1xyXG5LZXlib2FyZC5ET1dOID0gNDA7XHJcbktleWJvYXJkLklOU0VSVCA9IDQ1O1xyXG5LZXlib2FyZC5ERUxFVEUgPSA0NjtcclxuS2V5Ym9hcmQuTlVNQkVSXzEgPSA0OTtcclxuS2V5Ym9hcmQuTlVNQkVSXzIgPSA1MDtcclxuS2V5Ym9hcmQuTlVNQkVSXzMgPSA1MTtcclxuS2V5Ym9hcmQuTlVNQkVSXzQgPSA1MjtcclxuS2V5Ym9hcmQuTlVNQkVSXzUgPSA1MztcclxuS2V5Ym9hcmQuTlVNQkVSXzYgPSA1NDtcclxuS2V5Ym9hcmQuTlVNQkVSXzcgPSA1NTtcclxuS2V5Ym9hcmQuTlVNQkVSXzggPSA1NjtcclxuS2V5Ym9hcmQuTlVNQkVSXzkgPSA1NztcclxuS2V5Ym9hcmQuTlVNUEFEXzAgPSA5NjtcclxuS2V5Ym9hcmQuTlVNUEFEXzEgPSA5NztcclxuS2V5Ym9hcmQuTlVNUEFEXzIgPSA5ODtcclxuS2V5Ym9hcmQuTlVNUEFEXzMgPSA5OTtcclxuS2V5Ym9hcmQuTlVNUEFEXzQgPSAxMDA7XHJcbktleWJvYXJkLk5VTVBBRF81ID0gMTAxO1xyXG5LZXlib2FyZC5OVU1QQURfNiA9IDEwMjtcclxuS2V5Ym9hcmQuTlVNUEFEXzcgPSAxMDM7XHJcbktleWJvYXJkLk5VTVBBRF84ID0gMTA0O1xyXG5LZXlib2FyZC5OVU1QQURfOSA9IDEwNTtcclxuS2V5Ym9hcmQuTlVNUEFEX01VTFRJUExZID0gMTA2O1xyXG5LZXlib2FyZC5OVU1QQURfQUREID0gMTA3O1xyXG5LZXlib2FyZC5OVU1QQURfRU5URVIgPSAxMDg7XHJcbktleWJvYXJkLk5VTVBBRF9TVUJUUkFDVCA9IDEwOTtcclxuS2V5Ym9hcmQuTlVNUEFEX0RFTUlDQUwgPSAxMTA7XHJcbktleWJvYXJkLk5VTVBBRF9ESVZJREUgPSAxMTE7XHJcbktleWJvYXJkLkYxID0gMTEyO1xyXG5LZXlib2FyZC5GMiA9IDExMztcclxuS2V5Ym9hcmQuRjMgPSAxMTQ7XHJcbktleWJvYXJkLkY0ID0gMTE1O1xyXG5LZXlib2FyZC5GNSA9IDExNjtcclxuS2V5Ym9hcmQuRjYgPSAxMTc7XHJcbktleWJvYXJkLkY3ID0gMTE4O1xyXG5LZXlib2FyZC5GOCA9IDExOTtcclxuS2V5Ym9hcmQuRjkgPSAxMjA7XHJcbktleWJvYXJkLkYxMCA9IDEyMTtcclxuS2V5Ym9hcmQuRjExID0gMTIyO1xyXG5LZXlib2FyZC5GMTIgPSAxMjM7XHJcbktleWJvYXJkLkYxMyA9IDEyNDtcclxuS2V5Ym9hcmQuRjE0ID0gMTI1O1xyXG5LZXlib2FyZC5GMTUgPSAxMjY7XHJcbktleWJvYXJkLlNFTUlDT0xPTiA9IDE4NjtcclxuS2V5Ym9hcmQuRVFVQUwgPSAxODc7XHJcbktleWJvYXJkLkNPTU1BID0gMTg4O1xyXG5LZXlib2FyZC5NSU5VUyA9IDE4OTtcclxuS2V5Ym9hcmQuUEVSSU9EID0gMTkwO1xyXG5LZXlib2FyZC5TTEFTSCA9IDE5MTtcclxuS2V5Ym9hcmQuQkFDS1FVT1RFID0gMTkyO1xyXG5LZXlib2FyZC5MRUZUQlJBQ0tFVCA9IDIxOTtcclxuS2V5Ym9hcmQuQkFDS1NMQVNIID0gMjIwO1xyXG5LZXlib2FyZC5SSUdIVEJSQUNLRVQgPSAyMjE7XHJcbktleWJvYXJkLlFVT1RFID0gMjIyOyIsImltcG9ydCBWZWN0b3IyIGZyb20gJy4uL2dlb20vVmVjdG9yMidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vdXNlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lKSB7XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcbiAgICAgICAgdGhpcy5idXR0b25QcmVzc2VkID0gW107XHJcbiAgICAgICAgdGhpcy5idXR0b25QcmVzc2VkLmxlbmd0aCA9IDM7XHJcblxyXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uID0gbmV3IFZlY3RvcjIoKTtcclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm1vdXNlVXBIYW5kbGVyLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm1vdXNlRG93bkhhbmRsZXIuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMubW91c2VNb3ZlSGFuZGxlci5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICB9XHJcbiAgICBcclxuICAgIG1vdXNlVXBIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5idXR0b25QcmVzc2VkW2V2ZW50LmJ1dHRvbl0gPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBtb3VzZURvd25IYW5kbGVyKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5idXR0b25QcmVzc2VkW2V2ZW50LmJ1dHRvbl0gPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdXNlTW92ZUhhbmRsZXIoZXZlbnQpIHtcclxuICAgICAgICBsZXQgcmVjdCA9IHRoaXMuZ2FtZS5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgdGhpcy5fcG9zaXRpb24ueCA9IGV2ZW50LmNsaWVudFggLSByZWN0LmxlZnQ7XHJcbiAgICAgICAgdGhpcy5fcG9zaXRpb24ueSA9IGV2ZW50LmNsaWVudFkgLSByZWN0LnRvcDtcclxuICAgIH1cclxuXHJcbiAgICBwcmVzc2VkKGJ1dHRvbikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmJ1dHRvblByZXNzZWRbYnV0dG9uXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgeCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcG9zaXRpb24ueDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgeSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcG9zaXRpb24ueTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgcG9zaXRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uLmNsb25lKCk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5cclxuTW91c2UuTEVGVCA9IDA7XHJcbk1vdXNlLk1JRERMRSA9IDE7XHJcbk1vdXNlLlJJR0hUID0gMjsiLCJpbXBvcnQgQXNzZXQgZnJvbSAnLi9Bc3NldCdcbmltcG9ydCBTY2VuZU1hbmFnZXIgZnJvbSAnLi9TY2VuZU1hbmFnZXInXG5pbXBvcnQgQ2FtZXJhIGZyb20gJy4vQ2FtZXJhJ1xuaW1wb3J0IEtleWJvYXJkIGZyb20gJy4uL2lucHV0L0tleWJvYXJkJ1xuaW1wb3J0IE1vdXNlIGZyb20gJy4uL2lucHV0L01vdXNlJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lIHtcblxuICAgIGNvbnN0cnVjdG9yKGNhbnZhc0lkLCB3aWR0aCA9IDgwMCwgaGVpZ2h0ID0gNjAwLCBiYWNrZ3JvdW5kQ29sb3IgPSAnI2ZmZicpIHtcblxuICAgICAgICB0aGlzLmNhbnZhc0lkID0gY2FudmFzSWQ7XG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZENvbG9yID0gYmFja2dyb3VuZENvbG9yO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5jYW52YXMgPSBudWxsO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuYXNzZXQgPSBuZXcgQXNzZXQodGhpcyk7XG4gICAgICAgIHRoaXMuc2NlbmVzID0gbmV3IFNjZW5lTWFuYWdlcih0aGlzKTtcbiAgICAgICAgdGhpcy5rZXlib2FyZCA9IG51bGw7XG4gICAgICAgIHRoaXMubW91c2UgPSBudWxsO1xuICAgICAgICB0aGlzLmNhbWVyYSA9IG51bGw7XG4gICAgICAgIC8vdGhpcy5waHlzaWNzID0gbmV3IFBoeXNpY3MoKTtcblxuICAgICAgICB0aGlzLmR0ID0gMDtcblxuICAgICAgICB0aGlzLmluaXRlZCA9IGZhbHNlO1xuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCB0aGlzLmluaXQuYmluZCh0aGlzKSwgdHJ1ZSk7XG5cbiAgICB9XG5cbiAgICBpbml0KCkge1xuXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCB0aGlzLmluaXQsIHRydWUpO1xuXG4gICAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jYW52YXNJZCk7XG5cbiAgICAgICAgdGhpcy5rZXlib2FyZCA9IG5ldyBLZXlib2FyZCh0aGlzKTtcbiAgICAgICAgdGhpcy5tb3VzZSA9IG5ldyBNb3VzZSh0aGlzKTtcbiAgICAgICAgdGhpcy5jYW1lcmEgPSBuZXcgQ2FtZXJhKHRoaXMpO1xuXG4gICAgICAgIGlmICghdGhpcy5jYW52YXMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLmNhbnZhc0lkfeulvCDssL7snYQg7IiYIOyXhuyKteuLiOuLpC5gKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgICAgdGhpcy5fdGltZSA9IERhdGUubm93KCk7XG4gICAgICAgIHRoaXMuX2Zwc1N0YXJ0VGltZSA9IERhdGUubm93KCk7XG4gICAgICAgIHRoaXMuX2ZwcyA9IDYwO1xuXG4gICAgICAgIHRoaXMuaW5pdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fcmFmSWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucnVuLmJpbmQodGhpcykpO1xuXG4gICAgfVxuXG4gICAgcnVuKCkge1xuICAgICAgICBcbiAgICAgICAgdGhpcy5kdCA9IChEYXRlLm5vdygpIC0gdGhpcy5fdGltZSkgLyAxMDAwO1xuXG4gICAgICAgIGlmIChEYXRlLm5vdygpIC0gdGhpcy5fZnBzU3RhcnRUaW1lID4gNTAwKSB7XG4gICAgICAgICAgICB0aGlzLl9mcHNTdGFydFRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgdGhpcy5fZnBzID0gTWF0aC5tYXgoTWF0aC5yb3VuZCgxIC8gdGhpcy5kdCksIDYwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXBkYXRlKHRoaXMuZHQpO1xuICAgICAgICB0aGlzLnJlbmRlcih0aGlzLmNvbnRleHQpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5fdGltZSA9IERhdGUubm93KCk7XG4gICAgICAgIHRoaXMuX3JhZklkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJ1bi5iaW5kKHRoaXMpKTtcblxuICAgIH1cbiAgICBcbiAgICB1cGRhdGUoZHQpIHtcblxuICAgICAgICB0aGlzLmNhbWVyYS51cGRhdGUoZHQpO1xuICAgICAgICAvLyB0aGlzLnBoeXNpY3MudXBkYXRlKGR0KTtcblxuICAgICAgICBpZiAodGhpcy5zY2VuZXMuY3VycmVudCAmJiB0aGlzLnNjZW5lcy5jdXJyZW50LnByZWxvYWRlZClcbiAgICAgICAgICAgIHRoaXMuc2NlbmVzLmN1cnJlbnQudXBkYXRlKGR0KTtcblxuICAgIH1cblxuICAgIHJlbmRlcihjb250ZXh0KSB7XG5cbiAgICAgICAgbGV0IHRhcmdldFggPSB0aGlzLmNhbWVyYS53aWR0aCAvIDI7XG4gICAgICAgIGxldCB0YXJnZXRZID0gdGhpcy5jYW1lcmEuaGVpZ2h0IC8gMjtcblxuICAgICAgICBjb250ZXh0LnNhdmUoKTtcblxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuYmFja2dyb3VuZENvbG9yO1xuICAgICAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuICAgICAgICBcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUodGFyZ2V0WCwgdGFyZ2V0WSk7XG4gICAgICAgIGNvbnRleHQuc2NhbGUodGhpcy5jYW1lcmEuc2NhbGVYLCB0aGlzLmNhbWVyYS5zY2FsZVkpO1xuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZSgtdGFyZ2V0WCwgLXRhcmdldFkpO1xuXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKC10aGlzLmNhbWVyYS54LCAtdGhpcy5jYW1lcmEueSk7XG4gICAgICAgIFxuICAgICAgICBpZiAodGhpcy5zY2VuZXMuY3VycmVudC5wcmVsb2FkZWQpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuc2NlbmVzLmN1cnJlbnQuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBjaGlsZC5iZWZvcmVSZW5kZXIoY29udGV4dCk7XG4gICAgICAgICAgICAgICAgY2hpbGQucmVuZGVyKGNvbnRleHQpO1xuICAgICAgICAgICAgICAgIGNoaWxkLmFmdGVyUmVuZGVyKGNvbnRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dC5yZXN0b3JlKCk7XG5cbiAgICB9XG5cbiAgICBnZXQgZnBzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZnBzO1xuICAgIH1cblxufSIsImltcG9ydCBHYW1lT2JqZWN0IGZyb20gJy4vR2FtZU9iamVjdCdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRhaW5lciBleHRlbmRzIEdhbWVPYmplY3Qge1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoY29udGV4dCkge1xyXG4gICAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgY2hpbGQuYmVmb3JlUmVuZGVyKGNvbnRleHQpO1xyXG4gICAgICAgICAgICBjaGlsZC5yZW5kZXIoY29udGV4dCk7XHJcbiAgICAgICAgICAgIGNoaWxkLmFmdGVyUmVuZGVyKGNvbnRleHQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZHQpIHtcclxuICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKVxyXG4gICAgICAgICAgICBjaGlsZC51cGRhdGUoZHQpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZENoaWxkKGNoaWxkKSB7XHJcbiAgICAgICAgY2hpbGQucGFyZW50ID0gdGhpcztcclxuICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goY2hpbGQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUNoaWxkKGNoaWxkKSB7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UodGhpcy5jaGlsZHJlbi5pbmRleE9mKGNoaWxkKSwgMSk7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IENvbnRhaW5lciBmcm9tICcuL0NvbnRhaW5lcidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjZW5lIGV4dGVuZHMgQ29udGFpbmVye1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy51aSA9IG5ldyBDb250YWluZXIoKTtcclxuICAgICAgICB0aGlzLnVpLmlnbm9yZUdsb2JhbFRyYW5zZm9ybSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5wcmVsb2FkZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwcmVsb2FkKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZHQpIHtcclxuICAgICAgICBzdXBlci51cGRhdGUoZHQpO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCBDb250YWluZXIgZnJvbSAnLi9Db250YWluZXInXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcHJpdGUgZXh0ZW5kcyBDb250YWluZXIge1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihpbWFnZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMudGV4dHVyZSA9IGltYWdlO1xyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gaW1hZ2Uud2lkdGg7XHJcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gaW1hZ2UuaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcihjb250ZXh0KSB7XHJcbiAgICAgICAgc3VwZXIucmVuZGVyKGNvbnRleHQpO1xyXG4gICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKHRoaXMudGV4dHVyZSwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHdpZHRoKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgd2lkdGgodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl93aWR0aCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3NjYWxlLnggPSB2YWx1ZSAvIHRoaXMudGV4dHVyZS53aWR0aDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaGVpZ2h0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGhlaWdodCh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3NjYWxlLnkgPSB2YWx1ZSAvIHRoaXMudGV4dHVyZS5oZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHNjYWxlWCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2NhbGUueDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc2NhbGVYKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fd2lkdGggKj0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fc2NhbGUueCA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBzY2FsZVkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NjYWxlLnk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHNjYWxlWSh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCAqPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9zY2FsZS55ID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IFNwcml0ZSBmcm9tICcuL1Nwcml0ZSdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFuaW1hdGlvbiBleHRlbmRzIFNwcml0ZSB7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHNwcml0ZVNoZWV0LCBmcmFtZVJlY3QsIHRvdGFsRnJhbWUsIGZyYW1lU3BlZWQgPSA2MCkge1xyXG4gICAgICAgIHN1cGVyKHNwcml0ZVNoZWV0KTtcclxuXHJcbiAgICAgICAgdGhpcy5mcmFtZVJlY3QgPSBmcmFtZVJlY3Q7XHJcbiAgICAgICAgdGhpcy50b3RhbEZyYW1lID0gdG90YWxGcmFtZTtcclxuICAgICAgICB0aGlzLmZyYW1lc1BlclJvdyA9IE1hdGguZmxvb3IodGhpcy50ZXh0dXJlLndpZHRoIC8gZnJhbWVSZWN0LndpZHRoKTtcclxuICAgICAgICB0aGlzLmZyYW1lU3BlZWQgPSBmcmFtZVNwZWVkO1xyXG5cclxuICAgICAgICB0aGlzLmlzTG9vcCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5mcmFtZVNwZWVkID0gNjA7XHJcblxyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gZnJhbWVSZWN0LndpZHRoO1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCA9IGZyYW1lUmVjdC5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5fZnJhbWVDb3VudCA9IDA7XHJcbiAgICAgICAgdGhpcy5faXNQbGF5aW5nID0gZmFsc2U7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHBsYXkoaXNMb29wID0gdHJ1ZSwgZnJhbWVTcGVlZCA9IDYwKSB7XHJcblxyXG4gICAgICAgIHRoaXMuaXNMb29wID0gaXNMb29wO1xyXG4gICAgICAgIHRoaXMuZnJhbWVTcGVlZCA9IGZyYW1lU3BlZWQ7XHJcbiAgICAgICAgdGhpcy5faXNQbGF5aW5nID0gdHJ1ZTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgc3RvcChyZXNldCA9IGZhbHNlKSB7XHJcblxyXG4gICAgICAgIGlmIChyZXNldClcclxuICAgICAgICAgICAgdGhpcy5fZnJhbWVDb3VudCA9IDA7XHJcbiAgICAgICAgdGhpcy5faXNQbGF5aW5nID0gZmFsc2U7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShkdCkge1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuX2lzUGxheWluZylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX2ZyYW1lQ291bnQgKz0gdGhpcy5mcmFtZVNwZWVkICogZHQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMuX2ZyYW1lQ291bnQgPj0gdGhpcy50b3RhbEZyYW1lKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTG9vcClcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZyYW1lQ291bnQgPSAwO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZyYW1lQ291bnQgPSB0aGlzLnRvdGFsRnJhbWUgLSAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKGNvbnRleHQpIHtcclxuXHJcbiAgICAgICAgY29udGV4dC5kcmF3SW1hZ2UoXHJcbiAgICAgICAgICAgIHRoaXMudGV4dHVyZSxcclxuICAgICAgICAgICAgdGhpcy53aWR0aCAqIE1hdGguZmxvb3IodGhpcy5fZnJhbWVDb3VudCAlIHRoaXMuZnJhbWVzUGVyUm93KSxcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgKiBNYXRoLmZsb29yKHRoaXMuX2ZyYW1lQ291bnQgLyB0aGlzLmZyYW1lc1BlclJvdyksXHJcbiAgICAgICAgICAgIHRoaXMud2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB0aGlzLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLmhlaWdodFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBnZXQgY3VycmVudEZyYW1lKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mcmFtZUNvdW50O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpc1BsYXlpbmcoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzUGxheWluZztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgd2lkdGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB3aWR0aCh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fc2NhbGUueCA9IHZhbHVlIC8gdGhpcy5mcmFtZVJlY3Qud2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGhlaWdodCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBoZWlnaHQodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9zY2FsZS55ID0gdmFsdWUgLyB0aGlzLmZyYW1lUmVjdC5oZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHNjYWxlWCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2NhbGUueDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc2NhbGVYKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fd2lkdGggKj0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fc2NhbGUueCA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBzY2FsZVkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NjYWxlLnk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHNjYWxlWSh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCAqPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9zY2FsZS55ID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBZSxNQUFNLEtBQUssQ0FBQzs7SUFFdkIsV0FBVyxDQUFDLElBQUksRUFBRTs7UUFFZCxJQUFJLENBQUMs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T0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hELE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNuQzs7Q0FFSjs7O0FBR0QsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUN2QixRQUFRLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNqQixRQUFRLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNwQixRQUFRLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUN0QixRQUFRLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNwQixRQUFRLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUN0QixRQUFRLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUN4QixRQUFRLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUN4QixRQUFRLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNyQixRQUFRLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNwQixRQUFRLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUN0QixRQUFRLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUN4QixRQUFRLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNsQixRQUFRLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNuQixRQUFRLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNuQixRQUFRLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNqQixRQUFRLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNwQixRQUFRLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNuQixRQUFRLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNyQixRQUFRLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNyQixRQUFRLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUN2QixRQUFRLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUN2QixRQUFRLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUN2QixRQUFRLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUN2QixRQUFRLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUN2QixRQUFRLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUN2QixRQUFRLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUN2QixRQUFRLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUN2QixRQUFRLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUN2QixRQUFRLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUN2QixRQUFRLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUN2QixRQUFRLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUN2QixRQUFRLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUN2QixRQUFRLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztBQUN4QixRQUFRLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztBQUN4QixRQUFRLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztBQUN4QixRQUFRLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztBQUN4QixRQUFRLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztBQUN4QixRQUFRLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztBQUN4QixRQUFRLENBQUMsZUFBZSxHQUFHLEdBQUcsQ0FBQztBQUMvQixRQUFRLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztBQUMxQixRQUFRLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQztBQUM1QixRQUFRLENBQUMsZUFBZSxHQUFHLEdBQUcsQ0FBQztBQUMvQixRQUFRLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztBQUM5QixRQUFRLENBQUMsYUFBYSxHQUFHLEdBQUcsQ0FBQztBQUM3QixRQUFRLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQztBQUNsQixRQUFRLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQztBQUNsQixRQUFRLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQztBQUNsQixRQUFRLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQztBQUNsQixRQUFRLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQztBQUNsQixRQUFRLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQztBQUNsQixRQUFRLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQztBQUNsQixRQUFRLENB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
