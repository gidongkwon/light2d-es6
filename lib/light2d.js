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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlnaHQyZC5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2NvcmUvQXNzZXQuanMiLCIuLi9zcmMvY29yZS9TY2VuZU1hbmFnZXIuanMiLCIuLi9zcmMvaW5wdXQvS2V5Ym9hcmQuanMiLCIuLi9zcmMvZ2VvbS9WZWN0b3IyLmpzIiwiLi4vc3JjL2lucHV0L01vdXNlLmpzIiwiLi4vc3JjL2NvcmUvR2FtZS5qcyIsIi4uL3NyYy9nZW9tL1JlY3RhbmdsZS5qcyIsIi4uL3NyYy9nYW1lb2JqZWN0cy9HYW1lT2JqZWN0LmpzIiwiLi4vc3JjL2dhbWVvYmplY3RzL0NvbnRhaW5lci5qcyIsIi4uL3NyYy9nYW1lb2JqZWN0cy9TY2VuZS5qcyIsIi4uL3NyYy9nYW1lb2JqZWN0cy9TcHJpdGUuanMiLCIuLi9zcmMvZ2FtZW9iamVjdHMvQW5pbWF0aW9uLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIEFzc2V0IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lKSB7XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5sb2FkZWRGaWxlcyA9IDA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy50b0xvYWQgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IHt9O1xyXG4gICAgICAgIHRoaXMuYXVkaW8gPSB7fTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEltYWdlKGlkLCB1cmwpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UuaGFzT3duUHJvcGVydHkoaWQpKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnRvTG9hZC5zZXQoaWQsIG5ldyBGaWxlKCdpbWFnZScsIGlkLCB1cmwpKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEF1ZGlvKGlkLCB1cmwpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYXVkaW8uaGFzT3duUHJvcGVydHkoaWQpKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy50b0xvYWQuc2V0KGlkLCBuZXcgRmlsZSgnYXVkaW8nLCBpZCwgdXJsKSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8vIHByaXZhdGVcclxuICAgIHN0YXJ0TG9hZCgpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgZmlsZSBvZiB0aGlzLnRvTG9hZC52YWx1ZXMoKSkge1xyXG5cclxuICAgICAgICAgICAgc3dpdGNoIChmaWxlLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAnaW1hZ2UnOlxyXG4gICAgICAgICAgICAgICAgbGV0IGltZyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgICAgICAgICAgaW1nLnNyYyA9IGZpbGUudXJsO1xyXG4gICAgICAgICAgICAgICAgaW1nLmFzc2V0SWQgPSBmaWxlLmlkO1xyXG4gICAgICAgICAgICAgICAgaW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBsb2FkSGFubGRlci5iaW5kKHRoaXMpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAnYXVkaW8nOlxyXG4gICAgICAgICAgICAgICAgbGV0IGF1ZCA9IG5ldyBBdWRpbyhmaWxlLnVybCk7XHJcbiAgICAgICAgICAgICAgICBhdWQuYXNzZXRJZCA9IGZpbGUuaWQ7XHJcbiAgICAgICAgICAgICAgICBhdWQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGxvYWRIYW5sZGVyLmJpbmQodGhpcykpO1xyXG4gICAgICAgICAgICAgICAgYXVkLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdsb2FkJykpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHRvdGFsRmlsZXMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudG9Mb2FkLnNpemU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBwcm9ncmVzc0FzUGVyY2VudCgpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMubG9hZGluZ0ZpbGVzID09PSAwKSA/IDAgOiB0aGlzLmxvYWRlZEZpbGVzIC8gdGhpcy50b3RhbEZpbGVzICogMTAwO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuXHJcbmNvbnN0IGxvYWRIYW5sZGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcbiAgICBldmVudC50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcsIGxvYWRIYW5sZGVyKTtcclxuICAgIFxyXG4gICAgY29uc3QgZmlsZSA9IHRoaXMudG9Mb2FkLmdldChldmVudC50YXJnZXQuYXNzZXRJZCk7XHJcbiAgICBcclxuICAgIHRoaXNbZmlsZS50eXBlXVtmaWxlLmlkXSA9IGV2ZW50LnRhcmdldDtcclxuICAgIHRoaXMubG9hZGVkRmlsZXMrKztcclxuICAgIFxyXG4gICAgaWYodGhpcy5sb2FkZWRGaWxlcyA9PT0gdGhpcy50b3RhbEZpbGVzKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3ByZWxvYWRlZCcpKTtcclxuICAgICAgICB0aGlzLnRvTG9hZC5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMubG9hZGVkRmlsZXMgPSAwO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuXHJcbmNsYXNzIEZpbGUge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHR5cGUsIGlkLCB1cmwpIHtcclxuXHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XHJcblxyXG4gICAgfVxyXG5cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjZW5lTWFuYWdlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZSkge1xyXG5cclxuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRTY2VuZSA9IG51bGw7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZShzY2VuZSkge1xyXG5cclxuICAgICAgICB0aGlzLl9jdXJyZW50U2NlbmUgPSBzY2VuZTtcclxuICAgICAgICB0aGlzLl9jdXJyZW50U2NlbmUucHJlbG9hZCgpO1xyXG5cclxuICAgICAgICB0aGlzLmdhbWUuYXNzZXQuc3RhcnRMb2FkKCk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3ByZWxvYWRlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fY3VycmVudFNjZW5lLnByZWxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRTY2VuZS5pbml0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKCF0aGlzLmdhbWUuaW5pdGVkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8vdGhpcy5nYW1lLmNhbWVyYS5yZXNldCgpO1xyXG4gICAgICAgIC8vdGhpcy5nYW1lLnBoeXNpY3MucmVzZXQoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGN1cnJlbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRTY2VuZTtcclxuICAgIH1cclxuXHJcbn0iLCJcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgS2V5Ym9hcmQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGdhbWUpIHtcclxuICAgIFxyXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcbiAgICAgICAgdGhpcy5rZXlQcmVzc2VkID0gW107XHJcbiAgICAgICAgdGhpcy5rZXlDYXB0dXJpbmcgPSBbXTtcclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleURvd25IYW5kbGVyLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMua2V5VXBIYW5kbGVyLmJpbmQodGhpcykpO1xyXG5cclxuICAgIH1cclxuICAgIFxyXG4gICAga2V5RG93bkhhbmRsZXIoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMua2V5Q2FwdHVyaW5nLmluY2x1ZGVzKGV2ZW50LmtleUNvZGUpKVxyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICB0aGlzLmtleVByZXNzZWRbZXZlbnQua2V5Q29kZV0gPSB0cnVlO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBrZXlVcEhhbmRsZXIoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLmtleVByZXNzZWRbZXZlbnQua2V5Q29kZV0gPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwcmVzc2VkKGtleUNvZGUpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgJHtrZXlDb2RlfSA6ICR7dGhpcy5rZXlQcmVzc2VkW2tleUNvZGVdfWApO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmtleVByZXNzZWRba2V5Q29kZV07XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5cclxuS2V5Ym9hcmQuQSA9ICdBJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5CID0gJ0InLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLkMgPSAnQycuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuRCA9ICdEJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5FID0gJ0UnLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLkYgPSAnRicuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuRyA9ICdHJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5IID0gJ0gnLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLkkgPSAnSScuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuSiA9ICdKJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5LID0gJ0snLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLkwgPSAnTCcuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuTSA9ICdNJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5OID0gJ04nLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLk8gPSAnTycuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuUCA9ICdQJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5RID0gJ1EnLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLlIgPSAnUicuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuUyA9ICdTJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5UID0gJ1QnLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLlUgPSAnVScuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuViA9ICdWJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5XID0gJ1cnLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLlggPSAnWCcuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuWSA9ICdZJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5aID0gJ1onLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLkJBQ0tTUEFDRSA9IDg7XHJcbktleWJvYXJkLlRBUCA9IDk7XHJcbktleWJvYXJkLkVOVEVSID0gMTM7XHJcbktleWJvYXJkLkNPTU1BTkQgPSAxNTtcclxuS2V5Ym9hcmQuU0hJRlQgPSAxNjtcclxuS2V5Ym9hcmQuQ09OVFJPTCA9IDE3O1xyXG5LZXlib2FyZC5BTFRFUk5BVEUgPSAxODtcclxuS2V5Ym9hcmQuQ0FQU19MT0NLID0gMjA7XHJcbktleWJvYXJkLkVTQ0FQRSA9IDI3O1xyXG5LZXlib2FyZC5TUEFDRSA9IDMyO1xyXG5LZXlib2FyZC5QQUdFX1VQID0gMzM7XHJcbktleWJvYXJkLlBBR0VfRE9XTiA9IDM0O1xyXG5LZXlib2FyZC5FTkQgPSAzNTtcclxuS2V5Ym9hcmQuSE9NRSA9IDM2O1xyXG5LZXlib2FyZC5MRUZUID0gMzc7XHJcbktleWJvYXJkLlVQID0gMzg7XHJcbktleWJvYXJkLlJJR0hUID0gMzk7XHJcbktleWJvYXJkLkRPV04gPSA0MDtcclxuS2V5Ym9hcmQuSU5TRVJUID0gNDU7XHJcbktleWJvYXJkLkRFTEVURSA9IDQ2O1xyXG5LZXlib2FyZC5OVU1CRVJfMSA9IDQ5O1xyXG5LZXlib2FyZC5OVU1CRVJfMiA9IDUwO1xyXG5LZXlib2FyZC5OVU1CRVJfMyA9IDUxO1xyXG5LZXlib2FyZC5OVU1CRVJfNCA9IDUyO1xyXG5LZXlib2FyZC5OVU1CRVJfNSA9IDUzO1xyXG5LZXlib2FyZC5OVU1CRVJfNiA9IDU0O1xyXG5LZXlib2FyZC5OVU1CRVJfNyA9IDU1O1xyXG5LZXlib2FyZC5OVU1CRVJfOCA9IDU2O1xyXG5LZXlib2FyZC5OVU1CRVJfOSA9IDU3O1xyXG5LZXlib2FyZC5OVU1QQURfMCA9IDk2O1xyXG5LZXlib2FyZC5OVU1QQURfMSA9IDk3O1xyXG5LZXlib2FyZC5OVU1QQURfMiA9IDk4O1xyXG5LZXlib2FyZC5OVU1QQURfMyA9IDk5O1xyXG5LZXlib2FyZC5OVU1QQURfNCA9IDEwMDtcclxuS2V5Ym9hcmQuTlVNUEFEXzUgPSAxMDE7XHJcbktleWJvYXJkLk5VTVBBRF82ID0gMTAyO1xyXG5LZXlib2FyZC5OVU1QQURfNyA9IDEwMztcclxuS2V5Ym9hcmQuTlVNUEFEXzggPSAxMDQ7XHJcbktleWJvYXJkLk5VTVBBRF85ID0gMTA1O1xyXG5LZXlib2FyZC5OVU1QQURfTVVMVElQTFkgPSAxMDY7XHJcbktleWJvYXJkLk5VTVBBRF9BREQgPSAxMDc7XHJcbktleWJvYXJkLk5VTVBBRF9FTlRFUiA9IDEwODtcclxuS2V5Ym9hcmQuTlVNUEFEX1NVQlRSQUNUID0gMTA5O1xyXG5LZXlib2FyZC5OVU1QQURfREVNSUNBTCA9IDExMDtcclxuS2V5Ym9hcmQuTlVNUEFEX0RJVklERSA9IDExMTtcclxuS2V5Ym9hcmQuRjEgPSAxMTI7XHJcbktleWJvYXJkLkYyID0gMTEzO1xyXG5LZXlib2FyZC5GMyA9IDExNDtcclxuS2V5Ym9hcmQuRjQgPSAxMTU7XHJcbktleWJvYXJkLkY1ID0gMTE2O1xyXG5LZXlib2FyZC5GNiA9IDExNztcclxuS2V5Ym9hcmQuRjcgPSAxMTg7XHJcbktleWJvYXJkLkY4ID0gMTE5O1xyXG5LZXlib2FyZC5GOSA9IDEyMDtcclxuS2V5Ym9hcmQuRjEwID0gMTIxO1xyXG5LZXlib2FyZC5GMTEgPSAxMjI7XHJcbktleWJvYXJkLkYxMiA9IDEyMztcclxuS2V5Ym9hcmQuRjEzID0gMTI0O1xyXG5LZXlib2FyZC5GMTQgPSAxMjU7XHJcbktleWJvYXJkLkYxNSA9IDEyNjtcclxuS2V5Ym9hcmQuU0VNSUNPTE9OID0gMTg2O1xyXG5LZXlib2FyZC5FUVVBTCA9IDE4NztcclxuS2V5Ym9hcmQuQ09NTUEgPSAxODg7XHJcbktleWJvYXJkLk1JTlVTID0gMTg5O1xyXG5LZXlib2FyZC5QRVJJT0QgPSAxOTA7XHJcbktleWJvYXJkLlNMQVNIID0gMTkxO1xyXG5LZXlib2FyZC5CQUNLUVVPVEUgPSAxOTI7XHJcbktleWJvYXJkLkxFRlRCUkFDS0VUID0gMjE5O1xyXG5LZXlib2FyZC5CQUNLU0xBU0ggPSAyMjA7XHJcbktleWJvYXJkLlJJR0hUQlJBQ0tFVCA9IDIyMTtcclxuS2V5Ym9hcmQuUVVPVEUgPSAyMjI7IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmVjdG9yMiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoeCA9IDAsIHkgPSAwKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgfVxyXG5cclxuICAgIGFkZCh2ZWMyKSB7XHJcbiAgICAgICAgdGhpcy54ID0gdmVjMi54O1xyXG4gICAgICAgIHRoaXMueSA9IHZlYzIueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzdWJ0cmFjdCh2ZWMyKSB7XHJcbiAgICAgICAgdGhpcy54IC09IHZlYzIueDtcclxuICAgICAgICB0aGlzLnkgLT0gdmVjMi55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIG11bHRpcGx5KHZlYzIpIHtcclxuICAgICAgICB0aGlzLnggKj0gdmVjMi54O1xyXG4gICAgICAgIHRoaXMueSAqPSB2ZWMyLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgZGl2aWRlKHZlYzIpIHtcclxuICAgICAgICB0aGlzLnggLz0gdmVjMi54O1xyXG4gICAgICAgIHRoaXMueSAvPSB2ZWMyLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgYW5nbGUodmVjMikge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmF0YW4yKHZlYzIueSAtIHRoaXMueSwgdmVjMi54IC0gdGhpcy54KTtcclxuICAgIH1cclxuXHJcbiAgICBkaXN0YW5jZSh2ZWMyKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyh2ZWMyLnggLSB0aGlzLngsIDIpICsgTWF0aC5wb3codmVjMi55IC0gdGhpcy55LCAyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGlzdGFuY2VTcSh2ZWMyKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgucG93KHZlYzIueCAtIHRoaXMueCwgMikgKyBNYXRoLnBvdyh2ZWMyLnkgLSB0aGlzLnksIDIpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsb25lKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMih0aGlzLngsIHRoaXMueSk7XHJcbiAgICB9XHJcbiAgICBcclxufSIsImltcG9ydCBWZWN0b3IyIGZyb20gJy4uL2dlb20vVmVjdG9yMidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vdXNlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lKSB7XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcbiAgICAgICAgdGhpcy5idXR0b25QcmVzc2VkID0gW107XHJcbiAgICAgICAgdGhpcy5idXR0b25QcmVzc2VkLmxlbmd0aCA9IDM7XHJcblxyXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uID0gbmV3IFZlY3RvcjIoKTtcclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm1vdXNlVXBIYW5kbGVyLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm1vdXNlRG93bkhhbmRsZXIuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMubW91c2VNb3ZlSGFuZGxlci5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICB9XHJcbiAgICBcclxuICAgIG1vdXNlVXBIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5idXR0b25QcmVzc2VkW2V2ZW50LmJ1dHRvbl0gPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBtb3VzZURvd25IYW5kbGVyKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5idXR0b25QcmVzc2VkW2V2ZW50LmJ1dHRvbl0gPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdXNlTW92ZUhhbmRsZXIoZXZlbnQpIHtcclxuICAgICAgICBsZXQgcmVjdCA9IHRoaXMuZ2FtZS5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgdGhpcy5fcG9zaXRpb24ueCA9IGV2ZW50LmNsaWVudFggLSByZWN0LmxlZnQ7XHJcbiAgICAgICAgdGhpcy5fcG9zaXRpb24ueSA9IGV2ZW50LmNsaWVudFkgLSByZWN0LnRvcDtcclxuICAgIH1cclxuXHJcbiAgICBwcmVzc2VkKGJ1dHRvbikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmJ1dHRvblByZXNzZWRbYnV0dG9uXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgeCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcG9zaXRpb24ueDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgeSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcG9zaXRpb24ueTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgcG9zaXRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uLmNsb25lKCk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5cclxuTW91c2UuTEVGVCA9IDA7XHJcbk1vdXNlLk1JRERMRSA9IDE7XHJcbk1vdXNlLlJJR0hUID0gMjsiLCJpbXBvcnQgQXNzZXQgZnJvbSAnLi9Bc3NldCdcbmltcG9ydCBTY2VuZU1hbmFnZXIgZnJvbSAnLi9TY2VuZU1hbmFnZXInXG5pbXBvcnQgQ2FtZXJhIGZyb20gJy4vQ2FtZXJhJ1xuaW1wb3J0IEtleWJvYXJkIGZyb20gJy4uL2lucHV0L0tleWJvYXJkJ1xuaW1wb3J0IE1vdXNlIGZyb20gJy4uL2lucHV0L01vdXNlJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lIHtcblxuICAgIGNvbnN0cnVjdG9yKGNhbnZhc0lkLCB3aWR0aCA9IDgwMCwgaGVpZ2h0ID0gNjAwLCBiYWNrZ3JvdW5kQ29sb3IgPSAnI2ZmZicpIHtcblxuICAgICAgICB0aGlzLmNhbnZhc0lkID0gY2FudmFzSWQ7XG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZENvbG9yID0gYmFja2dyb3VuZENvbG9yO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5jYW52YXMgPSBudWxsO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuYXNzZXQgPSBuZXcgQXNzZXQodGhpcyk7XG4gICAgICAgIHRoaXMuc2NlbmVzID0gbmV3IFNjZW5lTWFuYWdlcih0aGlzKTtcbiAgICAgICAgdGhpcy5rZXlib2FyZCA9IG5ldyBLZXlib2FyZCh0aGlzKTtcbiAgICAgICAgdGhpcy5tb3VzZSA9IG5ldyBNb3VzZSh0aGlzKTtcbiAgICAgICAgLy90aGlzLmNhbWVyYSA9IG5ldyBDYW1lcmEoKTtcbiAgICAgICAgLy90aGlzLnBoeXNpY3MgPSBuZXcgUGh5c2ljcygpO1xuXG4gICAgICAgIHRoaXMuZHQgPSAwO1xuXG4gICAgICAgIHRoaXMuaW5pdGVkID0gZmFsc2U7XG5cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIHRoaXMuaW5pdC5iaW5kKHRoaXMpLCB0cnVlKTtcblxuICAgIH1cblxuICAgIGluaXQoKSB7XG5cbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIHRoaXMuaW5pdCwgdHJ1ZSk7XG5cbiAgICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNhbnZhc0lkKTtcblxuICAgICAgICBpZiAoIXRoaXMuY2FudmFzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGhpcy5jYW52YXNJZH3rpbwg7LC+7J2EIOyImCDsl4bsirXri4jri6QuYCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgICAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAgIHRoaXMuX3RpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICB0aGlzLl9mcHNTdGFydFRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICB0aGlzLl9mcHMgPSA2MDtcblxuICAgICAgICB0aGlzLmluaXRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX3JhZklkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJ1bi5iaW5kKHRoaXMpKTtcblxuICAgIH1cblxuICAgIHJ1bigpIHtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZHQgPSAoRGF0ZS5ub3coKSAtIHRoaXMuX3RpbWUpIC8gMTAwMDtcblxuICAgICAgICBpZiAoRGF0ZS5ub3coKSAtIHRoaXMuX2Zwc1N0YXJ0VGltZSA+IDUwMCkge1xuICAgICAgICAgICAgdGhpcy5fZnBzU3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIHRoaXMuX2ZwcyA9IE1hdGgubWF4KE1hdGgucm91bmQoMSAvIHRoaXMuZHQpLCA2MCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVwZGF0ZSh0aGlzLmR0KTtcbiAgICAgICAgdGhpcy5yZW5kZXIodGhpcy5jb250ZXh0KTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuX3RpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICB0aGlzLl9yYWZJZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5ydW4uYmluZCh0aGlzKSk7XG5cbiAgICB9XG4gICAgXG4gICAgdXBkYXRlKGR0KSB7XG5cbiAgICAgICAgLy8gdGhpcy5waHlzaWNzLnVwZGF0ZShkdCk7XG5cbiAgICAgICAgaWYgKHRoaXMuc2NlbmVzLmN1cnJlbnQgJiYgdGhpcy5zY2VuZXMuY3VycmVudC5wcmVsb2FkZWQpXG4gICAgICAgICAgICB0aGlzLnNjZW5lcy5jdXJyZW50LnVwZGF0ZShkdCk7XG5cbiAgICB9XG5cbiAgICByZW5kZXIoY29udGV4dCkge1xuXG4gICAgICAgIGxldCB0YXJnZXRYID0gdGhpcy53aWR0aCAvIDI7XG4gICAgICAgIGxldCB0YXJnZXRZID0gdGhpcy5oZWlnaHQgLyAyO1xuXG4gICAgICAgIGNvbnRleHQuc2F2ZSgpO1xuXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgICAgIFxuICAgICAgICAvLyBjb250ZXh0LnRyYW5zbGF0ZSh0YXJnZXRYLCB0YXJnZXRZKTtcbiAgICAgICAgLy8gY29udGV4dC5zY2FsZSh0aGlzLmNhbWVyYS5zY2FsZS54LCB0aGlzLmNhbWVyYS5zY2FsZS55KTtcbiAgICAgICAgLy8gY29udGV4dC50cmFuc2xhdGUoLXRhcmdldFgsIC10YXJnZXRZKTtcblxuICAgICAgICAvLyBjb250ZXh0LnRyYW5zbGF0ZSgtdGhpcy5jYW1lcmEueCwgLXRoaXMuY2FtZXJhLnkpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMuc2NlbmVzLmN1cnJlbnQucHJlbG9hZGVkKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLnNjZW5lcy5jdXJyZW50LmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgY2hpbGQuYmVmb3JlUmVuZGVyKGNvbnRleHQpO1xuICAgICAgICAgICAgICAgIGNoaWxkLnJlbmRlcihjb250ZXh0KTtcbiAgICAgICAgICAgICAgICBjaGlsZC5hZnRlclJlbmRlcihjb250ZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQucmVzdG9yZSgpO1xuXG4gICAgfVxuXG4gICAgZ2V0IGZwcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZwcztcbiAgICB9XG5cbn0iLCJpbXBvcnQgVmVjdG9yMiBmcm9tICcuL1ZlY3RvcjInXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0YW5nbGUge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHggPSAwLCB5ID0gMCwgd2lkdGggPSAwLCBoZWlnaHQgPSAwKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBpbnRlcnNlY3RzKHJlY3QpIHtcclxuICAgICAgICByZXR1cm4gISh0aGlzLnggKyB0aGlzLndpZHRoIDwgcmVjdC54IHx8IHRoaXMueSArIHRoaXMuaGVpZ2h0IDwgcmVjdC55IHx8IHJlY3QueCArIHJlY3Qud2lkdGggPCB0aGlzLnggfHwgcmVjdC55ICsgcmVjdC5oZWlnaHQgPCB0aGlzLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIGludGVyc2VjdGlvbihyZWN0KSB7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5pbnRlcnNlY3RzKHJlY3QpKVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgbGV0IHggPSBNYXRoLm1heCh0aGlzLngsIHJlY3QueCk7XHJcbiAgICAgICAgbGV0IHkgPSBNYXRoLm1heCh0aGlzLnksIHJlY3QueSk7XHJcbiAgICAgICAgbGV0IHdpZHRoID0gTWF0aC5taW4odGhpcy54ICsgdGhpcy53aWR0aCwgcmVjdC54ICsgcmVjdC53aWR0aCkgLSB4O1xyXG4gICAgICAgIGxldCBoZWlnaHQgPSBNYXRoLm1pbih0aGlzLnkgKyB0aGlzLmhlaWdodCwgcmVjdC55ICsgcmVjdC5oZWlnaHQpIC0geTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBSZWN0YW5nbGUoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgfVxyXG4gICAgICAgIFxyXG4gICAgY29udGFpbnModmVjMikge1xyXG4gICAgICAgIHJldHVybiAhKHRoaXMueCA+IHZlYzIueCB8fCB0aGlzLnggKyB0aGlzLndpZHRoIDwgdmVjMi54IHx8IHRoaXMueSA+IHZlYzIueSB8fCB0aGlzLnkgKyB0aGlzLmhlaWdodCA8IHZlYzIueSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xvbmUoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBSZWN0YW5nbGUodGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY2VudGVyKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMih0aGlzLnggKyB0aGlzLndpZHRoIC8gMiwgdGhpcy55ICsgdGhpcy5oZWlnaHQgLyAyKTtcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgVmVjdG9yMiBmcm9tICcuLi9nZW9tL1ZlY3RvcjInXHJcbmltcG9ydCBSZWN0YW5nbGUgZnJvbSAnLi4vZ2VvbS9SZWN0YW5nbGUnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lT2JqZWN0IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBWZWN0b3IyKCk7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvbiA9IDA7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvbkNlbnRlciA9IG5ldyBWZWN0b3IyKCk7XHJcbiAgICAgICAgdGhpcy5zY2FsZUNlbnRlciA9IG5ldyBWZWN0b3IyKCk7XHJcbiAgICAgICAgdGhpcy5hbHBoYSA9IDE7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnBhcmVudCA9IG51bGw7IFxyXG4gICAgICAgIHRoaXMuaWdub3JlR2xvYmFsVHJhbnNmb3JtID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gMDtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSAwO1xyXG4gICAgICAgIHRoaXMuX3NjYWxlID0gbmV3IFZlY3RvcjIoMSwgMSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGJlZm9yZVJlbmRlcihjb250ZXh0KSB7XHJcblxyXG4gICAgICAgIC8vIOyghOyXrSB0cmFuc2Zvcm3snYQg66y07Iuc7ZWgIOqyveyasCAtIFVJ65Ox7JeQIOyCrOyaqVxyXG4gICAgICAgIGlmICh0aGlzLmlnbm9yZUdsb2JhbE1hdHJpeCkge1xyXG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50R2xvYmFsVHJhbnNmb3JtID0gY29udGV4dC5jdXJyZW50VHJhbnNmb3JtO1xyXG4gICAgICAgICAgICBjb250ZXh0LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCAwLCAwKTsgLy8gY29udGV4dOydmCB0cmFuc2Zvcm3snYQgaWRlbnRpdHkgbWF0cml466GcIOyEpOyglVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29udGV4dC5zYXZlKCk7XHJcblxyXG4gICAgICAgIC8vIHBvc2l0aW9uXHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUodGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnkpO1xyXG5cclxuICAgICAgICAvLyByb3RhdGlvblxyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKHRoaXMucm90YXRpb25DZW50ZXIueCwgdGhpcy5yb3RhdGlvbkNlbnRlci55KTtcclxuICAgICAgICBjb250ZXh0LnJvdGF0ZSh0aGlzLnJvdGF0aW9uKTtcclxuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZSgtdGhpcy5yb3RhdGlvbkNlbnRlci54LCAtdGhpcy5yb3RhdGlvbkNlbnRlci55KTtcclxuXHJcbiAgICAgICAgLy8gc2NhbGVcclxuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZSh0aGlzLnNjYWxlQ2VudGVyLngsIHRoaXMuc2NhbGVDZW50ZXIueSk7XHJcbiAgICAgICAgY29udGV4dC5zY2FsZSh0aGlzLnNjYWxlWCwgdGhpcy5zY2FsZVkpO1xyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKC10aGlzLnNjYWxlQ2VudGVyLngsIC10aGlzLnNjYWxlQ2VudGVyLnkpO1xyXG5cclxuICAgICAgICAvLyBhbHBoYVxyXG4gICAgICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgKj0gdGhpcy5hbHBoYTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKGNvbnRleHQpIHtcclxuICAgICAgICAvLyDtlZjsnITtgbTrnpjsiqTsl5DshJwg6rWs7ZiEXHJcbiAgICB9XHJcblxyXG4gICAgYWZ0ZXJSZW5kZXIoY29udGV4dCkge1xyXG4gICAgICAgIGNvbnRleHQucmVzdG9yZSgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pZ25vcmVHbG9iYWxNYXRyaXgpXHJcbiAgICAgICAgICAgIGNvbnRleHQuc2V0VHJhbnNmb3JtKHRoaXMuX2N1cnJlbnRHbG9iYWxUcmFuc2Zvcm0pO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShkdCkge1xyXG4gICAgICAgIC8vIO2VmOychO2BtOuemOyKpOyXkOyEnCDqtaztmIRcclxuICAgIH1cclxuICAgIFxyXG4gICAgaW50ZXJzZWN0cyhnYW1lT2JqZWN0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYm91bmRzLmludGVyc2VjdHMoZ2FtZU9iamVjdCk7IC8vIO2KuOumrTogR2FtZU9iamVjdOyZgCBSZWN0YW5nbGUg66qo65GQIHgsIHksIHdpZHRoLCBoZWlnaHTqsIAg7J6I64uk64qUIOqyg+ydhCDsnbTsmqlcclxuICAgIH1cclxuXHJcbiAgICBpbnRlcnNlY3Rpb24oZ2FtZU9iamVjdCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmJvdW5kcy5pbnRlcnNlY3Rpb24oZ2FtZU9iamVjdCk7IC8vIO2KuOumrVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnRhaW5zKHZlYzIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ib3VuZHMuY29udGFpbnModmVjMik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGJvdW5kcygpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFJlY3RhbmdsZSh0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB4KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLng7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHgodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uLnggPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgeSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi55O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB5KHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbi55ID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHdpZHRoKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgd2lkdGgodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl93aWR0aCA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBoZWlnaHQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgaGVpZ2h0KHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHNjYWxlWCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2NhbGUueDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc2NhbGVYKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fc2NhbGUueCA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBzY2FsZVkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NjYWxlLnk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHNjYWxlWSh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX3NjYWxlLnkgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgR2FtZU9iamVjdCBmcm9tICcuL0dhbWVPYmplY3QnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250YWluZXIgZXh0ZW5kcyBHYW1lT2JqZWN0IHtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKGNvbnRleHQpIHtcclxuICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIGNoaWxkLmJlZm9yZVJlbmRlcihjb250ZXh0KTtcclxuICAgICAgICAgICAgY2hpbGQucmVuZGVyKGNvbnRleHQpO1xyXG4gICAgICAgICAgICBjaGlsZC5hZnRlclJlbmRlcihjb250ZXh0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGR0KSB7XHJcbiAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbilcclxuICAgICAgICAgICAgY2hpbGQudXBkYXRlKGR0KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRDaGlsZChjaGlsZCkge1xyXG4gICAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVDaGlsZChjaGlsZCkge1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKHRoaXMuY2hpbGRyZW4uaW5kZXhPZihjaGlsZCksIDEpO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCBDb250YWluZXIgZnJvbSAnLi9Db250YWluZXInXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2VuZSBleHRlbmRzIENvbnRhaW5lcntcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudWkgPSBuZXcgQ29udGFpbmVyKCk7XHJcbiAgICAgICAgdGhpcy51aS5pZ25vcmVHbG9iYWxUcmFuc2Zvcm0gPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucHJlbG9hZGVkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJlbG9hZCgpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGR0KSB7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKGR0KTtcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgQ29udGFpbmVyIGZyb20gJy4vQ29udGFpbmVyJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3ByaXRlIGV4dGVuZHMgQ29udGFpbmVyIHtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoaW1hZ2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLnRleHR1cmUgPSBpbWFnZTtcclxuICAgICAgICB0aGlzLl93aWR0aCA9IGltYWdlLndpZHRoO1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCA9IGltYWdlLmhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoY29udGV4dCkge1xyXG4gICAgICAgIHN1cGVyLnJlbmRlcihjb250ZXh0KTtcclxuICAgICAgICBjb250ZXh0LmRyYXdJbWFnZSh0aGlzLnRleHR1cmUsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB3aWR0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHdpZHRoKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fd2lkdGggPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9zY2FsZS54ID0gdmFsdWUgLyB0aGlzLnRleHR1cmUud2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGhlaWdodCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBoZWlnaHQodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9zY2FsZS55ID0gdmFsdWUgLyB0aGlzLnRleHR1cmUuaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBzY2FsZVgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NjYWxlLng7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHNjYWxlWCh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX3dpZHRoICo9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3NjYWxlLnggPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgc2NhbGVZKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zY2FsZS55O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBzY2FsZVkodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgKj0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fc2NhbGUueSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCBTcHJpdGUgZnJvbSAnLi9TcHJpdGUnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbmltYXRpb24gZXh0ZW5kcyBTcHJpdGUge1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihzcHJpdGVTaGVldCwgZnJhbWVSZWN0LCB0b3RhbEZyYW1lLCBmcmFtZVNwZWVkID0gNjApIHtcclxuICAgICAgICBzdXBlcihzcHJpdGVTaGVldCk7XHJcblxyXG4gICAgICAgIHRoaXMuZnJhbWVSZWN0ID0gZnJhbWVSZWN0O1xyXG4gICAgICAgIHRoaXMudG90YWxGcmFtZSA9IHRvdGFsRnJhbWU7XHJcbiAgICAgICAgdGhpcy5mcmFtZXNQZXJSb3cgPSBNYXRoLmZsb29yKHRoaXMudGV4dHVyZS53aWR0aCAvIGZyYW1lUmVjdC53aWR0aCk7XHJcbiAgICAgICAgdGhpcy5mcmFtZVNwZWVkID0gZnJhbWVTcGVlZDtcclxuXHJcbiAgICAgICAgdGhpcy5pc0xvb3AgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZnJhbWVTcGVlZCA9IDYwO1xyXG5cclxuICAgICAgICB0aGlzLl93aWR0aCA9IGZyYW1lUmVjdC53aWR0aDtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSBmcmFtZVJlY3QuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuX2ZyYW1lQ291bnQgPSAwO1xyXG4gICAgICAgIHRoaXMuX2lzUGxheWluZyA9IGZhbHNlO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwbGF5KGlzTG9vcCA9IHRydWUsIGZyYW1lU3BlZWQgPSA2MCkge1xyXG5cclxuICAgICAgICB0aGlzLmlzTG9vcCA9IGlzTG9vcDtcclxuICAgICAgICB0aGlzLmZyYW1lU3BlZWQgPSBmcmFtZVNwZWVkO1xyXG4gICAgICAgIHRoaXMuX2lzUGxheWluZyA9IHRydWU7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHN0b3AocmVzZXQgPSBmYWxzZSkge1xyXG5cclxuICAgICAgICBpZiAocmVzZXQpXHJcbiAgICAgICAgICAgIHRoaXMuX2ZyYW1lQ291bnQgPSAwO1xyXG4gICAgICAgIHRoaXMuX2lzUGxheWluZyA9IGZhbHNlO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZHQpIHtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLl9pc1BsYXlpbmcpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9mcmFtZUNvdW50ICs9IHRoaXMuZnJhbWVTcGVlZCAqIGR0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLl9mcmFtZUNvdW50ID49IHRoaXMudG90YWxGcmFtZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0xvb3ApXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mcmFtZUNvdW50ID0gMDtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5mcmFtZUNvdW50ID0gdGhpcy50b3RhbEZyYW1lIC0gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcihjb250ZXh0KSB7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKFxyXG4gICAgICAgICAgICB0aGlzLnRleHR1cmUsXHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggKiBNYXRoLmZsb29yKHRoaXMuX2ZyYW1lQ291bnQgJSB0aGlzLmZyYW1lc1BlclJvdyksXHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ICogTWF0aC5mbG9vcih0aGlzLl9mcmFtZUNvdW50IC8gdGhpcy5mcmFtZXNQZXJSb3cpLFxyXG4gICAgICAgICAgICB0aGlzLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgdGhpcy53aWR0aCxcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHRcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGN1cnJlbnRGcmFtZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZnJhbWVDb3VudDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaXNQbGF5aW5nKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc1BsYXlpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHdpZHRoKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgd2lkdGgodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl93aWR0aCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3NjYWxlLnggPSB2YWx1ZSAvIHRoaXMuZnJhbWVSZWN0LndpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBoZWlnaHQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgaGVpZ2h0KHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fc2NhbGUueSA9IHZhbHVlIC8gdGhpcy5mcmFtZVJlY3QuaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBzY2FsZVgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NjYWxlLng7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHNjYWxlWCh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX3dpZHRoICo9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3NjYWxlLnggPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgc2NhbGVZKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zY2FsZS55O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBzY2FsZVkodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgKj0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fc2NhbGUueSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxufVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQWUsTUFBTSxLQUFLLENBQUM7O0lBRXZCLFdBQVcsQ0FBQyxJQUFJLEVBQUU7O1FBRWQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7O1FBRWpCLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDOztRQUVyQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7O0tBRW5COztJQUVELFNBQVMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFOztRQUVmLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDO1lBQzdCLE9BQU8sSUFBSSxDQUFDOztRQUVoQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2hELE9BQU8sSUFBSSxDQUFDOztLQUVmOztJQUVELFNBQVMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFOztRQUVmLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFj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VUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDdkIsUUFBUSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDakIsUUFBUSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDcEIsUUFBUSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDdEIsUUFBUSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDcEIsUUFBUSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDdEIsUUFBUSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDeEIsUUFBUSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDeEIsUUFBUSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDckIsUUFBUSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDcEIsUUFBUSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDdEIsUUFBUSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDeEIsUUFBUSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDbEIsUUFBUSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDbkIsUUFBUSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDbkIsUUFBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDakIsUUFBUSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDcEIsUUFBUSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDbkIsUUFBUSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDckIsUUFBUSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDckIsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7QUFDeEIsUUFBUSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7QUFDeEIsUUFBUSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7QUFDeEIsUUFBUSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7QUFDeEIsUUFBUSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7QUFDeEIsUUFBUSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7QUFDeEIsUUFBUSxDQUFDLGVBQWUsR0FBRyxHQUFHLENBQUM7QUFDL0IsUUFBUSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7QUFDMUIsUUFBUSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUM7QUFDNUIsUUFBUSxDQUFDLGVBQWUsR0FBRyxHQUFHLENBQUM7QUFDL0IsUUFBUSxDQUFDLGNBQWMsR0FBRyxHQUFHLENBQUM7QUFDOUIsUUFBUSxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUM7QUFDN0IsUUFBUSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDbEIsUUFBUSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDbEIsUUFBUSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDbEIsUUFBUSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDbEIsUUFBUSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDbEIsUUFBUSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDbEIsUUFBUSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDbEIsUUFBUSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDbEIsUUFBUSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDbEIsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDbkIsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDbkIsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDbkIsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDbkIsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDbkIsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDbkIsUUFBUSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7QUFDekIsUUFBUSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDckIsUUFBUSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDckIsUUFBUSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDckIsUUFBUSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7QUFDdEIsUUFBUSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDckIsUUFBUSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7QUFDekIsUUFBUSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7QUFDM0IsUUFBUSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7QUFDekIsUUFBUSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUM7QUFDNUIsUUFBUSxDQUFDLEtB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QUM7O1FBRWhCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkUsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztRQUV0RSxPQUFPLElBQUksU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDOztLQUU3Qzs7SUFFRCxRQUFRLENBQUMsSUFBSSxFQUFFO1FBQ1gsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNqSDs7SUFFRCxLQUFLLEdBQUc7UUFDSixPQUFPLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMs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
