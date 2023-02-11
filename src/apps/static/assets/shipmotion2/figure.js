const leftEle = document.getElementById('left');
const rightUpEle = document.getElementById('rightUp');
const rightDownEle = document.getElementById('rightDown');
var selectBox= document.getElementById("rightUp");
var resetBox= document.getElementById("resetButton");
var figureBox = document.getElementById("rightDown");

var showCount = 0;

var mapContainer = document.getElementById("left");

var topicContainer= document.getElementById("rightUp");
var resetBox= document.getElementById("resetButton");
var figureContainer = document.getElementById("rightDown");

document.getElementById("showButton").onclick= function(){
    if(showCount==0){
        topicContainer.style.display='block';
        topicContainer.style.width='30%';
        mapContainer.style.width='70%';
        showCount=1;
    }
    else{
        topicContainer.style.display='none';
        resetBox.style.display='none';
        figureContainer.style.display='none';
        mapContainer.style.width='100%';
        showCount=0;
    }
}

// The current position of mouse
let MouseX = 0;
let MouseY = 0;
// The dimension of the element
let LeftWidth = 0;
let RightWidth = 0;

// Handle the mousedown event
// that's triggered when user drags the resizer
const mouseDownHandler = function (e) {
    // Get the current mouse position
    MouseX = e.clientX;
    MouseY = e.clientY;

    // Calculate the dimension of element
    const LeftStyles = window.getComputedStyle(leftEle);
    const RightStyles = window.getComputedStyle(rightUpEle);
    LeftWidth = parseInt(LeftStyles.width);
    RightWidth = parseInt(RightStyles.width);

    // Attach the listeners to `document`
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
};


const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - MouseX;
    const dy = e.clientY - MouseY;

    // Adjust the dimension of element
    let newLeftWidth = LeftWidth + dx;
    let newRightWidth = window.innerWidth -newLeftWidth;
    leftEle.style.width = `${newLeftWidth}px`;
    rightUpEle.style.width = `${newRightWidth}px`;
    resetBox.style.width = `${newRightWidth}px`;
    rightDownEle.style.width = `${newRightWidth}px`;

};

const mouseUpHandler = function () {
    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
};
// Query all resizers
const resizers = leftEle.querySelectorAll('.resizer-r');


// Loop over them
[].forEach.call(resizers, function (resizer) {
    resizer.addEventListener('mousedown', mouseDownHandler);
});



CheckList = ["crane1","crane2","crane3","crane4","crane5",
              "engine1","engine2","engine3", "engine4","engine5","engine6", "engine7","engine8","engine9",
              "Enviroment1","Enviroment2","Enviroment3", "Enviroment4","Enviroment5","Enviroment6", "Enviroment7","Enviroment8",
              "ship1","ship2","ship3", "ship4","ship5","ship6", "ship7","ship8","ship9","ship10",
              "ship11","ship12","ship13", "ship14","ship15","ship16", "ship17","ship18","ship19","ship20",
              "ship21","ship22","ship23", "ship24","ship25","ship26", "ship27","ship28",
              "AIS1","AIS2","AIS3","AIS4"
            ];
var Chart1, Chart2, Chart3, Chart4, Chart5, Chart6, Chart7, Chart8, Chart9, Chart10, Chart11, Chart12, Chart13, Chart14, Chart15, Chart16;
var subTopic = {};
document.getElementById("drawButton").onclick= function(){
  selectBox.style.display='none';
  resetBox.style.display='block';
  figureBox.style.display='block';

  var subNum=1;
  for (var prop in subTopic) {
    if (subTopic.hasOwnProperty(prop)) {
        delete subTopic[prop];
    }
}

  var title = {};
  CheckList.forEach(function (topic, index) {
      if(document.getElementById(topic).checked){
          if (subNum<=16){
              var checkedTopic= document.getElementById(topic).value;
              subTopic[checkedTopic] = subNum;
              subNum= subNum +1;
          }
      }
    });

    for (let figureNum=1; figureNum<=16; figureNum++){
      var canvasName='realTimeFigure'+figureNum;
      var canvas=document.getElementById(canvasName);
      var ctx = canvas.getContext('2d');
      var width=document.getElementById("chart1").offsetWidth;
      var height=document.getElementById("realTimeFigure1").offsetHeight;
      ctx.clearRect(0, 0, width, height);
    }
    getFigureData(subTopic);
  
}



resetBox.onclick=function(){
  selectBox.style.display='block';
  resetBox.style.display='none';
  figureBox.style.display='none';
  clearInterval(myInterval);
  for (let figureNum=1; figureNum<=16; figureNum++){
    var canvasName='realTimeFigure'+figureNum; 
    var canvasE= document.getElementById(canvasName);
    canvasE.style.border = "none";
    const chart = Chart.getChart(canvasName);
    console.log(chart);
    if(chart != undefined){
      chart.destroy();
    }
  }
}


var myInterval=setInterval();
function getFigureData(subTopic){

    
  
  clearInterval(myInterval);
  
  myInterval = setInterval(function(){

        for (const [key, value] of Object.entries(subTopic)) {

          if(key.includes("engineX")){
            topicStr = key.replace("engineX", "");
            p1=Promise.all([1, 2, 3].map(id => 
              fetch(`http://10.24.92.185:9000/mqttrealfigure/Gunnerus/Engine${id}/${topicStr}`).then(resp => resp.json())
            )).then(values => {
            var canvasName='realTimeFigure'+value;
            const chart = Chart.getChart(canvasName);
            if(chart != undefined){
              chart.destroy();
            }
            
            engineDraw(values,value,key)}
            );
            
          }
          else{
            if(key.includes("AIVDM")){
              var url = "http://10.24.92.185:9000/mqttrealfigure/"+key;
              fetch(url)
                   .then(function (response) { return response.json(); })
                   .then(function (data) { 
                    var canvasName='realTimeFigure'+value;
                    const chart = Chart.getChart(canvasName);
                    if(chart != undefined){
                      chart.destroy();
                    }

                      var yValues=[];
                      var xValues=[];
                      var mmsiList=[];
                      var unit;
                      unit='';
                      for(let i =0; i<data[0]["value"].length; i++){
                          yValues.push(data[0]["value"][i][1]);
                          xValues.push(i-data[0]["value"].length);
                          mmsiList.push(data[0]["value"][i][0]);
                      }
                      AISDraw(xValues,yValues,mmsiList, value,key,unit);
                    });

            }
            else{
              var url = "http://10.24.92.185:9000/mqttrealfigure/"+key;
              fetch(url)
                   .then(function (response) { return response.json(); })
                   .then(function (data) { 
                    var canvasName='realTimeFigure'+value;
                    console.log(canvasName);
                    const chart = Chart.getChart(canvasName);
                    if(chart != undefined){
                      chart.destroy();
                    }
                     
                      var yValues=[];
                      var xValues=[];
                      var unit =data[0]["value"][0][2];
                      if(key=="Gunnerus/Crane1/dp_main_cyl"){
                        unit = "Bar";
                      }
                      for(let i =0; i<data[0]["value"].length; i++){
                          yValues.push(data[0]["value"][i][0]);
                          xValues.push(Date.parse(data[0]["value"][i][1]));
                          
                      }
                      draw(xValues,yValues,value,key,unit);
                    });
            } 
          }
            
          }            
        }, 1000);
}

function engineDraw(data,figureNum,key){

  key = key.replace("engineX", "");
  var yValues=[];
  var xValues=[];
  var yValues1=[];
  var xValues1=[];
  var yValues2=[];
  var xValues2=[];
  var unit=data[0][0]["value"][0][2];
  for(let i =0; i<data[0][0]["value"].length; i++){
      yValues.push(data[0][0]["value"][i][0]);
      xValues.push(Date.parse(data[0][0]["value"][i][1]));
  }
  for(let i =0; i<data[1][0]["value"].length; i++){
    yValues1.push(data[1][0]["value"][i][0]);
    xValues1.push(Date.parse(data[0][0]["value"][i][1]));
  }
  for(let i =0; i<data[2][0]["value"].length; i++){
    yValues2.push(data[2][0]["value"][i][0]);
    xValues2.push(Date.parse(data[0][0]["value"][i][1]));
  }
  
  var canvasName='realTimeFigure'+figureNum;
  var canvasE= document.getElementById(canvasName);
  canvasE.style.border = 'solid 3px rgba(119,136,153, 1)';
  canvasE.style.padding =  '20px';
  canvasE.style.border_radius= '20px';

  var ctx = document.getElementById(canvasName).getContext('2d');
  var xAxis=[];
  for(let i=0; i<xValues.length;i++){
   xAxis.push(Math.round((xValues[i]-xValues[xValues.length-1])/1000));
  }

  new Chart(ctx, {
      type: "line",
      data: {
        labels: xAxis,
        datasets: [{
          label:"engine1",
          data: yValues,
          borderColor: "#596869",
          borderWidth: 1,
          backgroundColor: '#596869',
          fill: false
        },
        {
          label:"engine2",
          data: yValues1,
          borderColor: "#B7999C",
          borderWidth: 1,
          backgroundColor: '#B7999C',
          fill: false
        },
        {
          label:"engine3",
          data: yValues2,
          borderColor: "#AAAAAA",
          borderWidth: 1,
          backgroundColor: '#AAAAAA',
          fill: false
        },]
      },
      options: {
        animation: { duration: 0 },
        plugins: {
          chartAreaBorder: {
            borderColor: 'red',
            borderWidth: 2,
            borderDash: [5, 5],
            borderDashOffset: 2,
          },
          title: {
            display: true,
            text: key+" ("+unit+")",
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {display: true},
        font: {size: 8},

        scales: {
          xAxis: { 
              
              ticks:{ autoSkip: true,
                maxTicksLimit: 12},
           },
          yAxis: {suggestedMin: Math.min(yValues)-1,
              suggestedMax: Math.max(yValues)+1,
            }
       }
      }
    }).update("none");

    figureNum=figureNum+1;
}

function AISDraw(xValues,yValues, mmsiList, figureNum,key,unit){
  var canvasName='realTimeFigure'+figureNum;

  var canvasName='realTimeFigure'+figureNum;
  var canvasE= document.getElementById(canvasName);
  canvasE.style.border = 'solid 3px rgba(119,136,153, 1)';
  canvasE.style.padding =  '20px';
  canvasE.style.border_radius= '20px';

  var ctx = document.getElementById(canvasName).getContext('2d');
  var AISList= uniqueArray(mmsiList);

  var linechart = new Chart(ctx, {
      type: "line",
      data: {
        labels: xValues,
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
        
        font: {size: 8},
        animation: { duration: 0 },
        plugins:{
          legend: {display: false},
          chartAreaBorder: {
            borderColor: 'red',
            borderWidth: 2,
            borderDash: [5, 5],
            borderDashOffset: 2,
          },
          title: {
            display: true,
            text: key+" ("+unit+")",
          },
        },
        scales: {
          xAxis: { 
              ticks:{ autoSkip: true,
                maxTicksLimit: 12},
           },
          yAxis: {suggestedMin: Math.min(yValues)-1,
              suggestedMax: Math.max(yValues)+1,
              gridLines: { drawBorder: false,},
              }
       }
      }
    }).update("none");

  for (let i = 0; i<5;i++){
    var newY=[];
    var newX=[];
    var tempY=0;
    for (let j=0; j<60;j++){
      if(mmsiList[j]===AISList[i]){
        tempY=yValues[j];
      }
      newY.push(tempY);

    }
    addData(linechart, AISList[i], "#AAAAAA", newY );
  }



    figureNum=figureNum+1;
}

function draw(xValues,yValues, figureNum,key,unit){
        var canvasName='realTimeFigure'+figureNum;
        var canvasName='realTimeFigure'+figureNum;
        var canvasE= document.getElementById(canvasName);
        canvasE.style.border = 'solid 3px rgba(119,136,153, 1)';
        canvasE.style.padding =  '20px';
        canvasE.style.border_radius= '20px';

        var ctx = document.getElementById(canvasName).getContext('2d');
        var xAxis=[];
        for(let i=0; i<xValues.length;i++){
         
         xAxis.push(Math.round((xValues[i]-xValues[xValues.length-1])/1000));
        }

        new Chart(ctx, {
          type: "line",
          data: {
            labels: xAxis,
            datasets: [{
              data: yValues,
                borderColor: "#AAAAAA",
                borderWidth: 1,
                backgroundColor: '#AAAAAA',
                fill: false
            },]
          },
          options: {
            animation: { duration: 0 },
            plugins: {
              legend: {display: false},
              chartAreaBorder: {
                borderColor: 'red',
                borderWidth: 2,
                borderDash: [5, 5],
                borderDashOffset: 2,
              },
              title: {
                display: true,
                text: key+" ("+unit+")",
              },
            },
            responsive: true,
            maintainAspectRatio: false,
            
            font: {size: 8},
    
            scales: {
              xAxis: { 
                  ticks:{ autoSkip: true,
                    maxTicksLimit: 12},
               },
              yAxis: {suggestedMin: Math.min(yValues)-1,
                  suggestedMax: Math.max(yValues)+1,
                }
           }
          }
        }).update("none");
        

          figureNum=figureNum+1;
}

function uniqueArray( ar ) {
  var j = {};

  ar.forEach( function(v) {
    j[v+ '::' + typeof v] = v;
  });


  return Object.keys(j).map(function(v){
    return j[v];
  });
} 

function addData(chart, label, color, data) {
  chart.data.datasets.push({
    label:label,
      data: data,
      borderColor: color,
      borderWidth: 1,
      backgroundColor: color,
      fill: false
  });
  chart.update("none");
}