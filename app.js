var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var _ = require('lodash');
/**
 * Allow require with namespacing from application path
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 * @param  {String} name The path of the require from the app root directory (much like NS)
 * @return {mixed}
 */
global.app_require = function(name){
	return require(__dirname + '/' + name);
};

var routes = require('./routes/index');
var crud = require('./routes/crud');
var modelList = app_require('models');


var app = express();

// uncomment after placing your favicon in /public
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

_.forEach(modelList,function(modelName,modelNamePlural){
	app.use('/'+modelNamePlural, crud);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Undefined API endpoint');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace

app.use(function(err, req, res, next) {
  	console.error(err.stack);
	res.status(err.status || 500);
	res.json({
		type:'error',
		errors: [
			{
				message: err.message,
				error: (app.get('env') === 'development' ? err : {})
			}
		]
	});
});


module.exports = app;
