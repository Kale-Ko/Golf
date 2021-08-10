import { levels, winlevel } from "./levels.js"

const canvas = document.getElementById("game")

var mouseDown = false
var startMousePos = { x: 0, y: 0 }

const app = new PIXI.Application({
    view: canvas,
    width: 300,
    height: 600,
    backgroundColor: 0x00aa00,
    autoStart: true
})

window.onresize = () => {
    app.resolution = window.devicePixelRatio || 1
}

window.onresize()

Math.P = 16
Math.F = 0.015

/*const background = new PIXI.TilingSprite.from("./assets/background.png")
background.tileScale.x = 2 / Math.P
background.tileScale.y = 2 / Math.P
background.width = 300
background.height = 600*/

const ball = PIXI.Sprite.from("./assets/ball.png")
ball.scale.x = 1 / Math.P
ball.scale.y = 1 / Math.P
var velocity = { x: 0, y: 0}
app.ticker.add(delta => {
    ball.x += velocity.x * delta
    ball.y += velocity.y * delta

    if (velocity.x > 0) velocity.x -= Math.F * velocity.x * delta
    else velocity.x += Math.F * -velocity.x * delta
    if (velocity.y > 0) velocity.y -= Math.F * velocity.y * delta
    else velocity.y += Math.F * -velocity.y * delta

    doBallCollision(ball, [hole, arrow])

    if (isCollding(ball, hole)) loadLevel()

    arrow.x = ball.x
    arrow.y = ball.y

    arrow.visible = mouseDown
})

var arrow = PIXI.Sprite.from("./assets/arrow.png")
arrow.scale.x = 1 / Math.P
arrow.scale.y = 2 / Math.P

const hole = PIXI.Sprite.from("./assets/hole.png")
hole.scale.x = 1 / Math.P
hole.scale.y = 1 / Math.P

var wall1 = PIXI.Sprite.from("./assets/wall.png")
wall1.scale.x = 20 / Math.P
wall1.scale.y = 1 / Math.P
var wall2 = PIXI.Sprite.from("./assets/wall.png")
wall2.scale.x = 1 / Math.P
wall2.scale.y = 40 / Math.P
var wall3 = PIXI.Sprite.from("./assets/wall.png")
wall3.y = 585
wall3.scale.x = 20 / Math.P
wall3.scale.y = 1 / Math.P
var wall4 = PIXI.Sprite.from("./assets/wall.png")
wall4.x = 285
wall4.scale.x = 1 / Math.P
wall4.scale.y = 40 / Math.P

//app.stage.addChild(background)

app.stage.addChild(wall1)
app.stage.addChild(wall2)
app.stage.addChild(wall3)
app.stage.addChild(wall4)

app.stage.addChild(hole)

app.stage.addChild(ball)
app.stage.addChild(arrow)


var level = 0
var currentlevel
var currentobjects = []

loadLevel()

function loadLevel() {
    currentobjects.forEach(object => { object.destroy(); delete currentobjects[currentobjects.indexOf(object)] })

    level++

    document.title = "Golf - Level " + level

    currentlevel = levels[level - 1]

    if (currentlevel == undefined) {
        document.title = "Golf - Win"

        currentlevel = winlevel
    }

    resetLevel()
}

function resetLevel() {
    velocity.x = 0
    velocity.y = 0

    ball.x = currentlevel.ball.x
    ball.y = currentlevel.ball.y

    hole.x = currentlevel.hole.x
    hole.y = currentlevel.hole.y

    currentlevel.objects.forEach(object => {
        var newobject
        if (object[0] == "brick") {
            newobject = PIXI.Sprite.from("./assets/object.png")
            newobject.x = object[1]
            newobject.y = object[2]
            newobject.scale.x = object[3] / 100
            newobject.scale.y = object[4] / 100
        } else if (object[0] == "water") {
            newobject = PIXI.Sprite.from("./assets/water.png")
            newobject.x = object[1]
            newobject.y = object[2]
            newobject.scale.x = object[3] / 100
            newobject.scale.y = object[4] / 100
        }

        currentobjects.push(newobject)
        app.stage.addChild(newobject)
    })
}

window.onmousemove = event => { if (mouseDown) calculateArrow(startMousePos, { x: event.pageX, y: event.pageY }) }
window.onmousedown = event => { mouseDown = true; startMousePos = { x: event.pageX, y: event.pageY } }
window.onmouseup = event => { mouseDown = false; launchBall(startMousePos, { x: event.pageX, y: event.pageY }) }

function calculateArrow(start, end) {
    arrow.rotation = Math.atan2(start.y - end.y, start.x - end.x) + (90 * (Math.PI / 180))

    arrow.scale.y = Math.pos(Math.pos(Math.clamp((start.x - end.x) / 25, -10, 10)) + Math.pos(Math.clamp((start.y - end.y) / 25, -10, 10))) / 50
}

function launchBall(start, end) {
    velocity.x = Math.clamp((start.x - end.x) / 25, -10, 10)
    velocity.y = Math.clamp((start.y - end.y) / 25, -10, 10)
}

function isCollding(object1, object2) {
    return object1.x + object1.width >= object2.x && object1.y + object1.height >= object2.y && object1.x <= object2.x + object2.width && object1.y <= object2.y + object2.height
}

function doBallCollision(ball, exlcude = []) {
    var ballx = PIXI.Sprite.from("./assets/ball.png")
    ballx.x = ball.x + velocity.x
    ballx.y = ball.y
    ballx.width = ball.width
    ballx.height = ball.height
    ballx.scale.x = 1 / Math.P
    ballx.scale.y = 1 / Math.P
    var bally = PIXI.Sprite.from("./assets/ball.png")
    bally.x = ball.x
    bally.y = ball.y + velocity.y
    bally.width = ball.width
    bally.height = ball.height
    bally.scale.x = 1 / Math.P
    bally.scale.y = 1 / Math.P

    ballx.x += velocity.x
    bally.y += velocity.y

    app.stage.children.forEach(object2 => {
        if (ball == object2 || exlcude.includes(object2)) return

        if (isCollding(ballx, object2)) velocity.x = -velocity.x
        if (isCollding(bally, object2)) velocity.y = -velocity.y
    })
}

Math.clamp = (x, min, max) => { return Math.min(Math.max(x, min), max) }
Math.pos = x => { if (x < 0) x = -x; return x }
Math.neg = x => { if (x > 0) x = -x; return x }