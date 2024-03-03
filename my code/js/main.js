let canvas;
let engine;
let scene;
// vars for handling inputs
let inputStates = {};

window.onload = startGame;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene();
    // modify some default settings (i.e pointer events to prevent cursor to go 
    // out of the game window)
    modifySettings();

    let boat = scene.getMeshByName("myboat");

    engine.runRenderLoop(() => {
        let deltaTime = engine.getDeltaTime(); // remind you something ?

        boat.move();
        scene.render();
    });
}

function createScene() {
    let scene = new BABYLON.Scene(engine);
    let ground = createGround(scene);
    let freeCamera = createFreeCamera(scene);

    createobstacle ();
    let boat = createboat(scene);

    // second parameter is the target to follow
    let followCamera = createFollowCamera(scene, boat);
    scene.activeCamera = followCamera;

    createLights(scene);
 
   return scene;
}

function createGround(scene) {
    const groundOptions = { width:2000, height:2000, subdivisions:20, minHeight:0, maxHeight:1000, onReady: onGroundCreated};
    //scene is optional and defaults to the current scene
    const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm", 'images/hmap4.png', groundOptions, scene); 

    function onGroundCreated() {
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("images/water.jpg");
        ground.material = groundMaterial;
        // to be taken into account by collision detection
        ground.checkCollisions = true;
        //groundMaterial.wireframe=true;
    }
    return ground;
}

function createLights(scene) {
    // i.e sun light with all light rays parallels, the vector is the direction.
    let light0 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(-1, -1, 0), scene);

}

function createFreeCamera(scene) {
    let camera = new BABYLON.FreeCamera("freeCamera", new BABYLON.Vector3(0, 50, 0), scene);
    camera.attachControl(canvas);
    // prevent camera to cross ground
    camera.checkCollisions = true; 
    // avoid flying with the camera
    camera.applyGravity = true;

    // Add extra keys for camera movements
    // Need the ascii code of the extra key(s). We use a string method here to get the ascii code
    camera.keysUp.push('z'.charCodeAt(0));
    camera.keysDown.push('s'.charCodeAt(0));
    camera.keysLeft.push('q'.charCodeAt(0));
    camera.keysRight.push('d'.charCodeAt(0));
    camera.keysUp.push('Z'.charCodeAt(0));
    camera.keysDown.push('S'.charCodeAt(0));
    camera.keysLeft.push('Q'.charCodeAt(0));
    camera.keysRight.push('D'.charCodeAt(0));

    return camera;
}

function createFollowCamera(scene, target) {
    let camera = new BABYLON.FollowCamera("boatFollowCamera", target.position, scene, target);

    camera.radius = 50; // how far from the object to follow
	camera.heightOffset = 14; // how high above the object to place the camera
	camera.rotationOffset = 180; // the viewing angle
	camera.cameraAcceleration = .1; // how fast to move
	camera.maxCameraSpeed = 5; // speed limit

    return camera;
}

let zMovement = 5;
function createboat(scene) {
    let boat = new BABYLON.MeshBuilder.CreateBox("myboat", {height:2, depth:8, width:6}, scene);
    let boatMaterial = new BABYLON.StandardMaterial("boatMaterial", scene);
    boatMaterial.diffuseColor = new BABYLON.Color3.White;
    boatMaterial.emissiveColor = new BABYLON.Color3.Blue;
    boat.material = boatMaterial;

    // By default the box/boat is in 0, 0, 0, let's change that...
    boat.position.y = 0.6;
    boat.position.x = -7;
    boat.position.z = 7;
    boat.speed = 1;
    boat.frontVector = new BABYLON.Vector3(0, 0, 1);

    boat.move = () => {
                //boat.position.z += -1; // speed should be in unit/s, and depends on
                                 // deltaTime !

        // if we want to move while taking into account collision detections
        // collision uses by default "ellipsoids"

        let yMovement = 0;
       
        if (inputStates.haut) {
            boat.position.y = 200;
        } else if (boat.position.y > 2.2) {
            zMovement = 0;
            yMovement = -2;
            boat.position.y = 0.6;
        } 
        //boat.moveWithCollisions(new BABYLON.Vector3(0, yMovement, zMovement));

        
        if(inputStates.up) {
            if(boat.rotation.x != -0.1) {
                boat.rotation.x -= 0.02;
            }
            boat.moveWithCollisions(boat.frontVector.multiplyByFloats(boat.speed, boat.speed, boat.speed));
        } else {
            boat.rotation.x = 0;
        }
        if(inputStates.down) {
            boat.speed = 1;
            boat.moveWithCollisions(boat.frontVector.multiplyByFloats(-boat.speed, -boat.speed, -boat.speed));
        } else {
            boat.speed = 2;
        }
        if(inputStates.left) {
            if(boat.rotation.z <= 0.1) {
                boat.rotation.z -= -0.02;
            }
            boat.rotation.y -= 0.02;
            boat.frontVector = new BABYLON.Vector3(Math.sin(boat.rotation.y), 0, Math.cos(boat.rotation.y));
        }
        if(inputStates.right) {
            if(boat.rotation.z >= -0.1) {
                boat.rotation.z -= 0.02;
            }
            boat.rotation.y -= -0.02;
            boat.frontVector = new BABYLON.Vector3(Math.sin(boat.rotation.y), 0, Math.cos(boat.rotation.y));
        }
        if(!inputStates.right && !inputStates.left){
            boat.rotation.z = 0;
        }
        if(inputStates.space) {
            boat.speed *= 2;
        }
    }

    return boat;
}

var createobstacle = function (scene) {
    let numObstacles = Math.floor(Math.random() * 1000) + 1

    for (let i = 0; i < numObstacles; i++) {
        let obstacle = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: 5, diameter:3},scene)
        obstacle.position.x = getRandomInt(-900, 0);
        obstacle.position.z = getRandomInt(-900, 0);
    }
}

window.addEventListener("resize", () => {
    engine.resize()
});

function modifySettings() {
    // as soon as we click on the game window, the mouse pointer is "locked"
    // you will have to press ESC to unlock it
    scene.onPointerDown = () => {
        if(!scene.alreadyLocked) {
            console.log("requesting pointer lock");
            canvas.requestPointerLock();
        } else {
            console.log("Pointer already locked");
        }
    }

    document.addEventListener("pointerlockchange", () => {
        let element = document.pointerLockElement || null;
        if(element) {
            // lets create a custom attribute
            scene.alreadyLocked = true;
        } else {
            scene.alreadyLocked = false;
        }
    })

    // key listeners for the boat
    inputStates.left = false;
    inputStates.right = false;
    inputStates.up = false;
    inputStates.down = false;
    inputStates.space = false;
    inputStates.haut = false;;
    
    //add the listener to the main, window object, and update the states
    window.addEventListener('keydown', (event) => {
        if ((event.key === "ArrowLeft") || (event.key === "q")|| (event.key === "Q")) {
           inputStates.left = true;
        } else if ((event.key === "ArrowUp") || (event.key === "z")|| (event.key === "Z")){
           inputStates.up = true;
        } else if ((event.key === "ArrowRight") || (event.key === "d")|| (event.key === "D")){
           inputStates.right = true;
        } else if ((event.key === "ArrowDown")|| (event.key === "s")|| (event.key === "S")) {
           inputStates.down = true;
        }  else if (event.key === " ") {
           inputStates.space = true;
        } else if (event.key === "r" || event.key === "R") {
           inputStates.haut = true;
        }
    }, false);

    //if the key will be released, change the states object 
    window.addEventListener('keyup', (event) => {
        if ((event.key === "ArrowLeft") || (event.key === "q")|| (event.key === "Q")) {
           inputStates.left = false;
        } else if ((event.key === "ArrowUp") || (event.key === "z")|| (event.key === "Z")){
           inputStates.up = false;
        } else if ((event.key === "ArrowRight") || (event.key === "d")|| (event.key === "D")){
           inputStates.right = false;
        } else if ((event.key === "ArrowDown")|| (event.key === "s")|| (event.key === "S")) {
           inputStates.down = false;
        }  else if (event.key === " ") {
           inputStates.space = false;
        } else if (event.key === "r" || event.key === "R") {
           inputStates.up = false;
        }
    }, false);
}

