var _ = require('lodash');
var Sequelize = require('sequelize');
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
		this.sequelize = new Sequelize('mysql://nodejs:nodejs@localhost:3306/nodejs',{logging: false});
		return this;
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
	 * Convert a modelConfig Object to a sequelize configuration object passed to sequelize.define
	 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
	 * @param  {Object} modelConfig A model config to convert
	 * @return {Object}
	 */
	this.convertConfigToSequelize = function(modelConfig){
		var sequelizeConfig = {};
		// TODO : Use a converter object and cut this into functions
		_.forEach(modelConfig,function(fieldOptions,fieldName){
			var sequelizeFieldOptions = {};
			_.forEach(fieldOptions,function(optionValue,optionName){
				switch(optionName){
					case 'type':
						var res;
						var functionRegex = /^([a-z]+)(\(([0-9,]+)\))?$/gi;

						if(optionValue.match(/^(VARCHAR|STRING)$/g)){
							optionValue = Sequelize.STRING;
						}else if( (res = functionRegex.exec(optionValue))!==null ) {
							var type = res[1].toUpperCase();
							if(type === 'VARCHAR'){
								type = 'STRING';
							}
							var typeParam = null;
							if( res[2] !== undefined ){
								typeParam = res[3].split(',');
							}
							if(typeParam===null){
								optionValue = Sequelize[type];
							}else{
								optionValue = Sequelize[type].apply(Sequelize,typeParam);
							}
						}else{
							throw 'Invalid model option';
						}

						sequelizeFieldOptions[optionName] = optionValue;
						break;
					case 'defaultValue':
						if( optionValue instanceof Object){
							var generator;
							if( (optionValue['generator'] !== undefined) && (generator = optionValue['generator']) ){
								// TODO : Add generator classes/methods somewhere
								switch(generator){
									case 'uuid':
										optionValue = function(){
											var data = uuid.v1();
											// 58e0a7d7-eebc-11d8-9669-0800200c9a66 => 11d8eebc58e0a7d796690800200c9a66
											var parts = data.split('-');
											data = parts[2]+parts[1]+parts[0]+parts[3]+parts[4];
											// console.log(data);
											return data;
										};
										break;
									default: 
										throw 'Not a valid generator given in defaultValue';
								}								
							}
						}
					default:
						sequelizeFieldOptions[optionName] = optionValue;
						break;
				}
			});
			sequelizeConfig[fieldName] = sequelizeFieldOptions;
		});
		return sequelizeConfig;
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