import "./style.css";

import * as THREE from "three";
import Stats from "stats.js";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import gltfUrl from "/assets/abstract.gltf?url";
// import gltfUrl from "/assets/from_blender.glb?url";

init();

function init() {
  const container = document.getElementById("container");

  const stats = new Stats();
  container.appendChild(stats.dom);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  const pmremGenerator = new THREE.PMREMGenerator(renderer);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbfe3dd);
  scene.environment = pmremGenerator.fromScene(
    new RoomEnvironment(),
    0.04
  ).texture;

  const camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    100
  );
  camera.position.set(5, 2, 8);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();
  controls.enablePan = false;
  controls.enableDamping = true;

  let mixer;
  let clock = new THREE.Clock();

  function loadScene() {
    const loader = new GLTFLoader();
    loader.load(
      gltfUrl,
      (gltf) => {
        console.log(gltf);
        // console.log(gltf.scene.children[0].material);
        // const materials = await gltf.parser.getDependencies("material");
        // console.log(materials);
        scene.add(gltf.scene);

        // mixer = new THREE.AnimationMixer(gltf.scene);
        // mixer.clipAction(gltf.animations[0]).play();

        animate();
      },
      undefined,
      function (e) {
        console.err(e);
      }
    );
  }
  loadScene();

  window.onresize = function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    // mixer.update(delta);

    controls.update();
    stats.update();

    renderer.render(scene, camera);
  }
}
