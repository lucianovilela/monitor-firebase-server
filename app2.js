// More info -> https://github.com/UlisesGascon/raspberrypi-system-info-data-to-firebase

var Firebase = require("firebase");
var fs = require('fs');
var sys = require('util');
var exec = require('child_process').exec, child, child1;
var _=require('underscore');

var commands = [];

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

ref.on("child_added", function(snapshot, prevChildKey){
      console.log(snapshot.val());
      commands.push(snapshot.val());

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    }
);


setInterval(function(){
  _.each(commands, function(index, command){
    child = exec(command.exec, function (error, stdout, stderr) {
        if (error !== null) {
          console.error('exec error: ' + error);
        } else {
          console.log(command.name + " " + stdout);
        }
      }
    );


  });


}, 1000);
