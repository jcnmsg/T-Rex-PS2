module.exports = {
    states: {
        IDLE: 0,
        DEAD: 1,
        RUNNING: 2,
        CRAWLING: 3,
        JUMPING: 4,
    },
    meta: [
        { length: 1, width: 44, height: 47, startCol: 0, startRow: 0 },
        { length: 1, width: 44, height: 47, startCol: 1, startRow: 0 },
        { length: 2, width: 44, height: 47, startCol: 2, startRow: 0 },
        { length: 2, width: 59, height: 47, startCol: 0, startRow: 1 },
        { length: 1, width: 44, height: 47, startCol: 0, startRow: 0 },
    ],
    sprite: "./assets/img/dino.png",
}