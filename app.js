// Include Express
var express = require('express');
// Use cluster
var cluster = require('cluster');

if( cluster.isMaster ){

 	// Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    while(cpuCount--){
    	cluster.fork();
    }

	cluster.on('exit', function (worker) {
	    // Replace the dead worker,
	    // we're not sentimental
	    console.log('Worker %d died :(', worker.id);
	    cluster.fork();
	});

}else{

	// Create a new Express application
	var app = express();

}