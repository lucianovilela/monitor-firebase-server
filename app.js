// More info -> https://github.com/UlisesGascon/raspberrypi-system-info-data-to-firebase

var Firebase = require("firebase");
var fs = require('fs');
var sys = require('util');
var exec = require('child_process').exec, child, child1;

  var config = {
    apiKey: "AIzaSyD03tfMzN7KtNrydxx73ScCDeuXhpDjZdg",
    authDomain: "ehatdig.firebaseapp.com",
    databaseURL: "https://ehatdig.firebaseio.com",
    storageBucket: "ehatdig.appspot.com",
  };
 Firebase.initializeApp(config);


var fastTime = 5000; // Time used to check the memory buffered and CPU Temp.
var customTime = 60000; // Time used to check the uptime.
var slowTime = 10000; // Time used to check the top list and CPU usage.

  // Function for checking memory
    child = exec("egrep --color 'MemTotal' /proc/meminfo | egrep '[0-9.]{4,}' -o", function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
    } else {
      memTotal = stdout.replace("\n","");
      var myFirebaseRef = Firebase.database().ref("/memory/total");
      myFirebaseRef.set(parseInt(memTotal));
    }
  });

  // Function for checking hostname
    child = exec("hostname", function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
    } else {
      var hostname = stdout.replace("\n","");
      var myFirebaseRef = Firebase.database().ref("/hostname");
      myFirebaseRef.set(hostname);
    }
  });

  // Function for checking uptime
    child = exec("uptime | tail -n 1 | awk '{print $1}'", function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
    } else {
	    var uptime = stdout.replace("\n","");
      	var myFirebaseRef = Firebase.database().ref("/uptime");
      	myFirebaseRef.set(uptime);
    }
  });

  // Function for checking Kernel version
    child = exec("uname -r", function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
    } else {
      var kernel = stdout.replace("\n","");
      var myFirebaseRef = Firebase.database().ref("/kernel");
      myFirebaseRef.set(kernel);
    }
  });

  // Function for checking Top list
    child = exec("top -d 0.5 -b -n2 | tail -n 10 | awk '{print $12}'", function (error, stdout, stderr) {
	    if (error !== null) {
	      console.log('exec error: ' + error);
	    } else {
      		var myFirebaseRef = Firebase.database().ref("/toplist");
      		myFirebaseRef.set(stdout);
	    }
	  });

  setInterval(function(){
  // Function for checking memory free and used
    child1 = exec("egrep --color 'MemFree' /proc/meminfo | egrep '[0-9.]{4,}' -o", function (error, stdout, stderr) {
    if (error == null) {
      memFree = stdout.replace("\n","");
      memUsed = parseInt(memTotal)-parseInt(memFree);
      percentUsed = Math.round(parseInt(memUsed)*100/parseInt(memTotal));
      percentFree = 100 - percentUsed;

      var myFbmFRef = Firebase.database().ref("/memory/free");
	    var myFbmURef = Firebase.database().ref("/memory/used");
	    var myFbPMURef = Firebase.database().ref("/memory/percent/used");
	    var myFbPMFRef = Firebase.database().ref("/memory/percent/free");
      myFbmFRef.set(parseInt(memFree));
	    myFbmURef.set(memUsed);
	    myFbPMURef.set(percentUsed);
	    myFbPMFRef.set(percentFree);

    } else {
      sendData = 0;
      console.log('exec error: ' + error);
    }
  	});

  // Function for checking memory buffered
    child1 = exec("egrep --color 'Buffers' /proc/meminfo | egrep '[0-9.]{4,}' -o", function (error, stdout, stderr) {
    if (error == null) {
      memBuffered = stdout.replace("\n","");
      percentBuffered = Math.round(parseInt(memBuffered)*100/parseInt(memTotal));
      var myFbmBRef = Firebase.database().ref("/memory/buffered");
      var myFbPMBRef = Firebase.database().ref("/memory/percent/buffered");
      myFbmBRef.set(parseInt(memBuffered));
	  myFbPMBRef.set(percentBuffered);

    } else {
      sendData = 0;
      console.log('exec error: ' + error);
    }
  });

  // Function for checking memory buffered
    child1 = exec("egrep --color 'Cached' /proc/meminfo | egrep '[0-9.]{4,}' -o", function (error, stdout, stderr) {
    if (error == null) {
      memCached = stdout.replace("\n","");
      percentCached = Math.round(parseInt(memCached)*100/parseInt(memTotal));
      var myFbmCRef = Firebase.database().ref("/memory/cached");
      var myFbPMCRef = Firebase.database().ref("/memory/percent/cached");
      myFbmCRef.set(parseInt(memCached));
	  myFbPMCRef.set(percentCached);
    } else {
      console.log('exec error: ' + error);
    }
  });}, fastTime);

  // Function for measuring temperature
  setInterval(function(){
    child = exec("cat /sys/class/thermal/thermal_zone0/temp", function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
    } else {
      //For charts we need (X axis) time and (Y axis) temperature.
      var date = new Date().getTime();
      var temp = parseFloat(stdout)/1000;
      var myFbtRef = Firebase.database().ref("/CPU/temp");
      var myFbttRef = Firebase.database().ref("/CPU/tempdate");
      myFbtRef.set(temp);
	    myFbttRef.set(date);

    }
  });}, fastTime);

  setInterval(function(){
    child = exec("top -d 0.5 -b -n2 | grep 'Cpu(s)'|tail -n 1 | awk '{print $2 + $4}'", function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
    } else {
      //For charts we need (X axis) time and (Y axis) percentaje.
      var date = new Date().getTime();
      var cpuUsageUpdate = parseFloat(stdout);
      var myFbcRef = Firebase.database().ref("/CPU/usage");
      var myFbctRef = Firebase.database().ref("/CPU/usagedate");
      myFbcRef.set(cpuUsageUpdate);
	    myFbctRef.set(date);
    }
  });}, slowTime);

	// Uptime
  setInterval(function(){
    child = exec("uptime | tail -n 1 | awk '{print $1}'", function (error, stdout, stderr) {
	    if (error !== null) {
	      console.log('exec error: ' + error);
	    } else {
	    	var uptime = stdout.replace("\n","");
      		var myFirebaseRef = Firebase.database().ref("/uptime");
      		myFirebaseRef.set(uptime);
	    }
	  });}, customTime);

  // TOP list
  setInterval(function(){
    child = exec("ps aux --width 30 --sort -rss --no-headers | head  | awk '{print $11}'", function (error, stdout, stderr) {
	    if (error !== null) {
	      console.log('exec error: ' + error);
	    } else {
      var topControl = 1;
      var res = stdout.split("\n");
        for (r in res) {
          if (res[r] != "") {
                    var myFirebaseRef = Firebase.database().ref("/toplist/"+topControl);
                    myFirebaseRef.set(res[r]);
                    topControl++;
              }
        }
	    }
});}, slowTime);
