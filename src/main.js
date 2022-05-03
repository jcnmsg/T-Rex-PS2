global.env = require('../.env');
global.Vector2 = require('./extend/Vectors').Vector2;
global.Colors = require('./extend/Colors');
global.GamePad = require('./extend/GamePad');
global.random = require('./extend/Random');

const game = require('./game/game')();
const timer = Timer.new();

let currentFrame = previousFrame = 0;

function iterate() {
    currentFrame = Timer.getTime(timer);
    const dt = (currentFrame - previousFrame)/1000; // Calculate delta time
    previousFrame = Timer.getTime(timer);

    GamePad.capture(); // Simple wrapper for captured input (pressed, clicked, interacted)

    game.update(dt);
    game.draw();
}

while(1) iterate();