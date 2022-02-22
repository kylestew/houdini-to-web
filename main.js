import "./style.css";

import * as THREE from "three";
import Stats from "stats.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";

import { createScene as bunnyScene } from "./scenes/bunny";
import { createScene as virusScene } from "./scenes/virus";

const app = init();
app.nextScene();

document.getElementById("next").onclick = function changeContent() {
  app.nextScene();
};
document.getElementById("prev").onclick = function changeContent() {
  app.nextScene(true);
};

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

      scene.appendPost(composer, size);
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

  const scenes = [bunnyScene(renderer), virusScene(renderer)];
  let sceneIdx = -1;

  function nextScene(backwards = false) {
    if (scene) {
      console.log("pausing scene", sceneIdx);
      scene.pause();
    }

    sceneIdx += backwards ? -1 : 1;
    if (sceneIdx >= scenes.length) sceneIdx = 0;
    scene = scenes[sceneIdx];

    console.log("preparing scene ", sceneIdx);
    scene.prepare();
    console.log("begin scene ", sceneIdx);
    scene.begin(camera);
    createPostWorkflow([window.innerWidth, window.innerHeight]);
  }

  render();

  return {
    nextScene,
  };
}
