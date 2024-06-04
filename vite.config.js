import { defineConfig } from 'vite'

export default defineConfig({
    base: '/', // Adjust this if your project is served from a subdirectory
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                counter: './counter.js', // Ponto de entrada para o arquivo index.js
                script: './script.js', // Ponto de entrada para o arquivo index.js
                main: './main.js',    // Ponto de entrada para o arquivo main.js
                firstperson: './js/FirstPersonControls.js',
                gltf: './js/GLTFLoader.js',
                orbit: './js/OrbitControls.js',
                three: './js/three.min.js',
                sky: './js/Sky.js',
            }
        }
    }
})