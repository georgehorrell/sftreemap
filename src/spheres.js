import * as THREE from "three";
import random from "random";
import aPos from "./all.json";

let fragmentShader = `
varying vec3 vColor;

void main(){
  vec3 color = vColor;
  gl_FragColor = vec4(color, 1.);
}
`;

let vertexShader = `
#define PI 3.14159265359
attribute vec2 aPos;

attribute vec3 aColor;
varying vec3 vColor;

void main(){
  vec3 transformed = position.xyz;
  transformed.x += aPos.x * 50.;
  transformed.z += aPos.y * 50.;
  gl_Position = projectionMatrix* modelViewMatrix * vec4(transformed, 1.);

  vColor = aColor;
}
`;

let baseGeometry = new THREE.SphereBufferGeometry(0.05, 8, 8);
let baseCube = new THREE.BoxBufferGeometry(1, 1, 1);
export class Spheres extends THREE.Mesh {
  constructor(config, colors) {
    super();
    this.config = config;
    this.colors = colors;
    this.uniforms = {
      uScale: new THREE.Uniform(config.scale)
    };
    let material = new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms: this.uniforms
    });
    this.material = material;
  }
  init() {
    let instancedGeometry = new THREE.InstancedBufferGeometry().copy(
      this.config.useCube ? baseCube : baseGeometry
    );

    this.uniforms.uScale.value = this.config.scale;
    let instanceCount = this.config.nInstances;
    instancedGeometry.maxInstancedCount = instanceCount;
    let aColor = [];

    for (let i = 0; i < instanceCount; i++) {
      let color = this.colors[Math.floor(Math.random() * this.colors.length)];
      aColor.push(color.r, color.g, color.b);
    }

    let aPosFloat32 = new Float32Array(aPos.slice(0, instanceCount * 2));
    console.log(aPosFloat32.length);
    instancedGeometry.addAttribute(
      "aPos",
      new THREE.InstancedBufferAttribute(aPosFloat32, 2, false),
    );

    instancedGeometry.addAttribute(
      "aColor",
      new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3, false)
    );

    // Ignore this. Just to fix the lag of rendering all the spheres in the same position

    this.geometry = instancedGeometry;
  }
  clean() {
    this.geometry.dispose();
  }
  dispose() {
    this.geometry.dispose();
    baseGeometry.dispose();
    this.material.dispose();
  }
}
