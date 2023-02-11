mapboxgl.accessToken =
  "pk.eyJ1Ijoic2FpcmFuYSIsImEiOiJjbDFxaWFxbTMxa2V2M2pvMmY2ZDdlZWlsIn0.c50jduV_DHhrogk1sSia7g";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/satellite-streets-v11",
  zoom: 15.5,
  center: [6.179522, 62.457598],
  pitch: 45,
  bearing: -17.6,
  hideCompass: true,
  attributionControl: false,
  antialias: true, // create the gl context with MSAA antialiasing, so custom layers are antialiased
});

// parameters to ensure the model is georeferenced correctly on the map
const modelOrigin = [6.179522, 62.4576];
const modelAltitude = 3;
const modelRotate = [Math.PI / 2, 0, 0];
const slewing_ang_calib = -194;
const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
  modelOrigin,
  modelAltitude
);

// transformation parameters to position, rotate and scale the 3D model onto the map
var modelTransform = {
  translateX: modelAsMercatorCoordinate.x,
  translateY: modelAsMercatorCoordinate.y,
  translateZ: modelAsMercatorCoordinate.z,
  rotateX: modelRotate[0],
  rotateY: modelRotate[1],
  rotateZ: modelRotate[2],
  scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
};

const THREE = window.THREE;

// configuration of the custom layer for a 3D model per the CustomLayerInterface
const customLayer = {
  id: "3d-model",
  type: "custom",
  renderingMode: "3d",
  onAdd: function (map, gl) {
    this.camera = new THREE.Camera();
    this.scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0xcccccc);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0, 900, 1500);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = -2;
    dirLight.shadow.camera.left = -2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;
    this.scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0xffffff);
    dirLight2.position.set(0, 900, -1500);
    dirLight2.castShadow = true;
    dirLight2.shadow.camera.top = 2;
    dirLight2.shadow.camera.bottom = -2;
    dirLight2.shadow.camera.left = -2;
    dirLight2.shadow.camera.right = 2;
    dirLight2.shadow.camera.near = 0.1;
    dirLight2.shadow.camera.far = 40;
    this.scene.add(dirLight2);

    const dirLight3 = new THREE.DirectionalLight(0xffffff);
    dirLight3.position.set(0, 900, 0);
    dirLight3.castShadow = true;
    dirLight3.shadow.camera.top = 2;
    dirLight3.shadow.camera.bottom = -2;
    dirLight3.shadow.camera.left = -2;
    dirLight3.shadow.camera.right = 2;
    dirLight3.shadow.camera.near = 0.1;
    dirLight3.shadow.camera.far = 40;
    this.scene.add(dirLight3);

    function degrees_to_radians(degrees) {
      var pi = Math.PI;
      return degrees * (pi / 180);
    }

    // use the three.js GLTF loader to add the 3D model to the three.js scene
    const loader = new THREE.GLTFLoader();
    loader.load(model_path, (gltf) => {
      var model = gltf.scene;
      this.scene.add(model);
      let DoubleLink1 = model.getObjectByName("DoubleLink1");
      let DoubleLink2 = model.getObjectByName("DoubleLink2");
      let YawSupport1 = model.getObjectByName("YawSupport1");
      let LoadCellHook = model.getObjectByName("LoadCellHook");
      let Tele11 = model.getObjectByName("Tele11");
      let Tele2 = model.getObjectByName("Tele2");
      let Tele3 = model.getObjectByName("Tele3");
      let Tele4 = model.getObjectByName("Tele4");
      let Tele5 = model.getObjectByName("Tele5");
      let Tele6 = model.getObjectByName("Tele6");
      let Tele7 = model.getObjectByName("Tele7");

      async function set_crane() {
        let exten_outer = 48;
        let double_link1_data = -3;
        let double_link2_data = -177;
        let yaw_support_data = 194;
        let tele_data = -(1800 - exten_outer * 10) - 480;

        let double_link1_angle = double_link1_data;

        let double_link2_angle = double_link2_data + double_link1_angle;

        let YawSupport1_angle = +yaw_support_data + slewing_ang_calib;

        DoubleLink1.rotation.set(0, degrees_to_radians(double_link1_angle), 0);
        DoubleLink2.rotation.set(0, degrees_to_radians(-double_link2_angle), 0);
        YawSupport1.rotation.set(0, 0, degrees_to_radians(YawSupport1_angle));
        LoadCellHook.position.set(1000000, 10000000, 1000000);

        Tele11.position.set(tele_data, 0, 0);
        Tele2.position.set(tele_data, 0, 0);
        Tele3.position.set(tele_data, 0, 0);
        Tele4.position.set(tele_data * 1.1, 0, 0);
        Tele5.position.set(tele_data * 1.1, 0, 0);
        Tele6.position.set(tele_data * 1.2, 0, 0);
        Tele7.position.set(tele_data * 1.2, 0, 0);
      }
      set_crane();
    });
    this.map = map;

    // use the Mapbox GL JS map canvas for three.js
    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: true,
    });

    this.renderer.autoClear = false;
  },
  render: function (gl, matrix) {
    const rotationX = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(1, 0, 0),
      modelTransform.rotateX
    );
    const rotationY = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(0, 1, 0),
      modelTransform.rotateY
    );
    const rotationZ = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(0, 0, 1),
      modelTransform.rotateZ
    );

    const m = new THREE.Matrix4().fromArray(matrix);
    const l = new THREE.Matrix4()
      .makeTranslation(
        modelTransform.translateX,
        modelTransform.translateY,
        modelTransform.translateZ
      )
      .scale(
        new THREE.Vector3(
          modelTransform.scale,
          -modelTransform.scale,
          modelTransform.scale
        )
      )
      .multiply(rotationX)
      .multiply(rotationY)
      .multiply(rotationZ);

    this.camera.projectionMatrix = m.multiply(l);
    this.renderer.resetState();
    this.renderer.render(this.scene, this.camera);
    this.map.triggerRepaint();
  },
};

let plot_data = {
  latitude: {},
  longitude: {},
  heading: {},
};
var plots = [];
map.on("style.load", () => {
  map.addLayer(customLayer, "waterway-label");

  initialize_graph(plot_data);

  function animate() {
    get_data();
    requestAnimationFrame(animate);
  }

  animate();
});

async function get_data() {
  const response = await fetch(
    "http://10.24.92.185:9000/ship_motion/real_time_data"
  );
  const data = await response.json();
  let ld = Math.floor(data.lon[0] /100);
  let long = ld + (data.lon[0] - ld*100)/60;

  let lt = Math.floor(data.lat[0] /100);
  let lati = lt + (data.lat[0] - lt*100)/60;

  var latitude = lati;
  var longitude = long;
  var heading = data.head[0];
  var time = data.lat[1];

  plot_data.latitude[time] = latitude;
  plot_data.longitude[time] = longitude;
  plot_data.heading[time] = heading;
  UpdateGraph(plot_data);

  move_ship(latitude, longitude, heading);
  map.flyTo({
    center: [longitude, latitude],
    duration: 0,
    essential: true,
  });

  console.log(data);
}

function move_ship(latip, longp, headp) {
  let modelAltitudep = -3;
  let modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
    [longp, latip],
    modelAltitudep
  );
  // transformation parameters to position, rotate and scale the 3D model onto the map
  modelTransform = {
    translateX: modelAsMercatorCoordinate.x,
    translateY: modelAsMercatorCoordinate.y,
    translateZ: modelAsMercatorCoordinate.z,
    rotateX: Math.PI / 2,
    rotateY: (-headp + 90) * (Math.PI / 180),
    rotateZ: modelRotate[2],
    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
  };
}

function initialize_graph(plot_data) {
  const plot_name = ["Latitude", "Longitude", "Heading"];
  const charts_element = document.getElementById("graph_container");

  while (charts_element.firstChild) {
    charts_element.removeChild(charts_element.lastChild);
  }

  for (var i = 0; i < Object.keys(plot_data).length; i++) {
    const figure = document.createElement("div");

    figure.id = "figure" + i;

    plots.push(figure);

    // Append to body:
    charts_element.appendChild(figure);

    var layout = {
      title: {
        text: plot_name[i],
        font: {
          family: "Courier New, monospace",
          size: 20,
        },
        xref: "paper",
        x: 0.05,
      },
      xaxis: {
        title: {
          text: "Time",
          font: {
            family: "Courier New, monospace",
            size: 14,
            color: "#7f7f7f",
          },
        },
      },
      yaxis: {
        title: {
          text: "Degree",
          font: {
            family: "Courier New, monospace",
            size: 14,
            color: "#7f7f7f",
          },
        },
      },
    };

    Plotly.newPlot(figure, [{ y: [0], x: [new Date()] }], layout);
  }
}

function UpdateGraph(data) {
  var topic_list = ["latitude", "longitude", "heading"];
  for (var i = 0; i < Object.keys(data).length; i++) {
    var figure = "figure" + i;

    var x = Object.keys(data[topic_list[i]]);
    var y = Object.values(data[topic_list[i]]);
    console.log(x);

    Plotly.animate(
      figure,
      {
        data: [{ y: y, x: x, type: "scatter" }],
      },
      {
        transition: {
          duration: 0,
          easing: "cubic-in-out",
        },
        frame: {
          duration: 0,
        },
      }
    );
  }
}
