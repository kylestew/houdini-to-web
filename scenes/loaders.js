import * as THREE from "three";

import { LUTCubeLoader } from "three/examples/jsm/loaders/LUTCubeLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const loadModel = (gltfUrl) => {
  return new Promise((resolve) => {
    new GLTFLoader().load(
      gltfUrl,
      (gltf) => {
        resolve(gltf);
      },
      undefined,
      function (e) {
        console.err(e);
      }
    );
  });
};

function loadEnvironmentMap(url) {
  return new RGBELoader().load(url, (envMap) => {
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    return envMap;
  });
}

function loadLUT(lutUrl) {
  return new Promise((resolve) => {
    new LUTCubeLoader().load(lutUrl, (lut) => {
      return resolve(lut);
    });
  });
}

export { loadLUT, loadEnvironmentMap, loadModel };
