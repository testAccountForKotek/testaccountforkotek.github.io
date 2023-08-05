import * as THREE from '../three/three.module.js';
import {GLTFLoader} from '../three/GLTFLoader.js';
import {OrbitControls} from '../three/OrbitControls.js';

document.addEventListener('DOMContentLoaded', function () {

    let elements = {
        leftCell: document.getElementsByClassName('leftCell').item(0),
    }

    const scene = new THREE.Scene();
    const loader = new GLTFLoader();
    const renderer = new THREE.WebGLRenderer({alpha: true});

    const canvasWidth = elements.leftCell.clientWidth * 0.8;
    const canvasHeight = elements.leftCell.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 300);
    const frontLight = new THREE.DirectionalLight(0xffff8a, 5);
    const redLight = new THREE.DirectionalLight(0xff0000, 2);
    const blueLight = new THREE.DirectionalLight(0x40e0d0, 2);

    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.setClearColor(0x353531, 0.5);

    elements.leftCell.appendChild(renderer.domElement);
    camera.position.set(40, 0, 0);
    camera.lookAt(0, 0, 0);

    frontLight.position.set(1.2, 7, 1.5);
    redLight.position.set(-10, 5, 0);
    blueLight.position.set(-10, 3, -100);
    scene.add(frontLight);
    scene.add(redLight);
    scene.add(blueLight);

    const controls = new OrbitControls(camera, renderer.domElement);

    let machine;

    loader.load('../assets/machine.glb', function (gltfMachine) {
        machine = gltfMachine.scene;
        scene.add(machine);
        machine.position.set(0, -3, 0);
    }, undefined, function (error) {
        console.error(error);
    });

    window.addEventListener('resize', function () {
        const canvasWidth = elements.leftCell.clientWidth * 0.8;
        const canvasHeight = elements.leftCell.clientHeight;

        camera.aspect = canvasWidth / canvasHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(canvasWidth, canvasHeight);
        controls.update();
    });

    const clock = new THREE.Clock();
    let delta = 0;
    const interval = 1 / 24;

    function animate() {
        delta += clock.getDelta();

        if (delta > interval) {
            renderer.render(scene, camera);
            delta = delta % interval;
        }
        requestAnimationFrame(animate);
    }

    animate();

});