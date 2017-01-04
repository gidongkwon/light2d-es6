export default class SceneManager {

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