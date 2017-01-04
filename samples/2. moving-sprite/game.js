//import * as light2d from '../../src' // VSCode 코드힌트를 위해서 넣은 줄. 실제 실행시 주석처리

class Player extends light2d.Container{

    constructor () {
        super();
        
        this.sprite = new light2d.Sprite(game.asset.image.blue);
        this.speed = 500;

        this.addChild(this.sprite);

    }

    
    render (context) {
        super.render(context);
    }

}

class GameScene extends light2d.Scene {

    preload () {
        game.asset.loadImage('blue', 'blue.png');
    }


    init () {

        this.player = new Player();
        this.addChild(this.player);
        
        this.player.x = 100;
        this.player.y = 100;

    }

    
    update (dt) {

        super.update(dt);

        let keyboard = game.keyboard;

        if (keyboard.pressed(light2d.Keyboard.LEFT)) {
            this.player.x -= this.player.speed * dt;
        }
        else if (keyboard.pressed(light2d.Keyboard.RIGHT)) {
            this.player.x += this.player.speed * dt;
        }
        
        if (keyboard.pressed(light2d.Keyboard.UP)) {
            this.player.y -= this.player.speed * dt;
        }
        else if (keyboard.pressed(light2d.Keyboard.DOWN)) {
            this.player.y += this.player.speed * dt;
        }

    }
    
}

let game = new light2d.Game('gameCanvas', 800, 500);
game.scenes.change(new GameScene(game));