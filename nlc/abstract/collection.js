var AbstractCollection = function(modelName, factory){
	this.modelName = modelName;
	this.setFactory(factory);
	this.objectList = [];
	this.limit = 0;
	this.offset = 0;
	this.total = 0;
};

AbstractCollection.prototype.setFactory = function(factory){
	this._factory = factory;
	return this;
};

AbstractCollection.prototype.getFactory = function(){
	return this._factory;
};

AbstractCollection.prototype.getModel = function(row){
	return (new this._modelClass()).load(row);
};

AbstractCollection.prototype.getModelClass = function(){
	// Must be defined in the prototype of the "final" class
	return this._modelClass;
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
		var ModelClass = this.getModelClass();
		objectList.forEach(function(row,k){
			if( !(row instanceof ModelClass) ){
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