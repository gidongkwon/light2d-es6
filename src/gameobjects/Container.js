import GameObject from './GameObject'

export default class Container extends GameObject {
    
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