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
  camera.position.z = 30;
  camera.position.y = 10;
  // camera.zoom = 3;


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
  directionalLight.shadow.camera.near = 0.5;
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



  cloudLayer(250, 100);
  cloudLayer(150, 200);


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


  createForestEdge();

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
    const willowTrunkGeo = new THREE.CylinderGeometry(2, 8 + Math.random() * 10, willowTreeHeight, 12);
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
    const trunkRadiusTop = 2; // Top radius of the trunk
    const trunkRadiusBottom = 5 + Math.random() * 5; // Bottom radius of the trunk
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
      const foliageGeo = new THREE.ConeGeometry(radius, foliageHeight + 3, 16);
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
    }
  }

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