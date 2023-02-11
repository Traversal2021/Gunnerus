var plots = [];

let plot_name = {
  engine1_power: "Engine1 power",
  engine1_speed: "Engine1 speed",
  engine1_exhaust_temp: "Engine1 exhaust temperature",
  engine1_lub_oil_temp: "Engine1 lubricant oil pressure",
  engine2_power: "Engine2 power",
  engine2_speed: "Engine2 speed",
  engine2_exhaust_temp: "Engine2 exhaust temperature",
  engine2_lub_oil_temp: "Engine2 lubricant oil pressure",
  engine3_power: "Engine3 power",
  engine3_speed: "Engine3 speed",
  engine3_exhaust_temp: "Engine3 exhaust temperature",
  engine3_lub_oil_temp: "Engine3 lubricant oil pressure",
};

let plot_unit = {
  engine1_power: "Kw",
  engine1_speed: "rpm",
  engine1_exhaust_temp: "celcius",
  engine1_lub_oil_temp: "bar",
  engine2_power: "Kw",
  engine2_speed: "rpm",
  engine2_exhaust_temp: "celcius",
  engine2_lub_oil_temp: "bar",
  engine3_power: "Kw",
  engine3_speed: "rpm",
  engine3_exhaust_temp: "celcius",
  engine3_lub_oil_temp: "bar",
};

let plot_data = {
  engine1_power: {},
  engine1_speed: {},
  engine1_exhaust_temp: {},
  engine1_lub_oil_temp: {},
  engine2_power: {},
  engine2_speed: {},
  engine2_exhaust_temp: {},
  engine2_lub_oil_temp: {},
  engine3_power: {},
  engine3_speed: {},
  engine3_exhaust_temp: {},
  engine3_lub_oil_temp: {},
};

let plot_container = [
  "engine1_power",
  "engine1_exhaust_temp",
  "engine1_speed",
  "engine1_lub_oil_temp",
  "engine2_power",
  "engine2_exhaust_temp",
  "engine2_speed",
  "engine2_lub_oil_temp",
  "engine3_power",
  "engine3_exhaust_temp",
  "engine3_speed",
  "engine3_lub_oil_temp",
];

const api_url = "http://10.24.92.185:9000/engine/real_time_data";

setInterval(function () {
  getiss();
}, 1000);

initialize_graph(plot_data);

function initialize_graph(plot_data) {
  for (let i = 0; i < plot_container.length; i++) {
    var layout = {
      title: {
        text: plot_name[plot_container[i]],
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
          text: plot_unit[[plot_container[i]]],
          font: {
            family: "Courier New, monospace",
            size: 14,
            color: "#7f7f7f",
          },
        },
      },
    };

    Plotly.newPlot(plot_container[i], [{ y: [0], x: [new Date()] }], layout);
  }
}

async function getiss() {
  const response = await fetch(api_url);
  const data = await response.json();

  for (var i = 0; i < Object.keys(plot_data).length; i++) {
    plot_data[plot_container[i]][data[plot_container[i]][1]] =
      data[plot_container[i]][0];
  }

  UpdateGraph(plot_data);
}

function UpdateGraph(data) {
  for (var i = 0; i < Object.keys(data).length; i++) {
    var update_x = Object.keys(data[plot_container[i]]);
    var update_y = Object.values(data[plot_container[i]]);

    Plotly.update(plot_container[i], { x: [update_x], y: [update_y] });

    console.log(plot_container[i]);
    console.log(update_y);
  }
}
