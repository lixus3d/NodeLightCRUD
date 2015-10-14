var AbstractModel = app_require('nlc/abstract/model');

var AbstractCollection = function(modelName){
	this.modelName = modelName;
	this.objectList = [];
	this.limit = 0;
	this.offset = 0;
	this.total = 0;
};

AbstractCollection.prototype.getFactory = function(){
	return app_require('nlc/factory');
};

AbstractCollection.prototype.getModel = function(row){
	return this.getFactory().getModel(this.modelName).load(row);
};

AbstractCollection.prototype.setLimit = function(limit){
	this.limit = parseInt(limit,10) || 10;
	return this;
};
AbstractCollection.prototype.setOffset = function(offset){
	this.offset = parseInt(offset,10) || 0;
	return this;
};
AbstractCollection.prototype.setTotal = function(total){
	this.total = parseInt(total,10) || 0;
	return this;
};

AbstractCollection.prototype.getLength = function(){
	return this.objectList.length;
};

AbstractCollection.prototype.getOffset = function(){
	return this.offset;
};

AbstractCollection.prototype.getLimit = function(){
	return this.limit;
};

AbstractCollection.prototype.getTotal = function(){
	return this.total;
};

AbstractCollection.prototype.load = function(objectList){
	var self = this;

	if( objectList instanceof Array){
		objectList.forEach(function(row,k){
			if( !(row instanceof AbstractModel) ){
				objectList[k] = self.getModel(row);
			}
		});
		this.objectList = objectList;
	}else throw 'Invalid objectList given to load';
	return this;
};

AbstractCollection.prototype.each = function(callback){
	for (var i = 0, l = this.objectList.length; i < l; i++) {
		callback(this.objectList[i], i);
	}
};

AbstractCollection.prototype.toJSON = function(){
	return this.objectList;
};

module.exports = AbstractCollection;