import Asset from './Asset'
import SceneManager from './SceneManager'
import Camera from './Camera'
import Keyboard from '../input/Keyboard'

export default class Game {

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