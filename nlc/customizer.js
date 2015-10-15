
var Q = require('q');
var orm = app_require('nlc/orm');

var daoCustomizer = app_require('nlc/customizer/dao');
var collectionCustomizer = app_require('nlc/customizer/collection');

/**
 * Provide the "Final" Object classes customization
  * Note : Not necessary shared between all env.
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 * @param  {Factory} factory The factory it depends on
 */
var Customizer = function(factory){
	this.setFactory(factory);
};

Customizer.prototype.setFactory = function(factory){
	this._factory = factory;
	return this;
};

Customizer.prototype.getFactory = function(){
	return this._factory;
};

/**
 * Customize the DAO for sequelize
 * TODO : Externalize to a dao customizer
 * Note : Can't be shared with browser
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 * @param  {String} modelName The model name of this dao class
 * @param  {Function} daoClass  The dao class to customize
 * @return {Promise}
 */
Customizer.prototype.daoCustomize = function(modelName, daoClass){
	return daoCustomizer(this, modelName, daoClass);
};

/**
 * Customize the Collection
 * TODO : Externalize to a collection customizer
 * Note : Can be shared with browser
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 * @param  {[type]} modelName       [description]
 * @param  {[type]} collectionClass [description]
 * @return {[type]}                 [description]
 */
Customizer.prototype.collectionCustomize = function(modelName, collectionClass){
	return Q.when(this.getFactory().buildModel(modelName)).then(function(modelClass){
		collectionClass.prototype._modelClass = modelClass;
		return collectionClass;
	});
};

module.exports = Customizer;
