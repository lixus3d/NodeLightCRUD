var _ = require('lodash');

var AbstractModel = function(modelName, factory){
	this.modelName = modelName;
	if(factory){
		this.setFactory(factory);
	}
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

AbstractModel.prototype.setFactory = function(factory){
	this._factory = factory;
	return this;
};

AbstractModel.prototype.getFactory = function(){
	return this._factory;
};

AbstractModel.prototype.getModelFields = function(){
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
		var self = this;
		return this.object[method].apply(this.object,arguments).then(function(){ return self; });
	};
});

module.exports = AbstractModel;