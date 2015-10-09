var _ = require('lodash');
var AbstractCollection = app_require('nlc/abstract/collection');

var CollectionAddress = function(){
	AbstractCollection.call(this);

	this.getName = function(){
		return 'CollectionAddress';
	};
};

CollectionAddress.prototype = _.create(AbstractCollection.prototype,{
	constructor: CollectionAddress
});

module.exports = CollectionAddress;