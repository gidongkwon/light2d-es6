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
        //this.camera = new Camera();
        //this.keyboard = new Keyboard();
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

        // this.keyboard.update(dt);
        // this.mouse.update(dt);
        // this.physics.update(dt);

        if (!this.scenes.current && this.scenes.current.preloaded)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlnaHQyZC5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2NvcmUvQXNzZXQuanMiLCIuLi9zcmMvY29yZS9TY2VuZU1hbmFnZXIuanMiLCIuLi9zcmMvaW5wdXQvS2V5Ym9hcmQuanMiLCIuLi9zcmMvY29yZS9HYW1lLmpzIiwiLi4vc3JjL2dlb20vVmVjdG9yMi5qcyIsIi4uL3NyYy9nZW9tL1JlY3RhbmdsZS5qcyIsIi4uL3NyYy9nYW1lb2JqZWN0cy9HYW1lT2JqZWN0LmpzIiwiLi4vc3JjL2dhbWVvYmplY3RzL0NvbnRhaW5lci5qcyIsIi4uL3NyYy9nYW1lb2JqZWN0cy9TY2VuZS5qcyIsIi4uL3NyYy9nYW1lb2JqZWN0cy9TcHJpdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXNzZXQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChnYW1lKSB7XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5sb2FkZWRGaWxlcyA9IDA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy50b0xvYWQgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IHt9O1xyXG4gICAgICAgIHRoaXMuYXVkaW8gPSB7fTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBsb2FkSW1hZ2UgKGlkLCB1cmwpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UuaGFzT3duUHJvcGVydHkoaWQpKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnRvTG9hZC5zZXQoaWQsIG5ldyBGaWxlKCdpbWFnZScsIGlkLCB1cmwpKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBsb2FkQXVkaW8gKGlkLCB1cmwpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYXVkaW8uaGFzT3duUHJvcGVydHkoaWQpKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy50b0xvYWQuc2V0KGlkLCBuZXcgRmlsZSgnYXVkaW8nLCBpZCwgdXJsKSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgLy8gcHJpdmF0ZVxyXG4gICAgc3RhcnRMb2FkICgpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgZmlsZSBvZiB0aGlzLnRvTG9hZC52YWx1ZXMoKSkge1xyXG5cclxuICAgICAgICAgICAgc3dpdGNoIChmaWxlLnR5cGUpIHtcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ2ltYWdlJzpcclxuICAgICAgICAgICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgICAgIGltZy5zcmMgPSBmaWxlLnVybDtcclxuICAgICAgICAgICAgICAgIGltZy5hc3NldElkID0gZmlsZS5pZDtcclxuICAgICAgICAgICAgICAgIGltZy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgbG9hZEhhbmxkZXIuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ2F1ZGlvJzpcclxuICAgICAgICAgICAgICAgIGxldCBhdWQgPSBuZXcgQXVkaW8oZmlsZS51cmwpO1xyXG4gICAgICAgICAgICAgICAgYXVkLmFzc2V0SWQgPSBmaWxlLmlkO1xyXG4gICAgICAgICAgICAgICAgYXVkLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBsb2FkSGFubGRlci5iaW5kKHRoaXMpKTtcclxuICAgICAgICAgICAgICAgIGF1ZC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnbG9hZCcpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXQgdG90YWxGaWxlcyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudG9Mb2FkLnNpemU7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBnZXQgcHJvZ3Jlc3NBc1BlcmNlbnQgKCkge1xyXG5cclxuICAgICAgICByZXR1cm4gKHRoaXMubG9hZGluZ0ZpbGVzID09PSAwKSA/IDAgOiB0aGlzLmxvYWRlZEZpbGVzIC8gdGhpcy50b3RhbEZpbGVzICogMTAwO1xyXG5cclxuICAgIH1cclxuXHJcbn1cclxuXHJcblxyXG5jb25zdCBsb2FkSGFubGRlciA9IGZ1bmN0aW9uIChldmVudCkge1xyXG5cclxuICAgIGV2ZW50LnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgbG9hZEhhbmxkZXIpO1xyXG4gICAgXHJcbiAgICBjb25zdCBmaWxlID0gdGhpcy50b0xvYWQuZ2V0KGV2ZW50LnRhcmdldC5hc3NldElkKTtcclxuICAgIFxyXG4gICAgdGhpc1tmaWxlLnR5cGVdW2ZpbGUuaWRdID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgdGhpcy5sb2FkZWRGaWxlcysrO1xyXG4gICAgXHJcbiAgICBpZih0aGlzLmxvYWRlZEZpbGVzID09PSB0aGlzLnRvdGFsRmlsZXMpIHtcclxuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncHJlbG9hZGVkJykpO1xyXG4gICAgICAgIHRoaXMudG9Mb2FkLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5sb2FkZWRGaWxlcyA9IDA7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5cclxuY2xhc3MgRmlsZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHR5cGUsIGlkLCB1cmwpIHtcclxuXHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XHJcblxyXG4gICAgfVxyXG5cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjZW5lTWFuYWdlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKGdhbWUpIHtcclxuXHJcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcclxuICAgICAgICB0aGlzLl9jdXJyZW50U2NlbmUgPSBudWxsO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgY2hhbmdlIChzY2VuZSkge1xyXG5cclxuICAgICAgICB0aGlzLl9jdXJyZW50U2NlbmUgPSBzY2VuZTtcclxuICAgICAgICB0aGlzLl9jdXJyZW50U2NlbmUucHJlbG9hZCgpO1xyXG5cclxuICAgICAgICB0aGlzLmdhbWUuYXNzZXQuc3RhcnRMb2FkKCk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3ByZWxvYWRlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fY3VycmVudFNjZW5lLnByZWxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRTY2VuZS5pbml0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKCF0aGlzLmdhbWUuaW5pdGVkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8vdGhpcy5nYW1lLmNhbWVyYS5yZXNldCgpO1xyXG4gICAgICAgIC8vdGhpcy5nYW1lLnBoeXNpY3MucmVzZXQoKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldCBjdXJyZW50ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY3VycmVudFNjZW5lO1xyXG4gICAgfVxyXG5cclxufSIsIlxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBLZXlib2FyZCB7XHJcbiAgICBjb25zdHJ1Y3RvciAoZ2FtZSkge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG59XHJcblxyXG5LZXlib2FyZC5BID0gJ0EnLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLkIgPSAnQicuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuQyA9ICdDJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5EID0gJ0QnLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLkUgPSAnRScuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuRiA9ICdGJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5HID0gJ0cnLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLkggPSAnSCcuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuSSA9ICdJJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5KID0gJ0onLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLksgPSAnSycuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuTCA9ICdMJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5NID0gJ00nLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLk4gPSAnTicuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuTyA9ICdPJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5QID0gJ1AnLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLlEgPSAnUScuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuUiA9ICdSJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5TID0gJ1MnLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLlQgPSAnVCcuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuVSA9ICdVJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5WID0gJ1YnLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLlcgPSAnVycuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuWCA9ICdYJy5jaGFyQ29kZUF0KDApO1xyXG5LZXlib2FyZC5ZID0gJ1knLmNoYXJDb2RlQXQoMCk7XHJcbktleWJvYXJkLlogPSAnWicuY2hhckNvZGVBdCgwKTtcclxuS2V5Ym9hcmQuQkFDS1NQQUNFID0gODtcclxuS2V5Ym9hcmQuVEFQID0gOTtcclxuS2V5Ym9hcmQuRU5URVIgPSAxMztcclxuS2V5Ym9hcmQuQ09NTUFORCA9IDE1O1xyXG5LZXlib2FyZC5TSElGVCA9IDE2O1xyXG5LZXlib2FyZC5DT05UUk9MID0gMTc7XHJcbktleWJvYXJkLkFMVEVSTkFURSA9IDE4O1xyXG5LZXlib2FyZC5DQVBTX0xPQ0sgPSAyMDtcclxuS2V5Ym9hcmQuRVNDQVBFID0gMjc7XHJcbktleWJvYXJkLlNQQUNFID0gMzI7XHJcbktleWJvYXJkLlBBR0VfVVAgPSAzMztcclxuS2V5Ym9hcmQuUEFHRV9ET1dOID0gMzQ7XHJcbktleWJvYXJkLkVORCA9IDM1O1xyXG5LZXlib2FyZC5IT01FID0gMzY7XHJcbktleWJvYXJkLkxFRlQgPSAzNztcclxuS2V5Ym9hcmQuVVAgPSAzODtcclxuS2V5Ym9hcmQuUklHSFQgPSAzOTtcclxuS2V5Ym9hcmQuRE9XTiA9IDQwO1xyXG5LZXlib2FyZC5JTlNFUlQgPSA0NTtcclxuS2V5Ym9hcmQuREVMRVRFID0gNDY7XHJcbktleWJvYXJkLk5VTUJFUl8xID0gNDk7XHJcbktleWJvYXJkLk5VTUJFUl8yID0gNTA7XHJcbktleWJvYXJkLk5VTUJFUl8zID0gNTE7XHJcbktleWJvYXJkLk5VTUJFUl80ID0gNTI7XHJcbktleWJvYXJkLk5VTUJFUl81ID0gNTM7XHJcbktleWJvYXJkLk5VTUJFUl82ID0gNTQ7XHJcbktleWJvYXJkLk5VTUJFUl83ID0gNTU7XHJcbktleWJvYXJkLk5VTUJFUl84ID0gNTY7XHJcbktleWJvYXJkLk5VTUJFUl85ID0gNTc7XHJcbktleWJvYXJkLk5VTVBBRF8wID0gOTY7XHJcbktleWJvYXJkLk5VTVBBRF8xID0gOTc7XHJcbktleWJvYXJkLk5VTVBBRF8yID0gOTg7XHJcbktleWJvYXJkLk5VTVBBRF8zID0gOTk7XHJcbktleWJvYXJkLk5VTVBBRF80ID0gMTAwO1xyXG5LZXlib2FyZC5OVU1QQURfNSA9IDEwMTtcclxuS2V5Ym9hcmQuTlVNUEFEXzYgPSAxMDI7XHJcbktleWJvYXJkLk5VTVBBRF83ID0gMTAzO1xyXG5LZXlib2FyZC5OVU1QQURfOCA9IDEwNDtcclxuS2V5Ym9hcmQuTlVNUEFEXzkgPSAxMDU7XHJcbktleWJvYXJkLk5VTVBBRF9NVUxUSVBMWSA9IDEwNjtcclxuS2V5Ym9hcmQuTlVNUEFEX0FERCA9IDEwNztcclxuS2V5Ym9hcmQuTlVNUEFEX0VOVEVSID0gMTA4O1xyXG5LZXlib2FyZC5OVU1QQURfU1VCVFJBQ1QgPSAxMDk7XHJcbktleWJvYXJkLk5VTVBBRF9ERU1JQ0FMID0gMTEwO1xyXG5LZXlib2FyZC5OVU1QQURfRElWSURFID0gMTExO1xyXG5LZXlib2FyZC5GMSA9IDExMjtcclxuS2V5Ym9hcmQuRjIgPSAxMTM7XHJcbktleWJvYXJkLkYzID0gMTE0O1xyXG5LZXlib2FyZC5GNCA9IDExNTtcclxuS2V5Ym9hcmQuRjUgPSAxMTY7XHJcbktleWJvYXJkLkY2ID0gMTE3O1xyXG5LZXlib2FyZC5GNyA9IDExODtcclxuS2V5Ym9hcmQuRjggPSAxMTk7XHJcbktleWJvYXJkLkY5ID0gMTIwO1xyXG5LZXlib2FyZC5GMTAgPSAxMjE7XHJcbktleWJvYXJkLkYxMSA9IDEyMjtcclxuS2V5Ym9hcmQuRjEyID0gMTIzO1xyXG5LZXlib2FyZC5GMTMgPSAxMjQ7XHJcbktleWJvYXJkLkYxNCA9IDEyNTtcclxuS2V5Ym9hcmQuRjE1ID0gMTI2O1xyXG5LZXlib2FyZC5TRU1JQ09MT04gPSAxODY7XHJcbktleWJvYXJkLkVRVUFMID0gMTg3O1xyXG5LZXlib2FyZC5DT01NQSA9IDE4ODtcclxuS2V5Ym9hcmQuTUlOVVMgPSAxODk7XHJcbktleWJvYXJkLlBFUklPRCA9IDE5MDtcclxuS2V5Ym9hcmQuU0xBU0ggPSAxOTE7XHJcbktleWJvYXJkLkJBQ0tRVU9URSA9IDE5MjtcclxuS2V5Ym9hcmQuTEVGVEJSQUNLRVQgPSAyMTk7XHJcbktleWJvYXJkLkJBQ0tTTEFTSCA9IDIyMDtcclxuS2V5Ym9hcmQuUklHSFRCUkFDS0VUID0gMjIxO1xyXG5LZXlib2FyZC5RVU9URSA9IDIyMjsiLCJpbXBvcnQgQXNzZXQgZnJvbSAnLi9Bc3NldCdcclxuaW1wb3J0IFNjZW5lTWFuYWdlciBmcm9tICcuL1NjZW5lTWFuYWdlcidcclxuaW1wb3J0IENhbWVyYSBmcm9tICcuL0NhbWVyYSdcclxuaW1wb3J0IEtleWJvYXJkIGZyb20gJy4uL2lucHV0L0tleWJvYXJkJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKGNhbnZhc0lkLCB3aWR0aCA9IDgwMCwgaGVpZ2h0ID0gNjAwLCBiYWNrZ3JvdW5kQ29sb3IgPSAnI2ZmZicpIHtcclxuXHJcbiAgICAgICAgdGhpcy5jYW52YXNJZCA9IGNhbnZhc0lkO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICB0aGlzLmJhY2tncm91bmRDb2xvciA9IGJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5hc3NldCA9IG5ldyBBc3NldCh0aGlzKTtcclxuICAgICAgICB0aGlzLnNjZW5lcyA9IG5ldyBTY2VuZU1hbmFnZXIodGhpcyk7XHJcbiAgICAgICAgLy90aGlzLmNhbWVyYSA9IG5ldyBDYW1lcmEoKTtcclxuICAgICAgICAvL3RoaXMua2V5Ym9hcmQgPSBuZXcgS2V5Ym9hcmQoKTtcclxuICAgICAgICAvL3RoaXMubW91c2UgPSBuZXcgTW91c2UoKTtcclxuICAgICAgICAvL3RoaXMucGh5c2ljcyA9IG5ldyBQaHlzaWNzKCk7XHJcblxyXG4gICAgICAgIHRoaXMuZHQgPSAwO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgdGhpcy5pbml0LmJpbmQodGhpcyksIHRydWUpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgaW5pdCAoKSB7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCB0aGlzLmluaXQsIHRydWUpO1xyXG5cclxuICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY2FudmFzSWQpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuY2FudmFzKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLmNhbnZhc0lkfeulvCDssL7snYQg7IiYIOyXhuyKteuLiOuLpC5gKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG4gICAgICAgIHRoaXMuX3RpbWUgPSBEYXRlLm5vdygpO1xyXG4gICAgICAgIHRoaXMuX2Zwc1N0YXJ0VGltZSA9IERhdGUubm93KCk7XHJcbiAgICAgICAgdGhpcy5fZnBzID0gNjA7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9yYWZJZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5ydW4uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBydW4gKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuZHQgPSAoRGF0ZS5ub3coKSAtIHRoaXMuX3RpbWUpIC8gMTAwMDtcclxuXHJcbiAgICAgICAgaWYgKERhdGUubm93KCkgLSB0aGlzLl9mcHNTdGFydFRpbWUgPiA1MDApIHtcclxuICAgICAgICAgICAgdGhpcy5fZnBzU3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcclxuICAgICAgICAgICAgdGhpcy5fZnBzID0gTWF0aC5tYXgoTWF0aC5yb3VuZCgxIC8gdGhpcy5kdCksIDYwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlKHRoaXMuZHQpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKHRoaXMuY29udGV4dCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fdGltZSA9IERhdGUubm93KCk7XHJcbiAgICAgICAgdGhpcy5fcmFmSWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucnVuLmJpbmQodGhpcykpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHVwZGF0ZSAoZHQpIHtcclxuXHJcbiAgICAgICAgLy8gdGhpcy5rZXlib2FyZC51cGRhdGUoZHQpO1xyXG4gICAgICAgIC8vIHRoaXMubW91c2UudXBkYXRlKGR0KTtcclxuICAgICAgICAvLyB0aGlzLnBoeXNpY3MudXBkYXRlKGR0KTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnNjZW5lcy5jdXJyZW50ICYmIHRoaXMuc2NlbmVzLmN1cnJlbnQucHJlbG9hZGVkKVxyXG4gICAgICAgICAgICB0aGlzLnNjZW5lcy5jdXJyZW50LnVwZGF0ZShkdCk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICByZW5kZXIgKGNvbnRleHQpIHtcclxuXHJcbiAgICAgICAgbGV0IHRhcmdldFggPSB0aGlzLndpZHRoIC8gMjtcclxuICAgICAgICBsZXQgdGFyZ2V0WSA9IHRoaXMuaGVpZ2h0IC8gMjtcclxuXHJcbiAgICAgICAgY29udGV4dC5zYXZlKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5iYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICAgICAgY29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBjb250ZXh0LnRyYW5zbGF0ZSh0YXJnZXRYLCB0YXJnZXRZKTtcclxuICAgICAgICAvLyBjb250ZXh0LnNjYWxlKHRoaXMuY2FtZXJhLnNjYWxlLngsIHRoaXMuY2FtZXJhLnNjYWxlLnkpO1xyXG4gICAgICAgIC8vIGNvbnRleHQudHJhbnNsYXRlKC10YXJnZXRYLCAtdGFyZ2V0WSk7XHJcblxyXG4gICAgICAgIC8vIGNvbnRleHQudHJhbnNsYXRlKC10aGlzLmNhbWVyYS54LCAtdGhpcy5jYW1lcmEueSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMuc2NlbmVzLmN1cnJlbnQucHJlbG9hZGVkKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuc2NlbmVzLmN1cnJlbnQuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkLmJlZm9yZVJlbmRlcihjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgIGNoaWxkLnJlbmRlcihjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgIGNoaWxkLmFmdGVyUmVuZGVyKGNvbnRleHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb250ZXh0LnJlc3RvcmUoKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldCBmcHMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mcHM7XHJcbiAgICB9XHJcblxyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmVjdG9yMiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHggPSAwLCB5ID0gMCkge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgYWRkICh2ZWMyKSB7XHJcbiAgICAgICAgdGhpcy54ID0gdmVjMi54O1xyXG4gICAgICAgIHRoaXMueSA9IHZlYzIueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcblxyXG4gICAgc3VidHJhY3QgKHZlYzIpIHtcclxuICAgICAgICB0aGlzLnggLT0gdmVjMi54O1xyXG4gICAgICAgIHRoaXMueSAtPSB2ZWMyLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIG11bHRpcGx5ICh2ZWMyKSB7XHJcbiAgICAgICAgdGhpcy54ICo9IHZlYzIueDtcclxuICAgICAgICB0aGlzLnkgKj0gdmVjMi55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBkaXZpZGUgKHZlYzIpIHtcclxuICAgICAgICB0aGlzLnggLz0gdmVjMi54O1xyXG4gICAgICAgIHRoaXMueSAvPSB2ZWMyLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFuZ2xlICh2ZWMyKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbjIodmVjMi55IC0gdGhpcy55LCB2ZWMyLnggLSB0aGlzLngpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBkaXN0YW5jZSAodmVjMikge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3codmVjMi54IC0gdGhpcy54LCAyKSArIE1hdGgucG93KHZlYzIueSAtIHRoaXMueSwgMikpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBkaXN0YW5jZVNxICh2ZWMyKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgucG93KHZlYzIueCAtIHRoaXMueCwgMikgKyBNYXRoLnBvdyh2ZWMyLnkgLSB0aGlzLnksIDIpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBjbG9uZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMueCwgdGhpcy55KTtcclxuICAgIH1cclxufSIsImltcG9ydCBWZWN0b3IyIGZyb20gJy4vVmVjdG9yMidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY3RhbmdsZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHggPSAwLCB5ID0gMCwgd2lkdGggPSAwLCBoZWlnaHQgPSAwKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgaW50ZXJzZWN0cyAocmVjdCkge1xyXG4gICAgICAgIHJldHVybiAhKHRoaXMueCArIHRoaXMud2lkdGggPCByZWN0LnggfHwgdGhpcy55ICsgdGhpcy5oZWlnaHQgPCByZWN0LnkgfHwgcmVjdC54ICsgcmVjdC53aWR0aCA8IHRoaXMueCB8fCByZWN0LnkgKyByZWN0LmhlaWdodCA8IHRoaXMueSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGludGVyc2VjdGlvbiAocmVjdCkge1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaW50ZXJzZWN0cyhyZWN0KSlcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIGxldCB4ID0gTWF0aC5tYXgodGhpcy54LCByZWN0LngpO1xyXG4gICAgICAgIGxldCB5ID0gTWF0aC5tYXgodGhpcy55LCByZWN0LnkpO1xyXG4gICAgICAgIGxldCB3aWR0aCA9IE1hdGgubWluKHRoaXMueCArIHRoaXMud2lkdGgsIHJlY3QueCArIHJlY3Qud2lkdGgpIC0geDtcclxuICAgICAgICBsZXQgaGVpZ2h0ID0gTWF0aC5taW4odGhpcy55ICsgdGhpcy5oZWlnaHQsIHJlY3QueSArIHJlY3QuaGVpZ2h0KSAtIHk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlKHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgIH1cclxuICAgIFxyXG4gICAgXHJcbiAgICBjb250YWlucyAodmVjMikge1xyXG4gICAgICAgIHJldHVybiAhKHRoaXMueCA+IHZlYzIueCB8fCB0aGlzLnggKyB0aGlzLndpZHRoIDwgdmVjMi54IHx8IHRoaXMueSA+IHZlYzIueSB8fCB0aGlzLnkgKyB0aGlzLmhlaWdodCA8IHZlYzIueSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGNsb25lICgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFJlY3RhbmdsZSh0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXQgY2VudGVyICgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54ICsgdGhpcy53aWR0aCAvIDIsIHRoaXMueSArIHRoaXMuaGVpZ2h0IC8gMik7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IFZlY3RvcjIgZnJvbSAnLi4vZ2VvbS9WZWN0b3IyJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZU9iamVjdCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG5cclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFZlY3RvcjIoKTtcclxuICAgICAgICB0aGlzLnJvdGF0aW9uID0gMDtcclxuICAgICAgICB0aGlzLnJvdGF0aW9uQ2VudGVyID0gbmV3IFZlY3RvcjIoKTtcclxuICAgICAgICB0aGlzLnNjYWxlQ2VudGVyID0gbmV3IFZlY3RvcjIoKTtcclxuICAgICAgICB0aGlzLmFscGhhID0gMTtcclxuICAgICAgICB0aGlzLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDsgXHJcbiAgICAgICAgdGhpcy5pZ25vcmVHbG9iYWxUcmFuc2Zvcm0gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5fd2lkdGggPSAwO1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCA9IDA7XHJcbiAgICAgICAgdGhpcy5fc2NhbGUgPSBuZXcgVmVjdG9yMigxLCAxKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGJlZm9yZVJlbmRlciAoY29udGV4dCkge1xyXG5cclxuICAgICAgICAvLyDsoITsl60gdHJhbnNmb3Jt7J2EIOustOyLnO2VoCDqsr3smrAgLSBVSeuTseyXkCDsgqzsmqlcclxuICAgICAgICBpZiAodGhpcy5pZ25vcmVHbG9iYWxNYXRyaXgpIHtcclxuICAgICAgICAgICAgdGhpcy5fY3VycmVudEdsb2JhbFRyYW5zZm9ybSA9IGNvbnRleHQuY3VycmVudFRyYW5zZm9ybTtcclxuICAgICAgICAgICAgY29udGV4dC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMCwgMCk7IC8vIGNvbnRleHTsnZggdHJhbnNmb3Jt7J2EIGlkZW50aXR5IG1hdHJpeOuhnCDshKTsoJVcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnRleHQuc2F2ZSgpO1xyXG5cclxuICAgICAgICAvLyBwb3NpdGlvblxyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55KTtcclxuXHJcbiAgICAgICAgLy8gcm90YXRpb25cclxuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZSh0aGlzLnJvdGF0aW9uQ2VudGVyLngsIHRoaXMucm90YXRpb25DZW50ZXIueSk7XHJcbiAgICAgICAgY29udGV4dC5yb3RhdGUodGhpcy5yb3RhdGlvbik7XHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoLXRoaXMucm90YXRpb25DZW50ZXIueCwgLXRoaXMucm90YXRpb25DZW50ZXIueSk7XHJcblxyXG4gICAgICAgIC8vIHNjYWxlXHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUodGhpcy5zY2FsZUNlbnRlci54LCB0aGlzLnNjYWxlQ2VudGVyLnkpO1xyXG4gICAgICAgIGNvbnRleHQuc2NhbGUodGhpcy5zY2FsZVgsIHRoaXMuc2NhbGVZKTtcclxuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZSgtdGhpcy5zY2FsZUNlbnRlci54LCAtdGhpcy5zY2FsZUNlbnRlci55KTtcclxuXHJcbiAgICAgICAgLy8gYWxwaGFcclxuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhICo9IHRoaXMuYWxwaGE7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICByZW5kZXIgKGNvbnRleHQpIHtcclxuICAgICAgICAvLyDtlZjsnITtgbTrnpjsiqTsl5DshJwg6rWs7ZiEXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFmdGVyUmVuZGVyIChjb250ZXh0KSB7XHJcbiAgICAgICAgY29udGV4dC5yZXN0b3JlKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlnbm9yZUdsb2JhbE1hdHJpeClcclxuICAgICAgICAgICAgY29udGV4dC5zZXRUcmFuc2Zvcm0odGhpcy5fY3VycmVudEdsb2JhbFRyYW5zZm9ybSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHVwZGF0ZSAoZHQpIHtcclxuICAgICAgICAvLyDtlZjsnITtgbTrnpjsiqTsl5DshJwg6rWs7ZiEXHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBpbnRlcnNlY3RzIChnYW1lT2JqZWN0KSB7XHJcbiAgICAgICAgcmV0dXJuIGJvdW5kcy5pbnRlcnNlY3RzKGdhbWVPYmplY3QpOyAvLyDtirjrpq06IEdhbWVPYmplY3TsmYAgUmVjdGFuZ2xlIOuqqOuRkCB4LCB5LCB3aWR0aCwgaGVpZ2h06rCAIOyeiOuLpOuKlCDqsoPsnYQg7J207JqpXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGludGVyc2VjdGlvbiAoZ2FtZU9iamVjdCkge1xyXG4gICAgICAgIHJldHVybiBib3VuZHMuaW50ZXJzZWN0aW9uKGdhbWVPYmplY3QpOyAvLyDtirjrpq1cclxuICAgIH1cclxuXHJcblxyXG4gICAgY29udGFpbnMgKHZlYzIpIHtcclxuICAgICAgICByZXR1cm4gYm91bmRzLmNvbnRhaW5zKHZlYzIpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXQgYm91bmRzICgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFJlY3RhbmdsZSh0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXQgeCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb24ueDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgc2V0IHggKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54ID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldCB5ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi55O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBzZXQgeSAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uLnkgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0IHdpZHRoICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHNldCB3aWR0aCAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl93aWR0aCA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXQgaGVpZ2h0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBzZXQgaGVpZ2h0ICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXQgc2NhbGVYICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2NhbGUueDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgc2V0IHNjYWxlWCAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9zY2FsZS54ID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldCBzY2FsZVkgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zY2FsZS55O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBzZXQgc2NhbGVZICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX3NjYWxlLnkgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgR2FtZU9iamVjdCBmcm9tICcuL0dhbWVPYmplY3QnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250YWluZXIgZXh0ZW5kcyBHYW1lT2JqZWN0IHtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICByZW5kZXIgKGNvbnRleHQpIHtcclxuICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIGNoaWxkLmJlZm9yZVJlbmRlcihjb250ZXh0KTtcclxuICAgICAgICAgICAgY2hpbGQucmVuZGVyKGNvbnRleHQpO1xyXG4gICAgICAgICAgICBjaGlsZC5hZnRlclJlbmRlcihjb250ZXh0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHVwZGF0ZSAoZHQpIHtcclxuICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKVxyXG4gICAgICAgICAgICBjaGlsZC51cGRhdGUoZHQpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhZGRDaGlsZChjaGlsZCkge1xyXG4gICAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcmVtb3ZlQ2hpbGQoY2hpbGQpIHtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZSh0aGlzLmNoaWxkcmVuLmluZGV4T2YoY2hpbGQpLCAxKTtcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgQ29udGFpbmVyIGZyb20gJy4vQ29udGFpbmVyJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NlbmUgZXh0ZW5kcyBDb250YWluZXJ7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy51aSA9IG5ldyBDb250YWluZXIoKTtcclxuICAgICAgICB0aGlzLnVpLmlnbm9yZUdsb2JhbFRyYW5zZm9ybSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5wcmVsb2FkZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHJlbG9hZCAoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICB1cGRhdGUgKGR0KSB7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKGR0KTtcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgQ29udGFpbmVyIGZyb20gJy4vQ29udGFpbmVyJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3ByaXRlIGV4dGVuZHMgQ29udGFpbmVyIHtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IgKGltYWdlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy50ZXh0dXJlID0gaW1hZ2U7XHJcbiAgICAgICAgdGhpcy5fd2lkdGggPSBpbWFnZS53aWR0aDtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSBpbWFnZS5oZWlnaHQ7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHJlbmRlciAoY29udGV4dCkge1xyXG4gICAgICAgIHN1cGVyLnJlbmRlcihjb250ZXh0KTtcclxuICAgICAgICBjb250ZXh0LmRyYXdJbWFnZSh0aGlzLnRleHR1cmUsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXQgd2lkdGggKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgc2V0IHdpZHRoICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fc2NhbGUueCA9IHZhbHVlIC8gdGhpcy50ZXh0dXJlLndpZHRoO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXQgaGVpZ2h0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBzZXQgaGVpZ2h0ICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3NjYWxlLnkgPSB2YWx1ZSAvIHRoaXMudGV4dHVyZS5oZWlnaHQ7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldCBzY2FsZVggKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zY2FsZS54O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBzZXQgc2NhbGVYICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX3dpZHRoICo9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3NjYWxlLnggPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0IHNjYWxlWSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NjYWxlLnk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHNldCBzY2FsZVkgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5faGVpZ2h0ICo9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3NjYWxlLnkgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbn0iXSwibmFtZXMiOlsiUmVjdGFuZ2xlIl0sIm1hcHBpbmdzIjoiOzs7QUFBZSxNQUFNLEtBQUssQ0FBQzs7SUFFdkIsV0FBVyxDQUFDLENBQUMsSUFBSSxFQUFFOztRQUVmLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOztRQUVqQixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQzs7UUFFckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDOztLQUVuQjs7O0lBR0QsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRTs7UUFF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QUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZCLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLFFBQVEsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLFFBQVEsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLFFBQVEsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLFFBQVEsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLFFBQVEsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLFFBQVEsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLFFBQVEsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLFFBQVEsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLFFBQVEsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLFFBQVEsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLFFBQVEsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLFFBQVEsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ25CLFFBQVEsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ25CLFFBQVEsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLFFBQVEsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLFFBQVEsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ25CLFFBQVEsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLFFBQVEsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO0FBQ3hCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO0FBQ3hCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO0FBQ3hCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO0FBQ3hCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO0FBQ3hCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO0FBQ3hCLFFBQVEsQ0FBQyxlQUFlLEdBQUcsR0FBRyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO0FBQzFCLFFBQVEsQ0FBQyxZQUFZLEdBQUcsR0FBRyxDQUFDO0FBQzVCLFFBQVEsQ0FBQyxlQUFlLEdBQUcsR0FBRyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDO0FBQzlCLFFBQVEsQ0FBQyxhQUFhLEdBQUcsR0FBRyxDQUFDO0FBQzdCLFFBQVEsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLFFBQVEsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLFFBQVEsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLFFBQVEsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLFFBQVEsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLFFBQVEsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLFFBQVEsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLFFBQVEsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLFFBQVEsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ25CLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ25CLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ25CLFFBQVEsQ0FB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
