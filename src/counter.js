import * as THREE from 'three';

// Criar a cena
const scene = new THREE.Scene();

// Criar a câmera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Criar o renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Criar um cubo
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Posicionar a câmera
camera.position.z = 5;

// Função de animação
function animate() {
    requestAnimationFrame(animate);

    // Rotacionar o cubo
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Renderizar a cena
    renderer.render(scene, camera);
}

animate();
