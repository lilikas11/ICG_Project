/*
  three.js demo
  https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene
*/

import { color } from 'three/examples/jsm/nodes/Nodes.js';
import { FirstPersonControls } from './js/FirstPersonControls.js';
import { create } from 'zustand';

// global variables
let scene, camera, renderer, controls; // initialization, declaration
let sky, sun;
let duck, particleSystem1, particleSystem2;
let treeTrunkBoundingBox, treeLeafBoundingSpheres = [];


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

  const gltfLoader1 = new THREE.GLTFLoader(manager);
  const gltfURL1 = 'tables_and_chairs/scene.gltf'; // Atualize este caminho
  gltfLoader1.load(gltfURL1, function (glb) {
    console.log(glb);
    const sceneObject = glb.scene;
    sceneObject.position.set(-190, -8, 280);
    sceneObject.scale.set(8, 8, 8);
    scene.add(sceneObject);
  });

  const gltfLoader2 = new THREE.GLTFLoader(manager);
  const gltfURL2 = 'minecraft_bee/scene.gltf'; // Atualize este caminho
  gltfLoader2.load(gltfURL2, function (glb) {
    console.log(glb);
    const sceneObject = glb.scene;
    sceneObject.position.set(-175, 15, 320);
    sceneObject.scale.set(50, 50, 50);
    sceneObject.rotation.y = Math.PI / 2 + 1;
    scene.add(sceneObject);
  });

  const gltfLoader3 = new THREE.GLTFLoader(manager);
  const gltfURL3 = 'minecraft_bee/scene.gltf'; // Atualize este caminho
  gltfLoader3.load(gltfURL3, function (glb) {
    console.log(glb);
    const sceneObject = glb.scene;
    sceneObject.position.set(-185, 10, 302);
    sceneObject.scale.set(50, 50, 50);
    sceneObject.rotation.y = Math.PI / 2 - 1;
    scene.add(sceneObject);
  });

  const gltfLoader4 = new THREE.GLTFLoader(manager);
  const gltfURL4 = 'minecraft_grass_block/scene.gltf'; // Atualize este caminho
  gltfLoader4.load(gltfURL4, function (glb) {
    console.log(glb);
    const sceneObject = glb.scene;
    sceneObject.position.set(-185, 1, 315);
    sceneObject.scale.set(3, 3, 3);
    scene.add(sceneObject);
  });

  const gltfLoader5 = new THREE.GLTFLoader(manager);
  const gltfURL5 = 'minecraft_grass_block/scene.gltf'; // Atualize este caminho
  gltfLoader5.load(gltfURL5, function (glb) {
    console.log(glb);
    const sceneObject = glb.scene;
    sceneObject.position.set(-185, 1, 309);
    sceneObject.scale.set(3, 3, 3);
    scene.add(sceneObject);
  });

  const gltfLoader6 = new THREE.GLTFLoader(manager);
  const gltfURL6 = 'minecraft_grass_block/scene.gltf'; // Atualize este caminho
  gltfLoader6.load(gltfURL6, function (glb) {
    console.log(glb);
    const sceneObject = glb.scene;
    sceneObject.position.set(-179, 1, 315);
    sceneObject.scale.set(3, 3, 3);
    scene.add(sceneObject);
  });


  const gltfLoader7 = new THREE.GLTFLoader(manager);
  const gltfURL7 = 'minecraft_grass_block/scene.gltf'; // Atualize este caminho
  gltfLoader7.load(gltfURL7, function (glb) {
    console.log(glb);
    const sceneObject = glb.scene;
    sceneObject.position.set(-185, 7, 315);
    sceneObject.scale.set(3, 3, 3);
    scene.add(sceneObject);
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
  camera.position.z = 300;
  camera.position.y = 10;
  camera.position.x = 30;
  // camera.zoom = 3;
  camera.lookAt(0, 10, 300);


  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;

  renderer.shadowMap.enabled = true;  // Habilitar mapas de sombra
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;  // Tipo de sombra, PCFSoftShadowMap geralmente proporciona sombras mais suaves
  // from sky example
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;
  document.body.appendChild(renderer.domElement);

  //   controls = new THREE.OrbitControls(camera, renderer.domElement);
  //   // controls.enableZoom = false;

  controls = new FirstPersonControls(camera, renderer.domElement);
  controls.movementSpeed = 10;
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
  directionalLight.castShadow = true;  // Habilitar a projeção de sombras

  // Configurações adicionais de sombra para a luz direcional
  directionalLight.shadow.mapSize.width = 2048;  // Resolução da sombra
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 500;
  directionalLight.shadow.camera.left = -100;
  directionalLight.shadow.camera.right = 100;
  directionalLight.shadow.camera.top = 100;
  directionalLight.shadow.camera.bottom = -100;

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

  // Atualizar a posição do sol com base nos parâmetros de elevação e azimute



  sun.setFromSphericalCoords(1, phi, theta);

  sky.material.uniforms.sunPosition.value.copy(sun);
  directionalLight.position.copy(sun);  // Sincronizar a posição da luz direcional com a posição do sol
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

  const geometry = new THREE.PlaneGeometry(1500, 1500);
  const material = new THREE.MeshStandardMaterial({
    color: 0x98fb98,
    side: THREE.DoubleSide,
    map: texture,
  });

  const ground = new THREE.Mesh(geometry, material);
  ground.rotation.x = Math.PI / 2; // rotate 180 degrees
  ground.receiveShadow = true;
  scene.add(ground);



  const noiseTexture = new THREE.TextureLoader().load(noiseTextureURL);
  noiseTexture.wrapS = THREE.RepeatWrapping;
  noiseTexture.wrapT = THREE.RepeatWrapping;
  noiseTexture.repeat.set(1, 4);

  const clouds = [];

  cloudLayer(250, 100);
  cloudLayer(150, 200);

  animateClouds();


  centralTree();

  createForestEdge();

  createStonePathZ(300, -75, 30, 200);
  createStonePathX(273, -173, 7, 50);

  Board();

  BoardTrees();

  function BoardTrees() {

    particleSystem1 = arvoreRosa(-30, 0, 210);
    particleSystem2 = arvoreRosa(-60, 0, 260);

    // outra rosa
    function arvoreRosa(x, y, z) {
      const treeHeight = 60;
      const trunkHeight = treeHeight * 0.5;
      const trunkRadius = 3;
      const trunkGeo = new THREE.CylinderGeometry(trunkRadius, trunkRadius, trunkHeight, 12);
      const trunkMat = new THREE.MeshStandardMaterial({
        color: 0x8B4513,
        map: noiseTexture,
      });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.set(x, y + trunkHeight / 2, z);
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      scene.add(trunk);

      // Create cherry blossoms using SphereGeometry with small particles
      const blossomCount = 80 + treeHeight / 4; // Total number of blossoms
      const blossomGeo = new THREE.SphereGeometry(10, 8, 8); // Small spheres for blossoms
      const blossomMat = new THREE.MeshStandardMaterial({
        color: 0xFFB7C5, // A soft pink color for the blossoms
        map: noiseTexture,

      });

      for (let i = 0; i < blossomCount; i++) {
        const blossom = new THREE.Mesh(blossomGeo, blossomMat);
        const angle = Math.random() * Math.PI * 2; // Random angle for horizontal spread
        const height = y + trunkHeight + (Math.random() * treeHeight * 0.2); // Random height above the trunk
        const distance = 10; // Random distance from trunk center
        blossom.position.set(
          x + Math.cos(angle) * distance,
          height,
          z + Math.sin(angle) * distance
        );
        blossom.castShadow = true;
        blossom.receiveShadow = true;
        scene.add(blossom);
      }


      // Particle system for cherry blossoms
      const particleCount = 500;
      const particles = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = Math.random() * 200 - 100; // Adjust for more centralized spawning
      }
      particles.setAttribute('position', new THREE.BufferAttribute(positions, 4));

      const particleMaterial = new THREE.PointsMaterial({
        color: 0xFFB7C5,
        size: 0.5,
        transparent: true,
        opacity: 0.6  // Increased opacity for visibility
      });

      const particleSystem = new THREE.Points(particles, particleMaterial);
      particleSystem.position.set(x, y, z); // Adjust position to emit from the top of the trunk
      scene.add(particleSystem);

      return particleSystem; // Return the particle system
    }


    // Willow tree arvore com sombras
    const willowTreeHeight = 70;
    const willowTrunkGeo = new THREE.CylinderGeometry(2, 5, willowTreeHeight, 12);
    const willowTrunkMat = new THREE.MeshStandardMaterial({
      color: 0x4A2B0F,
      map: noiseTexture, // Assuming you have a noise texture for bark details
    });
    const willowTrunk = new THREE.Mesh(willowTrunkGeo, willowTrunkMat);
    willowTrunk.castShadow = true;  // Habilitar a projeção de sombras
    willowTrunk.receiveShadow = true;  // Permitir que o objeto receba sombras
    willowTrunk.position.set(-70, 0 + willowTreeHeight / 2, 340);
    willowTrunk.castShadow = true;
    willowTrunk.receiveShadow = true;
    scene.add(willowTrunk);


    // Create willow foliage using an IcosahedronGeometry for a more organic look
    const willowLeafGeo = new THREE.IcosahedronGeometry(15, 1);
    const willowLeafMat = new THREE.MeshStandardMaterial({
      color: 0x3DA35D,
      side: THREE.DoubleSide,
      map: noiseTexture, // You can reuse the same noise texture or use a green leafy texture
    });
    const willowLeaves = [];

    // Position multiple leaf clusters to simulate the drooping effect
    for (let i = 0; i < 5; i++) {
      let leaf = new THREE.Mesh(willowLeafGeo, willowLeafMat);
      leaf.position.set(
        -70 + Math.random() * 10 - 5, // Random position around the trunk
        0 + willowTreeHeight - i * 5, // Gradually lower the leaves
        340 + Math.random() * 10 - 5
      );
      leaf.rotation.x = Math.random() * Math.PI; // Random rotation for natural look
      leaf.rotation.z = Math.random() * Math.PI;
      leaf.castShadow = true;
      leaf.receiveShadow = true;
      scene.add(leaf);
      willowLeaves.push(leaf);
    }




    // Willow tree arvore com sombras
    const willow2TreeHeight = 50;
    const willow2TrunkGeo = new THREE.CylinderGeometry(2, 5, willow2TreeHeight, 12);
    const willow2TrunkMat = new THREE.MeshStandardMaterial({
      color: 0x4A2B0F,
      map: noiseTexture, // Assuming you have a noise texture for bark details
    });
    const willow2Trunk = new THREE.Mesh(willow2TrunkGeo, willow2TrunkMat);
    willow2Trunk.castShadow = true;  // Habilitar a projeção de sombras
    willow2Trunk.receiveShadow = true;  // Permitir que o objeto receba sombras
    willow2Trunk.position.set(-120, 0 + willow2TreeHeight / 2, 328);
    willow2Trunk.castShadow = true;
    willow2Trunk.receiveShadow = true;
    scene.add(willow2Trunk);


    // Create willow2 foliage using an IcosahedronGeometry for a more organic look
    const willow2LeafGeo = new THREE.IcosahedronGeometry(15, 1);
    const willow2LeafMat = new THREE.MeshStandardMaterial({
      color: 0x3DA35D,
      side: THREE.DoubleSide,
      map: noiseTexture, // You can reuse the same noise texture or use a green leafy texture
    });
    const willow2Leaves = [];

    // Position multiple leaf clusters to simulate the drooping effect
    for (let i = 0; i < 5; i++) {
      let leaf2 = new THREE.Mesh(willow2LeafGeo, willow2LeafMat);
      leaf2.position.set(
        -120 + Math.random() * 10 - 5, // Random position around the trunk
        0 + willow2TreeHeight - i * 5, // Gradually lower the leaves
        328 + Math.random() * 10 - 5
      );
      leaf2.rotation.x = Math.random() * Math.PI; // Random rotation for natural look
      leaf2.rotation.z = Math.random() * Math.PI;
      leaf2.castShadow = true;
      leaf2.receiveShadow = true;
      scene.add(leaf2);
      willow2Leaves.push(leaf2);
    }

    // Willow tree arvore com sombras
    const willow3TreeHeight = 30;
    const willow3TrunkGeo = new THREE.CylinderGeometry(2, 3, willow3TreeHeight, 8);
    const willow3TrunkMat = new THREE.MeshStandardMaterial({
      color: 0x4A2B0F,
      map: noiseTexture, // Assuming you have a noise texture for bark details
    });
    const willow3Trunk = new THREE.Mesh(willow3TrunkGeo, willow3TrunkMat);
    willow3Trunk.castShadow = true;  // Habilitar a projeção de sombras
    willow3Trunk.receiveShadow = true;  // Permitir que o objeto receba sombras
    willow3Trunk.position.set(-120, 0 + willow3TreeHeight / 2, 270);
    willow3Trunk.castShadow = true;
    willow3Trunk.receiveShadow = true;
    scene.add(willow3Trunk);


    // Create willow2 foliage using an IcosahedronGeometry for a more organic look
    const willow3LeafGeo = new THREE.IcosahedronGeometry(15, 1);
    const willow3LeafMat = new THREE.MeshStandardMaterial({
      color: 0x3DA35D,
      side: THREE.DoubleSide,
      map: noiseTexture, // You can reuse the same noise texture or use a green leafy texture
    });
    const willow3Leaves = [];

    // Position multiple leaf clusters to simulate the drooping effect
    for (let i = 0; i < 5; i++) {
      let leaf3 = new THREE.Mesh(willow3LeafGeo, willow3LeafMat);
      leaf3.position.set(
        -120 + Math.random() * 10 - 5, // Random position around the trunk
        0 + willow2TreeHeight - 15 - i * 2, // Gradually lower the leaves
        270 + Math.random() * 10 - 5
      );
      leaf3.rotation.x = Math.random() * Math.PI; // Random rotation for natural look
      leaf3.rotation.z = Math.random() * Math.PI;
      leaf3.castShadow = true;
      leaf3.receiveShadow = true;
      scene.add(leaf3);
      willow3Leaves.push(leaf3);
    }

    // Willow tree arvore com sombras
    const willow4TreeHeight = 30;
    const willow4TrunkGeo = new THREE.CylinderGeometry(2, 3, willow4TreeHeight, 8);
    const willow4TrunkMat = new THREE.MeshStandardMaterial({
      color: 0x4A2B0F,
      map: noiseTexture, // Assuming you have a noise texture for bark details
    });
    const willow4Trunk = new THREE.Mesh(willow4TrunkGeo, willow4TrunkMat);
    willow4Trunk.castShadow = true;  // Habilitar a projeção de sombras
    willow4Trunk.receiveShadow = true;  // Permitir que o objeto receba sombras
    willow4Trunk.position.set(-145, 0 + willow4TreeHeight / 2, 245);
    willow4Trunk.castShadow = true;
    willow4Trunk.receiveShadow = true;
    scene.add(willow4Trunk);


    // Create willow2 foliage using an IcosahedronGeometry for a more organic look
    const willow4LeafGeo = new THREE.IcosahedronGeometry(15, 1);
    const willow4LeafMat = new THREE.MeshStandardMaterial({
      color: 0x3DA35D,
      side: THREE.DoubleSide,
      map: noiseTexture, // You can reuse the same noise texture or use a green leafy texture
    });
    const willow4Leaves = [];

    // Position multiple leaf clusters to simulate the drooping effect
    for (let i = 0; i < 5; i++) {
      let leaf4 = new THREE.Mesh(willow4LeafGeo, willow4LeafMat);
      leaf4.position.set(
        -145 + Math.random() * 10 - 5, // Random position around the trunk
        0 + willow2TreeHeight - 15 - i * 2, // Gradually lower the leaves
        245 + Math.random() * 10 - 5
      );
      leaf4.rotation.x = Math.random() * Math.PI; // Random rotation for natural look
      leaf4.rotation.z = Math.random() * Math.PI;
      leaf4.castShadow = true;
      leaf4.receiveShadow = true;
      scene.add(leaf4);
      willow4Leaves.push(leaf4);
    }

    // Willow tree arvore com sombras
    const willow5TreeHeight = 50;
    const willow5TrunkGeo = new THREE.CylinderGeometry(2, 5, willow5TreeHeight, 12);
    const willow5TrunkMat = new THREE.MeshStandardMaterial({
      color: 0x4A2B0F,
      map: noiseTexture, // Assuming you have a noise texture for bark details
    });
    const willow5Trunk = new THREE.Mesh(willow5TrunkGeo, willow5TrunkMat);
    willow5Trunk.castShadow = true;  // Habilitar a projeção de sombras
    willow5Trunk.receiveShadow = true;  // Permitir que o objeto receba sombras
    willow5Trunk.position.set(-220, 0 + willow5TreeHeight / 2, 300);
    willow5Trunk.castShadow = true;
    willow5Trunk.receiveShadow = true;
    scene.add(willow5Trunk);


    // Create willow2 foliage using an IcosahedronGeometry for a more organic look
    const willow5LeafGeo = new THREE.IcosahedronGeometry(15, 1);
    const willow5LeafMat = new THREE.MeshStandardMaterial({
      color: 0x3DA35D,
      side: THREE.DoubleSide,
      map: noiseTexture, // You can reuse the same noise texture or use a green leafy texture
    });
    const willow5Leaves = [];

    // Position multiple leaf clusters to simulate the drooping effect
    for (let i = 0; i < 5; i++) {
      let leaf5 = new THREE.Mesh(willow5LeafGeo, willow5LeafMat);
      leaf5.position.set(
        -220 + Math.random() * 10 - 5, // Random position around the trunk
        2 + willow2TreeHeight - i * 5, // Gradually lower the leaves
        300 + Math.random() * 10 - 5
      );
      leaf5.rotation.x = Math.random() * Math.PI; // Random rotation for natural look
      leaf5.rotation.z = Math.random() * Math.PI;
      leaf5.castShadow = true;
      leaf5.receiveShadow = true;
      scene.add(leaf5);
      willow4Leaves.push(leaf5);
    }

    // Willow tree arvore com sombras
    const willow6TreeHeight = 70;
    const willow6TrunkGeo = new THREE.CylinderGeometry(2, 5, willow6TreeHeight, 12);
    const willow6TrunkMat = new THREE.MeshStandardMaterial({
      color: 0x4A2B0F,
      map: noiseTexture, // Assuming you have a noise texture for bark details
    });
    const willow6Trunk = new THREE.Mesh(willow6TrunkGeo, willow6TrunkMat);
    willow6Trunk.castShadow = true;  // Habilitar a projeção de sombras
    willow6Trunk.receiveShadow = true;  // Permitir que o objeto receba sombras
    willow6Trunk.position.set(-180, 0 + willow6TreeHeight / 2, 340);
    willow6Trunk.castShadow = true;
    willow6Trunk.receiveShadow = true;
    scene.add(willow6Trunk);


    // Create willow2 foliage using an IcosahedronGeometry for a more organic look
    const willow6LeafGeo = new THREE.IcosahedronGeometry(15, 1);
    const willow6LeafMat = new THREE.MeshStandardMaterial({
      color: 0x3DA35D,
      side: THREE.DoubleSide,
      map: noiseTexture, // You can reuse the same noise texture or use a green leafy texture
    });
    const willow6Leaves = [];

    // Position multiple leaf clusters to simulate the drooping effect
    for (let i = 0; i < 5; i++) {
      let leaf6 = new THREE.Mesh(willow6LeafGeo, willow6LeafMat);
      leaf6.position.set(
        -180 + Math.random() * 10 - 5, // Random position around the trunk
        0 + willow6TreeHeight - i * 5, // Gradually lower the leaves
        340 + Math.random() * 10 - 5
      );
      leaf6.rotation.x = Math.random() * Math.PI; // Random rotation for natural look
      leaf6.rotation.z = Math.random() * Math.PI;
      leaf6.castShadow = true;
      leaf6.receiveShadow = true;
      scene.add(leaf6);
      willow6Leaves.push(leaf6);
    }


        // Willow tree arvore com sombras
        const willow7TreeHeight = 80;
        const willow7TrunkGeo = new THREE.CylinderGeometry(2, 6, willow7TreeHeight, 12);
        const willow7TrunkMat = new THREE.MeshStandardMaterial({
          color: 0x4A2B0F,
          map: noiseTexture, // Assuming you have a noise texture for bark details
        });
        const willow7Trunk = new THREE.Mesh(willow7TrunkGeo, willow7TrunkMat);
        willow7Trunk.castShadow = true;  // Habilitar a projeção de sombras
        willow7Trunk.receiveShadow = true;  // Permitir que o objeto receba sombras
        willow7Trunk.position.set(-250, 0 + willow7TreeHeight / 2, 370);
        willow7Trunk.castShadow = true;
        willow7Trunk.receiveShadow = true;
        scene.add(willow7Trunk);
    
    
        // Create willow2 foliage using an IcosahedronGeometry for a more organic look
        const willow7LeafGeo = new THREE.IcosahedronGeometry(30, 1);
        const willow7LeafMat = new THREE.MeshStandardMaterial({
          color: 0x3DA35D,
          side: THREE.DoubleSide,
          map: noiseTexture, // You can reuse the same noise texture or use a green leafy texture
        });
        const willow7Leaves = [];
    
        // Position multiple leaf clusters to simulate the drooping effect
        for (let i = 0; i < 5; i++) {
          let leaf7 = new THREE.Mesh(willow7LeafGeo, willow7LeafMat);
          leaf7.position.set(
            -250 + Math.random() * 10 - 5, // Random position around the trunk
            0 + willow7TreeHeight - i * 5, // Gradually lower the leaves
            370 + Math.random() * 10 - 5
          );
          leaf7.rotation.x = Math.random() * Math.PI; // Random rotation for natural look
          leaf7.rotation.z = Math.random() * Math.PI;
          leaf7.castShadow = true;
          leaf7.receiveShadow = true;
          scene.add(leaf7);
          willow7Leaves.push(leaf7);
        }


  }

  function Board() {
    /// Parâmetros da moldura
    const frameOuterWidth = 25;
    const frameOuterHeight = 15;
    const frameThickness = 1;
    const extrudeDepth = 1;

    const frameGroup = new THREE.Group();


    // Material da moldura
    const wood = new THREE.TextureLoader().load('data/madeira.jpeg')
    const cortica = new THREE.TextureLoader().load('data/cortica.png')
    const frameMaterial = new THREE.MeshBasicMaterial({ map: wood });

    // Parte superior da moldura
    const topFrameGeometry = new THREE.BoxGeometry(frameOuterWidth, frameThickness, extrudeDepth);
    const topFrame = new THREE.Mesh(topFrameGeometry, frameMaterial);
    topFrame.position.y = 12 + frameOuterHeight / 2 - frameThickness / 2;
    topFrame.position.z = 280 - extrudeDepth / 2;
    topFrame.position.x = -10

    frameGroup.add(topFrame);

    // Parte inferior da moldura
    const bottomFrameGeometry = new THREE.BoxGeometry(frameOuterWidth, frameThickness, extrudeDepth);
    const bottomFrame = new THREE.Mesh(bottomFrameGeometry, frameMaterial);
    bottomFrame.position.y = 12 - frameOuterHeight / 2 + frameThickness / 2;
    bottomFrame.position.z = 280 - extrudeDepth / 2;
    bottomFrame.position.x = -10

    frameGroup.add(bottomFrame);

    // Lados da moldura
    const sideFrameGeometry = new THREE.BoxGeometry(frameThickness, frameOuterHeight - 2 * frameThickness, extrudeDepth);
    // Lado esquerdo
    const leftFrame = new THREE.Mesh(sideFrameGeometry, frameMaterial);
    leftFrame.position.x = -10 - frameOuterWidth / 2 + frameThickness / 2;
    leftFrame.position.z = 280 - extrudeDepth / 2;
    leftFrame.position.y = 12

    frameGroup.add(leftFrame);
    // Lado direito
    const rightFrame = new THREE.Mesh(sideFrameGeometry, frameMaterial);
    rightFrame.position.x = -10 + frameOuterWidth / 2 - frameThickness / 2;
    rightFrame.position.z = 280 - extrudeDepth / 2;
    rightFrame.position.y = 12
    frameGroup.add(rightFrame);

    // Adicionando o quadro central
    const boardGeometry = new THREE.BoxGeometry(frameOuterWidth - 2 * frameThickness, frameOuterHeight - 2 * frameThickness, 0.1);
    const boardMaterial = new THREE.MeshBasicMaterial({ color: 0xc3946b, map: cortica });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.position.z = 280 - extrudeDepth + 0.1; // Posicionando um pouco à frente para não ficar exatamente no fundo
    board.position.y = 12
    board.position.x = -10
    frameGroup.add(board);

    // Adicionando o quadro central
    const backGeometry = new THREE.BoxGeometry(frameOuterWidth - 2 * frameThickness, frameOuterHeight - 2 * frameThickness, 0.1);
    const backMaterial = new THREE.MeshBasicMaterial({ map: wood });
    const back = new THREE.Mesh(backGeometry, backMaterial);
    back.position.z = 280 - extrudeDepth + 0.05; // Posicionando um pouco à frente para não ficar exatamente no fundo
    back.position.y = 12
    back.position.x = -10
    frameGroup.add(back);



    // Base cilíndrica
    // Base cilíndrica
    const BaseGeometry = new THREE.BoxGeometry(frameThickness + 1, frameOuterHeight - 2 * frameThickness - 5, extrudeDepth);
    const leftBase = new THREE.Mesh(BaseGeometry, frameMaterial);
    leftBase.position.x = -8 - frameOuterWidth / 2 + frameThickness / 2;
    leftBase.position.z = 280 - extrudeDepth / 2;
    leftBase.position.y = 0.5

    frameGroup.add(leftBase);

    // Lado direito
    const rightBase = new THREE.Mesh(BaseGeometry, frameMaterial);
    rightBase.position.x = -12 + frameOuterWidth / 2 - frameThickness / 2;
    rightBase.position.z = 280 - extrudeDepth / 2;
    rightBase.position.y = 0.5

    frameGroup.add(rightBase);

    topFrame.castShadow = true; // Permitir que este objeto lance sombras
    topFrame.receiveShadow = true; // Permitir que este objeto receba sombras

    // Faça o mesmo para outros objetos
    bottomFrame.castShadow = true;
    bottomFrame.receiveShadow = true;
    leftFrame.castShadow = true;
    leftFrame.receiveShadow = true;
    rightFrame.castShadow = true;
    rightFrame.receiveShadow = true;
    board.receiveShadow = true; // Geralmente quadros como este não lançam sombras, mas recebem
    board.castShadow = true;
    rightBase.castShadow = true;
    rightBase.receiveShadow = true;
    leftBase.castShadow = true;
    leftBase.receiveShadow = true;



    scene.add(frameGroup)

    frameGroup.rotation.y = 0.6
    frameGroup.position.x = -180
    frameGroup.position.z = 40



    // circulo

    pin(-34, 10, 279)

    pin(-38, 10, 281.5)

    pin(-37.5, 16.3, 281)

    pin(-30.5, 14.3, 276)

    pin(-27.7, 10.2, 274.5)

    pin(-23, 12, 271)

    pin(-25.5, 17.2, 272.7)

    pin(-35.5, 17.2, 279.5)





  }

  function pin(x, y, z) {
    const pinGeo = new THREE.SphereGeometry(0.2, 8, 8); // Small spheres for blossoms
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0x8050cc, // A soft pink color for the blossoms
    });
    const pin = new THREE.Mesh(pinGeo, pinMat);
    pin.position.z = z
    pin.position.y = y
    pin.position.x = x

    scene.add(pin)

  }


  function createStonePathZ(z, x, numStones, pathLength) {
    // Configurações da pedra
    const stoneRadiusTop = 1.8; // Raio superior do cilindro
    const stoneRadiusBottom = 2; // Raio inferior do cilindro para dar um efeito ligeiramente cônico
    const stoneHeight = 0.3; // Altura da pedra
    const stoneSegments = 12; // Número de segmentos para suavizar a pedra

    // Criar as pedras
    const stoneGeometry = new THREE.CylinderGeometry(stoneRadiusTop, stoneRadiusBottom, stoneHeight, stoneSegments);
    const stoneMaterial = new THREE.MeshStandardMaterial({
      color: 0x6666666, // Cor cinza
      map: noiseTexture
    });

    for (let i = 0; i < numStones; i++) {
      const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
      stone.position.x = x + (i / numStones) * pathLength - pathLength / 2 + Math.random() * 1; // Distribuir ao longo do caminho
      stone.position.y = stoneHeight / 2; // Posiciona a pedra para que sua base toque o chão
      stone.rotation.y = Math.random() * Math.PI; // Rotação aleatória para mais naturalidade
      stone.position.z = z - Math.random() * 2;

      scene.add(stone);

      const stone2 = new THREE.Mesh(stoneGeometry, stoneMaterial);

      stone2.position.x = x + (i / numStones) * pathLength - pathLength / 2 + Math.random() * 1; // Distribuir ao longo do caminho
      stone2.position.y = stoneHeight / 2; // Posiciona a pedra para que sua base toque o chão
      stone2.rotation.y = Math.random() * Math.PI; // Rotação aleatória para mais naturalidade
      stone2.position.z = z + 5 + Math.random() * 2;

      scene.add(stone2);

    }

    // Renderizar a cena
    renderer.render(scene, camera);

  }


  function createStonePathX(z, x, numStones, pathLength) {
    // Configurações da pedra
    const stoneRadiusTop = 1.8; // Raio superior do cilindro
    const stoneRadiusBottom = 2; // Raio inferior do cilindro para dar um efeito ligeiramente cônico
    const stoneHeight = 0.3; // Altura da pedra
    const stoneSegments = 12; // Número de segmentos para suavizar a pedra

    // Criar as pedras
    const stoneGeometry = new THREE.CylinderGeometry(stoneRadiusTop, stoneRadiusBottom, stoneHeight, stoneSegments);
    const stoneMaterial = new THREE.MeshStandardMaterial({
      color: 0x6666666, // Cor cinza
      map: noiseTexture
    });

    for (let i = 0; i < numStones; i++) {
      const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
      stone.position.z = z + (i / numStones) * pathLength - pathLength / 2 + Math.random() * 1; // Distribuir ao longo do caminho
      stone.position.y = stoneHeight / 2; // Posiciona a pedra para que sua base toque o chão
      stone.rotation.y = Math.random() * Math.PI; // Rotação aleatória para mais naturalidade
      stone.position.x = x - Math.random() * 2;

      scene.add(stone);

      const stone2 = new THREE.Mesh(stoneGeometry, stoneMaterial);

      stone2.position.z = z + (i / numStones) * pathLength - pathLength / 2 + Math.random() * 1; // Distribuir ao longo do caminho
      stone2.position.y = stoneHeight / 2; // Posiciona a pedra para que sua base toque o chão
      stone2.rotation.y = Math.random() * Math.PI; // Rotação aleatória para mais naturalidade
      stone2.position.x = x + 5 + Math.random() * 2;

      scene.add(stone2);

    }

    // Renderizar a cena
    renderer.render(scene, camera);

  }

  function centralTree() {
    // Willow tree arvore com sombras
    const willowTreeHeight = 70;
    const willowTrunkGeo = new THREE.CylinderGeometry(2, 5, willowTreeHeight, 12);
    const willowTrunkMat = new THREE.MeshStandardMaterial({
      color: 0x4A2B0F,
      map: noiseTexture, // Assuming you have a noise texture for bark details
    });
    const willowTrunk = new THREE.Mesh(willowTrunkGeo, willowTrunkMat);
    willowTrunk.castShadow = true;  // Habilitar a projeção de sombras
    willowTrunk.receiveShadow = true;  // Permitir que o objeto receba sombras
    willowTrunk.position.set(0, 0 + willowTreeHeight / 2, 0);
    scene.add(willowTrunk);
    treeTrunkBoundingBox = new THREE.Box3().setFromObject(willowTrunk);


    // Create willow foliage using an IcosahedronGeometry for a more organic look
    const willowLeafGeo = new THREE.IcosahedronGeometry(15, 1);
    const willowLeafMat = new THREE.MeshStandardMaterial({
      color: 0x3DA35D,
      side: THREE.DoubleSide,
      map: noiseTexture, // You can reuse the same noise texture or use a green leafy texture
    });
    const willowLeaves = [];

    // Position multiple leaf clusters to simulate the drooping effect
    for (let i = 0; i < 5; i++) {
      let leaf = new THREE.Mesh(willowLeafGeo, willowLeafMat);
      leaf.position.set(
        0 + Math.random() * 10 - 5, // Random position around the trunk
        0 + willowTreeHeight - i * 5, // Gradually lower the leaves
        0 + Math.random() * 10 - 5
      );
      leaf.rotation.x = Math.random() * Math.PI; // Random rotation for natural look
      leaf.rotation.z = Math.random() * Math.PI;
      leaf.castShadow = true;
      leaf.receiveShadow = true;
      scene.add(leaf);
      willowLeaves.push(leaf);
    }
    willowLeaves.forEach(leaf => {
      let sphere = new THREE.Sphere();
      let box = new THREE.Box3().setFromObject(leaf);
      box.getBoundingSphere(sphere);
      treeLeafBoundingSpheres.push(sphere);
    });
  }


  function createForestEdge() {
    const treeTypes = [
      createNormalTree,
      createWillowTree,
      createOakTree,
      createCherryBlossomTree,
      createPineTree
    ];

    const numTrees = 150; // Número total de árvores nas bordas
    const worldSize = 1500; // Tamanho do mundo
    const edgeDepth = 100; // Profundidade da faixa de floresta
    const halfWorld = worldSize / 2;
    const minDistance = 50; // Distância mínima entre as árvores
    let positions = []; // Armazenar as posições das árvores para verificar a distância

    function isTooClose(x, z) {
      // Verificar se a nova posição está muito próxima de outras árvores
      return positions.some(pos => {
        let dx = pos.x - x;
        let dz = pos.z - z;
        return Math.sqrt(dx * dx + dz * dz) < minDistance;
      });
    }

    for (let i = 0; i < numTrees; i++) {
      let x, y, z;
      let attempts = 0; // Contador para limitar o número de tentativas de encontrar uma posição

      y = 0;
      do {
        // Escolher uma borda aleatoriamente (topo, fundo, esquerda, direita)
        const edgeChoice = Math.floor(Math.random() * 4);
        switch (edgeChoice) {
          case 0: // Borda superior
            x = Math.random() * worldSize - halfWorld;
            z = halfWorld - Math.random() * edgeDepth;
            break;
          case 1: // Borda inferior
            x = Math.random() * worldSize - halfWorld;
            z = -halfWorld + Math.random() * edgeDepth;
            break;
          case 2: // Borda esquerda
            x = -halfWorld + Math.random() * edgeDepth;
            z = Math.random() * worldSize - halfWorld;
            break;
          case 3: // Borda direita
            x = halfWorld - Math.random() * edgeDepth;
            z = Math.random() * worldSize - halfWorld;
            break;
        }
        attempts++;
      } while (isTooClose(x, z) && attempts < 100); // Continuar tentando enquanto estiver muito próximo e não ultrapassar 100 tentativas

      if (attempts < 100) { // Se encontrou uma posição válida
        const treeFunction = treeTypes[Math.floor(Math.random() * treeTypes.length)];
        treeFunction(x, y, z);
        positions.push({ x, z }); // Armazenar posição para futuras verificações
      }
    }
  }


  // trees
  function createNormalTree(x, y, z) {

    const treeHeight = 40 + Math.random() * 80;
    const trunkGeo = new THREE.CylinderGeometry(5, 8 + Math.random() * 4, treeHeight, 8, 1, true);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x695436,
      side: THREE.DoubleSide,
      map: noiseTexture,
    });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(x, y + treeHeight / 2, z);
    scene.add(trunk);

    const leafGeo = new THREE.BoxGeometry(20 + Math.random() * 30, 20 + Math.random() * 30, 20 + Math.random() * 30);
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x68cc7a,
      map: noiseTexture,
    });
    const leaf1 = new THREE.Mesh(leafGeo, leafMat);
    leaf1.position.set(x, y + treeHeight, z);
    leaf1.rotation.x = Math.random() * Math.PI;
    leaf1.rotation.z = Math.random() * Math.PI;
    scene.add(leaf1);

    const leaf2 = new THREE.Mesh(leafGeo, leafMat);
    leaf2.position.set(x + 3, y + treeHeight, z + 1);
    leaf2.rotation.x = Math.random() * Math.PI;
    leaf2.rotation.z = Math.random() * Math.PI;
    scene.add(leaf2);

    const leaf3 = new THREE.Mesh(leafGeo, leafMat);
    leaf3.position.set(x - 3, y + treeHeight, z + 1);
    leaf3.rotation.x = Math.random() * Math.PI;
    leaf3.rotation.z = Math.random() * Math.PI;
    scene.add(leaf3);
  }

  // Willow tree

  function createWillowTree(x, y, z) {

    const willowTreeHeight = 50 + Math.random() * 100;
    const willowTrunkGeo = new THREE.CylinderGeometry(2, 8 + Math.random() * 2, willowTreeHeight, 12);
    const willowTrunkMat = new THREE.MeshStandardMaterial({
      color: 0x4A2B0F,
      map: noiseTexture, // Assuming you have a noise texture for bark details
    });
    const willowTrunk = new THREE.Mesh(willowTrunkGeo, willowTrunkMat);
    willowTrunk.position.set(x, y + willowTreeHeight / 2, z);
    scene.add(willowTrunk);

    // Create willow foliage using an IcosahedronGeometry for a more organic look
    const willowLeafGeo = new THREE.IcosahedronGeometry(15 + Math.random() * 30, 1);
    const willowLeafMat = new THREE.MeshStandardMaterial({
      color: 0x3DA35D,
      side: THREE.DoubleSide,
      map: noiseTexture, // You can reuse the same noise texture or use a green leafy texture
    });
    const willowLeaves = [];

    // Position multiple leaf clusters to simulate the drooping effect
    for (let i = 0; i < 5; i++) {
      let leaf = new THREE.Mesh(willowLeafGeo, willowLeafMat);
      leaf.position.set(
        x + Math.random() * 10 - 5, // Random position around the trunk
        y + willowTreeHeight - i * 5, // Gradually lower the leaves
        z + Math.random() * 10 - 5
      );
      leaf.rotation.x = Math.random() * Math.PI; // Random rotation for natural look
      leaf.rotation.z = Math.random() * Math.PI;
      scene.add(leaf);
      willowLeaves.push(leaf);
    }
  }

  function createOakTree(x, y, z) {

    const oakTreeHeight = 150 + Math.random() * 150; // Total height of the tree
    const trunkHeight = oakTreeHeight * 0.3; // The trunk is 30% of the height of the tree
    const trunkRadiusTop = 1.5 + Math.random() * 2; // Top radius of the trunk
    const trunkRadiusBottom = 2.5 + Math.random() * 8; // Bottom radius of the trunk
    const trunkGeo = new THREE.CylinderGeometry(trunkRadiusTop, trunkRadiusBottom, trunkHeight, 16);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x8B4513, // A rich brown color for the trunk
      map: noiseTexture, // Assuming you have a noise texture for bark details
    });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(x, y + trunkHeight / 2, z);
    scene.add(trunk);

    // Create foliage using SphereGeometry to simulate the rounded, dense canopy of an oak tree
    const canopyRadius = 20 + Math.random() * 30 // Radius of the oak tree canopy
    const canopyGeo = new THREE.SphereGeometry(canopyRadius, 16, 16);
    const canopyMat = new THREE.MeshStandardMaterial({
      color: 0x228B22, // A lush green color
      map: noiseTexture, // You can reuse the same noise texture or use a green leafy texture
    });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(x, y + trunkHeight + canopyRadius * 0.6, z); // Position the canopy slightly above the trunk
    scene.add(canopy);
  }

  function createCherryBlossomTree(x, y, z) {

    const treeHeight = 80 + Math.random() * 90; // Total height of the tree
    const trunkHeight = treeHeight * 0.5; // The trunk is 50% of the tree's height
    const trunkRadius = 3 + Math.random() * 5; // Radius of the trunk
    const trunkGeo = new THREE.CylinderGeometry(trunkRadius, trunkRadius, trunkHeight, 12);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x8B4513, // A dark brown color for the trunk
      map: noiseTexture, // Assuming you have a noise texture for bark details
    });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(x, y + trunkHeight / 2, z);
    scene.add(trunk);

    // Create cherry blossoms using SphereGeometry with small particles
    const blossomCount = 100 + treeHeight / 4; // Total number of blossoms
    const blossomGeo = new THREE.SphereGeometry(10 + Math.random() * 20, 8, 8); // Small spheres for blossoms
    const blossomMat = new THREE.MeshStandardMaterial({
      color: 0xFFB7C5, // A soft pink color for the blossoms
      map: noiseTexture,

    });

    for (let i = 0; i < blossomCount; i++) {
      const blossom = new THREE.Mesh(blossomGeo, blossomMat);
      const angle = Math.random() * Math.PI * 2; // Random angle for horizontal spread
      const height = y + trunkHeight + (Math.random() * treeHeight * 0.5); // Random height above the trunk
      const distance = 2 + (Math.random() * 15); // Random distance from trunk center
      blossom.position.set(
        x + Math.cos(angle) * distance,
        height,
        z + Math.sin(angle) * distance
      );
      scene.add(blossom);
    }
  }


  function createPineTree(x, y, z) {

    const pineTreeHeight = 100 + Math.random() * 150; // Total height of the tree
    const trunkHeight = pineTreeHeight * 0.25; // The trunk is 1/4 the height of the tree
    const trunkRadiusTop = 2 + Math.random() * 2; // Top radius of the trunk
    const trunkRadiusBottom = 5 + Math.random() * 3; // Bottom radius of the trunk
    const trunkGeo = new THREE.CylinderGeometry(trunkRadiusTop, trunkRadiusBottom, trunkHeight, 12);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x8B4513, // A dark brown color for the trunk
      map: noiseTexture, // Assuming you have a noise texture for bark details
    });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(x, y + trunkHeight / 2, z);
    scene.add(trunk);

    // Create foliage using ConeGeometry to simulate the layered branches of a pine tree
    const foliageLevels = 4 + Math.random() * 3; // Number of foliage layers
    const maxRadius = 20 + Math.random() * 40; // Maximum radius at the base of the foliage
    const foliageHeight = (pineTreeHeight - trunkHeight) / foliageLevels - 1; // Height of each foliage layer

    for (let i = 0; i < foliageLevels; i++) {
      const radius = maxRadius * ((foliageLevels - i) / foliageLevels); // Decrease radius for upper layers
      const foliageGeo = new THREE.ConeGeometry(radius, foliageHeight + 3, 6);
      const foliageMat = new THREE.MeshStandardMaterial({
        color: 0x228B22, // A rich green color
        map: noiseTexture, // You can reuse the same noise texture or use a green leafy texture
      });
      const foliage = new THREE.Mesh(foliageGeo, foliageMat);
      foliage.position.set(
        x,
        y + trunkHeight + (i * foliageHeight + foliageHeight / 2),
        z
      );
      scene.add(foliage);
    }
  }


  function createCloud() {
    const cloud = new THREE.Group(); // Cria um grupo para manter as partes da nuvem

    const parts = Math.floor(Math.random() * 2) + 1; // 3 a 7 partes por nuvem
    for (let i = 0; i < parts; i++) {
      const radius = Math.random() * 50 + 20; // Tamanhos variados
      const cloudGeo = new THREE.IcosahedronGeometry(radius, 1); // Mais detalhes
      const cloudMat = new THREE.MeshStandardMaterial({
        color: 0xffffff, transparent: true,
        opacity: Math.random() * 0.3 + 0.05
      });
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
    for (let i = 0; i < 80; i++) { // Menos nuvens, mas mais complexas
      const cloud = createCloud();
      const x = Math.random() * 1700 - 1000;
      const y = Math.random() * layerDistribution + layerHeight;
      const z = Math.random() * 1700 - 1000;
      cloud.position.set(x, y, z);
      scene.add(cloud);
      clouds.push(cloud); // Adiciona a nuvem ao array
    }
  }

  function animateClouds() {
    requestAnimationFrame(animateClouds);

    clouds.forEach(cloud => {
      cloud.position.x += 0.1; // Move a nuvem na direção x
      // Adicione mais movimento se desejar, por exemplo:
      // cloud.position.y += 0.01;
      // cloud.position.z += 0.01;
    });

    renderer.render(scene, camera); // Renderiza a cena novamente
  }


}


function animate() {
  requestAnimationFrame(animate);
  updateParticles(particleSystem1);
  updateParticles(particleSystem2);

  // Calculate the forward direction vector of the camera
  const direction = new THREE.Vector3(0, 0, -1);
  direction.applyQuaternion(camera.quaternion);

  const moveDistance = controls.movementSpeed * 0.1;
  const potentialPosition = camera.position.clone().add(direction.multiplyScalar(moveDistance));

  const collisionResult = checkCollision(potentialPosition);
  if (!collisionResult.collided) {
    controls.update(0.1);  // Update normally if no collision
  } else {
    // Adjust the camera position to slide along the collision surface
    slideAlongCollisionSurface(direction, moveDistance, collisionResult.normal);
  }

  duck.rotation.y += 0.01;
  renderer.render(scene, camera);
}

function slideAlongCollisionSurface(direction, moveDistance, collisionNormal) {
  // Calcula a componente do vetor de movimento que está na direção da normal
  const movementComponentAlongNormal = direction.clone().projectOnVector(collisionNormal);

  // Calcula a direção de deslizamento subtraindo a componente ao longo da normal da direção original
  let slideDirection = direction.clone().sub(movementComponentAlongNormal);

  // Verifica se o deslizamento ainda aponta na direção original do movimento
  if (slideDirection.dot(direction) > 0) {
    // Se sim, inverte a direção para garantir que não estamos indo em direção ao obstáculo
    slideDirection.negate();
  }

  // Normaliza a direção de deslizamento para manter a velocidade constante e multiplica pela distância de movimento
  const safePosition = camera.position.clone().add(slideDirection.normalize().multiplyScalar(moveDistance));

  // Atualiza a posição da câmera para a nova posição segura
  camera.position.copy(safePosition);
}


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}



function checkCollision(newPosition) {
  if (treeTrunkBoundingBox.containsPoint(newPosition)) {
    return { collided: true, normal: calculateNormalForBoundingBox(treeTrunkBoundingBox, newPosition) };
  }
  for (let sphere of treeLeafBoundingSpheres) {
    if (newPosition.distanceTo(sphere.center) < sphere.radius) {
      const normal = new THREE.Vector3().subVectors(newPosition, sphere.center).normalize();
      return { collided: true, normal: normal };
    }
  }
  return { collided: false };
}

function calculateNormalForBoundingBox(box, point) {
  // A simple approximation for a bounding box normal could be based on the nearest face
  // This is a placeholder function. Proper calculation would depend on the specific geometry.
  const closestPoint = new THREE.Vector3().copy(point).clamp(box.min, box.max);
  return new THREE.Vector3().subVectors(point, closestPoint).normalize();
}

// Animation function to update particles
function updateParticles(particleSystem) {
  const positions = particleSystem.geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 1] -= 0.1; // Move each particle down
    if (positions[i + 1] < 0) {
      positions[i + 1] += 50; // Reset particles to top when they reach bottom
    }
  }
  particleSystem.geometry.attributes.position.needsUpdate = true;
}