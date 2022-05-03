const Dino = require('./controllers/dino');
const Floor = require('./controllers/floor');
const ScoreBoard = require('./controllers/scoreboard');
const Hazards = require('./controllers/hazards');
const Doors = require('./controllers/doors');
const Clouds = require('./controllers/clouds');

module.exports = function () {

    const { states } = require('./data/game');

    let state, dino, floor, scoreboard, hazards, speed, doors, clouds, paused;

    function constructor() {
        switch (env.DISPLAY_MODE) {
            case 'PAL_2D':
                Display.setMode(PAL, 640, 512, CT24, (!!env.INTERLACED ? INTERLACED : NONINTERLACED), FIELD);
                env.SCREEN_WIDTH = 640;
                env.SCREEN_HEIGHT = 512;
                break;

            case 'PAL_3D':
                Display.setMode(PAL, 640, 512, CT24, (!!env.INTERLACED ? INTERLACED : NONINTERLACED), FIELD, true, Z16S);
                env.SCREEN_WIDTH = 640;
                env.SCREEN_HEIGHT = 512;
                break;

            case 'NTSC_2D':
                Display.setMode(NTSC, 640, 448, CT24, (!!env.INTERLACED ? INTERLACED : NONINTERLACED), FIELD);
                env.SCREEN_WIDTH = 640;
                env.SCREEN_HEIGHT = 448;
                break;

            case 'NTSC_3D':
                Display.setMode(NTSC, 640, 448, CT24, (!!env.INTERLACED ? INTERLACED : NONINTERLACED), FIELD, true, Z16S);
                env.SCREEN_WIDTH = 640;
                env.SCREEN_HEIGHT = 448;
                break;
        }

        Display.setVSync(!!env.VSYNC);

        Font.ftInit();
        Sound.setFormat(8, 44100, 2);

        state = states.PRE_GAME;
        speed = env.INITIAL_SPEED;
        dino = new Dino();
        floor = new Floor();
        scoreboard = new ScoreBoard();
        hazards = new Hazards();
        doors = new Doors();
        clouds = new Clouds();
        paused = false;
    }

    function update(dt) {
        switch (state) {
            case states.PRE_GAME:
                if (doors.finished) {
                    if (GamePad.interacted(PAD_CROSS)) {
                        restart();
                    }
                }
                else {
                    doors.update({ dt, speed });
                }
                break;

            case states.GAME_OVER:
                if (GamePad.interacted(PAD_CROSS)) {
                    restart();
                }
                break;

            case states.GAME:
                if (GamePad.interacted(PAD_START)) {
                    paused = !paused;
                    GamePad.release(PAD_START)
                }

                if (hazards.colliding(dino.collider)) {
                    dino.kill();
                    scoreboard.stop();
                    floor.stop(); 
                    hazards.stop();
                    clouds.stop();
                    state = states.GAME_OVER;
                    GamePad.release(PAD_CROSS);
                }
                else if (!paused) {
                    if (speed < env.MAX_SPEED) {
                        speed += env.ACCELERATION;
                    }
                    
                    clouds.update({ dt, speed });
                    dino.update({ dt, speed });
                    scoreboard.update({ dt, speed });
                    floor.update({ dt, speed });
                    hazards.update({ dt, speed });   
                }
                break;
        }
    }

    function restart() {
        speed = env.INITIAL_SPEED;
        state = states.GAME;
        scoreboard.start();
        dino.start();
        floor.start();
        hazards.start();
        clouds.start();
    }

    function draw() {
        Display.clear(Colors.Black); // Clear the screen
        
        Graphics.drawRect(0, 128, env.SCREEN_WIDTH, 256, Colors.White); // Draw canvas

        // Draw game objects
        floor.draw();
        clouds.draw();
        dino.draw();
        hazards.draw();
        scoreboard.draw();
        if (!doors.finished) doors.draw();
      
        Display.flip(); // Flip to the screen
    }

    constructor();

    return {
        update,
        draw
    }
}