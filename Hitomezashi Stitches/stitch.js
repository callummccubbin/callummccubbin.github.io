
function $(x) {
    return document.getElementById(x);
}

const canvas = $("myCanvas");
const ctx = canvas.getContext("2d");
const container = $("container");


/*
const width = container.width;
const height = container.height;

canvas.width = width;
canvas.height = height;
*/

let numRows = 60;
let numCols = 100;
let topBorder = 20;
let leftBorder = 20;
let fill1 = true;
let fill2 = true;
let seedx = [];
let seedy = [];
let t = 0;
let frametime = 200;
let timeOfLastFrame = 0;

function assignSeeds() {
    for (i=0; i<numCols; i++) {
        seedx[i] = Math.floor(Math.random() * 2);
    }
    for (i=0; i<numRows; i++) {
        seedy[i] = Math.floor(Math.random() * 2);
    }
    console.log(seedx);
    console.log(seedy);
}

function shiftSeed(seed) {
    //if (seed[0] == seed[1]) {
    //    fill1 = !fill1;
    //}
    seed.shift();
    seed.push(Math.floor(Math.random() * 2));
}

function drawGrid() {

    ctx.fillStyle = "#FFFFFF90";
    ctx.fillRect(0, 0, leftBorder, canvas.height);
    ctx.fillRect(leftBorder, 0, canvas.width, topBorder);
    
    for (let i=0; i<numCols; i++) {
        for (let j=0; j<numRows; j++) {
            ctx.beginPath();
            ctx.arc(StoCx(i), StoCy(j), 1, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }
}
function drawStitches() {

    //draw the vertical stitches
    for (let i=0; i<(numCols); i++) {
        key = seedx[i];
        for (let j=0; j<(numRows - 1); j++) {
            if ((j + key)%2 == 1) {
                ctx.moveTo(StoCx(i), StoCy(j));
                ctx.lineTo(StoCx(i), StoCy(j + 1));
                ctx.stroke();
            }
        }
    }

    //draw the horizontal stitches
    for (let i=0; i<(numRows); i++) {
        key = seedy[i];
        for (let j=0; j<(numCols - 1); j++) {
            if ((j + key)%2 == 1) {
                ctx.moveTo(StoCx(j), StoCy(i));
                ctx.lineTo(StoCx(j + 1), StoCy(i));
                ctx.stroke();
            }
        }
    }
}

function drawFills() {
    fill1 = !fill1;
    ctx.fillStyle = "#7F9BAF";
    for (let i=0; i<(numCols - 1); i++) {
        if ((seedx[i])%2 == 1) {
            fill1 = !fill1;
        }
        if (fill1) {
            ctx.fillRect(StoCx(i), StoCy(0), StoCx(i+1) - StoCx(i) + 1, StoCy(1) - StoCy(0) + 1); 
        }
        fill2 = fill1;
        for (let j=1; j<(numRows - 1); j++) {
            if ((i + seedy[j])%2 == 1) {
                fill2 = !fill2;
            }
            if (fill2 == true) {
                ctx.fillRect(StoCx(i), StoCy(j), StoCx(i+1) - StoCx(i) + 1, StoCy(j+1) - StoCy(j) + 1);
            }
        }
    }
}

function StoCx(sx) {
    cx = leftBorder;
    cx = cx + ((sx + 0.5) / numCols * (canvas.width - leftBorder));
    return cx;
}

function StoCy(sy) {
    cy = topBorder;
    cy = cy + ((sy + 0.5) / numRows * (canvas.height - topBorder));
    return cy;
}
assignSeeds();
//drawGrid();
//drawFills();
//drawStitches();

function update(timestamp) {
    if (timestamp - timeOfLastFrame > frametime) {
        draw();
        timeOfLastFrame = timestamp;
    }
    window.requestAnimationFrame(update);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFills();
    shiftSeed(seedx);
    shiftSeed(seedy);
}

window.requestAnimationFrame(update);