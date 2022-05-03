module.exports = function () {

    let font, score, highscore, running, paused, frames, pointSound, scoreLock, scoreLockBlink, scorePos, highScorePos;

    function constructor() {
        font,
        score = 0,
        highscore = 0,
        running = false,
        frames = 0,
        pointSound,
        scoreLock = 0,
        scoreLockBlink = false,
        scorePos = new Vector2(-112, 160),
        highScorePos = new Vector2(-260, 160);

        font = Font.ftLoad("./assets/font/PressStart2P.ttf");
        pointSound = Sound.loadADPCM("./assets/sound/point.adp");
    }

    function update(gameState) {
        const { dt, speed } = gameState;

        if (!running) return false;

        if (frames > env.FRAMES_PER_SCORE) {
            frames = 0;
            score++;

            if (highscore <= score) {
                highscore++;
            }
        }
        else {
            frames++;
        }

        if (score % env.SCORE_LOCK_AT == 0) {
            Sound.playADPCM(-1, pointSound);
            scoreLock = 1;
        }

        if (scoreLock && scoreLock < env.SCORE_LOCK) {
            if (scoreLock % 11 == 0) {
                scoreLockBlink = !scoreLockBlink;
            }
            scoreLock++;
        }
        else {
            scoreLock = 0;
        }
    }

    function draw() {
        if (!scoreLockBlink) {
            Font.ftPrint(font, env.SCREEN_WIDTH + scorePos.x, scorePos.y, 0, 0, 0, format(score), Colors.DarkGrey)
            Font.ftPrint(font, env.SCREEN_WIDTH + highScorePos.x, highScorePos.y, 0, 0, 0, "HI " + format(highscore), Colors.LightGrey)
        }
    }

    function format(s) {
        if (!scoreLock) {
            return ("00000" + s).slice(-5);
        }

        return ("00000" + Math.floor(s / 100) * 100).slice(-5);
    }

    function start() {
        if (highscore == 0) {
            highscore = 1;
        }

        score = 1;
        running = true;
    }

    function stop() {
        running = false;
        scoreLockBlink = false;
        scoreLock = 0;
    }

    constructor();

    return {
        update,
        draw,
        start,
        stop,
        get state() {
            return states[state];
        }
    }
}

