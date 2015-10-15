var _ = require('lodash');
var Q = require('q');

var Provider = app_require('nlc/provider');
var Customizer = app_require('nlc/customizer');

var Factory = function(){
	this._businesses = {};
	this._daos = {};
	this._customizer = new Customizer(this);
	this._provider = new Provider(this);

	this.classes = {
		fields: {},
		model: {},
		business: {},
		collection: {},
		dao: {},
	};
};

/**
 * Return the abstract class to use for a particular objectType
 * This method use the Provider to get the abstract class
 * Note : Usually the classes are AbstractCollection, AbstractDao, etc...
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 * @param  {String} objectType The object type you want the abstract class
 * @return {mixed}
 */
Factory.prototype.getAbstractClass = function(objectType){
	return this._provider.getAbstractClass(objectType);
};

/**
 * Get the model business instance
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 * @param  {String} modelName The name of the model of the business you want
 * @return {AbstractBusiness}
 */
Factory.prototype.getBusiness = function(modelName){
	if(!this._businesses[modelName]){
		var factory = this;
		return Q.when(this.buildBusiness(modelName)).then(function(businessClass){
			factory._businesses[modelName] = new businessClass();
			return factory._businesses[modelName];
		});
	}else{
		return Q.fcall(this._businesses[modelName]);
	}
};

/**
 * Get the model dao instance
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 * @param  {String} modelName The name of the model of the dao you want
 * @return {AbstractDao}
 */
Factory.prototype.getDao = function(modelName){
	var factory = this;
	if(!this._daos[modelName]){
		return Q.when(this.buildDao(modelName)).then(function(daoClass){
			factory._daos[modelName] = new daoClass();
			return factory._daos[modelName];
		});
	}else{
		return Q.fcall(function(){return factory._daos[modelName];});
	}
};

/**
 * Get a model collection instance
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 * @param  {String} modelName The name of the model of the collection you want
 * @return {AbstractCollection}
 */
Factory.prototype.getCollection = function(modelName){
	return Q.when(this.buildCollection(modelName)).then(function(collectionClass){
		return new collectionClass();
	});
};

/**
 * Get a model instance
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 * @param  {String} modelName The name of the model you want an instance
 * @return {AbstractModel}
 */
Factory.prototype.getModel = function(modelName){
	return Q.when(this.buildModel(modelName)).then(function(modelClass){
		return new modelClass();
	});
};

/**
 * Get the model fields definition object
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 * @param  {String} modelName The name of the model fields you want the definition
 * @return {Object}
 */
Factory.prototype.getModelFields = function(modelName){
	return Q.when(this.buildModelFields(modelName)).then(function(modelFields){
		return modelFields;
	});
};

/**
 * Require a specific model config object (model, business, ...)
 * Note that if the config object did not exist, we use an empty one (no need to create the xxxx.js file)
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 * @param  {String} modelName  The name of the model
 * @param  {String} objectType The name of the model config object type you want for the model
 * @return {Object}
 */
Factory.prototype.getModelConfigObject = function(modelName, objectType){
	var deferred = Q.defer();
	try{
		var objectConfig = app_require('models/'+modelName+'/'+objectType);
		deferred.resolve(objectConfig);
	}catch(e){
		if(e instanceof Error && e.code === "MODULE_NOT_FOUND"){
			deferred.resolve({});
		}
		deferred.reject(e);
	}
	return deferred.promise;
};

/**
 * Get the config object for the model fields and store it for futur use
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 * @param  {String} modelName The model name you want the fields
 * @return {Promise}
 */
Factory.prototype.buildModelFields = function(modelName){
	var objectType = 'fields';
	if(this.classes[objectType][modelName]===undefined){
		var factory = this;
		return this.getModelConfigObject(modelName, objectType).then(function(objectConfig){
			factory.classes[objectType][modelName] = objectConfig;
			return factory.classes[objectType][modelName];
		});
	}
	return this.classes[objectType][modelName];
};

Factory.prototype.buildBusiness = function(modelName){
	return this.buildObject(modelName,'business');
};

Factory.prototype.buildDao = function(modelName){
	return this.buildObject(modelName,'dao');
};

Factory.prototype.buildCollection = function(modelName){
	return this.buildObject(modelName,'collection');
};

Factory.prototype.buildModel = function(modelName){
	return this.buildObject(modelName,'model');
};

/**
 * Build a class of objectType for modelName dynamically
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 * @param  {String} modelName  The model name of the class you want to create
 * @param  {String} objectType The class type of the class you want to create
 * @return {Promise}
 */
Factory.prototype.buildObject = function(modelName, objectType){
	if(this.classes[objectType][modelName]===undefined){
		var factory = this;

		return this.getModelConfigObject(modelName, objectType).then(function(objectConfig){
			var AbstractClass = factory.getAbstractClass(objectType);

			var ObjectClass = function(){
				AbstractClass.call(this,modelName,factory);
			};

			objectConfig.constructor = ObjectClass;
			ObjectClass.prototype = _.create(AbstractClass.prototype,objectConfig);
			if(factory._customizer[objectType+'Customize']!==undefined){
				return factory._customizer[objectType+'Customize'](modelName, ObjectClass).then(function(ObjectClass){
					return factory.assignObjectClass(modelName, objectType, ObjectClass);
				});
			}else{
				return factory.assignObjectClass(modelName, objectType, ObjectClass);
			}
		});
	}
	return this.classes[objectType][modelName];
};

/**
 * Store an ObjectClass for future use
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 */
Factory.prototype.assignObjectClass = function(modelName, objectType, ObjectClass){
	return (this.classes[objectType][modelName] = ObjectClass);
};

module.exports = new Factory();