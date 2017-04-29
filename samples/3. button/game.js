//import * as light2d from '../../src' // VSCode 코드힌트를 위해서 넣은 줄. 실제 실행시 주석처리

class GameScene extends light2d.Scene {

    preload() {
        game.asset.loadImage('blue', 'blue.png');
    }

    init() {

        this.button = new light2d.Sprite(game.asset.image.blue);
        this.addChild(this.button);
        
        this.button.x = 100;
        this.button.y = 100;

    }
    
    update(dt) {

        super.update(dt);

        let mousePos = game.mouse.position;

        this.button.alpha = 1;

        if (game.mouse.pressed(light2d.Mouse.LEFT)) {
            if (this.button.contains(mousePos)) {
                this.button.alpha = 0.5;
            }
        }

    }
    
}

let game = new light2d.Game('gameCanvas', 800, 500);
game.scenes.change(new GameScene());