
var Q = require('q');

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
 * Note : Can be shared with browser
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 * @param  {String} modelName The model name of this collection class
 * @param  {Function} daoClass  The collection class to customize
 * @return {Promise}
 */
Customizer.prototype.collectionCustomize = function(modelName, collectionClass){
	return collectionCustomizer(this, modelName, collectionClass);
};

module.exports = Customizer;
