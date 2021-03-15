const width = innerWidth;
const height = innerHeight;
var mousePos = [0, 0];

function $(x) {
    return document.getElementById(x);
}

const canvas = $("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = width;
canvas.height = height;

const lerpT = 0.01;

document.onmousemove = setMouse;

class tailComponent {
    constructor(pos, size) {
        this.pos = pos;
        this.size = size;
    }

    moveTowards(target, minDist) {
        console.log("dist", getDist(this.pos, target));

        if (getDist(this.pos, target) > minDist) {
            //console.log("lmao");
            let newX = lerp(this.pos[0], target[0], lerpT);
            let newY = lerp(this.pos[1], target[1], lerpT);
            //console.log("new", [newX,newY]);
            this.pos = [newX, newY];
        } 
    }
}


function update() {
    window.requestAnimationFrame(update);
    circle.moveTowards(mousePos, 100);
    draw();
}

function draw() {
    //console.log(mousePos[0], ",", mousePos[1]);

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.arc(circle.pos[0], circle.pos[1], circle.size, 40, 0, 2 * Math.PI);
    ctx.stroke();
}

function setMouse(ev) {
    mousePos[0] = ev.clientX;
    mousePos[1] = ev.clientY;
}

function lerp(x, y, t) {
    let value = (y * t) + x * (1 - t);
    return value;
}

function getDist(x1, x2) {
    dx = x2[0] - x1[0];
    dy = x2[1] - x1[1];
    //console.log(dx ^ 2);
    //console.log(dy ^ 2);
    let dist = Math.sqrt((dx ** 2) + (dy ** 2));
    return dist;
}

    var circle = new tailComponent([20, 200], 20);
    window.requestAnimationFrame(update);

