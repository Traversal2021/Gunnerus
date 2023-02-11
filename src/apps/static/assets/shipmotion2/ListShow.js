var Cranebutton= document.getElementById("CraneButton");
Cranebutton.onclick= function(){
    var x = document.getElementById("CraneList");
    if (!x.style.display || x.style.display == 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
}

var Engine1button= document.getElementById("engine_button");
Engine1button.onclick= function(){
    var x = document.getElementById("EngineList");
    if ( !x.style.display || x.style.display == 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
}

// var Engine2button= document.getElementById("engine2_button");
// Engine2button.onclick= function(){
//     var x = document.getElementById("Engine2List");
//     if (x.style.display == 'none') {
//         x.style.display = 'block';
//     } else {
//         x.style.display = 'none';
//     }
// }

// var Engine3button= document.getElementById("engine3_button");
// Engine3button.onclick= function(){
//     var x = document.getElementById("Engine3List");
//     if (x.style.display == 'none') {
//         x.style.display = 'block';
//     } else {
//         x.style.display = 'none';
//     }
// }

var Environmentbutton= document.getElementById("enviroment_button");
Environmentbutton.onclick= function(){
    var x = document.getElementById("EnviromentList");
    if (!x.style.display || x.style.display == 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
}

var shipButton= document.getElementById("shipButton");
shipButton.onclick= function(){
    var x = document.getElementById("ShipList");
    if ( !x.style.display || x.style.display == 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
}

var AISButton= document.getElementById("AISButton");
AISButton.onclick= function(){
    var x = document.getElementById("AISList");
    if (!x.style.display || x.style.display == 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
}
