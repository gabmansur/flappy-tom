// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: { gravity: { y: 600 }, debug: false },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

// Initialize game
const game = new Phaser.Game(config);

let tom;
let pipes;
let score = 0;
let scoreText;
let isGameOver = false;

function preload() {
    this.load.image("tom", "assets/tom.png");
}

function create() {
    // Background color
    this.cameras.main.setBackgroundColor("#87CEEB");

    // Add Tom (Flappy Cat)
    tom = this.physics.add.sprite(150, 300, "tom").setScale(0.2);
    tom.setCollideWorldBounds(true);

    // Flap on space or click
    this.input.on("pointerdown", flap);
    this.input.keyboard.on("keydown-SPACE", flap);

    // Pipes group
    pipes = this.physics.add.group();
    this.time.addEvent({
        delay: 2000,
        loop: true,
        callback: addPipes,
        callbackScope: this,
    });

    // Score
    scoreText = this.add.text(20, 20, "Score: 0", { fontSize: "24px", fill: "#fff" });

    // Collision with pipes
    this.physics.add.collider(tom, pipes, () => gameOver(this));
}

function update() {
    if (tom.y >= 600) {
        gameOver(this);
    }
}

function flap() {
    if (!isGameOver) {
        tom.setVelocityY(-250);
    }
}

function addPipes() {
    let gapHeight = Phaser.Math.Between(150, 300);

    // Create top and bottom pipes as PHYSICS OBJECTS
    let topPipe = this.physics.add.image(800, gapHeight - 400, "tom").setScale(0.1);
    let bottomPipe = this.physics.add.image(800, gapHeight + 100, "tom").setScale(0.1);

    // Set pipes to move left
    topPipe.setVelocityX(-200);
    bottomPipe.setVelocityX(-200);

    // Disable gravity for pipes
    topPipe.body.allowGravity = false;
    bottomPipe.body.allowGravity = false;

    // Add pipes to group
    pipes.add(topPipe);
    pipes.add(bottomPipe);
}

function gameOver(scene) {
    if (!isGameOver) {
        isGameOver = true;
        scene.scene.restart();
        score = 0;
    }
}
