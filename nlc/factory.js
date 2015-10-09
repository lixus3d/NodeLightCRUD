
var Factory = function(){
	this._businesses = {};
	this._daos = {};
	this._collections = {};
};

Factory.prototype.getBusiness = function(modelName){
	if(!this._businesses[modelName]){
		this._businesses[modelName] = app_require('models/'+modelName+'/business');
	}
	return this._businesses[modelName];
};

Factory.prototype.getDao = function(modelName){
	if(!this._daos[modelName]){
		this._daos[modelName] = app_require('models/'+modelName+'/dao');
	}
	return this._daos[modelName];
};

Factory.prototype.getCollection = function(modelName){
	if(!this._collections[modelName]){
		this._collections[modelName] = app_require('models/'+modelName+'/collection');
	}
	return new this._collections[modelName]();
};

module.exports = new Factory();