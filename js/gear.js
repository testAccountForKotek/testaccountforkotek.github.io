import * as THREE from "../three/three.module.js";
import {GLTFLoader} from "../three/GLTFLoader.js";
import {OrbitControls} from "../three/OrbitControls.js";

document.addEventListener('DOMContentLoaded', () => {

    let elements = {
        h1: document.getElementsByTagName('h1').item(0),
        leftCell: document.getElementsByClassName('leftCell').item(0),
        rightCell: document.getElementsByClassName('rightCell').item(0),

        machineSound: document.getElementById('machineSound'),

        soundButton: document.getElementById('soundButton'),
        backButton: document.getElementById('backButton')
    }

    let valuesCSS = {
        invisible: '0',
        visible: '1',

        beigeColor: 'rgb(235, 223, 192)',
        blackColor: 'black',
        transparent: '#00000000'
    }

    let transitionsDurations = {
        pageAppear: 400,
        cellAppear: 200,

        pageDisappear: 300,
        pageDisappearDelay: 100,

        threeAnimation: 500
    }

    const audio = elements.machineSound;

    function appear() {
        elements.h1.style.opacity = valuesCSS.visible;
        elements.leftCell.style.opacity = valuesCSS.visible;
        setTimeout(() => {
            elements.rightCell.style.opacity = valuesCSS.visible;
        }, transitionsDurations.cellAppear);
    }

    function relocate(address) {
        setTimeout(() => {
            location.href = address;
        }, transitionsDurations.pageDisappear);
    }

    function disappear(address) {
        elements.rightCell.style.opacity = valuesCSS.invisible;
        setTimeout(() => {
            elements.h1.style.opacity = valuesCSS.invisible;
            elements.leftCell.style.opacity = valuesCSS.invisible;

            relocate(address);
        }, transitionsDurations.pageDisappearDelay);
    }

    function loopAudioSmoothly() {
        const buffer = 0.5;

        if (audio.currentTime > audio.duration - buffer) {
            audio.currentTime = 0;
            audio.play();
        }
    }

    function animateButtonPlay() {
        const buttonStyle = elements.soundButton.style;
        const pauseText = 'Turn off the machine';

        buttonStyle.borderColor = valuesCSS.beigeColor;
        buttonStyle.backgroundColor = valuesCSS.transparent;
        buttonStyle.color = valuesCSS.beigeColor;

        elements.soundButton.innerText = pauseText;
    }

    function animateButtonPause() {
        const buttonStyle = elements.soundButton.style;
        const playText = 'Turn on the machine';

        buttonStyle.borderColor = valuesCSS.transparent;
        buttonStyle.backgroundColor = valuesCSS.beigeColor;
        buttonStyle.color = valuesCSS.blackColor;

        elements.soundButton.innerText = playText;
    }

    elements.soundButton.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            animateButtonPlay();
            assistMachineToWorkingQuaternion();
        } else {
            audio.pause();
            animateButtonPause();
            dancing = true;
        }
    });

    elements.machineSound.addEventListener('timeupdate', loopAudioSmoothly);

    elements.backButton.addEventListener('click', () => {
        const indexAddress = '../index.html';
        disappear(indexAddress);
    });

    setTimeout(appear, transitionsDurations.pageAppear);

    window.addEventListener('pageshow', eve => {
        if (eve.persisted) {
            setTimeout(appear, transitionsDurations.pageAppear);
        }
    });


    // Three.js starts here

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

    let dancing = true;
    let ongoingAnimation = false;

    let machine;

    loader.load('../assets/machine.glb', gltfMachine => {
        machine = gltfMachine.scene;
        scene.add(machine);
        machine.position.set(0, -3, 0);
    }, undefined, error => {
        console.error(error);
    });

    window.addEventListener('resize', () => {
        const canvasWidth = elements.leftCell.clientWidth * 0.8;
        const canvasHeight = elements.leftCell.clientHeight;

        camera.aspect = canvasWidth / canvasHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(canvasWidth, canvasHeight);
        controls.update();
    });

    function assistMachineToWorkingQuaternion() {
        dancing = false;
        ongoingAnimation = true;

        setTimeout(() => {
            ongoingAnimation = false;
        }, transitionsDurations.threeAnimation);
    }

    function moveMachineToWorkingQuaternion() {
        const workingQuaternion = new THREE.Quaternion(
            -0.24247235169095427,
            -0.04915157902114466,
            -0.19249318242027594,
            0.9495986813738215);

        if (machine) {
            machine.quaternion.slerpQuaternions(machine.quaternion, workingQuaternion, 0.1);
        }
    }

    const clock = new THREE.Clock();
    let delta = 0;
    const interval = 1 / 24;

    function animate() {
        delta += clock.getDelta();

        if (ongoingAnimation) {
            moveMachineToWorkingQuaternion();
        }

        if (delta > interval) {
            if (machine && dancing) {
                const machineRotation = machine.rotation;

                machineRotation.z += 0.01;
                machineRotation.x += 0.02;
                machineRotation.y += 0.04;
            }

            delta = delta % interval;
            renderer.render(scene, camera);
        }
        requestAnimationFrame(animate);
    }

    animate();

});