import "./style.css";

import * as THREE from "three";

init();

function init() {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  console.log(renderer);
}
