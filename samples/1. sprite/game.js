//import * as light2d from '../../src' // VSCode 코드힌트를 위해서 넣은 줄. 실제 실행시 주석처리

class GameScene extends light2d.Scene {

    preload () {
        game.asset.loadImage('blue', 'blue.png');
    }


    init () {

        this.mySprite = new light2d.Sprite(game.asset.image.blue); // 100px * 100px 이미지
        
        this.mySprite.x = 100;
        this.mySprite.y = 100;

        this.mySprite.width = 250; // scaleX와 연동

        this.mySprite.rotation = Math.PI / 4; // 호도법 사용

        this.addChild(this.mySprite);

    }

    
    update (dt) {

        super.update(dt);

    }
    
}

let game = new light2d.Game('gameCanvas', 800, 500);
game.scenes.change(new GameScene());