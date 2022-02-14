import "./style.css";

import * as THREE from "three";
import Stats from "stats.js";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import gltfUrl from "/assets/abstract01.glb?url";

init();

function init() {
  const container = document.getElementById("container");

  const stats = new Stats();
  container.appendChild(stats.dom);

  const clock = new THREE.Clock();

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

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

  //lights
  const sphere = new THREE.SphereGeometry(0.5, 16, 8);

  let light1 = new THREE.PointLight(0xff0040, 2, 50);
  scene.add(light1);
  let light2 = new THREE.PointLight(0x0040ff, 2, 50);
  scene.add(light2);
  let light3 = new THREE.PointLight(0x80ff80, 2, 50);
  scene.add(light3);
  let light4 = new THREE.PointLight(0xffaa00, 2, 50);
  scene.add(light4);

  let object;
  function loadScene() {
    new GLTFLoader().load(gltfUrl, async (gltf) => {
      const materials = await gltf.parser.getDependencies("material");

      // TODO: massage materials
      materials.forEach((material) => {
        // if (material.name == "translucent") {
        material.side = THREE.DoubleSide;
        console.log(material);
        // }
      });

      object = gltf.scene;
      scene.add(object);

      animate();
    });
  }
  loadScene();

  window.onresize = function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  function animate() {
    requestAnimationFrame(animate);

    controls.update();
    stats.update();

    render();
  }

  function render() {
    const time = Date.now() * 0.0005;
    const delta = clock.getDelta();

    if (object) {
      object.rotation.y -= 0.5 * delta;
      // object.rotation.x -= 0.05 * delta;
    }

    light1.position.x = Math.sin(time * 0.7) * 10;
    light1.position.y = Math.cos(time * 0.5) * 20;
    light1.position.z = Math.cos(time * 0.3) * 10;

    light2.position.x = Math.cos(time * 0.3) * 10;
    light2.position.y = Math.sin(time * 0.5) * 20;
    light2.position.z = Math.sin(time * 0.7) * 10;

    light3.position.x = Math.sin(time * 0.7) * 10;
    light3.position.y = Math.cos(time * 0.3) * 20;
    light3.position.z = Math.sin(time * 0.5) * 10;

    light4.position.x = Math.sin(time * 0.3) * 10;
    light4.position.y = Math.cos(time * 0.7) * 20;
    light4.position.z = Math.sin(time * 0.5) * 10;

    renderer.render(scene, camera);
  }
}
