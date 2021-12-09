import "./styles.css";
import * as THREE from "three";
import { OrbitBasic } from "./OrbitBasic";
import { Cones } from "./map";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import positions from "./trees.elevation.normalized.json";

export class App extends OrbitBasic {
  constructor(container, config) {
    super(container);
    this.config = config;
    this.camera.position.z = 50;
    this.camera.position.y = 50;
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.text = new Text(this);
    this.cones = new Cones(config, positions, [
      new THREE.Color("#005A04"),
      new THREE.Color("#CCFFBB"),
      new THREE.Color("#3A5F0B"),
      new THREE.Color("#005502,")
    ]);
    this.scene.background = new THREE.Color("#1d2132");

    this.restart = this.restart.bind(this);
  }
  restart() {
    this.cones.clean();
    this.cones.init();
  }
  dispose() {
    this.disposed = true;
    this.scene.dispose();
  }
  init() {
    this.cones.init();
    this.scene.add(this.cones);

    this.tick();
  }
}
