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
  function(gltf) {
    scene.add(gltf.scene);
    console.log("Model loaded successfully and added to the scene");

    // Center camera on the loaded model
    var box = new THREE.Box3().setFromObject(gltf.scene);
    var center = box.getCenter(new THREE.Vector3());
    camera.position.set(center.x, center.y, center.z + 5);
    camera.lookAt(center); // Look at the center of the model

    // Rotate the model to face the camera
    gltf.scene.rotation.y = Math.PI; // Adjust this if needed

    // Scale the model if needed
    gltf.scene.scale.set(1, 1, 1); // Adjust scale if necessary
  },
  undefined,
  function(error) {
    console.error("An error occurred while loading the model:", error);
  }
);

camera.position.z = 5;
console.log("Camera position set");

// Device Orientation permission
if (typeof DeviceOrientationEvent.requestPermission === 'function') {
  DeviceOrientationEvent.requestPermission()
    .then(function(permissionState) {
      if (permissionState === 'granted') {
        var controls = new THREE.DeviceOrientationControls(camera);
        console.log("DeviceOrientationControls initialized");

        // Render and update controls
        function animate() {
          requestAnimationFrame(animate);
          controls.update(); // Update orientation based on device movement
          renderer.render(scene, camera);
        }
        animate();
        console.log("Animation loop started");
      } else {
        console.error("Permission not granted for Device Orientation");
      }
    })
    .catch(function(error) {
      console.error("Error requesting Device Orientation permission:", error);
    });
} else {
  // Non-iOS 13 devices do not require permission.
  var controls = new THREE.DeviceOrientationControls(camera);
  console.log("DeviceOrientationControls initialized");

  // Render and update controls
  function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Update orientation based on device movement
    renderer.render(scene, camera);
  }
  animate();
  console.log("Animation loop started");
}
