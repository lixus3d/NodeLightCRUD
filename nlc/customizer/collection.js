var $promise = require('bluebird');

module.exports = function(customizer, modelName, collectionClass){
	return $promise.resolve(customizer.getFactory().buildModel(modelName)).then(function(modelClass){
		collectionClass.prototype._modelClass = modelClass;
		return collectionClass;
	});
};