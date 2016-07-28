// More info -> https://github.com/UlisesGascon/raspberrypi-system-info-data-to-firebase

var Firebase = require("firebase");
var fs = require('fs');
var sys = require('util');
var exec = require('child_process').exec, child;
var _=require('underscore');



var commands = require('./config.json');

  var config = {
    apiKey: "AIzaSyD03tfMzN7KtNrydxx73ScCDeuXhpDjZdg",
    authDomain: "ehatdig.firebaseapp.com",
    databaseURL: "https://ehatdig.firebaseio.com",
    storageBucket: "ehatdig.appspot.com",
  };
 Firebase.initializeApp(config);
 var ref = Firebase.database().ref('monitor').child("commands");
 _.each(commands, function(command){
   ref.child(command.name).set(command);

 });


ref = Firebase.database().ref('monitor').child("database");
setInterval(function(){
  _.each(commands, function(command){

        if(command.nextexec == undefined || _.now() >= command.nextexec){
            child = exec(command.exec, function (error, stdout, stderr) {
                if (error !== null) {
                  ref.child(command.name).child("error").push().set(_.now()+":"+error);
                  console.error('exec error: ' + error);
                } else {
                  stdout = stdout.replace("\n", "");
                  console.log(command.name + " " + stdout);
                  ref.child(command.name).child("data").push().set(stdout);

                }
              }
            );
            command.nextexec = _.now() + command.time;
        }
  });


}, 1000);
