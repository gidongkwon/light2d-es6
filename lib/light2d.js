(function (exports) {
'use strict';

class Asset {

    constructor (game) {

        this.game = game;
        
        this.loadedFiles = 0;
        
        this.toLoad = new Map();
        this.image = {};
        this.audio = {};

    }

    
    loadImage (id, url) {

        if (this.image.hasOwnProperty(id))
            return this;
        
        this.toLoad.set(id, new File('image', id, url));
        return this;

    }

    
    loadAudio (id, url) {

        if (this.audio.hasOwnProperty(id))
            return this;

        this.toLoad.set(id, new File('audio', id, url));
        return this;

    }

    
    // private
    startLoad () {

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


    get totalFiles () {
        return this.toLoad.size;
    }

    
    get progressAsPercent () {

        return (this.loadingFiles === 0) ? 0 : this.loadedFiles / this.totalFiles * 100;

    }

}


const loadHanlder = function (event) {

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

    constructor (type, id, url) {

        this.type = type;
        this.id = id;
        this.url = url;

    }

}

class SceneManager {

    constructor (game) {

        this.game = game;
        this._currentScene = null;

    }


    change (scene) {

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


    get current () {
        return this._currentScene;
    }

}

class Keyboard {

    constructor (game) {
    
        this.game = game;
        this.keyPressed = [];
        this.keyCapturing = [];

        window.addEventListener('keydown', this.keyDownHandler.bind(this));
        window.addEventListener('keyup', this.keyUpHandler.bind(this));

    }

    
    keyDownHandler (event) {

        if (this.keyCapturing.includes(event.keyCode))
            event.preventDefault();

        this.keyPressed[event.keyCode] = true;

    }


    keyUpHandler (event) {
        this.keyPressed[event.keyCode] = false;
    }


    pressed (keyCode) {
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

class Game {

    constructor (canvasId, width = 800, height = 600, backgroundColor = '#fff') {

        this.canvasId = canvasId;
        this.width = width;
        this.height = height;
        this.backgroundColor = backgroundColor;
        
        this.canvas = null;
        this.context = null;

        this.asset = new Asset(this);
        this.scenes = new SceneManager(this);
        this.keyboard = new Keyboard(this);
        //this.camera = new Camera();
        //this.mouse = new Mouse();
        //this.physics = new Physics();

        this.dt = 0;

        this.inited = false;

        document.addEventListener('DOMContentLoaded', this.init.bind(this), true);

    }


    init () {

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


    run () {
        
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

    
    update (dt) {

        // this.mouse.update(dt);
        // this.physics.update(dt);

        if (this.scenes.current && this.scenes.current.preloaded)
            this.scenes.current.update(dt);

    }


    render (context) {

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


    get fps () {
        return this._fps;
    }

}

class Vector2 {

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

class Rectangle$1 {

    constructor (x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }


    intersects (rect) {
        return !(this.x + this.width < rect.x || this.y + this.height < rect.y || rect.x + rect.width < this.x || rect.y + rect.height < this.y);
    }


    intersection (rect) {

        if (!this.intersects(rect))
            return null;

        let x = Math.max(this.x, rect.x);
        let y = Math.max(this.y, rect.y);
        let width = Math.min(this.x + this.width, rect.x + rect.width) - x;
        let height = Math.min(this.y + this.height, rect.y + rect.height) - y;

        return new Rectangle$1(x, y, width, height);

    }
    
    
    contains (vec2) {
        return !(this.x > vec2.x || this.x + this.width < vec2.x || this.y > vec2.y || this.y + this.height < vec2.y);
    }


    clone () {
        return new Rectangle$1(this.x, this.y, this.width, this.height);
    }


    get center () {
        return new Vector2(this.x + this.width / 2, this.y + this.height / 2);
    }

}

class GameObject {

    constructor () {

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


    beforeRender (context) {

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


    render (context) {
        // 하위클래스에서 구현
    }


    afterRender (context) {
        context.restore();

        if (this.ignoreGlobalMatrix)
            context.setTransform(this._currentGlobalTransform);
    }


    update (dt) {
        // 하위클래스에서 구현
    }

    
    intersects (gameObject) {
        return bounds.intersects(gameObject); // 트릭: GameObject와 Rectangle 모두 x, y, width, height가 있다는 것을 이용
    }


    intersection (gameObject) {
        return bounds.intersection(gameObject); // 트릭
    }


    contains (vec2) {
        return bounds.contains(vec2);
    }


    get bounds () {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }


    get x () {
        return this.position.x;
    }


    set x (value) {
        this.position.x = value;
    }


    get y () {
        return this.position.y;
    }


    set y (value) {
        this.position.y = value;
    }


    get width () {
        return this._width;
    }


    set width (value) {
        this._width = value;
    }


    get height () {
        return this._height;
    }


    set height (value) {
        this._height = value;
    }


    get scaleX () {
        return this._scale.x;
    }


    set scaleX (value) {
        this._scale.x = value;
    }


    get scaleY () {
        return this._scale.y;
    }


    set scaleY (value) {
        this._scale.y = value;
    }

}

class Container extends GameObject {
    
    constructor () {
        super();
        this.children = [];
    }


    render (context) {
        for (let child of this.children) {
            child.beforeRender(context);
            child.render(context);
            child.afterRender(context);
        }
    }


    update (dt) {
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

    constructor () {
        super();
        
        this.ui = new Container();
        this.ui.ignoreGlobalTransform = true;
        this.preloaded = false;
    }


    preload () {

    }


    update (dt) {
        super.update(dt);
    }

}

class Sprite extends Container {
    
    constructor (image) {
        super();

        this.texture = image;
        this._width = image.width;
        this._height = image.height;
    }


    render (context) {
        super.render(context);
        context.drawImage(this.texture, 0, 0);
    }


    get width () {
        return this._width;
    }


    set width (value) {
        this._width = value;
        this._scale.x = value / this.texture.width;
    }


    get height () {
        return this._height;
    }


    set height (value) {
        this._height = value;
        this._scale.y = value / this.texture.height;
    }


    get scaleX () {
        return this._scale.x;
    }


    set scaleX (value) {
        this._width *= value;
        this._scale.x = value;
    }


    get scaleY () {
        return this._scale.y;
    }


    set scaleY (value) {
        this._height *= value;
        this._scale.y = value;
    }

}

exports.Game = Game;
exports.Keyboard = Keyboard;
exports.Vector2 = Vector2;
exports.Rectangle = Rectangle$1;
exports.Container = Container;
exports.GameObject = GameObject;
exports.Scene = Scene;
exports.Sprite = Sprite;

}((this.light2d = this.light2d || {})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlnaHQyZC5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2NvcmUvQXNzZXQuanMiLCIuLi9zcmMvY29yZS9TY2VuZU1hbmFnZXIuanMiLCIuLi9zcmMvaW5wdXQvS2V5Ym9hcmQuanMiLCIuLi9zcmMvY29yZS9HYW1lLmpzIiwiLi4vc3JjL2dlb20vVmVjdG9yMi5qcyIsIi4uL3NyYy9nZW9tL1JlY3RhbmdsZS5qcyIsIi4uL3NyYy9nYW1lb2JqZWN0cy9HYW1lT2JqZWN0LmpzIiwiLi4vc3JjL2dhbWVvYmplY3RzL0NvbnRhaW5lci5qcyIsIi4uL3NyYy9nYW1lb2JqZWN0cy9TY2VuZS5qcyIsIi4uL3NyYy9nYW1lb2JqZWN0cy9TcHJpdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXNzZXQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChnYW1lKSB7XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5sb2FkZWRGaWxlcyA9IDA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy50b0xvYWQgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IHt9O1xyXG4gICAgICAgIHRoaXMuYXVkaW8gPSB7fTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBsb2FkSW1hZ2UgKGlkLCB1cmwpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UuaGFzT3duUHJvcGVydHkoaWQpKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnRvTG9hZC5zZXQoaWQsIG5ldyBGaWxlKCdpbWFnZScsIGlkLCB1cmwpKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBsb2FkQXVkaW8gKGlkLCB1cmwpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYXVkaW8uaGFzT3duUHJvcGVydHkoaWQpKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy50b0xvYWQuc2V0KGlkLCBuZXcgRmlsZSgnYXVkaW8nLCBpZCwgdXJsKSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgLy8gcHJpdmF0ZVxyXG4gICAgc3RhcnRMb2FkICgpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgZmlsZSBvZiB0aGlzLnRvTG9hZC52YWx1ZXMoKSkge1xyXG5cclxuICAgICAgICAgICAgc3dpdGNoIChmaWxlLnR5cGUpIHtcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ2ltYWdlJzpcclxuICAgICAgICAgICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgICAgIGltZy5zcmMgPSBmaWxlLnVybDtcclxuICAgICAgICAgICAgICAgIGltZy5hc3NldElkID0gZmlsZS5pZDtcclxuICAgICAgICAgICAgICAgIGltZy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgbG9hZEhhbmxkZXIuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ2F1ZGlvJzpcclxuICAgICAgICAgICAgICAgIGxldCBhdWQgPSBuZXcgQXVkaW8oZmlsZS51cmwpO1xyXG4gICAgICAgICAgICAgICAgYXVkLmFzc2V0SWQgPSBmaWxlLmlkO1xyXG4gICAgICAgICAgICAgICAgYXVkLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBsb2FkSGFubGRlci5iaW5kKHRoaXMpKTtcclxuICAgICAgICAgICAgICAgIGF1ZC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnbG9hZCcpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXQgdG90YWxGaWxlcyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudG9Mb2FkLnNpemU7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBnZXQgcHJvZ3Jlc3NBc1BlcmNlbnQgKCkge1xyXG5cclxuICAgICAgICByZXR1cm4gKHRoaXMubG9hZGluZ0ZpbGVzID09PSAwKSA/IDAgOiB0aGlzLmxvYWRlZEZpbGVzIC8gdGhpcy50b3RhbEZpbGVzICogMTAwO1xyXG5cclxuICAgIH1cclxuXHJcbn1cclxuXHJcblxyXG5jb25zdCBsb2FkSGFubGRlciA9IGZ1bmN0aW9uIChldmVudCkge1xyXG5cclxuICAgIGV2ZW50LnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgbG9hZEhhbmxkZXIpO1xyXG4gICAgXHJcbiAgICBjb25zdCBmaWxlID0gdGhpcy50b0xvYWQuZ2V0KGV2ZW50LnRhcmdldC5hc3NldElkKTtcclxuICAgIFxyXG4gICAgdGhpc1tmaWxlLnR5cGVdW2ZpbGUuaWRdID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgdGhpcy5sb2FkZWRGaWxlcysrO1xyXG4gICAgXHJcbiAgICBpZih0aGlzLmxvYWRlZEZpbGVzID09PSB0aGlzLnRvdGFsRmlsZXMpIHtcclxuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncHJlbG9hZGVkJykpO1xyXG4gICAgICAgIHRoaXMudG9Mb2FkLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5sb2FkZWRGaWxlcyA9IDA7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5cclxuY2xhc3MgRmlsZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHR5cGUsIGlkLCB1cmwpIHtcclxuXHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XHJcblxyXG4gICAgfVxyXG5cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjZW5lTWFuYWdlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKGdhbWUpIHtcclxuXHJcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcclxuICAgICAgICB0aGlzLl9jdXJyZW50U2NlbmUgPSBudWxsO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgY2hhbmdlIChzY2VuZSkge1xyXG5cclxuICAgICAgICB0aGlzLl9jdXJyZW50U2NlbmUgPSBzY2VuZTtcclxuICAgICAgICB0aGlzLl9jdXJyZW50U2NlbmUucHJlbG9hZCgpO1xyXG5cclxuICAgICAgICB0aGlzLmdhbWUuYXNzZXQuc3RhcnRMb2FkKCk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3ByZWxvYWRlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fY3VycmVudFNjZW5lLnByZWxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRTY2VuZS5pbml0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKCF0aGlzLmdhbWUuaW5pdGVkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8vdGhpcy5nYW1lLmNhbWVyYS5yZXNldCgpO1xyXG4gICAgICAgIC8vdGhpcy5nYW1lLnBoeXNpY3MucmVzZXQoKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldCBjdXJyZW50ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY3VycmVudFNjZW5lO1xyXG4gICAgfVxyXG5cclxufSIsIlxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBLZXlib2FyZCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKGdhbWUpIHtcclxuICAgIFxyXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcbiAgICAgICAgdGhpcy5rZXlQcmVzc2VkID0gW107XHJcbiAgICAgICAgdGhpcy5rZXlDYXB0dXJpbmcgPSBbXTtcclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleURvd25IYW5kbGVyLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMua2V5VXBIYW5kbGVyLmJpbmQodGhpcykpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIGtleURvd25IYW5kbGVyIChldmVudCkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5rZXlDYXB0dXJpbmcuaW5jbHVkZXMoZXZlbnQua2V5Q29kZSkpXHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIHRoaXMua2V5UHJlc3NlZFtldmVudC5rZXlDb2RlXSA9IHRydWU7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBrZXlVcEhhbmRsZXIgKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5rZXlQcmVzc2VkW2V2ZW50LmtleUNvZGVdID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByZXNzZWQgKGtleUNvZGUpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgJHtrZXlDb2RlfSA6ICR7dGhpcy5rZXlQcmVzc2VkW2tleUNvZGVdfWApO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmtleVByZXNzZWRba2V5Q29kZV07XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5cclxuS2V5Ym9hcmQuQSA9ICdBJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5CID0gJ0InLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLkMgPSAnQycuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuRCA9ICdEJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5FID0gJ0UnLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLkYgPSAnRicuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuRyA9ICdHJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5IID0gJ0gnLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLkkgPSAnSScuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuSiA9ICdKJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5LID0gJ0snLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLkwgPSAnTCcuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuTSA9ICdNJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5OID0gJ04nLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLk8gPSAnTycuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuUCA9ICdQJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5RID0gJ1EnLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLlIgPSAnUicuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuUyA9ICdTJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5UID0gJ1QnLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLlUgPSAnVScuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuViA9ICdWJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5XID0gJ1cnLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLlggPSAnWCcuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuWSA9ICdZJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5aID0gJ1onLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLkJBQ0tTUEFDRSA9IDg7XHJcbktleWJvYXJkLlRBUCA9IDk7XHJcbktleWJvYXJkLkVOVEVSID0gMTM7XHJcbktleWJvYXJkLkNPTU1BTkQgPSAxNTtcclxuS2V5Ym9hcmQuU0hJRlQgPSAxNjtcclxuS2V5Ym9hcmQuQ09OVFJPTCA9IDE3O1xyXG5LZXlib2FyZC5BTFRFUk5BVEUgPSAxODtcclxuS2V5Ym9hcmQuQ0FQU19MT0NLID0gMjA7XHJcbktleWJvYXJkLkVTQ0FQRSA9IDI3O1xyXG5LZXlib2FyZC5TUEFDRSA9IDMyO1xyXG5LZXlib2FyZC5QQUdFX1VQID0gMzM7XHJcbktleWJvYXJkLlBBR0VfRE9XTiA9IDM0O1xyXG5LZXlib2FyZC5FTkQgPSAzNTtcclxuS2V5Ym9hcmQuSE9NRSA9IDM2O1xyXG5LZXlib2FyZC5MRUZUID0gMzc7XHJcbktleWJvYXJkLlVQID0gMzg7XHJcbktleWJvYXJkLlJJR0hUID0gMzk7XHJcbktleWJvYXJkLkRPV04gPSA0MDtcclxuS2V5Ym9hcmQuSU5TRVJUID0gNDU7XHJcbktleWJvYXJkLkRFTEVURSA9IDQ2O1xyXG5LZXlib2FyZC5OVU1CRVJfMSA9IDQ5O1xyXG5LZXlib2FyZC5OVU1CRVJfMiA9IDUwO1xyXG5LZXlib2FyZC5OVU1CRVJfMyA9IDUxO1xyXG5LZXlib2FyZC5OVU1CRVJfNCA9IDUyO1xyXG5LZXlib2FyZC5OVU1CRVJfNSA9IDUzO1xyXG5LZXlib2FyZC5OVU1CRVJfNiA9IDU0O1xyXG5LZXlib2FyZC5OVU1CRVJfNyA9IDU1O1xyXG5LZXlib2FyZC5OVU1CRVJfOCA9IDU2O1xyXG5LZXlib2FyZC5OVU1CRVJfOSA9IDU3O1xyXG5LZXlib2FyZC5OVU1QQURfMCA9IDk2O1xyXG5LZXlib2FyZC5OVU1QQURfMSA9IDk3O1xyXG5LZXlib2FyZC5OVU1QQURfMiA9IDk4O1xyXG5LZXlib2FyZC5OVU1QQURfMyA9IDk5O1xyXG5LZXlib2FyZC5OVU1QQURfNCA9IDEwMDtcclxuS2V5Ym9hcmQuTlVNUEFEXzUgPSAxMDE7XHJcbktleWJvYXJkLk5VTVBBRF82ID0gMTAyO1xyXG5LZXlib2FyZC5OVU1QQURfNyA9IDEwMztcclxuS2V5Ym9hcmQuTlVNUEFEXzggPSAxMDQ7XHJcbktleWJvYXJkLk5VTVBBRF85ID0gMTA1O1xyXG5LZXlib2FyZC5OVU1QQURfTVVMVElQTFkgPSAxMDY7XHJcbktleWJvYXJkLk5VTVBBRF9BREQgPSAxMDc7XHJcbktleWJvYXJkLk5VTVBBRF9FTlRFUiA9IDEwODtcclxuS2V5Ym9hcmQuTlVNUEFEX1NVQlRSQUNUID0gMTA5O1xyXG5LZXlib2FyZC5OVU1QQURfREVNSUNBTCA9IDExMDtcclxuS2V5Ym9hcmQuTlVNUEFEX0RJVklERSA9IDExMTtcclxuS2V5Ym9hcmQuRjEgPSAxMTI7XHJcbktleWJvYXJkLkYyID0gMTEzO1xyXG5LZXlib2FyZC5GMyA9IDExNDtcclxuS2V5Ym9hcmQuRjQgPSAxMTU7XHJcbktleWJvYXJkLkY1ID0gMTE2O1xyXG5LZXlib2FyZC5GNiA9IDExNztcclxuS2V5Ym9hcmQuRjcgPSAxMTg7XHJcbktleWJvYXJkLkY4ID0gMTE5O1xyXG5LZXlib2FyZC5GOSA9IDEyMDtcclxuS2V5Ym9hcmQuRjEwID0gMTIxO1xyXG5LZXlib2FyZC5GMTEgPSAxMjI7XHJcbktleWJvYXJkLkYxMiA9IDEyMztcclxuS2V5Ym9hcmQuRjEzID0gMTI0O1xyXG5LZXlib2FyZC5GMTQgPSAxMjU7XHJcbktleWJvYXJkLkYxNSA9IDEyNjtcclxuS2V5Ym9hcmQuU0VNSUNPTE9OID0gMTg2O1xyXG5LZXlib2FyZC5FUVVBTCA9IDE4NztcclxuS2V5Ym9hcmQuQ09NTUEgPSAxODg7XHJcbktleWJvYXJkLk1JTlVTID0gMTg5O1xyXG5LZXlib2FyZC5QRVJJT0QgPSAxOTA7XHJcbktleWJvYXJkLlNMQVNIID0gMTkxO1xyXG5LZXlib2FyZC5CQUNLUVVPVEUgPSAxOTI7XHJcbktleWJvYXJkLkxFRlRCUkFDS0VUID0gMjE5O1xyXG5LZXlib2FyZC5CQUNLU0xBU0ggPSAyMjA7XHJcbktleWJvYXJkLlJJR0hUQlJBQ0tFVCA9IDIyMTtcclxuS2V5Ym9hcmQuUVVPVEUgPSAyMjI7IiwiaW1wb3J0IEFzc2V0IGZyb20gJy4vQXNzZXQnXHJcbmltcG9ydCBTY2VuZU1hbmFnZXIgZnJvbSAnLi9TY2VuZU1hbmFnZXInXHJcbmltcG9ydCBDYW1lcmEgZnJvbSAnLi9DYW1lcmEnXHJcbmltcG9ydCBLZXlib2FyZCBmcm9tICcuLi9pbnB1dC9LZXlib2FyZCdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWUge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChjYW52YXNJZCwgd2lkdGggPSA4MDAsIGhlaWdodCA9IDYwMCwgYmFja2dyb3VuZENvbG9yID0gJyNmZmYnKSB7XHJcblxyXG4gICAgICAgIHRoaXMuY2FudmFzSWQgPSBjYW52YXNJZDtcclxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSBiYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuYXNzZXQgPSBuZXcgQXNzZXQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5zY2VuZXMgPSBuZXcgU2NlbmVNYW5hZ2VyKHRoaXMpO1xyXG4gICAgICAgIHRoaXMua2V5Ym9hcmQgPSBuZXcgS2V5Ym9hcmQodGhpcyk7XHJcbiAgICAgICAgLy90aGlzLmNhbWVyYSA9IG5ldyBDYW1lcmEoKTtcclxuICAgICAgICAvL3RoaXMubW91c2UgPSBuZXcgTW91c2UoKTtcclxuICAgICAgICAvL3RoaXMucGh5c2ljcyA9IG5ldyBQaHlzaWNzKCk7XHJcblxyXG4gICAgICAgIHRoaXMuZHQgPSAwO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgdGhpcy5pbml0LmJpbmQodGhpcyksIHRydWUpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgaW5pdCAoKSB7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCB0aGlzLmluaXQsIHRydWUpO1xyXG5cclxuICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY2FudmFzSWQpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuY2FudmFzKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLmNhbnZhc0lkfeulvCDssL7snYQg7IiYIOyXhuyKteuLiOuLpC5gKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG4gICAgICAgIHRoaXMuX3RpbWUgPSBEYXRlLm5vdygpO1xyXG4gICAgICAgIHRoaXMuX2Zwc1N0YXJ0VGltZSA9IERhdGUubm93KCk7XHJcbiAgICAgICAgdGhpcy5fZnBzID0gNjA7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9yYWZJZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5ydW4uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBydW4gKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuZHQgPSAoRGF0ZS5ub3coKSAtIHRoaXMuX3RpbWUpIC8gMTAwMDtcclxuXHJcbiAgICAgICAgaWYgKERhdGUubm93KCkgLSB0aGlzLl9mcHNTdGFydFRpbWUgPiA1MDApIHtcclxuICAgICAgICAgICAgdGhpcy5fZnBzU3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcclxuICAgICAgICAgICAgdGhpcy5fZnBzID0gTWF0aC5tYXgoTWF0aC5yb3VuZCgxIC8gdGhpcy5kdCksIDYwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlKHRoaXMuZHQpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKHRoaXMuY29udGV4dCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fdGltZSA9IERhdGUubm93KCk7XHJcbiAgICAgICAgdGhpcy5fcmFmSWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucnVuLmJpbmQodGhpcykpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHVwZGF0ZSAoZHQpIHtcclxuXHJcbiAgICAgICAgLy8gdGhpcy5tb3VzZS51cGRhdGUoZHQpO1xyXG4gICAgICAgIC8vIHRoaXMucGh5c2ljcy51cGRhdGUoZHQpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zY2VuZXMuY3VycmVudCAmJiB0aGlzLnNjZW5lcy5jdXJyZW50LnByZWxvYWRlZClcclxuICAgICAgICAgICAgdGhpcy5zY2VuZXMuY3VycmVudC51cGRhdGUoZHQpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgcmVuZGVyIChjb250ZXh0KSB7XHJcblxyXG4gICAgICAgIGxldCB0YXJnZXRYID0gdGhpcy53aWR0aCAvIDI7XHJcbiAgICAgICAgbGV0IHRhcmdldFkgPSB0aGlzLmhlaWdodCAvIDI7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc2F2ZSgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuYmFja2dyb3VuZENvbG9yO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gY29udGV4dC50cmFuc2xhdGUodGFyZ2V0WCwgdGFyZ2V0WSk7XHJcbiAgICAgICAgLy8gY29udGV4dC5zY2FsZSh0aGlzLmNhbWVyYS5zY2FsZS54LCB0aGlzLmNhbWVyYS5zY2FsZS55KTtcclxuICAgICAgICAvLyBjb250ZXh0LnRyYW5zbGF0ZSgtdGFyZ2V0WCwgLXRhcmdldFkpO1xyXG5cclxuICAgICAgICAvLyBjb250ZXh0LnRyYW5zbGF0ZSgtdGhpcy5jYW1lcmEueCwgLXRoaXMuY2FtZXJhLnkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLnNjZW5lcy5jdXJyZW50LnByZWxvYWRlZCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLnNjZW5lcy5jdXJyZW50LmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5iZWZvcmVSZW5kZXIoY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5yZW5kZXIoY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5hZnRlclJlbmRlcihjb250ZXh0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29udGV4dC5yZXN0b3JlKCk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXQgZnBzICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZnBzO1xyXG4gICAgfVxyXG5cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFZlY3RvcjIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICh4ID0gMCwgeSA9IDApIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFkZCAodmVjMikge1xyXG4gICAgICAgIHRoaXMueCA9IHZlYzIueDtcclxuICAgICAgICB0aGlzLnkgPSB2ZWMyLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHN1YnRyYWN0ICh2ZWMyKSB7XHJcbiAgICAgICAgdGhpcy54IC09IHZlYzIueDtcclxuICAgICAgICB0aGlzLnkgLT0gdmVjMi55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBtdWx0aXBseSAodmVjMikge1xyXG4gICAgICAgIHRoaXMueCAqPSB2ZWMyLng7XHJcbiAgICAgICAgdGhpcy55ICo9IHZlYzIueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcblxyXG4gICAgZGl2aWRlICh2ZWMyKSB7XHJcbiAgICAgICAgdGhpcy54IC89IHZlYzIueDtcclxuICAgICAgICB0aGlzLnkgLz0gdmVjMi55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhbmdsZSAodmVjMikge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmF0YW4yKHZlYzIueSAtIHRoaXMueSwgdmVjMi54IC0gdGhpcy54KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZGlzdGFuY2UgKHZlYzIpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHZlYzIueCAtIHRoaXMueCwgMikgKyBNYXRoLnBvdyh2ZWMyLnkgLSB0aGlzLnksIDIpKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZGlzdGFuY2VTcSAodmVjMikge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnBvdyh2ZWMyLnggLSB0aGlzLngsIDIpICsgTWF0aC5wb3codmVjMi55IC0gdGhpcy55LCAyKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgY2xvbmUgKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMih0aGlzLngsIHRoaXMueSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgVmVjdG9yMiBmcm9tICcuL1ZlY3RvcjInXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0YW5nbGUge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICh4ID0gMCwgeSA9IDAsIHdpZHRoID0gMCwgaGVpZ2h0ID0gMCkge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGludGVyc2VjdHMgKHJlY3QpIHtcclxuICAgICAgICByZXR1cm4gISh0aGlzLnggKyB0aGlzLndpZHRoIDwgcmVjdC54IHx8IHRoaXMueSArIHRoaXMuaGVpZ2h0IDwgcmVjdC55IHx8IHJlY3QueCArIHJlY3Qud2lkdGggPCB0aGlzLnggfHwgcmVjdC55ICsgcmVjdC5oZWlnaHQgPCB0aGlzLnkpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBpbnRlcnNlY3Rpb24gKHJlY3QpIHtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmludGVyc2VjdHMocmVjdCkpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICBsZXQgeCA9IE1hdGgubWF4KHRoaXMueCwgcmVjdC54KTtcclxuICAgICAgICBsZXQgeSA9IE1hdGgubWF4KHRoaXMueSwgcmVjdC55KTtcclxuICAgICAgICBsZXQgd2lkdGggPSBNYXRoLm1pbih0aGlzLnggKyB0aGlzLndpZHRoLCByZWN0LnggKyByZWN0LndpZHRoKSAtIHg7XHJcbiAgICAgICAgbGV0IGhlaWdodCA9IE1hdGgubWluKHRoaXMueSArIHRoaXMuaGVpZ2h0LCByZWN0LnkgKyByZWN0LmhlaWdodCkgLSB5O1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFJlY3RhbmdsZSh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICB9XHJcbiAgICBcclxuICAgIFxyXG4gICAgY29udGFpbnMgKHZlYzIpIHtcclxuICAgICAgICByZXR1cm4gISh0aGlzLnggPiB2ZWMyLnggfHwgdGhpcy54ICsgdGhpcy53aWR0aCA8IHZlYzIueCB8fCB0aGlzLnkgPiB2ZWMyLnkgfHwgdGhpcy55ICsgdGhpcy5oZWlnaHQgPCB2ZWMyLnkpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBjbG9uZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBSZWN0YW5nbGUodGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0IGNlbnRlciAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMueCArIHRoaXMud2lkdGggLyAyLCB0aGlzLnkgKyB0aGlzLmhlaWdodCAvIDIpO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCBWZWN0b3IyIGZyb20gJy4uL2dlb20vVmVjdG9yMidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVPYmplY3Qge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBWZWN0b3IyKCk7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvbiA9IDA7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvbkNlbnRlciA9IG5ldyBWZWN0b3IyKCk7XHJcbiAgICAgICAgdGhpcy5zY2FsZUNlbnRlciA9IG5ldyBWZWN0b3IyKCk7XHJcbiAgICAgICAgdGhpcy5hbHBoYSA9IDE7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnBhcmVudCA9IG51bGw7IFxyXG4gICAgICAgIHRoaXMuaWdub3JlR2xvYmFsVHJhbnNmb3JtID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gMDtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSAwO1xyXG4gICAgICAgIHRoaXMuX3NjYWxlID0gbmV3IFZlY3RvcjIoMSwgMSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBiZWZvcmVSZW5kZXIgKGNvbnRleHQpIHtcclxuXHJcbiAgICAgICAgLy8g7KCE7JetIHRyYW5zZm9ybeydhCDrrLTsi5ztlaAg6rK97JqwIC0gVUnrk7Hsl5Ag7IKs7JqpXHJcbiAgICAgICAgaWYgKHRoaXMuaWdub3JlR2xvYmFsTWF0cml4KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRHbG9iYWxUcmFuc2Zvcm0gPSBjb250ZXh0LmN1cnJlbnRUcmFuc2Zvcm07XHJcbiAgICAgICAgICAgIGNvbnRleHQuc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIDAsIDApOyAvLyBjb250ZXh07J2YIHRyYW5zZm9ybeydhCBpZGVudGl0eSBtYXRyaXjroZwg7ISk7KCVXHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb250ZXh0LnNhdmUoKTtcclxuXHJcbiAgICAgICAgLy8gcG9zaXRpb25cclxuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZSh0aGlzLnBvc2l0aW9uLngsIHRoaXMucG9zaXRpb24ueSk7XHJcblxyXG4gICAgICAgIC8vIHJvdGF0aW9uXHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUodGhpcy5yb3RhdGlvbkNlbnRlci54LCB0aGlzLnJvdGF0aW9uQ2VudGVyLnkpO1xyXG4gICAgICAgIGNvbnRleHQucm90YXRlKHRoaXMucm90YXRpb24pO1xyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKC10aGlzLnJvdGF0aW9uQ2VudGVyLngsIC10aGlzLnJvdGF0aW9uQ2VudGVyLnkpO1xyXG5cclxuICAgICAgICAvLyBzY2FsZVxyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKHRoaXMuc2NhbGVDZW50ZXIueCwgdGhpcy5zY2FsZUNlbnRlci55KTtcclxuICAgICAgICBjb250ZXh0LnNjYWxlKHRoaXMuc2NhbGVYLCB0aGlzLnNjYWxlWSk7XHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoLXRoaXMuc2NhbGVDZW50ZXIueCwgLXRoaXMuc2NhbGVDZW50ZXIueSk7XHJcblxyXG4gICAgICAgIC8vIGFscGhhXHJcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSAqPSB0aGlzLmFscGhhO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgcmVuZGVyIChjb250ZXh0KSB7XHJcbiAgICAgICAgLy8g7ZWY7JyE7YG0656Y7Iqk7JeQ7IScIOq1rO2YhFxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhZnRlclJlbmRlciAoY29udGV4dCkge1xyXG4gICAgICAgIGNvbnRleHQucmVzdG9yZSgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pZ25vcmVHbG9iYWxNYXRyaXgpXHJcbiAgICAgICAgICAgIGNvbnRleHQuc2V0VHJhbnNmb3JtKHRoaXMuX2N1cnJlbnRHbG9iYWxUcmFuc2Zvcm0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB1cGRhdGUgKGR0KSB7XHJcbiAgICAgICAgLy8g7ZWY7JyE7YG0656Y7Iqk7JeQ7IScIOq1rO2YhFxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgaW50ZXJzZWN0cyAoZ2FtZU9iamVjdCkge1xyXG4gICAgICAgIHJldHVybiBib3VuZHMuaW50ZXJzZWN0cyhnYW1lT2JqZWN0KTsgLy8g7Yq466atOiBHYW1lT2JqZWN07JmAIFJlY3RhbmdsZSDrqqjrkZAgeCwgeSwgd2lkdGgsIGhlaWdodOqwgCDsnojri6TripQg6rKD7J2EIOydtOyaqVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBpbnRlcnNlY3Rpb24gKGdhbWVPYmplY3QpIHtcclxuICAgICAgICByZXR1cm4gYm91bmRzLmludGVyc2VjdGlvbihnYW1lT2JqZWN0KTsgLy8g7Yq466atXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGNvbnRhaW5zICh2ZWMyKSB7XHJcbiAgICAgICAgcmV0dXJuIGJvdW5kcy5jb250YWlucyh2ZWMyKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0IGJvdW5kcyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBSZWN0YW5nbGUodGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0IHggKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLng7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHNldCB4ICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24ueCA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXQgeSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb24ueTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgc2V0IHkgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbi55ID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldCB3aWR0aCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dpZHRoO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBzZXQgd2lkdGggKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fd2lkdGggPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0IGhlaWdodCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgc2V0IGhlaWdodCAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0IHNjYWxlWCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NjYWxlLng7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHNldCBzY2FsZVggKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fc2NhbGUueCA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXQgc2NhbGVZICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2NhbGUueTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgc2V0IHNjYWxlWSAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9zY2FsZS55ID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IEdhbWVPYmplY3QgZnJvbSAnLi9HYW1lT2JqZWN0J1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGFpbmVyIGV4dGVuZHMgR2FtZU9iamVjdCB7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcmVuZGVyIChjb250ZXh0KSB7XHJcbiAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICBjaGlsZC5iZWZvcmVSZW5kZXIoY29udGV4dCk7XHJcbiAgICAgICAgICAgIGNoaWxkLnJlbmRlcihjb250ZXh0KTtcclxuICAgICAgICAgICAgY2hpbGQuYWZ0ZXJSZW5kZXIoY29udGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICB1cGRhdGUgKGR0KSB7XHJcbiAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbilcclxuICAgICAgICAgICAgY2hpbGQudXBkYXRlKGR0KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgYWRkQ2hpbGQoY2hpbGQpIHtcclxuICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHJlbW92ZUNoaWxkKGNoaWxkKSB7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UodGhpcy5jaGlsZHJlbi5pbmRleE9mKGNoaWxkKSwgMSk7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IENvbnRhaW5lciBmcm9tICcuL0NvbnRhaW5lcidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjZW5lIGV4dGVuZHMgQ29udGFpbmVye1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudWkgPSBuZXcgQ29udGFpbmVyKCk7XHJcbiAgICAgICAgdGhpcy51aS5pZ25vcmVHbG9iYWxUcmFuc2Zvcm0gPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucHJlbG9hZGVkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByZWxvYWQgKCkge1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgdXBkYXRlIChkdCkge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShkdCk7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IENvbnRhaW5lciBmcm9tICcuL0NvbnRhaW5lcidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNwcml0ZSBleHRlbmRzIENvbnRhaW5lciB7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yIChpbWFnZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMudGV4dHVyZSA9IGltYWdlO1xyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gaW1hZ2Uud2lkdGg7XHJcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gaW1hZ2UuaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICByZW5kZXIgKGNvbnRleHQpIHtcclxuICAgICAgICBzdXBlci5yZW5kZXIoY29udGV4dCk7XHJcbiAgICAgICAgY29udGV4dC5kcmF3SW1hZ2UodGhpcy50ZXh0dXJlLCAwLCAwKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0IHdpZHRoICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHNldCB3aWR0aCAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl93aWR0aCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3NjYWxlLnggPSB2YWx1ZSAvIHRoaXMudGV4dHVyZS53aWR0aDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0IGhlaWdodCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgc2V0IGhlaWdodCAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9zY2FsZS55ID0gdmFsdWUgLyB0aGlzLnRleHR1cmUuaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXQgc2NhbGVYICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2NhbGUueDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgc2V0IHNjYWxlWCAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl93aWR0aCAqPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9zY2FsZS54ID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldCBzY2FsZVkgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zY2FsZS55O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBzZXQgc2NhbGVZICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCAqPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9zY2FsZS55ID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG59Il0sIm5hbWVzIjpbIlJlY3RhbmdsZSJdLCJtYXBwaW5ncyI6Ijs7O0FBQWUsTUFBTSxLQUFLLENBQUM7O0lBRXZCLFdBQVcsQ0FBQyxDQUFDLElBQUksRUFBRTs7UUFFZixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzs7UUFFakIsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7O1FBRXJCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNoQixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQzs7S0FFbkI7OztJQUdELFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUU7O1FBRWhCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDO1lBQzdCLE9BQU8sSUFBSSxDQUFDOztRQUVoQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2hELE9BQU8sSUFBSSxDQUFDOztLQUVmOzs7SUFHRCxT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QUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZCLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLFFBQVEsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLFFBQVEsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLFFBQVEsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLFFBQVEsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLFFBQVEsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLFFBQVEsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLFFBQVEsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLFFBQVEsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLFFBQVEsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLFFBQVEsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLFFBQVEsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLFFBQVEsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ25CLFFBQVEsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ25CLFFBQVEsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLFFBQVEsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLFFBQVEsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ25CLFFBQVEsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLFFBQVEsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO0FBQ3hCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO0FBQ3hCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO0FBQ3hCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO0FBQ3hCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO0FBQ3hCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO0FBQ3hCLFFBQVEsQ0FBQyxlQUFlLEdBQUcsR0FBRyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO0FBQzFCLFFBQVEsQ0FBQyxZQUFZLEdBQUcsR0FBRyxDQUFDO0FBQzVCLFFBQVEsQ0FBQyxlQUFlLEdBQUcsR0FBRyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDO0FBQzlCLFFBQVEsQ0FBQyxhQUFhLEdBQUcsR0FBRyxDQUFDO0FBQzdCLFFBQVEsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLFFBQVEsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLFFBQVEsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLFFBQVEsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLFFBQVEsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLFFBQVEsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLFFBQVEsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLFFBQVEsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLFFBQVEsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ25CLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ25CLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ25CLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ25CLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ25CLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ25CLFFBQVEsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO0FBQ3pCLFFBQVEsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ3JCLFFBQVEsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ3JCLFFBQVEsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ3JCLFFBQVEsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQ3RCLFFBQVEsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ3JCLFFBQVEsQ0FBQyxTQUFTLEdBQUcs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
