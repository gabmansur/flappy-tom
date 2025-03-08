import Phaser from "phaser";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: { gravity: { y: 400 } },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

let player;
let pipes;
let score = 0;
let scoreText;

function preload() {
    this.load.image("tom", "tom.png");
}

function create() {
    this.add.rectangle(400, 300, 800, 600, 0x87CEEB); // Sky blue background
    player = this.physics.add.sprite(100, 300, "tom").setScale(0.3);
    player.setGravityY(300);

    this.input.on("pointerdown", () => {
        player.setVelocityY(-200);
    });

    pipes = this.physics.add.group();
    this.time.addEvent({
        delay: 1500,
        callback: addPipes,
        callbackScope: this,
        loop: true,
    });

    scoreText = this.add.text(20, 20, "Score: 0", { fontSize: "20px", fill: "#fff" });
}

function update() {
    if (player.y > 600) {
        restartGame.call(this);
    }
}

function addPipes() {
    let pipeY = Phaser.Math.Between(100, 400);
    let topPipe = this.add.rectangle(800, pipeY - 100, 50, 200, 0x008000);
    let bottomPipe = this.add.rectangle(800, pipeY + 100, 50, 200, 0x008000);

    this.physics.add.existing(topPipe);
    this.physics.add.existing(bottomPipe);

    topPipe.body.setVelocityX(-200);
    bottomPipe.body.setVelocityX(-200);

    pipes.add(topPipe);
    pipes.add(bottomPipe);

    pipes.children.iterate((pipe) => {
        pipe.body.setAllowGravity(false);
        pipe.body.setImmovable(true);
    });

    score++;
    scoreText.setText("Score: " + score);
}

function restartGame() {
    this.scene.restart();
    score = 0;
}

const game = new Phaser.Game(config);
