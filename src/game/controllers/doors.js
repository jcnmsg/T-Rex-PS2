module.exports = function() {

    let topDoor, bottomDoor, done;

    function constructor() {
        done = false;
        
        topDoor = {
            position: new Vector2(0, 128),
            dimensions: new Vector2(env.SCREEN_WIDTH, 128),
            stopY: 0,
        }

        bottomDoor = {
            position: new Vector2(0, 256),
            dimensions: new Vector2(env.SCREEN_WIDTH, 128),
            stopY: 384
        }
    }

    function update(gameState) {
        const { dt, speed } = gameState;

        let moved = false;

        if (topDoor.position.y > topDoor.stopY) {
            topDoor.position.y-=2;
            moved = true;
        }

        if (bottomDoor.position.y < bottomDoor.stopY) {
            bottomDoor.position.y+=2;
            moved = true;
        }

        done = !moved;
    }

    function draw() {
        Graphics.drawRect(topDoor.position.x, topDoor.position.y, topDoor.dimensions.x, topDoor.dimensions.y, Colors.Black);
        Graphics.drawRect(bottomDoor.position.x, bottomDoor.position.y, bottomDoor.dimensions.x, bottomDoor.dimensions.y, Colors.Black);
    }

    constructor();

    return {
        update, 
        draw,
        get finished() {
            return done;
        }
    }
}