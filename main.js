import "./style.css";

import * as THREE from "three";
import Stats from "stats.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";

import { bunnyScene } from "./scenes/bunny";

init();

function init() {
  const container = document.getElementById("container");

  const stats = new Stats();
  container.appendChild(stats.dom);

  const renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.physicallyCorrectLights = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(
    52,
    window.innerWidth / window.innerHeight,
    1,
    100
  );
  camera.position.set(3, 0.5, -3);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();
  controls.enablePan = false;
  controls.enableDamping = true;

  var scene;
  var composer;
  function createPostWorkflow(size) {
    if (scene) {
      const renderPass = new RenderPass(scene.scene, camera);
      composer = new EffectComposer(renderer);
      composer.addPass(renderPass);

      scene.appendPostWorkflow(composer, size);
    }
  }

  function resizeWindow() {
    let size = [window.innerWidth, window.innerHeight];

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (composer) {
      composer.setSize(window.innerWidth, window.innerHeight);
    }
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // rebuild for size
    createPostWorkflow(size);
  }
  resizeWindow();

  window.onresize = function () {
    resizeWindow();
  };

  function render() {
    requestAnimationFrame(render);

    controls.update();
    stats.update();

    if (scene) {
      composer.render(scene.scene, camera);
    }
  }

  // load initial scene
  scene = bunnyScene(renderer);
  scene.prepare();
  createPostWorkflow([window.innerWidth, window.innerHeight]);
  render();
}
