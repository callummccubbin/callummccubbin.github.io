function xhat() {
    vec = new THREE.Vector3(1, 0, 0);
    return vec;
}
function yhat() {
    vec = new THREE.Vector3(0, 1, 0);
    return vec;
}
function zhat() {
    vec = new THREE.Vector3(0, 0, 1);
    return vec;
}
function zero() {
    vec = new THREE.Vector3(0, 0, 0);
    return vec;
}

function lerp(x, y, t) {
    return x + t * (y - x);
}

function rnd(x) {
    return Math.floor(Math.random() * x);
}

function positionRelativeToGridCenter(pos) {
    let pos2 = new THREE.Vector3(0, 0, 0);
    pos2.copy(pos);
    let gridCenter = new THREE.Vector3(maxGridCoordinate + 1, 0, maxGridCoordinate + 1);
    return pos2.add(gridCenter.negate());
}

function encodePos(pos) {
    if (pos.x >= 0 &&
        pos.y >= 0 &&
        pos.z >= 0 &&
        pos.x < gridSize &&
        pos.y < gridHeight &&
        pos.z < gridSize) {

        let gridKey = pos.x + (pos.y * gridSize) + (pos.z * (gridSize * gridHeight));
        return gridKey;
    } else {
        return -1;
    }
    
}

function decodeGridKey(gridKey) {
    let x = gridKey % gridSize;
    //let y = ((gridKey - x) % (gridSize ** 2)) / gridSize;
    let y = ((gridKey - x) / gridSize) % gridHeight;
    //let z = (gridKey - x - (y * gridSize)) / (gridSize ** 2);
    let z = (((gridKey - x) / gridSize) - y) / gridHeight;
    return new THREE.Vector3(x, y, z);
}