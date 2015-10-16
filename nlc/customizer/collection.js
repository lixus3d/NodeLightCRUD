var Q = require('q');

module.exports = function(customizer, modelName, collectionClass){
	return Q.when(customizer.getFactory().buildModel(modelName)).then(function(modelClass){
		collectionClass.prototype._modelClass = modelClass;
		return collectionClass;
	});
};