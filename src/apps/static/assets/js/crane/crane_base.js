import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@0.138.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://unpkg.com/three@0.138.0/examples/jsm/loaders/GLTFLoader";
import Stats from "https://unpkg.com/three@0.138.0/examples/jsm/libs/stats.module";
import { Water } from "https://unpkg.com/three@0.138.0/examples/jsm/objects/Water.js";

let scene, renderer, camera, stats;
export let model;
let mixer, clock;
export let water,
  DoubleLink1,
  DoubleLink2,
  d1,
  d2,
  d3,
  YawSupport1,
  LoadCellHook,
  d5,
  Tele11,
  Tele2,
  Tele3,
  Tele4,
  Tele5,
  Tele6,
  Tele7,
  s1,
  s2,
  s3;

function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

export const parameters3 = {
  Double_Link_1: -56,
  Double_Link_2: -153,
  Yaw_Support_1: 0,
  Load_Cell_Hook: 0,
  Tele: -2100,
};

export const parameters4 = {
  Yaw: 0,
  Pitch: 0,
  Roll: 0,
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

export function set_yaw() {
  s1 = parameters4.Yaw;
  s2 = parameters4.Pitch;
  s3 = parameters4.Roll;

  model.rotation.set(
    degrees_to_radians(s3),
    degrees_to_radians(s1),
    degrees_to_radians(s2)
  );
}

export function set_base_ang() {
  d1 = parameters3.Double_Link_1;
  DoubleLink1.rotation.set(0, degrees_to_radians(d1), 0);
}

export function set_base_ang2() {
  d2 = parameters3.Double_Link_2;
  DoubleLink2.rotation.set(0, degrees_to_radians(d2), 0);
}

export function set_base_ang3() {
  d3 = parameters3.Yaw_Support_1;
  YawSupport1.rotation.set(0, 0, degrees_to_radians(d3));
}

export function set_base_ang4() {
  LoadCellHook.quaternion.set(0, 0, 0, 0);
  LoadCellHook.setRotationFromQuaternion(1.0472);

  //LoadCellHook.rotation.set(0,0,degrees_to_radians(d4))
  //LoadCellHook.position.set(0,0,0)
}

export function set_tele1() {
  d5 = parameters3.Tele;
  Tele11.position.set(d5, 0, 0);
  Tele2.position.set(d5, 0, 0);
  Tele3.position.set(d5, 0, 0);
  Tele4.position.set(d5, 0, 0);
  Tele5.position.set(d5, 0, 0);
  Tele6.position.set(d5, 0, 0);
  Tele7.position.set(d5, 0, 0);
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

  renderer.render(scene, camera);
  water.material.uniforms["time"].value += 1.0 / 60.0;
}
