let canvas;
let engine;
let scene;
let camera;

window.onload = startGame;

function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);

    scene = createScene();

    // main animation loop 60 times/s
    engine.runRenderLoop(() => {
        scene.render();
    });
}

function createScene() {
    let scene = new BABYLON.Scene(engine);
    
    // background
    scene.clearColor = new BABYLON.Color3(1, 0, 1);

    // Create some objects 
    //var boat = BABYLON.MeshBuilder.CreateBox("Boat", {height:2, depth:6, width:6}, scene);
    
    //A Snowmen
    /*var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
    var sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere2", {diameter: 1.5, segments: 32}, scene);
    var sphere3 = BABYLON.MeshBuilder.CreateSphere("sphere3", {diameter: 1, segments: 32}, scene);
    var eye1 = BABYLON.MeshBuilder.CreateSphere("eye1", {diameter: 0.2, segments: 32}, scene);
    var eye2 = BABYLON.MeshBuilder.CreateSphere("eye2", {diameter: 0.2, segments: 32}, scene);
    var pupil = BABYLON.MeshBuilder.CreateCylinder("pupil", {height: 0.5, diameterTop: 0.01, diameterBottom: 0.2});

    //Set the position of the different parts
    sphere.position.y = 1;
    sphere2.position.y = 2;
    sphere3.position.y = 3;
    eye1.position.y = 3.3;
    eye1.position.x = 0.2;
    eye1.position.z = -0.3;
    eye2.position.y = 3.3;
    eye2.position.x = -0.2;
    eye2.position.z = -0.3;
    pupil.rotation.x = 4.8;
    pupil.position.y = 3.2;
    pupil.position.z = -0.6;

    //Add Color for the part
    // mettre eye1 en noir
    eye1.material = new BABYLON.StandardMaterial("black", scene);
    eye1.material.diffuseColor = BABYLON.Color3.Black();

    eye2.material = new BABYLON.StandardMaterial("black", scene);
    eye2.material.diffuseColor = BABYLON.Color3.Black();

    sphere.material = new BABYLON.StandardMaterial("white",scene);
    sphere.material.diffuseColor = BABYLON.Color3.White();

    sphere2.material = sphere.material;
    sphere2.material.diffuseColor = sphere.material.diffuseColor;

    sphere3.material = sphere.material;
    sphere3.material.diffuseColor = sphere.material.diffuseColor;

    pupil.material  = new BABYLON.StandardMaterial("orange", scene);
    pupil.material.diffuseColor =  BABYLON.Color3.Red();*/

    //import of the model of boat
    let boat = BABYLONE.MeshBuilder.ImportMeshAsync("boat", "./model/", "boat.obj", scene);

    let ground = BABYLON.MeshBuilder.CreateGround("myGround", {width: 60, height: 60}, scene);
    //console.log(ground.name);

     camera = new BABYLON.FreeCamera("myCamera", new BABYLON.Vector3(0, 5, -8), scene);
    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.rotation.x = 0.4;
    camera.attachControl(canvas);
   
    let light = new BABYLON.HemisphericLight("myLight", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 1;
    // color of the light
    light.diffuse = new BABYLON.Color3(1, 1, 1);
    return scene;
}

window.addEventListener("resize", () => {
    engine.resize()
})