import Vector2 from '../geom/Vector2'
import Rectangle from '../geom/Rectangle'

export default class GameObject {

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