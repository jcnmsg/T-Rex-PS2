module.exports = function () {

    const { meta } = require('../data/hazards');
    const hazards = [],
          store = {};

    let timer, bird, wingCounter, running;
    
    function constructor() {
        running = false;
        bird = 0;
        wingCounter = 0;
        timer = Timer.new();

        for (let i = 1; i <= 3; i++) {
            store[`cactus_big_${i}`] = {
                ...meta[`cactus_big_${i}`],
                sprite: Graphics.loadImage(`./assets/img/cactus_big_${i}.png`)
            }

            store[`cactus_short_${i}`] = {
                ...meta[`cactus_short_${i}`],
                sprite: Graphics.loadImage(`./assets/img/cactus_short_${i}.png`)
            }

            store[`bird`] = {
                ...meta[`bird`],
                sprite: Graphics.loadImage(`./assets/img/bird.png`)
            }

            Graphics.setImageFilters(store[`cactus_big_${i}`].sprite, 'NEAREST');
            Graphics.setImageFilters(store[`cactus_short_${i}`].sprite, 'NEAREST');
            Graphics.setImageFilters(store[`bird`].sprite, 'NEAREST');
        }
    }

    function update(gameState) {
        const { dt, speed } = gameState;

        if (!running) return false;

        let changeFrame = false;
        if (++wingCounter > 7) {
            changeFrame = true;
            wingCounter = 0;
        }

        let birdIndex = 0;

        hazards.forEach((hazard, index) => {
            hazard.position.x -= hazard.type == 0 ? speed : speed*1.5;
            if (hazard.type == 1 && changeFrame) hazard.frame = !hazard.frame;
            if (hazard.position.x + hazard.width < 0 && index == 0) {
                hazards.shift();
            }
            else {
                birdIndex = index;
            }
        });

        if (birdIndex) hazards.slice(birdIndex, 1);

        if (Timer.getTime(timer) > speed * env.TRIGGER_SPEED) spawn();
        if (bird > env.BIRD) spawnBird();
    }

    function draw() {
        hazards.forEach(function(hazard) {
            switch(hazard.type) {
                case 0:
                    Graphics.drawImage(
                        hazard.sprite,
                        hazard.position.x, hazard.position.y, // Screen position
                    )
                    break;

                case 1:
                    const startX = hazard.frame ? 0 : hazard.width;
                    Graphics.drawImageExtended(
                        hazard.sprite, 
                        hazard.position.x, hazard.position.y, // Screen position
                        startX, 0, // Sheet position
                        startX + hazard.width, hazard.height, // Width (docs are wrong, not width but actually x pos of end of frame) /height
                        hazard.width, hazard.height, // Scale
                        0
                    )
                    break;
            }
        })
    }

    function spawn() {
        Timer.reset(timer);
        bird++;

        const index = random(1, 3);
        const small = random(0, 1);

        if (!small) { // Big
            hazards.push({
                ...store[`cactus_big_${index}`],
                position: new Vector2(env.SCREEN_WIDTH, 298)
            })
        }
        else { // Small
            hazards.push({
                ...store[`cactus_short_${index}`],
                position: new Vector2(env.SCREEN_WIDTH, 312)
            })
        }
    }

    function spawnBird() {
        bird = 0;

        hazards.push({
            ...store[`bird`],
            position: new Vector2(env.SCREEN_WIDTH, random(172, 284))
        })
    }

    function start() {
        while (hazards.length) hazards.pop();

        running = true;
        Timer.reset(timer);
        Timer.resume(timer);
    }

    function stop() {
        running = false;
        Timer.pause(timer);
    }

    function colliding(dino) {
        let colliding = false;

        hazards.forEach((hazard) => {
            const x = !hazard.type ? hazard.position.x : hazard.position.x - hazard.width/2;
            const y = !hazard.type ? hazard.position.y : hazard.position.y - hazard.height/2;

            if (dino.position.x < x + hazard.width &&
                dino.position.x + dino.dimensions.x > x &&
                dino.position.y < y + hazard.height &&
                dino.position.y + dino.dimensions.y > y) {
                colliding = true;
            }
        })

        return colliding;
    }

    constructor();

    return {
        update,
        draw,
        start,
        stop,
        colliding,
    }
}