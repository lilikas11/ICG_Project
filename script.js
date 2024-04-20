/*
  three.js demo
  https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene
*/

import { FirstPersonControls } from './js/FirstPersonControls.js';

// global variables
let scene, camera, renderer, controls; // initialization, declaration
let sky, sun;
let duck;

const ambientColor = 0x394040;


// invoking, calling a function
init();
load(); // onLoad calls init etc.

function load() {
  // loading manager
  const manager = new THREE.LoadingManager();
  manager.onLoad = function () {
    onLoad();
  };

  // load gltf
  const gltfLoader = new THREE.GLTFLoader(manager);
  const gltfURL =
    "https://cdn.glitch.global/3bbd10eb-4c8c-4be9-b625-ecd05c7361c5/rubber_duck.glb?v=1664492164732";
  gltfLoader.load(gltfURL, function (glb) {
    console.log(glb);
    duck = glb.scene;
    duck.position.set(20, 5, -4);
    // duck.scale.set(10, 10, 10);
    scene.add(duck);
  });

  const loader = new THREE.ObjectLoader(manager);
  loader.load("data/bench.json", function (bench) {
    // callback function
    // onLoad();
    bench.position.set(20, 0.5, -5);
    bench.scale.set(5, 5, 5);
    scene.add(bench);
  });
}

function onLoad() {
  // init();
  lighting();
  scenery();
  animate();
}

// init, initialize, set up the three js scene
function init() {
  const bgColor = new THREE.Color(1, 1, 1); // 0-255, 0-1
  scene = new THREE.Scene(); // assignment
  // scene.background = bgColor; // scene bg color

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 100;
  camera.position.y = 10;
  // camera.zoom = 3;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;

  // from sky example
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;
  document.body.appendChild(renderer.domElement);

//   controls = new THREE.OrbitControls(camera, renderer.domElement);
//   // controls.enableZoom = false;

    controls = new FirstPersonControls(camera, renderer.domElement);
    controls.movementSpeed = 5;
    controls.lookSpeed = 0.02;
    controls.lookVertical = true;

    window.addEventListener('resize', onWindowResize, false);

  
}

function lighting() {
  const ambient = new THREE.AmbientLight(ambientColor); // soft white light // 0x404040 default
  scene.add(ambient);

  const hemi = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  scene.add(hemi);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(50, 50, -50);
  scene.add(directionalLight);

  // sky
  sky = new THREE.Sky();
  sky.scale.setScalar(450000);
  scene.add(sky);
  console.log(sky.material.uniforms);

  sky.material.uniforms.mieCoefficient.value = 0.005;
  sky.material.uniforms.mieDirectionalG.value = 0.7;

  sun = new THREE.Vector3();

  let elevation = 2;
  let azimuth = 180;

  // Math.PI to 360
  const phi = THREE.MathUtils.degToRad(90 - elevation);
  const theta = THREE.MathUtils.degToRad(azimuth);

  sun.setFromSphericalCoords(1, phi, theta);

  sky.material.uniforms.sunPosition.value.copy(sun);
}

function scenery() {
  // ground
  const noiseTextureURL =
    "https://cdn.glitch.global/28e73932-4e53-4402-8dd9-973314542393/256x256_Dissolve_Noise_Texture.png?v=1663195178908";

  const grassTextureURL =
    "https://cdn.glitch.global/28e73932-4e53-4402-8dd9-973314542393/_grass_4__grass_textures_seamless_turf_lawn_green_ground_field_texture_5.jpg?v=1663195183829";

  const texture = new THREE.TextureLoader().load(grassTextureURL);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(100, 100);

  const geometry = new THREE.PlaneGeometry(1000, 1000);
  const material = new THREE.MeshStandardMaterial({
    color: 0x98fb98,
    side: THREE.DoubleSide,
    map: texture,
  });

  const ground = new THREE.Mesh(geometry, material);
  ground.rotation.x = Math.PI / 2; // rotate 180 degrees
  scene.add(ground);

  const noiseTexture = new THREE.TextureLoader().load(noiseTextureURL);
  noiseTexture.wrapS = THREE.RepeatWrapping;
  noiseTexture.wrapT = THREE.RepeatWrapping;
  noiseTexture.repeat.set(1, 4);

  // trees
  const treeHeight = 30;
  const trunkGeo = new THREE.CylinderGeometry(3, 5, treeHeight, 8, 1, true);
  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x695436,
    side: THREE.DoubleSide,
    map: noiseTexture,
  });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.set(0, treeHeight / 2, 0);
  scene.add(trunk);

  const leafGeo = new THREE.BoxGeometry(12, 12, 12);
  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x68cc7a,
    map: noiseTexture,
  });
  const leaf1 = new THREE.Mesh(leafGeo, leafMat);
  leaf1.position.set(0, treeHeight, 0);
  leaf1.rotation.x = Math.random() * Math.PI;
  leaf1.rotation.z = Math.random() * Math.PI;
  scene.add(leaf1);

  const leaf2 = new THREE.Mesh(leafGeo, leafMat);
  leaf2.position.set(3, treeHeight, 1);
  leaf2.rotation.x = Math.random() * Math.PI;
  leaf2.rotation.z = Math.random() * Math.PI;
  scene.add(leaf2);

  const leaf3 = new THREE.Mesh(leafGeo, leafMat);
  leaf3.position.set(-3, treeHeight, 1);
  leaf3.rotation.x = Math.random() * Math.PI;
  leaf3.rotation.z = Math.random() * Math.PI;
  scene.add(leaf3);

  function createCloud() {
    const cloud = new THREE.Group(); // Cria um grupo para manter as partes da nuvem

    const parts = Math.floor(Math.random() * 2) +1; // 3 a 7 partes por nuvem
    for (let i = 0; i < parts; i++) {
        const radius = Math.random() * 50 + 20; // Tamanhos variados
        const cloudGeo = new THREE.IcosahedronGeometry(radius, 1); // Mais detalhes
        const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff,  transparent: true,
            opacity: Math.random() * 0.2 + 0.25});
        const part = new THREE.Mesh(cloudGeo, cloudMat);
        const x = Math.random() * 30 - 15; // Posiciona as partes próximas, mas não exatamente no mesmo lugar
        const y = Math.random() * 10 - 5;
        const z = Math.random() * 30 - 15;
        part.position.set(x, y, z);
        cloud.add(part);
    }
    return cloud;
}

function cloudLayer(layerHeight, layerDistribution) {
    for (let i = 0; i < 50; i++) { // Menos nuvens, mas mais complexas
        const cloud = createCloud();
        const x = Math.random() * 1000 - 500;
        const y = Math.random() * layerDistribution + layerHeight;
        const z = Math.random() * 1000 - 500;
        cloud.position.set(x, y, z);
        scene.add(cloud);
    }
}

  cloudLayer(80, 100);
  cloudLayer(150, 200);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update(0.1);
  duck.rotation.y += 0.01;
  renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}