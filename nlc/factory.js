var _ = require('lodash');
var sequelizeConverter = app_require('nlc/converter/sequelize');
var orm = app_require('nlc/orm');
var AbstractModel = app_require('nlc/abstract/model');
var AbstractCollection = app_require('nlc/abstract/collection');
var AbstractDao = app_require('nlc/abstract/dao');

var Factory = function(){
	this._businesses = {};
	this._daos = {};
	this._collections = {};
	this._models = {};
	this._modelFields = {};

	this.MODEL = {};
	this.BUSINESS = {};
	this.COLLECTION = {};
	this.DAO = {};
};

/**
 * Get the model business instance
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 * @param  {String} modelName The name of the model of the business you want
 * @return {AbstractBusiness}
 */
Factory.prototype.getBusiness = function(modelName){
	if(!this._businesses[modelName]){
		this._businesses[modelName] = new (this.buildBusiness(modelName))();
	}
	return this._businesses[modelName];
};

/**
 * Get the model dao instance
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 * @param  {String} modelName The name of the model of the dao you want
 * @return {AbstractDao}
 */
Factory.prototype.getDao = function(modelName){
	if(!this._daos[modelName]){
		this._daos[modelName] = new (this.buildDao(modelName))();
	}
	return this._daos[modelName];
};

/**
 * Get a model collection instance
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 * @param  {String} modelName The name of the model of the collection you want
 * @return {AbstractCollection}
 */
Factory.prototype.getCollection = function(modelName){
	if(!this._collections[modelName]){
		this._collections[modelName] = this.buildCollection(modelName);
	}
	return new this._collections[modelName]();
};

/**
 * Get a model instance
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 * @param  {String} modelName The name of the model you want an instance
 * @return {AbstractModel}
 */
Factory.prototype.getModel = function(modelName){
	if(!this._models[modelName]){
		this._models[modelName] = this.buildModel(modelName);
	}
	return new this._models[modelName]();
};

/**
 * Get the model fields definition object
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 * @param  {String} modelName The name of the model fields you want the definition
 * @return {Object}
 */
Factory.prototype.getModelFields = function(modelName){
	if(!this._modelFields[modelName]){
		this._modelFields[modelName] = this.buildModelFields(modelName);
	}
	return this._modelFields[modelName];
};

/**
 * Require a specific model config object (model, business, ...)
 * Note that if the config object did not exist, we use an empty one (no need to create the xxxx.js file)
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 * @param  {String} modelName  The name of the model
 * @param  {String} objectType The name of the model config object type you want for the model
 * @return {Object}
 */
Factory.prototype.getModelObjectConfig = function(modelName, objectType){
	try{
		return app_require('models/'+modelName+'/'+objectType);
	}catch(e){
		if(e instanceof Error && e.code === "MODULE_NOT_FOUND"){
			return {};
		}
		throw e;
	}
};


Factory.prototype.buildModelFields = function(modelName){
	return this.getModelObjectConfig(modelName, 'fields');
};

Factory.prototype.buildBusiness = function(modelName){
	if(this.BUSINESS[modelName]===undefined){
		var factory = this;
		var objectConfig = this.getModelObjectConfig(modelName, 'business');

		this.BUSINESS[modelName] = function(){
			AbstractBusiness.call(this,modelName,factory);
		};

		objectConfig.constructor = this.BUSINESS[modelName];
		this.BUSINESS[modelName].prototype = _.create(AbstractBusiness.prototype,objectConfig);
	}

	return this.BUSINESS[modelName];
};

Factory.prototype.buildDao = function(modelName){
	if(this.DAO[modelName]===undefined){
		var factory = this;
		var objectConfig = this.getModelObjectConfig(modelName, 'dao');
		var modelFields = this.getModelFields(modelName);
		modelFields = sequelizeConverter.convertConfigToSequelize(modelFields);

		this.DAO[modelName] = function(){
			AbstractDao.call(this,modelName,factory);
		};

		objectConfig.constructor = this.DAO[modelName];
		objectConfig.sequelize = orm.sequelize.define(modelName,modelFields,{freezeTableName: true});
		this.DAO[modelName].prototype = _.create(AbstractDao.prototype,objectConfig);
	}
	return this.DAO[modelName];
};

Factory.prototype.buildCollection = function(modelName){
	if(this.COLLECTION[modelName]===undefined){
		var factory = this;
		var objectConfig = this.getModelObjectConfig(modelName, 'collection');

		this.COLLECTION[modelName] = function(){
			AbstractCollection.call(this,modelName,factory);
		};

		objectConfig.constructor = this.COLLECTION[modelName];
		this.COLLECTION[modelName].prototype = _.create(AbstractCollection.prototype,objectConfig);
	}
	return this.COLLECTION[modelName];
};

Factory.prototype.buildModel = function(modelName){
	if(this.MODEL[modelName]===undefined){
		var factory = this;
		var objectConfig = this.getModelObjectConfig(modelName, 'model');

		this.MODEL[modelName] = function(){
			AbstractModel.call(this,modelName,factory);
		};

		objectConfig.constructor = this.MODEL[modelName];
		this.MODEL[modelName].prototype = _.create(AbstractModel.prototype,objectConfig);
	}
	return this.MODEL[modelName];
};

module.exports = new Factory();