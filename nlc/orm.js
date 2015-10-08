var sequelize = require('sequelize');
var core = app_require('nlc/core');

var ORM = function(){

	var orm = this;

	this.sequelize = null;

	this.init = function(){
		this.sequelize = new Sequelize('mysql://nodejs:nodejs@localhost/nodejs');
	};

	this.init();
};

router.exports = new ORM();