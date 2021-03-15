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

const lerpT = 0.1;

document.onmousemove = setMouse;

class tailComponent {
    constructor(pos, size) {
        this.pos = pos;
        this.size = size;
    }

    moveTowards(target, minDist) {
        //console.log("dist", getDist(this.pos, target));

        if (getDist(this.pos, target) > minDist) {
            //console.log("lmao");
            let newX = lerp(this.pos[0], target[0], lerpT);
            let newY = lerp(this.pos[1], target[1], lerpT);
            //console.log("new", [newX,newY]);
            this.pos = [newX, newY];
        } 
    }
}

class tail {
    constructor(pos, length, distBetween, size, taper) {
        this.taper = taper;
        this.length = length;
        this.distBetween = distBetween;
        this.components = [];
        for (let i = 0; i < this.length; i++) {
            this.components[i] = new tailComponent(pos, (size * (taper ** i)));
        }
    }

    move(target, minDist) {
        this.components[0].moveTowards(target, minDist);
        for (let i = 1; i < this.length; i++) {
            this.components[i].moveTowards(this.components[i - 1].pos, this.distBetween);
        }
    }
}


function update() {
    window.requestAnimationFrame(update);
    circles.move(mousePos, 100);
    draw();
}

function draw() {
    //console.log(mousePos[0], ",", mousePos[1]);

    ctx.clearRect(0, 0, width, height);
    //console.log(circles.length);

    for (let i = 0; i < circles.length; i++) {
        //console.log("lol");
        ctx.beginPath();
        ctx.arc(circles.components[i].pos[0], circles.components[i].pos[1], circles.components[i].size, 40, 0, 2 * Math.PI);
        ctx.stroke();
    } 

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

    var circles = new tail([0,0], 20, 20, 40, 0.9);

    window.requestAnimationFrame(update);

