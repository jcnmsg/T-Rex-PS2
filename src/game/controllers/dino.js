module.exports = function () {

    const { states, meta, sprite } = require('../data/dino');

    let state, frameChange, spritesheet, frame, jumpSound, deadSound, groundY, appliedExtra, position, velocity, collider;

    function constructor() {
        spritesheet = Graphics.loadImage(sprite);
        Graphics.setImageFilters(spritesheet, 'NEAREST');

        jumpSound = Sound.loadADPCM("./assets/sound/jump.adp");
        deadSound = Sound.loadADPCM("./assets/sound/die.adp");
        state = states.IDLE;

        groundY = 325;
        position = new Vector2(100, groundY);
        velocity = new Vector2(0, 0);
        collider = {
            position: new Vector2(position.x - 44/2 + 12, position.y - 47/2 + 2),
            dimensions: new Vector2(30, 30)
        }

        frame = 0;
        frameChange = 0;
        appliedExtra = false;
    }

    function update(gameState) {
        const { dt, speed } = gameState;

        const animation = meta[state];

        if (animation.length > 0) {
            if (frameChange == 5) {
                if (frame + 1 < animation.length) {
                    frame++;
                }
                else {
                    frame = 0;
                }
                frameChange = 0;
            }
            else {
                frameChange++;
            }
        }

        switch (state) {
            case states.RUNNING:
                if (GamePad.interacted(PAD_DOWN)) {
                    state = states.CRAWLING;
                } 
        
                if (GamePad.interacted(PAD_CROSS)) {
                    Sound.playADPCM(-1, jumpSound);
                    state = states.JUMPING;
                    frame = 0;
                }

                collider.position.x = position.x - 44/2 + 12;
                collider.position.y = position.y - 47/2 + 2;
                collider.dimensions.x = 30;
                collider.dimensions.y = 30;
                break;

            case states.CRAWLING:
                if (!GamePad.interacted(PAD_DOWN)) {
                    state = states.RUNNING;
                }

                collider.position.x = position.x - 53/2;
                collider.position.y = position.y;
                collider.dimensions.x = 53;
                collider.dimensions.y = 22;
                break;

            case states.JUMPING:
                if (position.y == groundY) {
                    velocity.y = env.SHORT_JUMP;
                }

                if (!appliedExtra && velocity.y < 0 && GamePad.pressed(PAD_CROSS)) {
                    velocity.y += env.LONG_JUMP;
                    appliedExtra = true;
                }

                position.y += velocity.y;
                velocity.y += 1;
                
                if (position.y >= groundY) {
                    state = states.RUNNING;
                    velocity.y = 0;
                    position.y = groundY;
                    appliedExtra = false;
                }

                collider.position.x = position.x - 44/2 + 12;
                collider.position.y = position.y - 47/2 + 2;
                collider.dimensions.x = 30;
                collider.dimensions.y = 30;
                break;

            default:
                break;
        }
    }

    function draw() {
        const animation = meta[state];

        const startX = (animation.startCol)*animation.width + frame*animation.width;
        const startY = (animation.startRow)*animation.height;

        Graphics.drawImageExtended(
            spritesheet, 
            position.x, position.y, // Screen position
            startX, startY, // Sheet position
            startX + animation.width, startY + animation.height, // Width (docs are wrong, not width but actually x pos of end of frame) /height
            animation.width, animation.height, // Scale
            0
        )
    }

    function start() {
        state = states.RUNNING;
        position.y = groundY;
    }

    function kill() {
        frame = 0;
        state = states.DEAD;
        Sound.playADPCM(-1, deadSound);
    }

    constructor();

    return {
        update,
        draw,
        start,
        kill,
        get state() {
            return states[state];
        },
        get position() {
            return position;
        },
        get size() {
            return size;
        },
        get collider() {
            return collider;
        },
        get dead() {
            return state == states.DEAD;
        }
    }
}

