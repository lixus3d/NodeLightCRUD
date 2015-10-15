
var AbstractModel = app_require('nlc/abstract/model');
var AbstractCollection = app_require('nlc/abstract/collection');
var AbstractDao = app_require('nlc/abstract/dao');

/**
 * Use to provide the Abstract Classes in this particular environnement
 * Note : Not necessary shared between all env.
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 * @param  {Factory} factory The factory it depends on
 */
var Provider = function(factory){
	// Not used for now
	this.setFactory(factory);
};

Provider.prototype.setFactory = function(factory){
	this._factory = factory;
	return this;
};

Provider.prototype.getFactory = function(){
	return this._factory;
};

/**
 * Provide the AbstractClass to use in this environnement
 * Note : This class might be overwrite when you change environnement (browser, mobile app, etc...)
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 * @param  {String} objectType The objectType of the abstract class you want (collection, dao, etc.)
 * @return {Function} "Class" function
 */
Provider.prototype.getAbstractClass = function(objectType){
	switch(objectType){
		case 'collection':
			return AbstractCollection;
		case 'dao':
			return AbstractDao;
		case 'model':
			return AbstractModel;
		case 'business':
			return AbstractBusiness;
	}
};

module.exports = Provider;
