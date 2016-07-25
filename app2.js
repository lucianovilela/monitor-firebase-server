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

var ref = Firebase.database().ref('comandos');

ref.on("value", function(snapshot){
  console.log(snapshot.val());
  child = exec(snapshot.val(), function (error, stdout, stderr) {
  if (error !== null) {
    console.log('exec error: ' + error);
  } else {
    console.log(stdout);
  }
});

}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});
