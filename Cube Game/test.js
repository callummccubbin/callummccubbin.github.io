function $(x) {
    return document.getElementById(x);
}

let screenResolution = new THREE.Vector2( window.innerWidth, window.innerHeight );

let inputs = [];
let outputs = [];

for (let k = 0; k < 7; k++) {
    inputs[k] = $("a" + String(k + 1));
    outputs[k] = $("b" + String(k + 1));
}
//console.log($("a1"));

for (let k = 0; k < 7; k++) {
    outputs[k].innerHTML = inputs[k].value;
}

for (let k = 0; k < 7; k++) {
    inputs[k].oninput = function() {
        outputs[k].innerHTML = this.value;
    }
}

let maxCubes = inputs[0].value * 1;
let maxGridCoordinate = inputs[1].value * 1;
let updateTimeMs = inputs[2].value * 1;
let cubesToMovePerTurn = inputs[3].value * 1;
let cubeLerp = inputs[4].value / 100;
let gridHeight = inputs[5].value * 1;
let thetaCameraDot = inputs[6].value / 1000;

let chord = $("chord");
let bass = $("bass");
let pad = $("pad");
let hat1 = $("hat1");
let hat2 = $("hat2");
let kick = $("kick");

let muted = true;

let cameraMode = 0;
// cameraMode 0 is player-centered
// cameraMode 1 is the zoomed out version

window.addEventListener("keypress", function (event) {
if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
}
switch (event.key) {
    case "w":
        rotateControls(zhat().negate());
    break;
    case "s":
        rotateControls(zhat());
    break;
    case "a":
        rotateControls(xhat().negate());
    break;
    case "d":
        rotateControls(xhat());
    break;
    case "e":
        muted = false;
        chord.muted = false;
        bass.muted = false;
        kick.muted = false;
        hat1.muted = false;
        hat2.muted = false;
        pad.muted = false;
    break;
    case "r":
        muted = true;
    break;
    case "q":
        fastForward(50);
    break;
    case "z":
        cameraMode = 0;
    break;
    case "x":
        cameraMode = 1;
    break;
    case "t":
        fastForward(500);
    break;
    default:
    return; // Quit when this doesn't handle the key event.
}
event.preventDefault();
}, true);

window.addEventListener("keydown", function (event) {
if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
}
switch (event.key) {
    case "ArrowDown":
        rotateControls(zhat());
    break;
    case "ArrowUp":
        rotateControls(zhat().negate());
    break;
    case "ArrowLeft":
        rotateControls(xhat().negate());
    break;
    case "ArrowRight":
        rotateControls(xhat());
    break;
    case " ":
        cubes[0].attemptMove(yhat());
    break;
    default:
    return; // Quit when this doesn't handle the key event.
}
event.preventDefault();
}, true);

function rotateControls(direction) {
    //console.log(positionRelativeToGridCenter(cubes[0].gridPosition));
    let s = Math.round((thetaPlayer * 2 / Math.PI + 4)) % 4;
    //console.log(s, "=s");
    let dir = new THREE.Vector3(0, 0, 0);

    if (s == 0) {
        dir.copy(direction);
    } else if (s == 1) {
        dir.x = direction.z;
        dir.z = -direction.x;
    } else if (s == 2) {
        dir.copy(direction.negate());
    } else if (s == 3) {
        dir.z = direction.x;
        dir.x = -direction.z;
    }
    //console.log("s = ", s);
    cubes[0].attemptMove(dir);
}

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 5000 );

scene.background = new THREE.Color().setHSL( 0.6, 0, 1 );
scene.fog = new THREE.Fog( scene.background, 1, 5000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
document.body.appendChild( renderer.domElement );

//LIGHTS

const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
hemiLight.color.setHSL( 0.6, 1, 0.6 );
hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
hemiLight.position.set( 0, 10, 0 );
scene.add( hemiLight );

//const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
//scene.add( hemiLightHelper );

const dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
dirLight.color.setHSL( 0.1, 1, 0.95 );
dirLight.position.set( - 1, 1.75, 1 );
dirLight.position.multiplyScalar( 90 );
scene.add(dirLight.target);
dirLight.target.position.copy(new THREE.Vector3(maxGridCoordinate, 0, maxGridCoordinate));

scene.add( dirLight );

//const cameraHelper = new THREE.CameraHelper(dirLight.shadow.camera);
//scene.add(cameraHelper);

dirLight.castShadow = true;

dirLight.shadow.mapSize.width = 4096;
dirLight.shadow.mapSize.height = 4096;

const d = 40;

dirLight.shadow.camera.left = - d;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = - d;
//dirLight.shadow.camera.position.set(new THREE.Vector3(10, 0, 10));

dirLight.shadow.camera.far = 3500;
dirLight.shadow.bias = - 0.000001;

//const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 10 );
//scene.add( dirLightHelper );

// // GROUND

//const groundGeo = new THREE.PlaneGeometry( 10000, 10000 );
const groundGeo = new THREE.SphereGeometry(500, 128, 32, 0, 2 * Math.PI, 0, 1);
const groundMat = new THREE.MeshLambertMaterial( { color: 0xffffff } );
groundMat.color.setHSL( 0.095, 1, 0.75 );

const ground = new THREE.Mesh( groundGeo, groundMat );
ground.position.y = -500.4  ;
ground.position.x = (maxGridCoordinate * 1) + 1;
ground.position.z = (maxGridCoordinate * 1) + 1;
//ground.position.y = -0.5;
//ground.rotation.x = - Math.PI / 2;
ground.receiveShadow = true;
scene.add( ground );

// // SKYDOME

const vertexShader = document.getElementById( 'vertexShader' ).textContent;
const fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
const uniforms = {
    'topColor': { value: new THREE.Color( 0x0077ff  ) },
    'bottomColor': { value: new THREE.Color( 0xffffff ) },
    'offset': { value: 800 },
    'exponent': { value: 0.65 }
};
//uniforms[ 'topColor' ].value.copy( hemiLight.color );

scene.fog.color.copy( uniforms[ 'bottomColor' ].value );

const skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
const skyMat = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.BackSide
} );

const sky = new THREE.Mesh( skyGeo, skyMat );
scene.add( sky );

// GRID

let gridSize = maxGridCoordinate * 2 + 1;

let grid = new Map();

// -1 means there's empty space
// 0 and greater is a cube of that id number

let gridHelper = new THREE.GridHelper(gridSize, gridSize);
scene.add(gridHelper);
gridHelper.position.x = int(maxGridCoordinate);
gridHelper.position.z = int(maxGridCoordinate);
gridHelper.position.y = -0.4;

// -----------------------------------------
    
//let nlf = document.getElementById("au");
//let arp = document.getElementById("arp");

const geometry = new THREE.BoxGeometry();
const livingCubeMaterial = new THREE.MeshStandardMaterial( { color: 0xa7c330 } );
// livingCubeMaterial.metalness = 0.9;
// livingCubeMaterial.roughness = 0.5;
let deadCubeMaterial = new THREE.MeshStandardMaterial( { color: 0x999980 } );
let playerCubeMaterial = new THREE.MeshStandardMaterial( { color: 0xB05C4C} );

let activeCubeMaterial = new THREE.MeshStandardMaterial( { color: 0xffffff } );
let acmr = livingCubeMaterial.color.r;
let acmg = livingCubeMaterial.color.g;
let acmb = livingCubeMaterial.color.b;

let cubes = [];
let movingCubes = [];

spawnCube(maxCubes);

function spawnCube(n) {
    let i = 0;
    let j = 0;
    while (i < n) {
        let place = new THREE.Vector3(rnd(gridSize), 0, rnd(gridSize));
        if (!grid.has(encodePos(place))) {
            cubes.push(new cube(cubes.length, place, new THREE.Mesh(geometry, livingCubeMaterial)));
            scene.add(cubes[cubes.length - 1].mesh);
            i++;
        }
        // if it tries too many times, break the loop
        j++;
        if (j > (2 * (gridSize ** 2))) {
            break;
        }
    }
}
        
cubes[0].player = true;
cubes[0].mesh.material = playerCubeMaterial;

let highestCubeHeight = 0;
let deadCubes = 0;

// can't move more cubes than there exist in a turn
if (cubesToMovePerTurn > cubes.length) {
    cubesToMovePerTurn = cubes.length - 1;
}

function refresh() {

    maxCubes = inputs[0].value * 1;
    maxGridCoordinate = inputs[1].value * 1;
    updateTimeMs = inputs[2].value * 1;
    cubesToMovePerTurn = inputs[3].value * 1;
    cubeLerp = inputs[4].value / 100;
    gridHeight = inputs[5].value * 1;
    thetaCameraDot = inputs[6].value / 1000;

    for (let i=0;i<cubes.length;i++) {
        cubes[i].expunge();
    }
    gridSize = maxGridCoordinate * 2 + 1;
    scene.remove(gridHelper);

    grid = new Map();

    cubes = [];
    movingCubes = [];

    spawnCube(maxCubes);

    highestCubeHeight = 0;
    deadCubes = 0;

    ground.position.x = (maxGridCoordinate * 1) + 1;
    ground.position.z = (maxGridCoordinate * 1) + 1;

    cubes[0].player = true;
    cubes[0].mesh.material = playerCubeMaterial;

    if (cubesToMovePerTurn > cubes.length) {
        cubesToMovePerTurn = cubes.length - 1;
    }

    gridHelper = new THREE.GridHelper(gridSize, gridSize);
    scene.add(gridHelper);
    gridHelper.position.x = int(maxGridCoordinate);
    gridHelper.position.z = int(maxGridCoordinate);
    gridHelper.position.y = -0.4;
}

function handleMusic() {
    // player's height x2
    // total max height
    // number of dead cubes
    // whether or not you are a murderer? Requires writing a new function

    if (muted == false) {
        if (cubes[0].gridPosition.y > highestCubeHeight / 2) {
            pad.volume = lerp(pad.volume, 1, 0.05);
        } else {
            pad.volume = lerp(pad.volume, 0, 0.05);
        }

        if (deadCubes > 1500) {
            hat1.volume = lerp(hat1.volume, 1, 0.05);
            hat2.volume = lerp(hat2.volume, 1, 0.05);
        } else {
            hat1.volume = lerp(hat1.volume, 0, 0.05);
            hat2.volume = lerp(hat2.volume, 0, 0.05);
        }

        if (highestCubeHeight > gridHeight * 0.8) {
            kick.volume = lerp(kick.volume, 1, 0.05);
        } else {
            kick.volume = lerp(kick.volume, 0, 0.05);
        }
        chord.volume = lerp(chord.volume, 1, 0.05);
        bass.volume = lerp(bass.volume, 1, 0.05);
        kick.volume = lerp(kick.volume, 1, 0.05);
    } else {
        chord.volume = lerp(chord.volume, 0, 0.05);
        bass.volume = lerp(bass.volume, 0, 0.05);
        kick.volume = lerp(kick.volume, 0, 0.05);
        hat1.volume = lerp(hat1.volume, 0, 0.05);
        hat2.volume = lerp(hat2.volume, 0, 0.05);
        pad.volume = lerp(pad.volume, 0, 0.05);
    }
    

}

function fastForward(n) {
    for (let i=0;i<n;i++)
    gameUpdate();
}

//function returns true if the cube's mesh's position is outside acceptable distance from its grid position.
// Then, it gets to stay in the movingCubes array.
mdcThreshold = 0.01;
function meshDistanceCheck(value, index, array) {
    x = zero();
    x.subVectors(cubes[value].mesh.position, cubes[value].gridPosition);
    //console.log(x.length(), Math.abs(x.length()) < mdcThreshold);
    return Math.abs(x.length()) > mdcThreshold;
}

function gameUpdate() {

    if (cubes[0].gridPosition.y > highestCubeHeight - 1 && cubes[0].gridPosition.y > 6) {
        //nlf.play();
        //arp.play();
    }
    //console.log("max height =", highestCubeHeight);

    for (let i=0;i<cubes.length;i++) {
        if (cubes[i].active == 1) {
            cubes[i].aiMove();
        }
    }
    //console.log(movingCubes);

    let i = 0;
    while (i < cubesToMovePerTurn) {
        let n = rnd(cubes.length);
        if (cubes[n].alive && !cubes[n].player && (cubes[n].active == 0)) {
            cubes[n].active = 1;
            cubes[n].mesh.material = activeCubeMaterial;
            i++;
        }
        // This is for the case that the game tries to move more cubes in an update than there living cubes.
        if (i >= cubes.length) {
            i = cubesToMovePerTurn;
        }
    }

}

let cameraBaseHeight = 15;
let rCameraBase = 30;
let rCamera = 30;
let thetaCamera = 0;
let rLight = 160;
let thetaLight = 0;
let thetaPlayer = 0;

camera.position.set( 0, cameraBaseHeight, rCamera);

let startTime = (new Date()).getTime();
//console.log(startTime);
let timeRunning = 0;
let sec = 0;
//scene.remove(cubes[1].mesh);
function animate() {


    timeRunning = (new Date()).getTime() - startTime;
    //console.log(timeRunning/1000, "timerunning/1000");
    //console.log(sec);

    if (Math.floor(timeRunning / updateTimeMs) > sec) {
        sec = Math.floor(timeRunning / updateTimeMs);
        gameUpdate();
    }
    //camera.rotateOnWorldAxis(yhat(), thetaCameraDot);

    thetaCamera += thetaCameraDot;
    thetaLight -= 0.005;


    if (positionRelativeToGridCenter(cubes[0].gridPosition).length() > 0) {
        if (positionRelativeToGridCenter(cubes[0].gridPosition).z > 0) {
            //console.log(positionRelativeToGridCenter(cubes[0].gridPosition).z, "=z");
        thetaPlayer = Math.atan(positionRelativeToGridCenter(cubes[0].gridPosition).x / positionRelativeToGridCenter(cubes[0].gridPosition).z);
        } else if  (positionRelativeToGridCenter(cubes[0].gridPosition).z < 0) {
            //console.log(positionRelativeToGridCenter(cubes[0].gridPosition).z, "=z");
        thetaPlayer = Math.atan(positionRelativeToGridCenter(cubes[0].gridPosition).x / positionRelativeToGridCenter(cubes[0].gridPosition).z) + Math.PI;
        } else if (positionRelativeToGridCenter(cubes[0].gridPosition).z == 0) {
            if (positionRelativeToGridCenter(cubes[0].gridPosition).x > 0) {
                thetaPlayer = Math.PI / 2;
            } else {
                thetaPlayer = Math.PI * 3 / 2;
            }
        }
        console.log(thetaPlayer);
    }
    
    //console.log("before check", movingCubes.length);
    movingCubes = movingCubes.filter(meshDistanceCheck);
    //console.log("after check", movingCubes.length);
    //console.log(movingCubes);
    for (i=0;i<movingCubes.length;i++) {
        cubes[movingCubes[i]].mesh.position.lerp(cubes[movingCubes[i]].gridPosition, cubeLerp);
    }

    //console.log(thetaPlayer, "= thetaPlayer");
    //console.log(positionRelativeToGridCenter(cubes[0].gridPosition).x, "x");
    //console.log(positionRelativeToGridCenter(cubes[0].gridPosition).z, "z");

    if (cameraMode == 0) {
        rCamera = rCameraBase;
        camera.position.x = lerp(camera.position.x, rCamera * Math.sin(thetaPlayer) + cubes[0].mesh.position.x, cubeLerp);
        camera.position.z = lerp(camera.position.z, rCamera * Math.cos(thetaPlayer) + cubes[0].mesh.position.z, cubeLerp);
        camera.quaternion.identity();

        camera.lookAt(cubes[0].mesh.position);

        camera.position.y = lerp(camera.position.y, cubes[0].mesh.position.y + cameraBaseHeight - Math.min(cubes[0].gridPosition.y * 0.4, 2 * cameraBaseHeight), 0.2);
    } else if (cameraMode == 1) {
        rCamera = lerp(rCamera, rCameraBase + highestCubeHeight * 1.75, 0.1);
        camera.quaternion.identity();
        camera.rotation.x = -0.3;
        camera.rotateOnWorldAxis(yhat(), thetaCamera);
        camera.position.x = rCamera * Math.sin(thetaCamera) + maxGridCoordinate;
        camera.position.z = rCamera * Math.cos(thetaCamera) + maxGridCoordinate;
        camera.position.y = lerp(camera.position.y, cameraBaseHeight + highestCubeHeight, cubeLerp);
    }

    // camera.rotation.x = -1.56;
    //camera.position.copy(cubes[0].mesh.position);
    // camera.position.add(positionRelativeToGridCenter(cubes[0].mesh.position));
    //camera.position.y += cameraBaseHeight;
    // camera.quaternion.identity();
    // camera.rotateOnWorldAxis(yhat(), Math.atan(cubes[0].mesh.position.z / cubes[0].mesh.position.x));
    //camera.rotateZ(Math.PI /2);


    //camera.position.y = lerp(camera.position.y, cameraBaseHeight + highestCubeHeight * .8, 0.1);
    //rCamera = lerp(rCamera, rCameraBase + highestCubeHeight * 1.5, 0.1);
    //console.log(camera.position.y);

    dirLight.position.x = rLight * Math.sin(thetaLight);
    dirLight.position.z = rLight * Math.cos(thetaLight);

    //console.log(cubes[0].gridPosition.x);
    
    activeCubeMaterial.color.setRGB(Math.min((1 - acmr) / updateTimeMs * (timeRunning % updateTimeMs) * 2 + acmr, 1),
                                    Math.min((1 - acmg) / updateTimeMs * (timeRunning % updateTimeMs) * 2 + acmg, 1),
                                    Math.min((1 - acmb) / updateTimeMs * (timeRunning % updateTimeMs) * 2 + acmb, 1));

    handleMusic();

    renderer.render( scene, camera );

    requestAnimationFrame( animate );
};
animate();