import * as THREE from './THREE/three.module.js';
import { OrbitControls } from './THREE/OrbitControls.js';
import * as objects from './PersonalLibrary.js';

//Scene
const scene = new THREE.Scene();

//Camera
//Main camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200000);
camera.position.set(0, 500, 800);


//Earth camera
const earthCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200000);
earthCamera.position.clone(camera.position);
const earthOffset = new THREE.Vector3(0, 0, -60);
const earthInterpolationFactor = 0.1;

//Moon camera
const moonCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200000);
moonCamera.position.clone(camera.position);
const moonOffset = new THREE.Vector3(0, 0, -60);
const moonInterpolationFactor = 0.1;


//Rendering
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Lights
const sunLight = new THREE.DirectionalLight('white', 1);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

//Controls
var controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 120;
controls.maxDistance = 4000;
controls.screenSpaceSpanning = true;

//Window control when resized
window.addEventListener('resize', redimension);
function redimension() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.render(scene, camera);
}

//Textures
var textureLoader = new THREE.TextureLoader();
var earthTexture = textureLoader.load('./Textures/earth-texture.jpg');
var moonTexture = textureLoader.load('./Textures/moon-texture.jpg');
var sunTexture = textureLoader.load('./Textures/sun-texture.jpg');
var mercuryTexture = textureLoader.load('./Textures/mercury-texture.jpg');
var venusTexture = textureLoader.load('./Textures/venus-texture.jpg');
var marsTexture = textureLoader.load('./Textures/mars-texture.jpg');
var jupiterTexture = textureLoader.load('./Textures/jupiter-texture.jpg');
var saturnTexture = textureLoader.load('./Textures/saturn-texture.jpg');
var uranusTexture = textureLoader.load('./Textures/uranus-texture.jpg');
var neptuneTexture = textureLoader.load('./Textures/neptune-texture.jpg');

//Random theta generator
function randomTheta() {
    var randomThetaValue = Math.random() * 360;
    return randomThetaValue;
}

//Objects
//Earth
const earth = new objects.createSphere(20, 100, 100, "Basic", earthTexture);            //earth is made 20x times bigger for easier display (original should be 1)
earth.theta = 0;
scene.add(earth);

//Moon
const moon = new objects.createSphere(5, 25, 25, "Basic", moonTexture);                 //moon is 0.25x earth's size
moon.theta = 0;
scene.add(moon);

//Sun
const sun = new objects.createSphere(109, 100, 100, "Basic", sunTexture);               //sun is 109x times bigger in diameter than earth. original size
scene.add(sun);

//Mercury
const mercury = new objects.createSphere(7.66, 50, 50, "Basic", mercuryTexture);        //0.383x earth's size
mercury.theta = randomTheta();
scene.add(mercury);

//Venus
const venus = new objects.createSphere(18.98, 100, 100, "Basic", venusTexture);         //0.949x earth's size
venus.theta = randomTheta();
scene.add(venus);

//Mars
const mars = new objects.createSphere(10.64, 50, 50, "Basic", marsTexture);             //0.532x earth's size
mars.theta = randomTheta();
scene.add(mars);

//Jupiter
const jupiter = new objects.createSphere(56.045, 100, 100, "Basic", jupiterTexture);    //11.209x earth's size. Made 0.25x original size
jupiter.theta = randomTheta();
scene.add(jupiter);

//Saturn
const saturn = new objects.createSphere(47.245, 100, 100, "Basic", saturnTexture);      //9.449x earth's size. Made 0.25x original size
saturn.theta = randomTheta();
scene.add(saturn);

//Uranus
const uranus = new objects.createSphere(26.553, 100, 100, "Basic", uranusTexture);      //3.983x earth's size. Made 1/3x original size
uranus.theta = randomTheta();
scene.add(uranus);

//Neptune
const neptune = new objects.createSphere(25.766, 100, 100, "Basic", neptuneTexture);    //3.865x earth's size. Made original 1/3x size
neptune.theta = randomTheta();
scene.add(neptune);

//Animation
var mainAnimation = function () {
    requestAnimationFrame(mainAnimation);

    const earthTheta = 0.005;       //Example value
    const earthRotation = 0.05;     //Example value

    //Earth animations based on sun's position
    earth.theta -= earthTheta;                   
    const earthOrbitRadius = 351            //11700x earth's diameter(radius*2), made 1.5/100x real distance (original 23400)
    earth.rotation.y += earthRotation;      //Value used as an example
    earth.position.x = sun.position.x + earthOrbitRadius * Math.cos(earth.theta);
    earth.position.z = sun.position.z + earthOrbitRadius * Math.sin(earth.theta);

    //Moon animations based on earth's position and rotation
    moon.theta -= earthTheta*0.034;         //0.034x earth's orbitational speed
    const moonOrbitRadius = 30;             //30x earth's diameter(radius*2), it's original (30)
    moon.rotation.y += earthTheta;          //Matching the earth's theta so the moon always faces earth
    moon.position.x = earth.position.x + moonOrbitRadius * Math.cos(moon.theta);
    moon.position.z = earth.position.z + moonOrbitRadius * Math.sin(moon.theta);

    //Mercury animations based on sun's position
    mercury.theta -= earthTheta*0.24;                           //0.24x earth's orbitational speed
    const mercuryOrbitRadius = earthOrbitRadius*0.39;           //0.39x earth-sun distance
    mercury.rotation.y += earthRotation*0.16;                   //0.16x earth's rotation speed
    mercury.position.x = sun.position.x + mercuryOrbitRadius * Math.cos(mercury.theta);
    mercury.position.z = sun.position.z + mercuryOrbitRadius * Math.sin(mercury.theta);

    //Venus animations based on sun's position
    venus.theta -= earthTheta*0.62;                             //0.62x earth's orbitational speed
    const venusOrbitRadius = earthOrbitRadius*0.72;             //0.72x earth-sun distance
    venus.rotation.y += earthRotation*0.38;                     //0.38x earth's rotation speed
    venus.position.x = sun.position.x + venusOrbitRadius * Math.cos(venus.theta);
    venus.position.z = sun.position.z + venusOrbitRadius * Math.sin(venus.theta);

    //Mars animations based on sun's position
    mars.theta -= earthTheta*0.8;                               //0.8x earth's orbitational speed
    const marsOrbitRadius = earthOrbitRadius*1.52;              //1.52x earth-sun distance
    mars.rotation.y += earthRotation*1.03;                      //1.03x earth's rotation speed
    mars.position.x = sun.position.x + marsOrbitRadius * Math.cos(mars.theta);
    mars.position.z = sun.position.z + marsOrbitRadius * Math.sin(mars.theta);

    //Jupiter animations based on sun's position
    jupiter.theta -= earthTheta*2.50;                           //2.50x earth's orbitational speed
    const jupiterOrbitRadius = earthOrbitRadius*5.20*0.5;       //5.20x earth-sun distance, made 0.5x original size (1825.2)
    jupiter.rotation.y += earthRotation*0.41;                   //0.41x earth's rotation speed
    jupiter.position.x = sun.position.x + jupiterOrbitRadius * Math.cos(jupiter.theta);
    jupiter.position.z = sun.position.z + jupiterOrbitRadius * Math.sin(jupiter.theta);

    //Saturn animations based on sun's position
    saturn.theta -= earthTheta*1.95;                            //1.95x earth's orbitational speed
    const saturnOrbitRadius = earthOrbitRadius*9.58/3;          //9.58x earth-sun distance, made 1/3x original size (3362.58)
    saturn.rotation.y += earthRotation*0.44;                    //0.44x earth's rotation speed
    saturn.position.x = sun.position.x + saturnOrbitRadius * Math.cos(saturn.theta);
    saturn.position.z = sun.position.z + saturnOrbitRadius * Math.sin(saturn.theta);

    //Uranus animations based on sun's position
    uranus.theta -= earthTheta*1.04;                            //1.04x earth's orbitational speed
    const uranusOrbitRadius = earthOrbitRadius*19.22*0.2;       //19.22x earth-sun distance, made 0.2x the original size (10547.55)
    uranus.rotation.y += earthRotation*0.72;                    //0.72x earth's rotation speed
    uranus.position.x = sun.position.x + uranusOrbitRadius * Math.cos(uranus.theta);
    uranus.position.z = sun.position.z + uranusOrbitRadius * Math.sin(uranus.theta);

    //neptune animations based on sun's position
    neptune.theta -= earthTheta*0.70;                           //0.70x earth's orbitational speed
    const neptuneOrbitRadius = earthOrbitRadius*30.05*0.15;     //30.05x earth-sun distance, made 0.15x the original size (10547.55)
    neptune.rotation.y += earthRotation*0.67;                   //0.67x earth's rotation speed
    neptune.position.x = sun.position.x + neptuneOrbitRadius * Math.cos(neptune.theta);
    neptune.position.z = sun.position.z + neptuneOrbitRadius * Math.sin(neptune.theta);

    renderer.render(scene, camera);
}


//Functions to handle camera switch and position
//Earth camera switch and movement
var earthPOV = function () {
    requestAnimationFrame(earthPOV);
    const earthCameraTargetPosition = earth.position.clone().add(earthOffset);
    earthCamera.position.lerp(earthCameraTargetPosition, earthInterpolationFactor);
    earthCamera.lookAt(earth.position);
    renderer.render(scene, earthCamera);
}

//Moon camera switch and movement
var moonPOV = function () {
    requestAnimationFrame(moonPOV);
    const moonCameraTargetPosition = moon.position.clone().add(moonOffset);
    moonCamera.position.lerp(moonCameraTargetPosition, moonInterpolationFactor);
    moonCamera.lookAt(moon.position);
    renderer.render(scene, moonCamera);
}

mainAnimation();