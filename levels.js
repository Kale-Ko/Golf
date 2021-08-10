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
        ["brick", 86, 220, 50, 4]
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
        ["brick", 134, 340, 60, 4],
        ["brick", 16, 220, 80, 4],
        ["brick", 80, 130, 80, 4],
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
        ["water", 16, 220, 105, 12]
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
        
    ]
}

var levels = [level3, level1, level2, level3]

export { levels, winlevel }