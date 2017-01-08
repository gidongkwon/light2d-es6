import GameObject from './GameObject'

export default class Text extends GameObject{

    constructor(font = '20px Arial', fillStyle = '#000') {

        this.font = font;
        this.fillStyle = fillStyle;

        this.baseline = 'top';
        this.text = '';

    }

    render(context) {

        context.font = this.font;
        context.fillStyle = fillStyle;
        context.textBaseline = this.baseline;
        context.fillText(this.text, 0, 0);
        
    }

}