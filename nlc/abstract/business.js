
var AbstactBusiness = function(modelName){
	this.modelName = modelName;
};

AbstactBusiness.prototype.findAll = function(limit, offset){
	limit = limit || 10;
	offset = offset || 0 ;

	this.getModel().findAll();

};

module.exports = AbstactBusiness;