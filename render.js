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
const mouseOrbitRadius = 200;
const mouseOrbitOmega = 1;
const tailLength = 50;
const tailDistBetween = 4;
const tailLerp = 0.05;
const componentLerp = 0.2;
const tailSize = 40;
const tailTaper = 0.9;


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
        targetOrbit[0] = target[0] + mouseOrbitRadius * Math.cos(mouseOrbitOmega * t + this.phase);
        targetOrbit[1] = target[1] + mouseOrbitRadius * Math.sin(mouseOrbitOmega * t + this.phase);
        this.components[0].moveTowards(targetOrbit, minDist, tailLerp);
        for (let i = 1; i < this.length; i++) {
            this.components[i].moveTowards(this.components[i - 1].pos, this.distBetween, componentLerp);
        }
    }
}


function update(timestamp) {

    t = timestamp / 1000;

    window.requestAnimationFrame(update);
    circles.move(mousePos, 5);
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
    ctx.lineJoin = 'round;'
    ctx.beginPath();

    for (let i = 0; i < circles.length; i++) {
        ctx.lineWidth = circles.components[i].size;
        //ctx.quadraticCurveTo(circles.components[i + 1].pos[0], circles.components[i + 1].pos[1], circles.components[i].pos[0], circles.components[i].pos[1]);
        //ctx.arc(circles.components[i].pos[0], circles.components[i].pos[1], circles.components[i].size, 40, 0, 2 * Math.PI);
        ctx.lineTo(circles.components[i].pos[0], circles.components[i].pos[1]);
        ctx.stroke();
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

    var circles = new tail([0,0], 80, 4, 40, 0.9);

    window.requestAnimationFrame(update);

