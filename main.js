import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(40); 
camera.position.setX(0); 
camera.position.setY(0);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(-9, 0, 0);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

// Sun 
const geometry = new THREE.SphereGeometry(10, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0xff6347 });
const sun = new THREE.Mesh(geometry, material);
scene.add(sun);

// Stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.15, 15, 15);
  const material = new THREE.MeshBasicMaterial ({ color: 0xFFFFFF });
  const star = new THREE.Mesh(geometry, material);
  
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Function to create a planet with motion parameters
function createPlanet(radius, width, height, color, zPos, xPos, yPos, motionParams) {
  const planetGeometry = new THREE.SphereGeometry(radius, width, height);
  const planetMaterial = new THREE.MeshBasicMaterial({ color });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  planet.position.set(xPos, yPos, zPos);
  scene.add(planet);

  // Return both the planet and its motion parameters
  return { planet, ...motionParams };
}

// Create and store the planets globally
const planets = [
  createPlanet(5, 32, 32, 0x0077ff, 10, 0, 0, { radius: 20, angle: 0, speed: 0.01 }),
  createPlanet(4, 32, 32, 0x00ff77, 15, 0, 0, { radius: 30, angle: Math.PI / 4, speed: 0.02 }),
  createPlanet(3, 32, 32, 0xff0077, 20, 0, 0, { radius: 40, angle: Math.PI / 2, speed: 0.03 })
];

function updateCircularMotion(planetData) {
  // Update the angle
  planetData.angle += planetData.speed;

  // Update the planet's position
  planetData.planet.position.x = planetData.radius * Math.cos(planetData.angle);
  planetData.planet.position.z = planetData.radius * Math.sin(planetData.angle);
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  sun.rotation.x += 0.01;

  // Update the circular motion for each planet
  planets.forEach(updateCircularMotion);

  controls.update();

  renderer.render(scene, camera);
}

animate();
