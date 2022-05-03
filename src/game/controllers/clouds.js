module.exports = function () {

    const clouds = [];

    let sprite, width, running;

    function constructor() {
        sprite = Graphics.loadImage("./assets/img/cloud.png");
        Graphics.setImageFilters(sprite, 'NEAREST');

        for (let i = 0; i < env.MAX_CLOUDS; i++) {
            const cloud = {
                position: new Vector2((env.SCREEN_WIDTH*i+46)/env.MAX_CLOUDS, random(128, 300))
            }

            clouds.push(cloud);
        }

        width = 92;
        running = false;
    }

    function update(gameState) {
        const { dt, speed } = gameState;

        let spd = running ? speed*0.1 : .001;

        clouds.forEach((cloud) => {
            cloud.position.x -= spd;

            if (cloud.position.x + width < 0) {
                const cloud = clouds.shift();
                cloud.position.x = env.SCREEN_WIDTH;
                cloud.position.y = random(128, 300);
                clouds.push(cloud);
            }
        });
    }

    function draw() {
        for (let i = 0; i < env.MAX_CLOUDS; i++) {
            Graphics.drawImage(
                sprite,
                clouds[i].position.x, clouds[i].position.y, // Screen position
            )
        }
    }

    function start() {
        running = true;
    }

    function stop() {
        running = false;
    }

    constructor();

    return {
        update,
        draw,
        start,
        stop
    }
}

