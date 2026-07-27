// viewer.js

const params = new URLSearchParams(window.location.search);
const model = params.get("model");

document.getElementById("modelName").textContent = model || "Model";

document.getElementById("downloadBtn").onclick = () => {
    const a = document.createElement("a");
    a.href = "models/" + model + ".obj";
    a.download = model + ".obj";
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

camera.position.set(0, 1, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight - 60
);

renderer.setPixelRatio(window.devicePixelRatio);

document.getElementById("viewer").appendChild(renderer.domElement);

// Controls
const controls = new THREE.OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 1.5));

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 10, 5);
scene.add(light);

// Load OBJ
const loader = new THREE.OBJLoader();

loader.load(
    "models/" + model + ".obj",

    function(object){

        object.traverse(function(child){

            if(child.isMesh){

                child.material = new THREE.MeshNormalMaterial();

            }

        });

        const box = new THREE.Box3().setFromObject(object);

        const center = box.getCenter(new THREE.Vector3());

        object.position.sub(center);

        const size = box.getSize(new THREE.Vector3());

        const max = Math.max(size.x,size.y,size.z);

        object.scale.setScalar(3/max);

        scene.add(object);

    },

    undefined,

    function(error){

        console.error(error);

        alert("Cannot load models/" + model + ".obj");

    }

);

// Resize
window.addEventListener("resize",()=>{

    camera.aspect=
    window.innerWidth/
    (window.innerHeight-60);

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight-60
    );

});

// Animation
function animate(){

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene,camera);

}

animate();