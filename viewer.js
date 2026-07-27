import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/OBJLoader.js";

const params = new URLSearchParams(window.location.search);
const modelName = params.get("model") || "heart";

document.getElementById("modelName").textContent =
    modelName.charAt(0).toUpperCase() + modelName.slice(1);

// Download
document.getElementById("downloadBtn").onclick = () => {
    const a = document.createElement("a");
    a.href = `models/${modelName}.obj`;
    a.download = `${modelName}.obj`;
    a.click();
};

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// Camera
const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / (window.innerHeight - 60),
    0.1,
    1000
);
camera.position.set(0, 2, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(
    window.innerWidth,
    window.innerHeight - 60
);

document.getElementById("viewer").appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.08;

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 2));

const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(5, 10, 8);
scene.add(light);

// Grid (optional)
const grid = new THREE.GridHelper(10, 10);
grid.position.y = -1.5;
scene.add(grid);

// Loader
const loader = new OBJLoader();

loader.load(

    `models/${modelName}.obj`,

    (object) => {

        object.traverse((child) => {

            if (child.isMesh) {

                child.material = new THREE.MeshStandardMaterial({
                    color: 0xcfcfcf,
                    metalness: 0,
                    roughness: 1
                });

            }

        });

        // Center model
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());

        object.position.sub(center);

        // Scale model
        const size = box.getSize(new THREE.Vector3());
        const max = Math.max(size.x, size.y, size.z);

        const scale = 3 / max;

        object.scale.setScalar(scale);

        scene.add(object);

    },

    (xhr) => {

        if (xhr.total) {
            console.log(
                Math.round((xhr.loaded / xhr.total) * 100) + "%"
            );
        }

    },

    (err) => {

        console.error(err);

        alert("Unable to load model.");

    }

);

// Resize
window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth /
        (window.innerHeight - 60);

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight - 60
    );

});

// Animation
function animate() {

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);

}

animate();