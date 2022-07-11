class cube {
    constructor(id, gridPosition, mesh) {
        this.id = id;
        this.gridPosition = new THREE.Vector3(0, 0, 0);
        this.gridPosition.copy(gridPosition);
        this.mesh = mesh;
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = true;
        this.mesh.position.copy(this.gridPosition);
        this.alive = true;
        this.player = false;
        this.active = 0;
        grid.set(encodePos(this.gridPosition), this.id);
        //console.log(grid.get(encodePos(this.gridPosition)), "is at", encodePos(this.gridPosition));
    }

    checkDeath() {

        let danger = this.check(xhat()) >= 0 &&
                    this.check(zhat()) >= 0 &&
                    this.check(xhat().negate()) >= 0 &&
                    this.check(zhat().negate()) >= 0 &&
                    this.check(yhat()) >= 0;


        //console.log("above me is", this.check(yhat()));
        
        if (danger) {
            this.die();
            return true;
        }
    }

    die() {
        //console.log("I am die.");
        //console.log(this.mesh.material.color);
        this.alive = false;
        this.mesh.material = deadCubeMaterial;
        this.active = false;
        deadCubes++;
        console.log(deadCubes, "dead cubes");
        console.log(highestCubeHeight, "highest cube");
            spawnCube(1);
    }

    canClimb() {
        if(this.check(xhat()) >= 0 ||
        this.check(xhat().negate()) >= 0 ||
        this.check(zhat()) >= 0 ||
        this.check(zhat().negate()) >= 0) {
            //console.log("above me is", this.check(yhat()));
            if (this.check(yhat()) == -1) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    // attemptClimb() {
    //     //if (this.canClimb()) {
    //         this.move(yhat());
    //         console.log("Hhhhhhhhhhhh");
    //         if (this.gridPosition.y >= 3) {
    //                 highestCubeHeight = this.gridPosition.y;
    //                 console.log("hhhhhhhhhhhhhhhh");
    //                 nlf.play();
    //                 //spawnCube(highestCubeHeight);
    //         }
    //     //}
    // }

    checkFall() {

        let safe = this.check(new THREE.Vector3(0,-1,-1)) > -1 ||
                    this.check(new THREE.Vector3(0,-1,0)) > -1 ||
                    this.check(new THREE.Vector3(0,-1,1)) > -1 ||
                    this.check(new THREE.Vector3(1,-1,0)) > -1 ||
                    this.check(new THREE.Vector3(-1,-1,0)) > -1;

        if (this.gridPosition.y == 0) {
            safe = true;
        }   
        if (!safe) {
            // descend unto the earth
            this.fall();
        }
    }

    fallReaction(n) {
        //console.log("fallreact for cube", this.id);

        let p = new THREE.Vector3(0, 0, 0);
        
        p.copy(this.gridPosition);
        p.add(n.negate());
        
        let p2 = new THREE.Vector3(0, 0, 0);
        p2.copy(p);

        p2.add(yhat());
        if (grid.has(encodePos(p2))) {
            cubes[grid.get(encodePos(p2))].checkFall();
        }

        p2.x += 1;
        if (grid.has(encodePos(p2))) {
            cubes[grid.get(encodePos(p2))].checkFall();
        }

        p2.x -= 2;

        if (grid.has(encodePos(p2))) {
            cubes[grid.get(encodePos(p2))].checkFall();
        }

        p2.x += 1;
        p2.z += 1;

        if (grid.has(encodePos(p2))) {
            cubes[grid.get(encodePos(p2))].checkFall();
        }
        
        p2.z -= 2;

        if (grid.has(encodePos(p2))) {
            cubes[grid.get(encodePos(p2))].checkFall();
        }

        //let f = 0;
        // for (let i=-1;i<2;i++) {
        //     for (let j=-1;j<2;j++) {
        //         f = this.check(new THREE.Vector3(i - n.x,1 - n.y,j - n.z));
        //         //console.log(i, j);
        //         if (f > -1) {
        //         //console.log(f, "is above them");
        //         cubes[f].checkFall();
        //         }
        //     }
        // }
    }

    fall() {
        //console.log(this.id, "is falling");
        this.move(yhat().negate());                    
    }

    check(direction) {
        let newPos = new THREE.Vector3(0, 0, 0);
        newPos.copy(this.gridPosition);
        newPos.x += direction.x;
        newPos.y += direction.y;
        newPos.z += direction.z;

        if (newPos.x < gridSize &&
            newPos.y < gridHeight &&
            newPos.z < gridSize &&
        newPos.x >= 0 &&
        newPos.y >= 0 &&
        newPos.z >= 0) {  

            if (!grid.has(encodePos(newPos))) {
                return -1;
            } else {
                return grid.get(encodePos(newPos));
            }
        } else {
            return -2;
        }
    }

    move(direction) {
        if (zero().equals(direction)) {
            return 0;
        }
        let newPos = new THREE.Vector3(0, 0, 0);
    
        newPos.copy(this.gridPosition);

        newPos.x += direction.x;
        newPos.y += direction.y;
        newPos.z += direction.z;
        
        //console.log(newPos.x + " newPos.x");
        //console.log(this.gridPosition.x + " gridPosition.x");

        grid.delete(encodePos(this.gridPosition));
        grid.set(encodePos(newPos), this.id);
        this.gridPosition = newPos;
        //console.log("moving in ", direction);
        this.fallReaction(direction);   
        this.checkFall();
        movingCubes.push(this.id);
    }

    attemptMove(direction) {
        if (this.check(direction) == -1) {
            this.move(direction);
        }
    }

    aiHelper(direction, options) {
        if(this.check(direction.add(yhat().negate())) > -1 || this.gridPosition.y == 0) {
            this.aiAddOption(direction, options);
        }
        if (this.check(direction.multiplyScalar(2)) >= 0) {
            this.aiAddOption(direction, options);
            this.aiAddOption(direction, options);
        }
        let b = yhat();
        b.cross(direction);
        let c = zero();
        if (this.check(c.addVectors(direction, b)) >= 0) {
            this.aiAddOption(direction, options);
            this.aiAddOption(b, options);
        }
    }

    aiAddOption(direction, options) {
        if (this.check(direction) == -1) {
            options.push(direction);
        }
    }

    aiMove() {
        //console.log("aiMove");
        let d = this.checkDeath();

        if(!d) {
            if(this.canClimb()) {
                //console.log("canClimb");
                this.move(yhat());
                if (this.gridPosition.y > highestCubeHeight) {
                    highestCubeHeight = this.gridPosition.y;
                    //console.log("hell yes", highestCubeHeight);
                    //spawnCube(highestCubeHeight);
                }
                //console.log(highestCubeHeight, "highest cube height");
            } else {
                let options = [];
                options.push(zero());

                let v = positionRelativeToGridCenter(this.gridPosition).negate();

                if (Math.abs(v.x) >= 1) {
                    this.aiAddOption(xhat().multiplyScalar(Math.sign(v.x)), options);
                }

                if (Math.abs(v.z) >= 1) {
                    this.aiAddOption(zhat().multiplyScalar(Math.sign(v.z)), options);
                }

                if (Math.abs(v.x) > Math.abs(v.z)) {
                    this.aiAddOption(xhat().multiplyScalar(Math.sign(v.x)), options);
                } else if (Math.abs(v.x) < Math.abs(v.z)) {
                    this.aiAddOption(zhat().multiplyScalar(Math.sign(v.z)), options);
                }

                this.aiHelper(xhat(), options);
                this.aiHelper(xhat().negate(), options);
                this.aiHelper(zhat(), options);
                this.aiHelper(zhat().negate(), options);


                //If you don't move, you're itchy. You need to move.
                if(options.length < 2 && this.gridPosition.y < rnd(highestCubeHeight)) {
                    this.aiAddOption(xhat(), options);
                    this.aiAddOption(xhat().negate(), options);
                    this.aiAddOption(zhat(), options);
                    this.aiAddOption(zhat().negate(), options);
                }


                //let c = options[rnd(options.length)]
                //console.log(options, "options");
                if (options.length > 0) {
                    this.move(options[rnd(options.length)]);
                }
            }
            this.active = 0;
            this.mesh.material = livingCubeMaterial;
        }

    }

}