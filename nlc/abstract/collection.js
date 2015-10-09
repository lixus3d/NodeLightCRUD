var AbstractCollection = function(){
	this.objectList = [];
	this.offset = 0;
	this.total = 0;
};

AbstractCollection.prototype.getLength = function(){
	return this.objectList.length;
};

AbstractCollection.prototype.getOffset = function(){
	return this.offset;
};

AbstractCollection.prototype.getTotal = function(){
	return this.total;
};

AbstractCollection.prototype.load = function(objectList){
	if( objectList instanceof Array){
		this.objectList = objectList;
	}else throw 'Invalid objectList given to load';
	return this;
};

AbstractCollection.prototype.each = function(callback){
	for (var i = 0, l = this.objectList.length; i < l; i++) {
		callback(this.objectList[i], i);
	}
};

AbstractCollection.prototype.export = function(){
	return this.objectList;
};

module.exports = AbstractCollection;