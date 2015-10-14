var _ = require('lodash');

var AbstractModel = function(modelName){
	this.modelName = modelName;
	this.object = null;

	this.init();
};

AbstractModel.prototype.init = function(){
	var self = this;
	var modelFields = this.getModelFields();
	_.each(modelFields,function(attribute,name){
		Object.defineProperty(self, name, {
		  get: function() { return this.object[name]; },
		  set: function(val){ return (this.object[name] = val); }
		});
	});
};

AbstractModel.prototype.getFactory = function(){
	return app_require('nlc/factory');
};

AbstractModel.prototype.getModelFields = function(row){
	return this.getFactory().getModelFields(this.modelName);
};

AbstractModel.prototype.load = function(row){
	this.object = row;
	return this;
};

AbstractModel.prototype.toJSON = function(){
	return this.toPlainObject();
};

AbstractModel.prototype.toPlainObject = function(){
	var object = this.object.get({plain:true});
	_.each(object,function(v,k){
		if(v instanceof Buffer){
			object[k] = v.toString('hex');
		}
	});
	return object;
};

var wrappedMethods = [
	'save',
	'update',
	'destroy'
];

wrappedMethods.forEach(function(method){
	AbstractModel.prototype[method] = function(){
		return this.object[method].apply(this.object,arguments);
	};
});

module.exports = AbstractModel;