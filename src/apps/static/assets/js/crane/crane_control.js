import { GUI } from "https://unpkg.com/three@0.138.0/examples/jsm/libs/lil-gui.module.min.js";
import {
  parameters3,
  parameters4,
  model,
  set_base_ang,
  set_base_ang2,
  set_base_ang3,
  set_base_ang4,
  set_tele1,
  set_yaw,
} from "./crane_base.js";

createPanel();

function createPanel() {
  const gui = new GUI();
  gui.domElement.id = "gui";
  const folderCrane = gui.addFolder("Crane Control");
  folderCrane
    .add(parameters3, "Double_Link_1", -70, 90, 0.1)
    .onChange(set_base_ang);
  folderCrane
    .add(parameters3, "Double_Link_2", -173, 12, 0.1)
    .onChange(set_base_ang2);
  folderCrane
    .add(parameters3, "Yaw_Support_1", -180, 180, 0.1)
    .onChange(set_base_ang3);
  folderCrane
    .add(parameters3, "Load_Cell_Hook", 0, 350, 0.1)
    .onChange(set_base_ang4);
  folderCrane.add(parameters3, "Tele", -2100, 60, 0.1).onChange(set_tele1);
  folderCrane.open();

  const folderShip = gui.addFolder("Ship Position Control");
  folderShip.add(parameters4, "Yaw", -30, 30, 0.1).onChange(set_yaw);
  folderShip.add(parameters4, "Pitch", -2, 2, 0.1).onChange(set_yaw);
  folderShip.add(parameters4, "Roll", -5, 5, 0.1).onChange(set_yaw);
  folderShip.open();
}
