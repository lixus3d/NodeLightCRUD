var _ = require('lodash');
var Sequelize = require('sequelize');
var SequelizeUtils = require('sequelize/lib/utils');
var DataTypes = require('sequelize/lib/data-types');
var uuid = require('node-uuid');
var core = app_require('nlc/core');

var ORM = function(){

	var orm = this;

	this.sequelize = null;

	/**
	 * Init the orm with a default connection
	 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
	 * @return {this}
	 */
	this.init = function(){
		this.initCustomDataTypes(Sequelize);
		this.sequelize = new Sequelize('mysql://nodejs:nodejs@localhost:3306/nodejs',{logging: console.log});
		return this;
	};

	this.initCustomDataTypes = function(){
		var BINARY = function(length){
			var options = typeof length === 'object' && length || {
				length: length
			};

			if (!(this instanceof BINARY)) return new BINARY(options);

			this.options = options;
  			this._binary = true;
			this._length = options.length || 32;
		};
		SequelizeUtils.inherit(BINARY,DataTypes.ABSTRACT);

		BINARY.prototype.dialectTypes = '';
		BINARY.prototype.key = BINARY.key = 'BINARY';
		BINARY.prototype.toSql = function() {
			return 'BINARY(' + this._length + ')';
		};
		BINARY.prototype.validate = function(value) {
			// TODO : Validate
			return true;
		};
		BINARY.prototype.setter = function(value){
			this.setDataValue('id',new Buffer(val,'hex'));
		};
		Sequelize.BINARY = BINARY;
	};

	/**
	 * Build a Sequelize Model/Schema from a modelName
	 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
	 * @param  {String} modelName The model name to build the schema for
	 * @return {Model}
	 */
	this.buildModel = function(modelName){
		var modelConfig = this.getModelConfig(modelName);
		return this.buildModelFromConfig(modelName, modelConfig);
	};

	/**
	 * Retrieve the config object for given modelName
	 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
	 * @param  {String} modelName The model name to get the config object
	 * @return {Object}
	 */
	this.getModelConfig = function(modelName){
		var modelConfig = app_require('models/'+modelName+'/model');
		// TODO : What does node do if there is no model ? exception ?
		return modelConfig;
	};

	/**
	 * Build a Sequelize Model/Schema of a modelName with a modelConfig
	 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
	 * @param  {String} modelName   The model name
	 * @param  {Object} modelConfig A model config oject
	 * @return {Model}
	 */
	this.buildModelFromConfig = function(modelName, modelConfig){
		modelConfig = this.convertConfigToSequelize(modelConfig);
		return this.sequelize.define(modelName,modelConfig,{freezeTableName: true});
	};


	/**
	 * Overload a Sequelize Model to manipulate
	 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
	 * @return {[type]} [description]
	 */
	this.buildDao = function(){

	};


	this.init();
};

module.exports = new ORM();