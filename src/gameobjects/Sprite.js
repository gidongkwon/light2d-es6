import Container from './Container'

export default class Sprite extends Container {
    
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