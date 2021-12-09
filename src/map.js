import * as THREE from "three";

let fragmentShader = `
varying vec3 vColor;

void main(){
  vec3 color = vColor;
  gl_FragColor = vec4(color, 1.);
}
`;

let vertexShader = `
#define PI 3.14159265359
attribute vec3 aPos;

attribute vec3 aColor;
varying vec3 vColor;

void main(){
  vec3 transformed = position.xyz;
  transformed += aPos * 50.;
  transformed.z *= -1.;
  gl_Position = projectionMatrix* modelViewMatrix * vec4(transformed, 1.);

  vColor = aColor;
}
`;

let baseCube = new THREE.ConeGeometry(0.03, 0.03, 3);
export class Spheres extends THREE.Mesh {
  constructor(config, positions, colors) {
    super();
    this.config = config;
    this.positions = positions;
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
    let instancedGeometry = new THREE.InstancedBufferGeometry().copy(baseCube);

    this.uniforms.uScale.value = this.config.scale;
    let instanceCount = this.config.nInstances;
    instancedGeometry.maxInstancedCount = instanceCount;
    let aColor = [];

    for (let i = 0; i < instanceCount; i++) {
      let color = this.colors[Math.floor(Math.random() * this.colors.length)];
      aColor.push(color.r, color.g, color.b);
    }

    let aPosFloat32 = new Float32Array(this.positions.slice(0, instanceCount * 3));
    instancedGeometry.addAttribute(
      "aPos",
      new THREE.InstancedBufferAttribute(aPosFloat32, 3, false),
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
