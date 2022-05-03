module.exports = function () {

    const floors = [];

    let position, width, running;

    function constructor() {
        position = new Vector2(0, 328);
        width = 400;
        running = false;

        for (let i = 0; i < 6; i++) {
            const sprite = Graphics.loadImage(`./assets/img/floor_${i}.png`);
            Graphics.setImageFilters(sprite, 'NEAREST');
            
            floors.push(sprite);
        }
    }

    function update(gameState) {
        const { dt, speed } = gameState;

        if (!running) return;

        position.x-=speed;

        if (position.x + width < 0) {
            const sprite = floors.shift();
            floors.push(sprite);
            position.x = 0;
        }
    }

    function draw() {
        for (let i = 0; i < 6; i++) {
            Graphics.drawImage(
                floors[i], 
                position.x + width*i, position.y, // Screen position
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
        stop,
    }
}

