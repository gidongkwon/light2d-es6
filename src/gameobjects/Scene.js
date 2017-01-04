import Container from './Container'

export default class Scene extends Container{

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