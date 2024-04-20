import * as THREE from 'three';

// Criar a cena, câmera e renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Adicionar luz
const light = new THREE.HemisphereLight(0xffffff, 0x444444);
light.position.set(0, 200, 0);
scene.add(light);

// Adicionar chão
const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x888888, depthWrite: false });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -50;
scene.add(plane);

// Posicionar a câmera
camera.position.set(0, 100, 200000);

// Adicionar céu (usando um cubo grande para simplicidade)
const skyGeometry = new THREE.BoxGeometry(5000, 5000, 5000);
const skyMaterial = new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide });
const skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(skyBox);

// Função de animação
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
