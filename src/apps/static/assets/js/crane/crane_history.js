var tele_data, double_link1_data, double_link2_data, yaw_support_data;
var list_length;
var latitude_data = [];
var longitude_data = [];
var head_data = [];
var download_data = [];
var coll = document.getElementsByClassName("collapsible");
var i;

var figure_list = [];
let color_list = [];
let size_list = [];

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "flex") {
      content.style.display = "none";
    } else {
      content.style.display = "flex";
    }
  });
}

(function () {
  if (typeof Object.defineProperty === "function") {
    try {
      Object.defineProperty(Array.prototype, "sortBy", { value: sb });
    } catch (e) {}
  }
  if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;

  function sb(f) {
    for (var i = this.length; i; ) {
      var o = this[--i];
      this[i] = [].concat(f.call(o, o, i), o);
    }
    this.sort(function (a, b) {
      for (var i = 0, len = a.length; i < len; ++i) {
        if (a[i] != b[i]) return a[i] < b[i] ? -1 : 1;
      }
      return 0;
    });
    for (var i = this.length; i; ) {
      this[--i] = this[i][this[i].length - 1];
    }
    return this;
  }
})();

$(function () {
  var start = moment().subtract(1, "minutes");
  var end = moment();

  $("#selected_data").daterangepicker(
    {
      timePicker: true,
      timePickerIncrement: 30,
      opens: "left",
      locale: {
        format: "MM/DD/YYYY h:mm A",
      },
      ranges: {
        "One minute": [moment().subtract(1, "minutes"), , moment()],
        "One hour": [moment().subtract(1, "hours"), , moment()],
        "One day": [moment().subtract(1, "days"), moment()],
        "One week": [moment().subtract(6, "days"), moment()],
      },
    },
    selection_changed
  );

  selection_changed(start, end);
});

async function selection_changed(start, end) {
  var startTime = new Date(start).toISOString().slice(0, 16);
  var endTime = new Date(end).toISOString().slice(0, 16);
  getTimelineData(startTime, endTime);
}

async function getTimelineData(startTime, endTime) {
  var speedConstrain =
    -1 + "< value and value <" + 5000 + "and topicid in (6,15,24)";
  var url =
    "http://10.24.92.185:9000/crane/timeline_data/info?ST=" +
    startTime +
    "&ET=" +
    endTime +
    "&CS=" +
    speedConstrain;
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var timeline_plot = [];

      for (var i = 1; i <= Object.keys(data).length; i++) {
        var x = [];
        var y = [];
        var base = [];
        var temp_date = new Date();

        for (var j = 0; j < data[i].length; j++) {
          //end_time = new Date(data[i][j].to).toISOString().slice(0, 16);

          x.push(new Date(data[i][j].to) - new Date(data[i][j].from));
          y.push("event" + i);
          base.push(data[i][j].from);
        }

        timeline_plot.push({
          type: "bar",
          y: y,
          x: x,
          orientation: "h",
          base: base,
        });
      }

      if (x.length != 0) {
        const charts_element = document.getElementById("timeline_chart");
        while (charts_element.firstChild) {
          charts_element.removeChild(charts_element.lastChild);
        }

        const figure = document.createElement("div");
        charts_element.appendChild(figure);

        var layout = {
          xaxis: {
            type: "date",
            title: "time",
          },
          yaxis: {
            title: "event",
          },
        };

        Plotly.newPlot(figure, timeline_plot, layout, {
          showSendToCloud: true,
        });

        figure.on("plotly_click", function (click_data) {
          var start_time = click_data["points"][0]["base"];
          var end_time;

          for (var i = 1; i <= Object.keys(data).length; i++) {
            for (var j = 0; j < data[i].length; j++) {
              if (data[i][j].from == start_time) {
                end_time = data[i][j].to;
              }
            }
          }
          var iss_start = new Date(start_time).toISOString().slice(0, 16);
          var iss_end = new Date(end_time).toISOString().slice(0, 16);

          update_charts(iss_start, iss_end);

          getISS(iss_start, iss_end);
        });
      }
    });
}

async function update_charts(startTime, endTime) {
  download_data = {};
  figure_list = [];
  var charts_topic = {
    "Gunnerus/SeapathGPSGga/Latitude": "",
    "Gunnerus/SeapathGPSGga/Longitude": "",
    "Gunnerus/SeapathMRU/Heading": "degree",
    "Gunnerus/Crane1/extension_length_outer_boom": "m",
    "Gunnerus/Crane1/main_boom_angle": "degree",
    "Gunnerus/Crane1/outer_boom_angle": "degree",
    "Gunnerus/Crane1/slewing_angle": "degree",
  };
  const charts_element = document.getElementById("graph_container");
  while (charts_element.firstChild) {
    charts_element.removeChild(charts_element.lastChild);
  }

  for (let i = 0; i < Object.keys(charts_topic).length; i++) {
    const chart_api =
      "http://10.24.92.185:9000/crane/history_data/info?ST=" +
      startTime +
      "&ET=" +
      endTime +
      "&TO=" +
      Object.keys(charts_topic)[i];

    fetch(chart_api)
      .then((response) => response.json())
      .then((his_data) => {
        let time_list = [];
        let value_list = [];

        var values = his_data[0].value[0];

        values.sort((a, b) => (a[2] > b[2] ? 1 : -1));

        for (var j = 0; j < values.length; j++) {
          time_list.push(values[j][2]);
          value_list.push(values[j][1]);
          color_list.push("#00000");
          size_list.push(0);
        }

        let figure = document.createElement("div");
        charts_element.appendChild(figure);
        figure.id = "figure" + i;
        figure_list.push(figure.id);

        var layout = {
          title: Object.keys(charts_topic)[i],
          xaxis: {
            type: "date",
            title: "time",
          },
          yaxis: {
            title: Object.values(charts_topic)[i],
          },
        };

        Plotly.newPlot(
          figure,
          [
            {
              x: time_list,
              y: value_list,
              type: "scatter",
              mode: "lines+markers",
              marker: { size: size_list, color: color_list },
            },
          ],
          layout,
          { showSendToCloud: true }
        );

        download_data[Object.keys(charts_topic)[i]] = {
          time: time_list,
          value: value_list,
        };
      });
  }
}

document.getElementById("download_button").addEventListener("click", () => {
  const csvdata = csvmaker(download_data);
  download(csvdata);
});

const download = function (data) {
  // Creating a Blob for having a csv file format
  // and passing the data with type
  const blob = new Blob([data], { type: "text/csv" });

  // Creating an object for downloading url
  const url = window.URL.createObjectURL(blob);

  // Creating an anchor(a) tag of HTML
  const a = document.createElement("a");

  // Passing the blob downloading url
  a.setAttribute("href", url);

  // Setting the anchor tag attribute for downloading
  // and passing the download file name
  a.setAttribute("download", "download.csv");

  // Performing a download with click
  a.click();
};

const csvmaker = function (data) {
  // Empty array for storing the values
  let csvRows = [];

  // Headers is basically a keys of an
  // object which is id, name, and
  // profession
  let headers = [];
  for (let i = 0; i < Object.keys(data).length; i++) {
    headers.push(Object.keys(data)[i]);
    headers.push("");
  }

  // As for making csv format, headers
  // must be separated by comma and
  // pushing it into array
  csvRows.push(headers.join(","));

  headers = [];
  for (let i = 0; i < Object.keys(data).length; i++) {
    headers.push("time");
    headers.push("value");
  }
  csvRows.push(headers.join(","));
  // Pushing Object values into array
  // with comma separation
  let output_list = [];
  for (let i = 0; i < Object.keys(data).length; i++) {
    output_list.push(data[Object.keys(data)[i]].time);
    output_list.push(data[Object.keys(data)[i]].value);
  }

  let output = output_list[0].map((_, colIndex) =>
    output_list.map((row) => row[colIndex])
  );
  csvRows.push(output.join("\n"));

  // Returning the array joining with new line
  return csvRows.join("\n");
};

async function getISS(startTime, endTime) {
  const historical_api_boom =
    "http://10.24.92.185:9000/crane/history_data/info?ST=" +
    startTime +
    "&ET=" +
    endTime +
    "&TO=Gunnerus/Crane1/extension_length_outer_boom";
  const mainboom_api_boom =
    "http://10.24.92.185:9000/crane/history_data/info?ST=" +
    startTime +
    "&ET=" +
    endTime +
    "&TO=Gunnerus/Crane1/main_boom_angle";
  const outer_boom_angle_api_boom =
    "http://10.24.92.185:9000/crane/history_data/info?ST=" +
    startTime +
    "&ET=" +
    endTime +
    "&TO=Gunnerus/Crane1/outer_boom_angle";
  const slewing_angle_api_boom =
    "http://10.24.92.185:9000/crane/history_data/info?ST=" +
    startTime +
    "&ET=" +
    endTime +
    "&TO=Gunnerus/Crane1/slewing_angle";
  const latitude_api =
    "http://10.24.92.185:9000/crane/history_data/info?ST=" +
    startTime +
    "&ET=" +
    endTime +
    "&TO=Gunnerus/SeapathGPSGga/Latitude";
  const longtitude_api =
    "http://10.24.92.185:9000/crane/history_data/info?ST=" +
    startTime +
    "&ET=" +
    endTime +
    "&TO=Gunnerus/SeapathGPSGga/Longitude";
  const head_api =
    "http://10.24.92.185:9000/crane/history_data/info?ST=" +
    startTime +
    "&ET=" +
    endTime +
    "&TO=Gunnerus/SeapathMRU/Heading";

  fetch(latitude_api)
    .then((response) => response.json())
    .then((his_data) => {

      let latitude_list = his_data[0].value[0];
      let length_latitude = latitude_list.length;

      for (var i = 0; i < length_latitude; i++) {
        let lt = Math.floor(his_data[0].value[0][i][1] / 100);
        let lati = lt + (his_data[0].value[0][i][1] - lt * 100) / 60;

        latitude_data.push(lati);
      }
    });
  fetch(longtitude_api)
    .then((response) => response.json())
    .then((his_data) => {
      let longtitude_list = his_data[0].value[0];
      let length_longtitude = longtitude_list.length;

      for (var i = 0; i < length_longtitude; i++) {
        let ld = Math.floor(his_data[0].value[0][i][1] / 100);
        let long = ld + (his_data[0].value[0][i][1] - ld * 100) / 60;
        longitude_data.push(long);
      }
    });
  fetch(head_api)
    .then((response) => response.json())
    .then((his_data) => {
      let head_list = his_data[0].value[0];

      let length_head = head_list.length;

      head_data.push(his_data[0].value[0][0][1]);
      for (var i = 0; i < length_head; i++) {
        head_data.push(his_data[0].value[0][i][1]);
      }
    });

  // Boom
  fetch(historical_api_boom)
    .then((response) => response.json())
    .then((his_data) => {
      let logged_array_boom = his_data[0].value[0];
      let length_boom = logged_array_boom.length;

      tele_length_list.push(his_data[0].value[0][0][1]);
      for (var i = 0; i < length_boom; i++) {
        tele_length_list.push(his_data[0].value[0][i][1]);
      }

      list_length = length_boom + 1;
      timeline.max = length_boom;
    });

  const mainboom_response = await fetch(mainboom_api_boom);
  const mainboom_data = await mainboom_response.json();
  let logged_main_boom = mainboom_data[0].value[0];
  let length_main_boom = logged_main_boom.length;
  main_boom_list.push(mainboom_data[0].value[0][0][1]);
  for (var i = 0; i < length_main_boom; i++) {
    main_boom_list.push(mainboom_data[0].value[0][i][1]);
  }

  const outer_boom_angle_response = await fetch(outer_boom_angle_api_boom);
  const outer_boom_angle_data = await outer_boom_angle_response.json();
  let logged_outer_boom_angle = outer_boom_angle_data[0].value[0];
  let length_outer_boom_angle = logged_outer_boom_angle.length;
  outer_boom_angle_list.push(outer_boom_angle_data[0].value[0][0][1]);
  for (var i = 0; i < length_outer_boom_angle; i++) {
    outer_boom_angle_list.push(outer_boom_angle_data[0].value[0][i][1]);
  }

  const slewing_angle_response = await fetch(slewing_angle_api_boom);
  const slewing_angle_data = await slewing_angle_response.json();
  let logged_slewing_angle = slewing_angle_data[0].value[0];
  let length_slewing_angle = logged_slewing_angle.length;
  slewing_angle_list.push(slewing_angle_data[0].value[0][0][1]);
  for (var i = 0; i < length_slewing_angle; i++) {
    slewing_angle_list.push(slewing_angle_data[0].value[0][i][1]);
  }

  timeline.min = 0;
  timeline.max = length_slewing_angle;
}

const timeline = document.getElementById("timeline");

const start = [6.179522, 62.457598];
let water,
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
  exten_outer,
  main_boom_calib,
  outer_boom_calib,
  extension_calib;
const slewing_ang_calib = -194;
var tele_length_list = [];
var main_boom_list = [];
var outer_boom_angle_list = [];
var slewing_angle_list = [];

var play_count = 0;
var play;
var play_interval = 100;
var playback_speed = 100;

var Play_tele_length_list = [10];
var Play_main_boom_list = [10];
var Play_outer_boom_angle_list = [10];
var Play_slewing_angle_list = [10];

var playback_interval;

var model;
let animation; // to store and cancel the animation

const geojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [],
      },
    },
  ],
};

function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

mapboxgl.accessToken =
  "pk.eyJ1Ijoic2FpcmFuYSIsImEiOiJjbDFxaWFxbTMxa2V2M2pvMmY2ZDdlZWlsIn0.c50jduV_DHhrogk1sSia7g";
const map = new mapboxgl.Map({
  style: "mapbox://styles/mapbox/satellite-streets-v11",
  center: start,
  zoom: 15.5,
  pitch: 45,
  bearing: -17.6,
  container: "map",
  antialias: true,
  hideCompass: true,
  attributionControl: false,
});

var modelOrigin2 = [6.179522, 62.457598];
const modelAltitude = 3;
const modelRotate = [Math.PI / 2, 0, 0];

var modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
  modelOrigin2,
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
  /* Since our 3D model is in real world meters, a scale transform needs to be
   * applied since the CustomLayerInterface expects units in MercatorCoordinates.
   */
  scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
};

const THREE = window.THREE;

var customLayer = {
  id: "3d-model",
  type: "custom",
  renderingMode: "3d",
  onAdd: function (map, gl) {
    this.camera = new THREE.Camera();
    this.scene = new THREE.Scene();
    // create two three.js lights to illuminate the model

    const ambientLight = new THREE.AmbientLight(0xcccccc);
    this.scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 500, 1000);
    //this.scene.add( hemiLight );

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

    // use the three.js GLTF loader to add the 3D model to the three.js scene
    var loader = new THREE.GLTFLoader();
    loader.load(
      model_path,
      function (gltf) {
        model = gltf.scene;
        this.scene.add(model);
        set_crane(model, 48, -3, -177, 194, -1800);
      }.bind(this)
    );
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
    var rotationX = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(1, 0, 0),
      modelTransform.rotateX
    );
    var rotationY = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(0, 1, 0),
      modelTransform.rotateY
    );
    var rotationZ = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(0, 0, 1),
      modelTransform.rotateZ
    );
    var m = new THREE.Matrix4().fromArray(matrix);
    var l = new THREE.Matrix4()
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
    this.renderer.state.reset();
    this.renderer.render(this.scene, this.camera);
    this.map.triggerRepaint();
  },
};

let startTime = 0;
let resetTime = false;
map.on("load", () => {
  map.setFog({ "horizon-blend": 0.05 }); // Enable stars with reduced atmosphere
  map.addLayer(customLayer, "waterway-label");

  startTime = performance.now();

  document.getElementById("play_speed").addEventListener("change", (event) => {
    playback_speed = 30.0 / event.target.value;
  });

  document.getElementById("play").addEventListener("click", () => {
    animate();
  });

  document.getElementById("pause").addEventListener("click", () => {
    cancelAnimationFrame(animation);
  });

  map.addSource("line", {
    type: "geojson",
    data: geojson,
  });

  // add the line which will be modified in the animation
  map.addLayer({
    id: "line-animation",
    type: "line",
    source: "line",
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#ed6498",
      "line-width": 5,
      "line-opacity": 0.8,
    },
  });

  // reset startTime and progress once the tab loses or gains focus
  // requestAnimationFrame also pauses on hidden tabs by default
  document.addEventListener("visibilitychange", () => {
    resetTime = true;
  });

  // animated in a circle as a sine wave along the map.
  function animate() {
    animation = requestAnimationFrame(animate);
    play_count = parseInt(timeline.value);

    for (let i = 0; i < figure_list.length; i++) {
      
      let colors = color_list
      let sizes = size_list;
      
      for(let i = 0; i <=play_count; i ++  ){
        colors[i] = "#C54C82"
        sizes[i] = 6
      }

      var update = {
        marker: { color: colors, size: sizes, line: { width: 0 } },
      };
      Plotly.restyle(figure_list[i], update);
    }

    move_ship(
      latitude_data[play_count],
      longitude_data[play_count],
      head_data[play_count]
    );
    map.flyTo({
      center: [longitude_data[play_count], latitude_data[play_count]],
      duration: 0,
      essential: true,
    });

    // append new coordinates to the lineString
    let geometry_list = []
    for(let i = 0; i <=play_count; i ++  ){
      geometry_list.push([longitude_data[i],
      latitude_data[i]])
    }
    geojson.features[0].geometry.coordinates=geometry_list;
    // then update the map
    map.getSource("line").setData(geojson);

    let exten_outer = tele_length_list[play_count];
    let double_link1_data = main_boom_list[play_count];
    let double_link2_data = outer_boom_angle_list[play_count];
    let yaw_support_data = slewing_angle_list[play_count];
    let tele_data = -(1800 - exten_outer * 10) - 480;

    set_crane(
      model,
      exten_outer,
      double_link1_data,
      double_link2_data,
      yaw_support_data,
      tele_data
    );

    if (play_count < parseInt(timeline.max)) {
      play_count = play_count + 1;
    } else {
      console.log("restart");
      play_count = 0;
      geojson.features[0].geometry.coordinates = [];
    }

    timeline.value = play_count;
  }
});

var lat_list = [],
  lon_list = [],
  route_list = [];
function learp1(start, end, t) {
  return start * (1 - t) + end * t;
}

async function set_crane(
  model,
  exten_outer,
  double_link1_data,
  double_link2_data,
  yaw_support_data,
  tele_data
) {
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

function move_ship(latip, longp, headp) {
  var modelAltitudep = -3;

  lat_list.push(latip);
  lon_list.push(longp);

  route_list.push([longp, latip]);

  modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
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
    /* Since our 3D model is in real world meters, a scale transform needs to be
     * applied since the CustomLayerInterface expects units in MercatorCoordinates.
     */
    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
  };
}

function update_lat_long_global(long, lati, headi) {
  lattitude_g = lati;
  longitude_g = long;
  heading_g = headi;
}
