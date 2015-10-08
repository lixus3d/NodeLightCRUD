
var Factory = function(){
	var _businesses = {};
};

Factory.prototype.getBusiness = function(modelName){
	if(!this._businesses[modelName]){
		var modelBusiness = require('models/'+modelName+'/business');
		this._businesses = new modelBusiness();
	}
	return this._businesses[modelName];
};

router.exports = new Factory();