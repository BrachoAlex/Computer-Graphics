"use strict";

import * as THREE from './libs/three.module.js'
import { OrbitControls } from './libs/controls/OrbitControls.js';
import { OBJLoader } from "./libs/loaders/OBJLoader.js";
import { GUI } from "./libs/dat.gui.module.js";

let renderer = null, scene = null, camera = null, orbitControls = null, objectList = [], tank = null, turret = null, tankgroup = null, turretgroup = null;

let ambientLight = null;


//TEXTURES

let mapUrl = "./checker_large.gif";

const textureTankFile = "./Tank/Tank_texture.jpg";

const textureTank = new THREE.TextureLoader().load(textureTankFile);

//OBJ
let tankObj = { obj: "./Tank/Tank.obj", texture: textureTank };

let turretObj = { obj: "./Tank/Turret.obj", texture: textureTank };



function main() {
    const canvas = document.getElementById("webglcanvas");

    createScene(canvas);

    createGUI();

    update();
}


//GUI
function createGUI() {
    const tankGUI = new GUI({ width: 350 });
    let settings = {
        'Tank Y': 0,
        'Turret Y': 0
    }

    tankGUI.add(settings, 'Tank Y', 0, 20, 1).onChange((delta) => {
        objectList[0].rotation.y = delta;
    })

    tankGUI.add(settings, 'Turret Y', 0, 20, 1).onChange((delta) => {
        objectList[1].rotation.y = delta;
    })
}

async function loadObj(objModelUrl, objectList, x, y, z) {
    try {
        const object = await new OBJLoader().loadAsync(objModelUrl.obj, onProgress, onError);
        let texture = objModelUrl.texture;

        for (const child of object.children) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.map = texture;
            child.material.color.set('rgb(0, 255, 0)')
        }

        object.scale.set(5, 5, 5);
        object.position.z = z;
        object.position.x = x;
        object.position.y = y;

        object.name = "3d Obj";

        objectList.push(object);
        scene.add(object);
    } catch (err) { onError(err); }
}

function update() {
    requestAnimationFrame(function () { update(); });

    renderer.render(scene, camera);

    orbitControls.update();
}

function onError(err) { console.error(err); }

function onProgress(xhr) {
    if (xhr.lengthComputable) {
        const percentComplete = (xhr.loaded / xhr.total) * 100;
        console.log(xhr.target.responseURL, Math.round(percentComplete, 2) + "% downloaded");
    }
}



async function createScene(canvas) {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

    renderer.setSize(canvas.width, canvas.height);

    //SHADOWS
    renderer.shadowMap.enabled = false;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 4000);
    camera.position.set(0, 3, 10);

    orbitControls = new OrbitControls(camera, renderer.domElement);

    ambientLight = new THREE.AmbientLight(0x444444, 0.8);
    scene.add(ambientLight);

    //OBJ
    //GROUPS
    tankgroup = new THREE.Object3D;
    turretgroup = new THREE.Object3D;

    tankgroup.add(turretgroup);
    tank = await loadObj(tankObj, objectList, 0, -2, .5);
    tankgroup.add(tank);
    turret = await loadObj(turretObj, objectList, 0, 0, .5);
    turretgroup.add(turret);
    scene.add(tankgroup)
    const map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    let geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ map: map, side: THREE.DoubleSide }));

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4.02;
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    scene.add(mesh);

    // POINT LIGHT
    const pointLight = new THREE.PointLight(0xffffff, 1, 0);
    pointLight.position.set(-1, 5, 3);
    pointLight.castShadow = true;
    scene.add(pointLight);
}

main();