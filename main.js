import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import GUI from 'lil-gui'

let paused = false
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 1;
camera.position.y = 20;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
const gui = new GUI();

// controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// params
const params = {
  radius: 1,
  widthSegments: 10,
  heightSegments: 10,
  repelStrength: 0.05,
};

// geometry
let geometry = new THREE.SphereGeometry(params.radius, params.widthSegments, params.heightSegments);
let material = new THREE.MeshNormalMaterial({ flatShading: true });
function getSphere() {
  const mesh = new THREE.Mesh(geometry, material);
  let x = THREE.MathUtils.randFloatSpread(10);
  let z = THREE.MathUtils.randFloatSpread(10);
  mesh.position.x = x;
  mesh.position.z = z;
  mesh.rotation.x = THREE.MathUtils.randFloatSpread(Math.PI);

  const dampingMult = 0.95;
  const velocity = {
    z: THREE.MathUtils.randFloatSpread(0.1),
    x: THREE.MathUtils.randFloatSpread(0.1)
  }
  function update() {
    velocity.x *= dampingMult;
    velocity.z *= dampingMult;
    x += velocity.x;
    z += velocity.z;
    mesh.position.z = z;
    mesh.position.x = x;
    const direction = new THREE.Vector3(0, 0, 0);
    spheres.forEach(sphere => {
      const distance = mesh.position.distanceTo(sphere.mesh.position);
      if (distance < params.radius * 2) {
        direction.subVectors(sphere.mesh.position, mesh.position).normalize();
        velocity.z -= direction.z * params.repelStrength;
        velocity.x -= direction.x * params.repelStrength;
      }
    })
  }
  return {
    update,
    mesh
  }
}
const spheres = [];
let numberSphere = 30
for (let i = 0; i < numberSphere; i++) {
  let sphere = getSphere();
  scene.add(sphere.mesh)
  spheres.push(sphere);
}
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  if (paused === false) {
    spheres.forEach(sphere => sphere.update(sphere));
  }
  renderer.render(scene, camera);
}

animate()

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    paused = !paused
  }
})