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
        ["brick", 86, 220, 50, 5]
    ]
}

var level2 = {
    ball: {
        x: 136,
        y: 520
    },
    hole: {
        x: 240,
        y: 60
    },
    objects: [
        ["brick", 134, 340, 60, 5],
        ["brick", 16, 220, 80, 5],
        ["brick", 80, 130, 80, 5],
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
        ["water", 16, 190, 75, 12],
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