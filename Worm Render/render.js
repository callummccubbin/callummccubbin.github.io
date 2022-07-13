const width = innerWidth;
const height = innerHeight;

function $(x) {
    return document.getElementById(x);
}

const canvas = $("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = width;
canvas.height = height;

let inputs = [];
let outputs = [];

var mousePos = [0, 0];
var t = 0;
var tails = [];

for (let k = 0; k < 7; k++) {
    inputs[k] = $("a" + String(k + 1));
    outputs[k] = $("b" + String(k + 1));
}

for (let k = 0; k < 7; k++) {
    outputs[k].innerHTML = inputs[k].value;
}

for (let k = 0; k < 7; k++) {
    inputs[k].oninput = function() {
        outputs[k].innerHTML = this.value;
    }
}

let numberOfTails = inputs[0].value;
let tailSize = inputs[1].value;
let tailLength = inputs[2].value;
let tailLerp = inputs[3].value / 100; // tail speed
let tailTaper = inputs[4].value / 100;
let mouseOrbitRadius = inputs[5].value;
let mouseOrbitOmega = inputs[6].value;

const tailDistBetween = 2;
const componentLerp = 0.2;

//console.log(tails);

function toggleNav() {
    if (document.getElementById("mySidenav").style.width == "300px") {
        document.getElementById("mySidenav").style.width = "0";
    } else {
        document.getElementById("mySidenav").style.width = "300px";
    }
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
} 

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
        this.rand = Math.random();
        this.rand2 = Math.random();
        this.taper = taper;
        this.length = length;
        this.distBetween = distBetween;
        this.components = [];
        for (let i = 0; i < this.length; i++) {
            this.components[i] = new tailComponent(pos, (size * (taper ** i)));
        }
    }

    move(target, minDist) {
        let targetOrbit = [0, 0];
        targetOrbit[0] = target[0] + (0.5 + this.rand) * mouseOrbitRadius * Math.cos((mouseOrbitOmega * (this.rand2 - 0.5)) * t + this.phase);
        targetOrbit[1] = target[1] + (0.5 + this.rand) * mouseOrbitRadius * Math.sin((mouseOrbitOmega * (this.rand2 - 0.5)) * t + this.phase);
        this.components[0].moveTowards(targetOrbit, minDist, tailLerp);
        //this.components[0].pos = targetOrbit;
        for (let i = 1; i < this.length; i++) {
            this.components[i].moveTowards(this.components[i - 1].pos, this.distBetween, componentLerp);
        }
    }
}

function initialize() {

    numberOfTails = inputs[0].value;
    tailSize = inputs[1].value;
    tailLength = inputs[2].value;
    tailLerp = inputs[3].value / 100; // tail speed
    tailTaper = inputs[4].value / 100;
    mouseOrbitRadius = inputs[5].value;
    mouseOrbitOmega = inputs[6].value;

    tails = [];
    for (i = 0; i < numberOfTails; i++) {
        tails[i] = new tail([width * Math.random(), height * Math.random()], tailLength, tailDistBetween, tailSize, tailTaper);
    }

}


document.onmousemove = setMouse;

initialize();

function update(timestamp) {

    t = timestamp / 1000;
    for (let i = 0; i < tails.length; i++) {
        tails[i].move(mousePos, 5);
    }
    draw();

    window.requestAnimationFrame(update);
}

function drawDot() {
    let targetOrbit = [0, 0];
    targetOrbit[0] = mousePos[0] + mouseOrbitRadius * Math.cos((mouseOrbitOmega) * t);
    targetOrbit[1] = mousePos[1] + mouseOrbitRadius * Math.sin((mouseOrbitOmega) * t);

    ctx.fillRect(targetOrbit[0], targetOrbit[1], 10, 10);
}

function draw() {

    //console.log(mousePos[0], ",", mousePos[1]);

    ctx.clearRect(0, 0, width, height);
    //console.log(circles.length);

    //ctx.beginPath();
    //ctx.arc(mouseOrbitPos[0], mouseOrbitPos[1], 10, 0, 2 * Math.PI);
    //ctx.stroke();
    //drawDot();


    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.miterLimit = 4;

    for (let j = 0; j < tails.length; j++) {
        ctx.beginPath();
        for (let i = 0; i < tails[j].length; i++) {
            ctx.lineWidth = tails[j].components[i].size;
            //ctx.strokeStyle = 'rgb(' + i + ', ' + i + ', ' + i + ')';
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
window.requestAnimationFrame(update);

