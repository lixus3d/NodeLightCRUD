var _ = require('lodash');
var AbstractBusiness = app_require('nlc/abstract/business');

var Business = function(){
	AbstractBusiness.call(this);
};

Business.prototype = _.create(AbstractBusiness.prototype,{
	constructor: Business,
});

module.exports = new Business();