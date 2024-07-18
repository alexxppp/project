import * as THREE from './THREE/three.module.js';
import { OrbitControls } from './THREE/OrbitControls.js';

/**
 * Function to create a spherical object in a faster and easier way.
 * @param {double} radius Radius value of the sphere.
 * @param {int} horizontalSegments Number of horizontal segments of the sphere. High values will occupy more resources to render.
 * @param {int} verticalSegments Number of vertical segments of the sphere. High values will occupy more resources to render.
 * @param {String} material Name of the object's material. It can be "Basic", "Phong", "Physical".
 * @param {*} texture Constant containing the desired texture.
 * @returns Creates the desired object. You can add it with "scene.add(object name)".
 */
function createSphere(radius, horizontalSegments, verticalSegments, material, texture) {
    const sphereGeometry = new THREE.SphereGeometry(radius, horizontalSegments, verticalSegments);
    var sphereMaterial;

    switch (material) {
        case "Basic":
            sphereMaterial = new THREE.MeshBasicMaterial({map: texture});
            break;
        case "Phong":
            sphereMaterial = new THREE.MeshPhongMaterial({map: texture});
            break;
        case "Standard":
            sphereMaterial = new THREE.MeshStandardMaterial({map: texture});
            break;
        case "Physical":
            sphereMaterial = new THREE.MeshPhysicalMaterial({map: texture});
            break;
        case "Lambert":
            sphereMaterial = new THREE.MeshLambertMaterial({map: texture});
            break;
        case "Toon":
            sphereMaterial = new THREE.MeshToonMaterial({map: texture});
            break;
        default:
            console.error('Invalid material type: ', material);
            return;
    }    

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    return sphere;
}

/**
 * Function to create a spherical object in a faster and easier way.
 * @param {double} width Width value of the box.
 * @param {int} height height value of the box.
 * @param {int} depth Depth value of the box.
 * @param {String} material Name of the object's material. It can be "Basic", "Phong", "Physical".
 * @param {*} texture Constant containing the desired texture.
 * @returns Creates the desired object. You can add it with "scene.add(object name)".
 */
function createBox(width, height, depth, material, texture) {
    const boxGeometry = new THREE.BoxGeometry(width, height, depth);
    var boxMaterial;

    switch (material) {
        case "Basic":
            boxMaterial = new THREE.MeshBasicMaterial({map: texture});
            break;
        case "Phong":
            boxMaterial = new THREE.MeshPhongMaterial({map: texture});
            break;
        case "Standard":
            boxMaterial = new THREE.MeshStandardMaterial({map: texture});
            break;
        case "Physical":
            boxMaterial = new THREE.MeshPhysicalMaterial({map: texture});
            break;
        case "Lambert":
            boxMaterial = new THREE.MeshLambertMaterial({map: texture});
            break;
        case "Toon":
            boxMaterial = new THREE.MeshToonMaterial({map: texture});
            break;
        default:
            console.error('Invalid material type: ', material);
            return;
    }    

    const box = new THREE.Mesh(boxGeometry, boxMaterial);

    return box;
}


export {createBox, createSphere};