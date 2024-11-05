// Initialize scene, camera, and renderer
var scene = new THREE.Scene();
console.log("Scene initialized");

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
console.log("Camera created");

var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Enable alpha for transparency
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xaaaaaa, 0); // Set transparent background
document.body.appendChild(renderer.domElement);
console.log("Renderer set up and added to document");

// Add lighting with adjusted intensity
var ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Decreased intensity
scene.add(ambientLight);
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // Adjusted intensity
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Resize event listener
window.addEventListener('resize', function() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  console.log("Window resized - camera and renderer updated");
});

// Load GLTF model
var loader = new THREE.GLTFLoader();
loader.load(
    'scene.gltf', // Ensure this path is correct
    function (gltf) {
        scene.add(gltf.scene);

        // Center the model and camera
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        camera.position.z = box.max.z * 2; // Adjust camera distance as needed
        camera.lookAt(center);

        // Add event listener for device orientation
        window.addEventListener('deviceorientation', handleDeviceOrientation);
    },
    undefined,
    function (error) {
        console.error("An error occurred while loading the model:", error);
    }
);

// Function to handle device orientation events
function handleDeviceOrientation(event) {
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;

    // Adjust the model's rotation based on orientation data
    gltf.scene.rotation.set(
        THREE.MathUtils.degToRad(beta),
        THREE.MathUtils.degToRad(alpha),
        THREE.MathUtils.degToRad(gamma)
    );
}

camera.position.z = 5;
console.log("Camera position set");

// Comment out DeviceOrientationControls for testing on laptop
// var controls = new THREE.DeviceOrientationControls(camera);
// console.log("DeviceOrientationControls added");

// Render and update controls
function animate() {
  requestAnimationFrame(animate);
  // controls.update(); // Uncomment if using DeviceOrientationControls
  renderer.render(scene, camera);
}
animate();
console.log("Animation loop started");
