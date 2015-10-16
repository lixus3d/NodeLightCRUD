
var daoCustomizer = app_require('nlc/customizer/dao');
var collectionCustomizer = app_require('nlc/customizer/collection');
var modelCustomizer = app_require('nlc/customizer/model');

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
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 * @param  {String} modelName The model name of this collection class
 * @param  {Function} daoClass  The collection class to customize
 * @return {Promise}
 */
Customizer.prototype.collectionCustomize = function(modelName, collectionClass){
	return collectionCustomizer(this, modelName, collectionClass);
};

/**
 * Customize the Collection
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 * @param  {String} modelName The model name of this collection class
 * @param  {Function} daoClass  The collection class to customize
 * @return {Promise}
 */
Customizer.prototype.modelCustomize = function(modelName, modelClass){
	return modelCustomizer(this, modelName, modelClass);
};

module.exports = Customizer;
