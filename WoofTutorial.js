const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
})
let platforms
let player
let diamonds
let score = 0
var number = 0
var number2 = 0

let badGuy
let badGuy2
let gameOver = false;

function preload() {
    game.load.image('sky', "images/sky.png");
    game.load.image('ground', 'images/platform.png');
    game.load.image('diamond', 'images/diamond.png');
    game.load.spritesheet('woof', 'images/woof.png', 32, 32)
    game.load.spritesheet('badGuy', 'images/evilWoof.png', 32, 32)
    game.load.spritesheet('badGuy2', 'images/evilWoof.png', 32, 32)
}

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.add.image(0, 0, 'sky') // loading sky asset

    platforms = game.add.group()
    // I think this adds collision detection
    platforms.enableBody = true

    //Making the ground
    let ground = platforms.create(0, game.world.height - 64, 'ground')
    ground.scale.setTo(2, 2)
    ground.body.immovable = true

    //Making the ledges
    let ledge = platforms.create(400, 450, 'ground')
    ledge.body.immovable = true

    ledge = platforms.create(-75, 350, 'ground')
    ledge.body.immovable = true

    //Create Player|| Position along x-axis, along y-axis, and sprite
    player = game.add.sprite(32, game.world.height - 150, 'woof')
    game.physics.arcade.enable(player)
    //Controls bouncing upon hitting ground
    player.body.bounce.y = .2
    //Rate of decent
    player.body.gravity.y = 800
    //Stops player from falling||Allows it to stay within world bounds
    player.body.collideWorldBounds = true

    //Sprite Animations
    player.animations.add('left', [0, 1], 8, true)
    player.animations.add('right', [2, 3], 8, true)




    //*************************** */BAD GUY SECTION TEST ***************************
    badGuy = game.add.sprite(400, 400, 'badGuy')
    game.physics.arcade.enable(badGuy)
    badGuy.body.bounce.y = .2
    badGuy.body.gravity.y = 800
    badGuy.body.collideWorldBounds = true

    badGuy.enableBody = true

    badGuy.animations.add('left', [0, 1], 8, true)
    badGuy.animations.add('right', [2, 3], 8, true)

    badGuy2 = game.add.sprite(0, 290, 'badGuy2')
    game.physics.arcade.enable(badGuy2)
    badGuy2.body.bounce.y = .2
    badGuy2.body.gravity.y = 800
    badGuy2.body.collideWorldBounds = true

    badGuy2.enableBody = true

    badGuy2.animations.add('left', [0, 1], 8, true)
    badGuy2.animations.add('right', [2, 3], 8, true)
    //******************** */END BAD GUY SECTION TEST ***************************



    diamonds = game.add.group()
    diamonds.enableBody = true

    //Creating Diamonds
    for (var i = 0; i < 50; i++) {
        let diamond = diamonds.create(i*30, 0, 'diamond')
    
        diamond.body.gravity.y = 1000
        diamond.body.bounce.y = 0.3 + Math.random() * 0.2
    }
    //Adds text on screen which appears when the score is increased
    scoreText = game.add.text(16, 16, '', {
        fontSize: '32px',
        fill: '#000'
    })
    cursors = game.input.keyboard.createCursorKeys()

}

function update() {
    //Adding collision||Reads as 'x' will collide with 'y'
    game.physics.arcade.collide(player, platforms)


    game.physics.arcade.collide(badGuy, platforms)
    game.physics.arcade.collide(badGuy2, platforms)
    // game.physics.arcade.collide(player, badGuy)

    game.physics.arcade.collide(diamonds, platforms)

    game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this)
    
    //Player's movement along x-axis||Can be altered to simulate wind blowing conditions
    player.body.velocity.x = 0

    //Movement
    if (cursors.left.isDown) {
        player.body.velocity.x = -150
        player.animations.play('left')
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 150
        player.animations.play('right')
    } else {
        player.animations.stop()
    }
    if (cursors.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -450
    }

    //Game over alert
    if (score == 200) {
        alert("You win!")
        score = 0
    }

    //Moves bad guy back and forth
    enemyMove()
    enemyMove2()

    //Add for speed boost in the enemies
    // enemyMove()
    // enemyMove2()


    checkGameOver()

        //Code for flying/fuel game

    //Movement
    //    if (cursors.left.isDown) {
    //     player.body.velocity.x = -150
    //     player.animations.play('left')
    // } else if (cursors.right.isDown) {
    //     player.body.velocity.x = 150
    //     player.animations.play('right')
    // } else {
    //     player.animations.stop()
    // }
    // if (cursors.up.isDown && player.body.touching.down) {
    //     player.body.velocity.y = -400
    //     jumpCount -= 1
    //     console.log(jumpCount)
    // }
    // else if(cursors.up.isDown &! player.body.touching.down){
    //     player.body.velocity.y = -100
    //     jumpCount += 1
    //     console.log("second" + jumpCount)
    // }
}

function collectDiamond(player, diamond) {
    //Makes diamond dissapear
    diamond.kill()
    //Adds 10 to overall score, then changes text
    score += 10
    scoreText.text = 'Score: ' + score
}
//Test function for defeating the player
function checkGameOver() {
    if(player.overlap(badGuy) && (gameOver != true)){
        console.log("TOUCH")
        scoreText.text = 'Refresh and try again!'
        alert("Game over!")
        badGuy.kill() 
        badGuy2.kill() 
        player.kill()
        
        gameOver = true
    }

    if(player.overlap(badGuy2) && (gameOver != true)){
        console.log("TOUCH")
        alert("Game over!")
        badGuy2.kill() 
        badGuy.kill() 
        player.kill()
        gameOver = true
    }
}
//Controls movement for enemy on bottom right ledge
function enemyMove() {
    if (number < 120) {
        badGuy.x += 3
        number++
        badGuy.animations.play('right')
    }
    if (number >= 120) {
        badGuy.x -= 3
        number++
        badGuy.animations.play('left')
    }
    if (number === 240) {
        number = 0
    }
}
//Controls movement for enemy on top left ledge
function enemyMove2() {
    if (number2 < 100) {
        badGuy2.x += 3
        number2++
        badGuy2.animations.play('right')
    }
    if (number2 >= 100) {
        badGuy2.x -= 3
        number2++
        badGuy2.animations.play('left')
    }
    if (number2 === 200) {
        number2 = 0
    }
}