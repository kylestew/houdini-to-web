import * as THREE from "three";

import { loadEnvironmentMap, loadLUT, loadModel } from "./loaders";

import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import { LUTPass } from "three/examples/jsm/postprocessing/LUTPass.js";

import lutUrl from "/assets/luts/Everyday_Pro_Color.cube?url";
import hdr from "/assets/hdrs/Barce_Rooftop_C_3k.hdr?url";
import gltfUrl from "/assets/virus.gltf?url";

function createScene(renderer) {
  const scene = new THREE.Scene();
  let model, lut, envMap;

  const prepare = async () => {
    envMap = await loadEnvironmentMap(hdr);
    lut = await loadLUT(lutUrl);

    scene.background = new THREE.Color(0xbfe3dd);
    scene.environment = envMap;
  };

  const begin = async (camera) => {
    model = await loadModel(gltfUrl);

    // rotate to face HDR
    model.scene.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    scene.add(model.scene);

    camera.position.set(3, 0.5, -3);
  };

  const pause = () => {
    // clear the model to save memory
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
    model = null;
  };

  const appendPost = (composer, size) => {
    const [width, height] = size;

    let fxaaPass = new ShaderPass(FXAAShader);
    const pixelRatio = renderer.getPixelRatio();
    fxaaPass.material.uniforms["resolution"].value.x = 1 / (width * pixelRatio);
    fxaaPass.material.uniforms["resolution"].value.y =
      1 / (height * pixelRatio);
    composer.addPass(fxaaPass);

    composer.addPass(new ShaderPass(GammaCorrectionShader));

    if (lut) {
      let lutPass = new LUTPass();
      lutPass.lut = lut.texture3D;
      lutPass.intensity = 1.0;
      lutPass.enabled = true;
      composer.addPass(lutPass);
    }
  };

  return {
    scene,
    prepare,
    begin,
    pause,
    appendPost,
  };
}

export { createScene };
