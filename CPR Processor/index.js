var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var recievingPort = process.env.PORT || 4300; //We'll recieve our data over the 4300 pipe

var collectingData = true;
var started = false; //Indicates if we've started collecting data (first run variable)
var startTime = Date.now();
var socketInstance;
io.on('connection', function(socket){
  socketInstance = socket;
  socket.on('message', messageCallback); 
});

function messageCallback(msg) {
  var data = parseInt(msg);
  if (collectingData && !started && data > 0) {
    startTime = Date.now();
    analyze(data); 
    emitPressure();
    started = true;
  } else if (collectingData && started) {
    analyze(data);
    emitPressure();
  }
}

http.listen(recievingPort, function(){
  console.log('Recieving data from activ5 on port *:' + recievingPort);
});





var appWeb = require('express')();
var httpWeb = require('http').Server(appWeb);
var ioWeb = require('socket.io')(httpWeb);
var recievingPortWeb = process.env.PORT || 3030;

appWeb.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

httpWeb.listen(3030, function(){
  console.log('listening on *:3030 for website traffic');``
});

var webSocket;
ioWeb.on('connection', function(socketWeb){
  webSocket = socketWeb;
  socketWeb.on('end', function(msgWeb){
    console.log("ending this shit.");
    collectingData = false;
    socketInstance.off('message', messageCallback);
    printData();
  });

  socketWeb.on('reset', function(msgWeb){
    console.log("resetting the entire game");
    socketInstance.on('message', messageCallback);
    resetTimers();
  });
});


// resets all variables to allow for restart of attempts
function resetTimers() {
  peakPresures = [];
  numPeaks = 0;
  pressureSum = 0;
  pressureAvg = 0;
  avgBPM = 0;
  climbing = true;
  max = 0;
  min = 0;
  started = false;
  collectingData = true;

  pressureQueue = [];
  numPQElems = 0;
}

var pressureQueue = []; //Stores 3 pressure peak readings for use in getting the current pressure (current analysis)
var numPQElems = 0; //Number of elements in the pressure queue (current analysis)

var peakPressures = []; //Array storing all of the peak pressure readings (final analysis/graphs)
var numPeaks = 0; //Stores the number of pumps that the user has done (final analysis/graphs)

var pressureSum = 0; //Sum of all the peak pressures (final analysis variable use)
var pressureAvg = 0; //Stores the average pressure over time (final analysis variable)

var avgBPM = 0; //Stores average bpm (final analysis variable)
var climbing = true; //Stores if we're climbing up in values (finding peaks)
var max = 0; //Current maximum value (finding peaks)
var min = 0; //Finding minimum value (finding valleys)

var peakCounter = 0; //Stores the number of peaks (used for current analysis of bpm)
var currentBPM = 0; //Stores the current bpm

function analyze(data) {
  var millis = Date.now() - startTime; //Find the current time (used for end analysis)

  if (climbing && data >= max) { //Case where we're just climbing
    max = data;
  }
  else if (climbing && data < max) { //Case where we've found a peak
    emitBeat();


    peakPressures.push(max); //Store the peak in the pressures array (for final analysis)
    numPeaks++; //Increment number of peaks for end analysis



    peakCounter++; //Increment peaks for current bpm analysis




    //Populate and store peak values in the pressureQueue (3 values in array max)
    if (numPQElems < 3) {
      pressureQueue.push(max);
      numPQElems++;
    } else {
      pressureQueue.shift();
      pressureQueue.push(max);
    }



    pressureSum+=max; //Add the current peak value to our existing pressure sum
    pressureAvg = pressureSum/numPeaks; //Find the total average pressure exerted (used for end analysis)
    avgBPM = numPeaks/(millis/60000); //Find the average bpm (for end analysis)

    min = max; //Switch variables for descent
    max = 0; //Reset max to allow for climbing to peak again later
    climbing = false; //no longer climbing 
  }

  else if (!climbing && data < min) { // In the case that we are descending and continue to descend
    min = data;
  }
  else if (!climbing && data > min) { // In the case that we were descending and have found the valley
    climbing = true; //begin rise again
    max = data; 
  }
}

// Allows us to print the end analysis data
function printData() {
  console.log("Average Pressure: " + pressureAvg);
  console.log("Average BPM: " + avgBPM);
  console.log("Number of pumps: " + numPeaks);

  avgBPM = Math.floor(avgBPM);
  webSocket.emit('endBPM', avgBPM);

  pressureAvg = Math.floor(pressureAvg*0.224809);
  webSocket.emit('endAvgPressure', pressureAvg);
}

// emitting the current bpm data during the testing
function emitBPM() {
  webSocket.emit('bpm', currentBPM);
}

function emitBeat() {
  console.log(numPeaks);
  webSocket.emit('beat', "test");
}

// Allows us to check for the amount of pumps produced within every 5 seconds
setInterval(function(){ 
  //code goes here that will be run every 5 seconds.  
  currentBPM = (peakCounter/5000)*60000;
  emitBPM();
  peakCounter = 0;
}, 5000);

// Allows us to print the average of the 3 most recent peak pressures (current analysis)
function emitPressure() {
  var pressureQSum = 0;
  for(var i = 0; i < pressureQueue.length; i++) {
    pressureQSum += pressureQueue[i];
  }
  var finalPressureAvg = Math.floor((pressureQSum/numPQElems)*0.224809) + ""; //conversion from N to lbs
  webSocket.emit('force', finalPressureAvg);
}
