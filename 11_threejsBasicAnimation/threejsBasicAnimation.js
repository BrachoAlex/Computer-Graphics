import * as THREE from '../libs/three.js/r131/three.module.js'

let renderer = null, scene = null, camera = null, directionalLight = null, group = null, cube = null;

let animator = null, duration = 10000, loopAnimation = false;

function update() 
{
    requestAnimationFrame(function() { update(); });

    // Render the scene
    renderer.render( scene, camera );

    // Update the animations
    KF.update();
}

function createScene(canvas) 
{
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Create a new Three.js scene
    scene = new THREE.Scene();

    scene.background = new THREE.Color( 0x222222 );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(0, 0, 8);

    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0xffffff, 1);

    // Create and add all the lights
    directionalLight.position.set(0, 1, 2);
    scene.add(directionalLight);

    group = new THREE.Object3D();
    
    // And put some geometry and material together into a mesh
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    cube = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:'white'}));
    cube.rotation.x = Math.PI / 4;

    group.add(cube);
    scene.add( group );
}

function initAnimations() 
{
    animator = new KF.KeyFrameAnimator;
    animator.init({ 
        interps:
            [
                { 
                    keys:[0, .5, 1], 
                    values:[
                            { y : 1 },
                            { y : 0.5 },
                            { y : 1 },
                            ],
                    target:group.scale
                },
                { 
                    keys:[0, .5, 1], 
                    values:[
                            { y : 0 },
                            { y : Math.PI * 2  },
                            { y : 0 },
                            ],
                    target:group.rotation
                },
            ],
        loop: loopAnimation,
        duration: duration,
    });
}

function playAnimations()
{
    animator.start();
}

window.onload=()=>
{
    const canvas = document.getElementById("webglcanvas");

    document.getElementById('playButton').addEventListener('click', ()=>playAnimations());
    // create the scene
    createScene(canvas);

    // set up the animations
    initAnimations();

    // create the animations
    playAnimations();
    
    // update the update loop
    update();
}