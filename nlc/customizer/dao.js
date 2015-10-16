var $promise = require('bluebird');

var orm = app_require('nlc/orm');
var sequelizeConverter = app_require('nlc/converter/sequelize');

module.exports = function(customizer, modelName, daoClass){
	return $promise.resolve(customizer.getFactory().buildModelFields(modelName)).then(function(modelFields){
		modelFields = sequelizeConverter.convertConfigToSequelize(modelFields);
		daoClass.prototype.sequelize = orm.sequelize.define(modelName,modelFields,{freezeTableName: true});
		return daoClass;
	});
};