var level1 = {
    ball: {
        x: 136,
        y: 520
    },
    hole: {
        x: 136,
        y: 60
    },
    objects: [
        ["text", 25, 550, "Click and drag to shoot", 24, 0x000000],
        ["text", 24, 90, "Get in the hole to advance", 22, 0x000000]
    ]
}

var level2 = {
    ball: {
        x: 136,
        y: 520
    },
    hole: {
        x: 136,
        y: 60
    },
    objects: [
        ["brick", 86, 220, 50, 5],
        ["text", 44, 160, "You bounce off the\nwalls and objects", 24, 0x000000]
    ]
}

var level3 = {
    ball: {
        x: 136,
        y: 520
    },
    hole: {
        x: 136,
        y: 60
    },
    objects: [
        ["water", 16, 190, 65, 12],
        ["text", 20, 160, "Hitting water is a penalty", 24, 0x000000]
    ]
}

var winlevel = {
    ball: {
        x: 136,
        y: 520
    },
    hole: {
        x: 136,
        y: 60
    },
    objects: [
        ["text", 65, 220, "You Won!", 40, 0x000000]
    ]
}

var levels = [level1, level2, level3]

export { levels, winlevel }