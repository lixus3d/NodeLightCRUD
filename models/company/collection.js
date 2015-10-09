var _ = require('lodash');
var AbstractCollection = app_require('nlc/abstract/collection');

var CollectionCompany = function(){
	AbstractCollection.call(this);

	this.getName = function(){
		return 'CollectionCompany';
	};
};

CollectionCompany.prototype = _.create(AbstractCollection.prototype,{
	constructor: CollectionCompany
});

module.exports = CollectionCompany;