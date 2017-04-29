//import * as light2d from '../../src' // VSCode 코드힌트를 위해서 넣은 줄. 실제 실행시 주석처리

class GameScene extends light2d.Scene {

    preload () {
        game.asset.loadImage('anim', 'texture.png');
    }


    init () {

        const frameRect = new light2d.Rectangle(0, 0, 125, 125);

        this.myAnimation = new light2d.Animation(game.asset.image.anim, frameRect, 16);
        
        this.myAnimation.x = 100;
        this.myAnimation.y = 100;

        this.addChild(this.myAnimation);
        
        this.myAnimation.play();

    }

    
    update (dt) {

        super.update(dt);

    }
    
}

let game = new light2d.Game('gameCanvas', 800, 500);
game.scenes.change(new GameScene());