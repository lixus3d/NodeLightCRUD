var Q = require('q');
var sequelizeConverter = app_require('nlc/converter/sequelize');

module.exports = function(customizer, modelName, daoClass){
	return Q.when(customizer.getFactory().buildModelFields(modelName)).then(function(modelFields){
		modelFields = sequelizeConverter.convertConfigToSequelize(modelFields);
		daoClass.prototype.sequelize = orm.sequelize.define(modelName,modelFields,{freezeTableName: true});
		return daoClass;
	});
};