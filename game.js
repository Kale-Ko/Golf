/**
    @license
    MIT License
    Copyright (c) 2021 Kale Ko
    See https://kaleko.ga/license.txt
*/

import { levels, winlevel } from "./levels.js"

const canvas = document.getElementById("game")

var mouseDown = false
var startMousePos = { x: 0, y: 0 }
var won = false

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

const background = PIXI.TilingSprite.from("./assets/background.png")
background.tileScale.x = 4 / Math.P
background.tileScale.y = 4 / Math.P
background.width = 300
background.height = 600

var strokeCount = 0
var totalStrokeCount = 0
const strokeCountText = new PIXI.Text("Strokes: " + strokeCount, { fontFamily: "Arial", fontSize: 24, fill: 0x000000, align: "left" })
strokeCountText.x = 20
strokeCountText.y = 20

const ball = PIXI.Sprite.from("./assets/ball.png")
ball.scale.x = 1 / Math.P
ball.scale.y = 1 / Math.P
var velocity = { x: 0, y: 0 }
app.ticker.add(delta => {
    ball.x += velocity.x * delta
    ball.y += velocity.y * delta

    if (velocity.x > 0) velocity.x -= Math.F * velocity.x * delta
    else velocity.x += Math.F * -velocity.x * delta
    if (velocity.y > 0) velocity.y -= Math.F * velocity.y * delta
    else velocity.y += Math.F * -velocity.y * delta

    doBallCollision(ball)

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
wall1.tiletype = "brick"
var wall2 = PIXI.Sprite.from("./assets/wall.png")
wall2.scale.x = 1 / Math.P
wall2.scale.y = 40 / Math.P
wall2.tiletype = "brick"
var wall3 = PIXI.Sprite.from("./assets/wall.png")
wall3.y = 585
wall3.scale.x = 20 / Math.P
wall3.scale.y = 1 / Math.P
wall3.tiletype = "brick"
var wall4 = PIXI.Sprite.from("./assets/wall.png")
wall4.x = 285
wall4.scale.x = 1 / Math.P
wall4.scale.y = 40 / Math.P
wall4.tiletype = "brick"

app.stage.addChild(background)

app.stage.addChild(strokeCountText)

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

    strokeCount = 0
    strokeCountText.text = "Strokes: " + strokeCount

    level++

    document.title = "Mini Golf - Level " + level

    currentlevel = levels[level - 1]

    if (currentlevel == undefined) {
        document.title = "Mini Golf - Win"

        currentlevel = winlevel

        strokeCountText.text = "Total Strokes: " + totalStrokeCount

        won = true
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
            newobject.tiletype = "brick"
        } else if (object[0] == "water") {
            newobject = PIXI.Sprite.from("./assets/water.png")
            newobject.x = object[1]
            newobject.y = object[2]
            newobject.scale.x = object[3] / 100
            newobject.scale.y = object[4] / 100
            newobject.tiletype = "water"
        } else if (object[0] == "text") {
            newobject = new PIXI.Text(object[3], { fontFamily: "Arial", fontSize: object[4], fill: object[5], align: "center" })
            newobject.x = object[1]
            newobject.y = object[2]
            newobject.tiletype = "text"
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

    if (!won) {
        strokeCount++
        totalStrokeCount++
        strokeCountText.text = "Strokes: " + strokeCount
    }
}

function isCollding(object1, object2) { return object1.x + object1.width >= object2.x && object1.y + object1.height >= object2.y && object1.x <= object2.x + object2.width && object1.y <= object2.y + object2.height }

var ballx = PIXI.Sprite.from("./assets/ball.png")
ballx.scale.x = 1 / Math.P
ballx.scale.y = 1 / Math.P
var bally = PIXI.Sprite.from("./assets/ball.png")
bally.scale.x = 1 / Math.P
bally.scale.y = 1 / Math.P

function doBallCollision(ball) {
    ballx.x = ball.x + velocity.x
    ballx.y = ball.y

    bally.x = ball.x
    bally.y = ball.y + velocity.y

    app.stage.children.forEach(object2 => {
        if (ball == object2) return

        var xcolliding = isCollding(ballx, object2)
        var ycolliding = isCollding(bally, object2)

        if (object2.tiletype == "brick" && (xcolliding || ycolliding)) {
            if (xcolliding) velocity.x = -velocity.x
            if (ycolliding) velocity.y = -velocity.y
        } else if (object2.tiletype == "water" && (xcolliding || ycolliding)) {
            if (xcolliding) {
                if (velocity.x > 0) {
                    ball.x = object2.x - ball.width - 2
                } else {
                    ball.x = object2.x + object2.width + 2
                }
            }
            if (ycolliding) {
                if (velocity.y > 0) {
                    ball.y = object2.y - ball.height - 2
                } else {
                    ball.y = object2.y + object2.height + 2
                }
            }

            velocity.x = 0
            velocity.y = 0

            strokeCount++
            totalStrokeCount++
            strokeCountText.text = "Stokes: " + strokeCount
        }
    })
}

Math.clamp = (x, min, max) => { return Math.min(Math.max(x, min), max) }
Math.pos = x => { if (x < 0) { x = -x } return x }
Math.neg = x => { if (x > 0) { x = -x } return x }