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
                  var obj = { time: _.now(),
                              value : error};

                  ref.child(command.name).child("error").push().set(error);
                } else {
                  stdout = stdout.replace("\n", "");

                    var obj = { time: Firebase.,
                                value : stdout};

                  ref.child(command.name).child("data").push().set(obj);

                }
              }
            );
            command.nextexec = _.now() + command.time;
        }
  });


}, 1000);
