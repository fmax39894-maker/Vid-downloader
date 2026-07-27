const params = new URLSearchParams(window.location.search);
const model = params.get("model");

document.getElementById("modelName").textContent = model || "Unknown";

document.getElementById("downloadBtn").onclick = function () {
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

camera.position.set(0, 0, 5);

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
const controls = new THREE.OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.08;

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 1.5));

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 10, 8);
scene.add(light);

// Grid
const grid = new THREE.GridHelper(10,10);
grid.position.y = -1.5;
scene.add(grid);

// Loader
const loader = new THREE.OBJLoader();

loader.load(
    "models/" + model + ".obj",

    function(object){

        object.traverse(function(child){

            if(child instanceof THREE.Mesh){

                child.material = new THREE.MeshNormalMaterial();

            }

        });

        // Center model
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());

        object.position.x -= center.x;
        object.position.y -= center.y;
        object.position.z -= center.z;

        // Scale model
        const size = box.getSize(new THREE.Vector3());
        const maxSize = Math.max(size.x,size.y,size.z);

        if(maxSize>0){

            const scale = 3/maxSize;

            object.scale.set(scale,scale,scale);

        }

        scene.add(object);

    },

    function(xhr){

        if(xhr.total){

            console.log(
                Math.round(xhr.loaded/xhr.total*100)+"%"
            );

        }

    },

    function(error){

        console.error(error);

        alert("Cannot load: models/" + model + ".obj");

    }

);

// Resize
window.addEventListener("resize",function(){

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
function animate(){

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene,camera);

}

animate();