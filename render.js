const width = innerWidth;
const height = innerHeight;

function $(x) {
    return document.getElementById(x);
}

const canvas = $("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = width;
canvas.height = height;

// set all ye constants here!!

var mousePos = [0, 0];
var t = 0;
var mouseOrbitPos = [0, 0];
const mouseOrbitRadius = 80;
const mouseOrbitOmega = 0.1;
const tailLength = 50;
const tailDistBetween = 4;
const tailLerp = 0.05;
const componentLerp = 0.2;
const tailSize = 40;
const tailTaper = 0.95;
const numberOfTails = 9;

document.onmousemove = setMouse;

class tailComponent {
    constructor(pos, size) {
        this.pos = pos;
        this.size = size;
    }

    moveTowards(target, minDist, lerpValue) {
        //console.log("dist", getDist(this.pos, target));

        if (getDist(this.pos, target) > minDist) {
            //console.log("lmao");
            let newX = lerp(this.pos[0], target[0], lerpValue);
            let newY = lerp(this.pos[1], target[1], lerpValue);
            //console.log("new", [newX,newY]);
            this.pos = [newX, newY];
        } 
    }
}

class tail {
    constructor(pos, length, distBetween, size, taper) {
        this.phase = Math.random() * 2 * Math.PI;
        this.taper = taper;
        this.length = length;
        this.distBetween = distBetween;
        this.components = [];
        for (let i = 0; i < this.length; i++) {
            this.components[i] = new tailComponent(pos, (size * (taper ** i)));
        }
    }

    move(target, minDist) {
        let targetOrbit = [0, 0]
        targetOrbit[0] = target[0] + (2 + this.phase) * mouseOrbitRadius * Math.cos((mouseOrbitOmega + this.phase) * t + this.phase);
        targetOrbit[1] = target[1] + (2 + this.phase) * mouseOrbitRadius * Math.sin((mouseOrbitOmega + this.phase) * t + this.phase);
        this.components[0].moveTowards(targetOrbit, minDist, tailLerp);
        for (let i = 1; i < this.length; i++) {
            this.components[i].moveTowards(this.components[i - 1].pos, this.distBetween, componentLerp);
        }
    }
}


function update(timestamp) {

    t = timestamp / 1000;

    window.requestAnimationFrame(update);
    for (let i = 0; i < tails.length; i++) {
        tails   [i].move(mousePos, 5);
    }
    draw();
}

function draw() {
    //console.log(mousePos[0], ",", mousePos[1]);

    ctx.clearRect(0, 0, width, height);
    //console.log(circles.length);

    //ctx.beginPath();
    //ctx.arc(mouseOrbitPos[0], mouseOrbitPos[1], 10, 0, 2 * Math.PI);
    //ctx.stroke();


    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.miterLimit = 4;

    for (let j = 0; j < tails.length; j++) {
        ctx.beginPath();
        for (let i = 0; i < tails[j].length; i++) {
            ctx.lineWidth = tails[j].components[i].size;
            //ctx.quadraticCurveTo(circles.components[i + 1].pos[0], circles.components[i + 1].pos[1], circles.components[i].pos[0], circles.components[i].pos[1]);
            //ctx.arc(circles.components[i].pos[0], circles.components[i].pos[1], circles.components[i].size, 40, 0, 2 * Math.PI);
            ctx.lineTo(tails[j].components[i].pos[0], tails[j].components[i].pos[1]);
            ctx.stroke();
        } 
    }


    //ctx.closePath();
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

    var tails = []
    for (i = 0; i < numberOfTails; i++) {
        tails[i] = new tail([width / 2, height / 2], tailLength, tailDistBetween, tailSize, tailTaper);
    }


    window.requestAnimationFrame(update);

