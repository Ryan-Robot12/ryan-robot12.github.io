var speed = 5
var turnSpeed = 0.1
// height, width, left offset, top offset, rotation (radians)
var redTank = new daize.sprite(30, 45, 25, 25, 0, "px");
canv.addsprite(redTank);
redTank.costume = "redtank.png";
redTank.layer = 3;
var redHitbox = new daize.sprite(30, 45, 25, 25, Math.PI, "px")
canv.addsprite(redHitbox)
var redShots = []

var greenTank = new daize.sprite(30, 45, 75, 25, 0, "px")
canv.addsprite(greenTank)
greenTank.costume = "greentank.png"
greenTank.layer = 3
var greenHitbox = new daize.sprite(30, 45, 75, 25, Math.PI, "px")
canv.addsprite(greenHitbox)
var greenShots = []

const motorBoundMargin = 18
var frame = -1
const framesBetweenShoot = 1
const maxShots = 10
const shotSpeed = 7
var walls = []

// key handling (credit @yikuansun1 on replit):
// used like if (keysDown.[key]) { doSomething(); } e.g. if (keysDown.a) { doSomething(); }
var keysDown = {};
var canPressQ = true;
var canPressM = true;
var onKeyDown = function(e) { keysDown[e.key] = true; };
var onKeyUp = function(e) { keysDown[e.key] = false; };
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);

function setup() {
  var map = getAMap()
  for (var x = 0; x < 9; x++) {
    for (var y = 0; y < 9; y++) {
      if (map[0][y].charAt(x) == "1") {
        var wall = new daize.sprite(20, 152, x * 120, y * 67, 0, "px")
        wall.costume = "wall.png"
        wall.layer = 3
        canv.addsprite(wall)
      }
    }
  }
  // --------------------------------------------------------------------
  for (var x = 0; x < 9; x++) {
    for (var y = 0; y < 9; y++) {
      if (map[1][y].charAt(x) == "1") {
        var wall = new daize.sprite(20, 130, x * 115, y * 67, Math.PI / 2, "px")
        wall.costume = "wall.png"
        wall.layer = 3
        canv.addsprite(wall)
        walls.push(wall)
      }
    }
  }
}

function mainLoop() {
  // ------------------------------
  if (keysDown.ArrowLeft) {
    greenTank.angle -= turnSpeed
    greenHitbox.angle -= turnSpeed
  } else if (keysDown.ArrowRight) {
    greenTank.angle += turnSpeed
    greenHitbox.angle += turnSpeed
  }
  var angle = (Math.PI / 2 - greenHitbox.angle)
  if (keysDown.ArrowUp) {
    greenHitbox.x += speed * Math.cos(angle)
    greenHitbox.y -= speed * Math.sin(angle)
  } else if (keysDown.ArrowDown) {
    greenHitbox.x += -speed * Math.cos(angle)
    greenHitbox.y -= -speed * Math.sin(angle)
  }
  greenTank.x = Math.min(Math.max(greenHitbox.x, 0 + motorBoundMargin), 960 - motorBoundMargin);
  greenTank.y = Math.min(Math.max(greenHitbox.y, 0 + motorBoundMargin), 540 - motorBoundMargin);
  // ------------------------------
  if (keysDown.a) {
    redTank.angle -= turnSpeed
    redHitbox.angle -= turnSpeed
  } else if (keysDown.d) {
    redTank.angle += turnSpeed
    redHitbox.angle += turnSpeed
  }
  var angle = (Math.PI / 2 - redHitbox.angle)
  if (keysDown.w) {
    redHitbox.x += speed * Math.cos(angle)
    redHitbox.y -= speed * Math.sin(angle)
  } else if (keysDown.s) {
    redHitbox.x += -speed * Math.cos(angle)
    redHitbox.y -= -speed * Math.sin(angle)
  }
  redTank.x = Math.min(Math.max(redHitbox.x, 0 + motorBoundMargin), 960 - motorBoundMargin);
  redTank.y = Math.min(Math.max(redHitbox.y, 0 + motorBoundMargin), 540 - motorBoundMargin);
  // ------------------------------
  if (keysDown.q && canPressQ) {
    canPressQ = false
    // red shoot
    if (redShots.length < maxShots) {
      var tempBall = new daize.sprite(8, 8, redHitbox.x, redHitbox.y, redTank.angle, "px");
      canv.addsprite(tempBall);
      tempBall.costume = "ball.png";
      tempBall.style.filter = redTank.style.filter; tempBall.layer = 2;
      redShots.push(tempBall);
      setTimeout(() => {
        tempBall.remove()
        redShots.shift()
      }, 7500)
    }
  }
  else if (!keysDown.q) {
    canPressQ = true;
  }
  // ------------------------------
  if (keysDown.m && canPressM) {
    canPressM = false
    // green shoot
    if (greenShots.length < maxShots) {
      var tempBall = new daize.sprite(8, 8, greenHitbox.x, greenHitbox.y, greenTank.angle, "px");
      canv.addsprite(tempBall);
      tempBall.costume = "ball.png";
      tempBall.style.filter = greenTank.style.filter;
      tempBall.layer = 2;
      greenShots.push(tempBall);
      setTimeout(() => {
        tempBall.remove()
        greenShots.shift()
      }, 7500)
    }
  } else if (!keysDown.m) {
    canPressM = true
  }
  // ------------------------------
  for (let i = 0; i < redShots.length; i++) {
    var redBall = redShots[i]
    redBall.movevec(7, (3 * Math.PI / 2 - redBall.angle));
    if ((0 < redBall.x) && (redBall.x < 960) && (0 < redBall.y) && (redBall.y < 540)) {
      if (redBall.boxcollision(greenHitbox)) {
        redBall.remove()
        redShots.splice(i, 1)
        greenTank.x = 75
        greenTank.y = 25
        greenTank.angle = 0
        greenHitbox.x = 75
        greenHitbox.y = 25
        greenHitbox.angle = Math.PI
      }
    } else {
      redBall.remove()
      redShots.splice(i, 1)
    }
  }
  // ------------------------------

  var i = 0;
  while (i < greenShots.length) {
    var greenBall = greenShots[i]
    greenBall.movevec(7, (3 * Math.PI / 2 - greenBall.angle));
    if ((0 < greenBall.x) && (greenBall.x < 960) && (0 < greenBall.y) && (greenBall.y < 540)) {
      if (greenBall.boxcollision(redHitbox)) {
        greenBall.remove()
        greenShots.splice(i, 1)
        redTank.x = 25
        redTank.y = 25
        redTank.angle = 0
        redHitbox.x = 25
        redHitbox.y = 25
        redHitbox.angle = Math.PI
      } else {
        i++;
      }
    } else {
      greenBall.remove()
      greenShots.splice(i, 1)
    }
  }
  // ------------------------------
  frame += 1
  if (frame > 4294967296) { // if the game is open for a while
    // should not cause any issues but just to be safe
    // max int variable is 2^51 - 1. This num is 2^32
    frame = 0
  }
  window.requestAnimationFrame(mainLoop)
}

setup()
window.requestAnimationFrame(mainLoop)
