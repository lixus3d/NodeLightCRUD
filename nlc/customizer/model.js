var $promise = require('bluebird');

module.exports = function(customizer, modelName, modelClass){
	return $promise.resolve(customizer.getFactory().buildModelFields(modelName)).then(function(modelFields){
		modelClass.prototype._modelFields = modelFields;
		return modelClass;
	});
};