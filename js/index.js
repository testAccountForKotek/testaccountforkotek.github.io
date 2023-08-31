import * as THREE from "../three/three.module.js";
import {GLTFLoader} from "../three/GLTFLoader.js";

document.addEventListener('DOMContentLoaded', () => {





    // Three.js starts here

    const scene = new THREE.Scene();
    const loader = new GLTFLoader();
    const renderer = new THREE.WebGLRenderer({alpha: true});

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 300);
    const rightLight = new THREE.DirectionalLight(0xffffff, 7);

    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setPixelRatio(window.devicePixelRatio / 4);

    renderer.setClearColor(0x353531, 0);

    document.body.appendChild(renderer.domElement);
    camera.position.set(0, 10, 10);
    camera.lookAt(0, -5, 0);

    rightLight.position.set(20, 20, 0);
    scene.add(rightLight);

    let rose;

    loader.load('../assets/roseRedSimple.glb', gltfRose => {
        rose = gltfRose.scene;
        scene.add(rose);
        rose.position.set(0, -15, -1.5);
    }, undefined, error => {
        console.error(error);
    });

    window.addEventListener('resize', () => {
        const canvasWidth = window.innerWidth;
        const canvasHeight = window.innerHeight;

        camera.aspect = canvasWidth / canvasHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(canvasWidth, canvasHeight);
    });

    const clock = new THREE.Clock();
    let delta = 0;
    const interval = 1 / 7;

    function animate() {
        delta += clock.getDelta();

        if (delta > interval) {
            if (rose) {
                rose.rotation.y += 0.005;
            }

            delta = delta % interval;
            renderer.render(scene, camera);
        }
        requestAnimationFrame(animate);
    }

    animate();

});