import { App } from "./App";
import debounce from "debounce";
import positions from "./trees.elevation.normalized.short.js";

let config = {
  // instances per thingy
  nInstances: 2000,
  positions: positions,
  scale: 1
};

const container = document.getElementById("app");
const myApp = new App(container, config);
myApp.init();

let less = document.getElementById("less");
let more = document.getElementById("more");
let evenLess = document.getElementById("even-less");
let evenMore = document.getElementById("even-more");
let countEle = document.getElementById("count");
let switchEle = document.getElementById("switch");

let restart = debounce(myApp.restart, 400);

countEle.innerText = config.nInstances;
let addInstances = count => {
  config.nInstances += count;
  config.nInstances = Math.max(500, config.nInstances);
  config.nInstances = Math.min(positions.length / 3, config.nInstances);
  countEle.innerText = config.nInstances;
  restart();
};
let handleLess = () => {
  addInstances(-5000);
};

let handleEvenLess = () => {
  addInstances(-20000);
};
let handleMore = () => {
  addInstances(5000);
};
let handleEvenMore = () => {
  addInstances(20000);
};

less.addEventListener("click", handleLess);
more.addEventListener("click", handleMore);
evenLess.addEventListener("click", handleEvenLess);
evenMore.addEventListener("click", handleEvenMore);
if (module && module.hot) {
  // module.hot.accept((a, b) => {
  //   // For some reason having this function here makes dat gui work correctly
  //   // when using hot module replacement
  // });
  module.hot.dispose(() => {
    less.removeEventListener("click", handleLess);
    more.removeEventListener("click", handleMore);
    evenLess.removeEventListener("click", handleEvenLess);
    evenMore.removeEventListener("click", handleEvenMore);
    switchEle.removeEventListener("click", handleSwitch);
    if (myApp) myApp.dispose();
  });
}
