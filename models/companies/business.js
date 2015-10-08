var _ = require('lodash');

var AbstractBusiness = app_require('nlc/abstract/business');

var CompanyBusiness = function(){
	AbstractBusiness.call(this,'companies');

	var business = this;
};

CompanyBusiness.prototype = _.create(AbstractBusiness.prototype,{
	constructor: CompanyBusiness,
});

module.exports = CompanyBusiness;