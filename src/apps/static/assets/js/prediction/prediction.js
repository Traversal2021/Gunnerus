import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@0.138.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://unpkg.com/three@0.138.0/examples/jsm/loaders/GLTFLoader";
import Stats from "https://unpkg.com/three@0.138.0/examples/jsm/libs/stats.module";
import { Water } from "https://unpkg.com/three@0.138.0/examples/jsm/objects/Water.js";

let scene, renderer, camera, stats;
let model, mixer, clock, water;
let DoubleLink1, DoubleLink2, YawSupport1, LoadCellHook;
let Tele11, Tele2, Tele3, Tele4, Tele5, Tele6, Tele7;

let double_link1_data;
let double_link2_data;
let yaw_support_data;
let tele_data;

let topic_list = [
  "double_link1",
  "double_link2",
  "yaw_support",
  "load_cell_hook",
  "tele",
];

var plots = [];

let plot_name = {
  double_link1: "double_link1",
  double_link2: "double_link2",
  yaw_support: "yaw_support",
  load_cell_hook: "load_cell_hook",
  tele: "tele",
};

let plot_unit = {
  double_link1: "degrees",
  double_link2: "degrees",
  yaw_support: "degrees",
  load_cell_hook: "decimeter",
  tele: "decimeter",
};

let plot_data = {
  double_link1: {},
  double_link2: {},
  yaw_support: {},
  load_cell_hook: {},
  tele: {},
};

const api_url = "http://10.24.92.185:9000/crane/real_time_data";

function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

const parameters3 = {
  Double_Link_1: -56,
  Double_Link_2: -153,
  Yaw_Support_1: 0,
  Load_Cell_Hook: 0,
  Tele: -2100,
};

const allActions = [];
const baseActions = {
  Full_Ship: { weight: 1 },
  Engine: { weight: 0 },
  Propeller: { weight: 0 },
};
const additiveActions = {
  Base_Joint: { weight: 0 },
  Second_Joint: { weight: 0 },
  Third_Joint: { weight: 0 },
  Boom_Length: { weight: 0 },
};
let numAnimations;

let pox1 = additiveActions.Base_Joint.weight;

init();

function init() {
  const container = document.getElementById("container");
  clock = new THREE.Clock();

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);
  scene.fog = new THREE.Fog(0xa0a0a0, 20, 100);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(3, 10, 10);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 2;
  dirLight.shadow.camera.bottom = -2;
  dirLight.shadow.camera.left = -2;
  dirLight.shadow.camera.right = 2;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 40;
  scene.add(dirLight);

  // ground
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);

  // Water
  const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
  water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load(
      water_path,
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    ),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 3.7,
    fog: scene.fog !== undefined,
  });
  water.rotation.x = -Math.PI / 2;
  scene.add(water);

  const loader = new GLTFLoader();
  loader.load(model_path, function (gltf) {
    model = gltf.scene;
    model.position.set(8, pox1 - 3.5, 1);
    scene.add(model);
    DoubleLink1 = model.getObjectByName("DoubleLink1");
    DoubleLink2 = model.getObjectByName("DoubleLink2");
    YawSupport1 = model.getObjectByName("YawSupport1");
    LoadCellHook = model.getObjectByName("LoadCellHook");
    Tele11 = model.getObjectByName("Tele11");
    Tele2 = model.getObjectByName("Tele2");
    Tele3 = model.getObjectByName("Tele3");
    Tele4 = model.getObjectByName("Tele4");
    Tele5 = model.getObjectByName("Tele5");
    Tele6 = model.getObjectByName("Tele6");
    Tele7 = model.getObjectByName("Tele7");

    DoubleLink1.rotation.set(
      0,
      degrees_to_radians(parameters3.Double_Link_1),
      0
    );
    DoubleLink2.rotation.set(
      0,
      degrees_to_radians(parameters3.Double_Link_2),
      0
    );
    LoadCellHook.quaternion.set(0, 0, 0, 0);
    LoadCellHook.setRotationFromQuaternion(1.0472);
    Tele11.position.set(-2100, 0, 0);
    Tele2.position.set(-2100, 0, 0);
    Tele3.position.set(-2100, 0, 0);
    Tele4.position.set(-2100, 0, 0);
    Tele5.position.set(-2100, 0, 0);
    Tele6.position.set(-2100, 0, 0);
    Tele7.position.set(-2100, 0, 0);

    model.traverse(function (object) {
      if (object.isMesh) object.castShadow = true;
    });

    const animations = gltf.animations;
    mixer = new THREE.AnimationMixer(model);
    numAnimations = animations.length;

    for (let i = 0; i !== numAnimations; ++i) {
      let clip = animations[i];
      const name = clip.name;

      if (baseActions[name]) {
        const action = mixer.clipAction(clip);
        activateAction(action);
        baseActions[name].action = action;
        allActions.push(action);
      } else if (additiveActions[name]) {
        // Make the clip additive and remove the reference frame

        THREE.AnimationUtils.makeClipAdditive(clip);

        if (clip.name.endsWith("_pose")) {
          clip = THREE.AnimationUtils.subclip(clip, clip.name, 2, 3, 30);
        }

        const action = mixer.clipAction(clip);
        activateAction(action);
        additiveActions[name].action = action;
        allActions.push(action);
      }
    }

    // initialize_graph(plot_data);

    animate();
  });

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // camera
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    500
  );
  camera.position.set(-10, 40, 40);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableZoom = true;
  controls.minDistance = 20;
  controls.maxDistance = 50;
  controls.target.set(0, 0, 0);
  controls.update();

  stats = new Stats();
  container.appendChild(stats.dom);

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  // Render loop

  requestAnimationFrame(animate);

  for (let i = 0; i !== numAnimations; ++i) {
    const action = allActions[i];
    const clip = action.getClip();
    const settings = baseActions[clip.name] || additiveActions[clip.name];
    settings.weight = action.getEffectiveWeight();
  }

  // Get the time elapsed since the last frame, used for mixer update

  const mixerUpdateDelta = clock.getDelta();

  // Update the animation mixer, the stats panel, and render this frame

  mixer.update(mixerUpdateDelta);

  stats.update();

  getiss();

  renderer.render(scene, camera);
  water.material.uniforms["time"].value += 1.0 / 60.0;
}

// function initialize_graph(plot_data) {
//   const charts_element = document.getElementById("graph_container");

//   while (charts_element.firstChild) {
//     charts_element.removeChild(charts_element.lastChild);
//   }

//   for (var i = 0; i < Object.keys(plot_data).length; i++) {
//     const figure = document.createElement("div");

//     figure.id = "figure" + i;

//     plots.push(figure);

//     // Append to body:
//     charts_element.appendChild(figure);

//     var layout = {
//       title: {
//         text: plot_name[topic_list[i]],
//         font: {
//           family: "Courier New, monospace",
//           size: 20,
//         },
//         xref: "paper",
//         x: 0.05,
//       },
//       xaxis: {
//         title: {
//           text: "Time",
//           font: {
//             family: "Courier New, monospace",
//             size: 14,
//             color: "#7f7f7f",
//           },
//         },
//       },
//       yaxis: {
//         title: {
//           text: plot_unit[topic_list[i]],
//           font: {
//             family: "Courier New, monospace",
//             size: 14,
//             color: "#7f7f7f",
//           },
//         },
//       },
//     };

//     Plotly.newPlot(figure, [{ y: [0], x: [new Date()] }], layout);
//   }
// }

async function getiss() {
  const response = await fetch(api_url);
  const data = await response.json();

  for (var i = 0; i < Object.keys(plot_data).length; i++) {
    plot_data[topic_list[i]][data[0].crane[topic_list[i]][1]] =
      data[0].crane[topic_list[i]][0];
    // .x.push(data[0].crane[topic_list[i]][1]);
    // plot_data[topic_list[i]].y.push(data[0].crane[topic_list[i]][0]);
  }

  UpdateGraph(plot_data);

  double_link1_data = data[0].crane.double_link1[0];
  double_link2_data = -data[0].crane.double_link2[0];
  yaw_support_data = data[0].crane.yaw_support[0];
  if (yaw_support_data == "None") {
    yaw_support_data = 0;
  }
  tele_data = data[0].crane.tele - 2000;

  DoubleLink1.rotation.set(0, degrees_to_radians(double_link1_data), 0);
  DoubleLink2.rotation.set(0, degrees_to_radians(double_link2_data), 0);
  YawSupport1.rotation.set(0, 0, degrees_to_radians(yaw_support_data));
  Tele11.position.set(tele_data, 0, 0);
  Tele2.position.set(tele_data, 0, 0);
  Tele3.position.set(tele_data, 0, 0);
  Tele4.position.set(tele_data, 0, 0);
  Tele5.position.set(tele_data, 0, 0);
  Tele6.position.set(tele_data, 0, 0);
  Tele7.position.set(tele_data, 0, 0);
}

// function UpdateGraph(data) {
//   for (var i = 0; i < Object.keys(data).length; i++) {
//     var figure = "figure" + i;

//     var x = Object.keys(data[topic_list[i]]);
//     var y = Object.values(data[topic_list[i]]);
//     console.log(x);

//     Plotly.animate(
//       figure,
//       {
//         data: [{ y: y, x: x, type: "scatter" }],
//       },
//       {
//         transition: {
//           duration: 0,
//           easing: "cubic-in-out",
//         },
//         frame: {
//           duration: 0,
//         },
//       }
//     );

//     // console.log(data[topic_list[i]]);
//     // figure.data = data[topic_list[i]];
//     // Plotly.redraw(figure);
//   }
// }
