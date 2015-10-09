
var AbstactBusiness = function(schema){
	this.schema = schema;
};

AbstactBusiness.prototype.getSchema = function(){
	return this.schema;
};

AbstactBusiness.prototype.findAll = function(limit, offset){
	limit = limit || 10;
	offset = offset || 0 ;

	var self = this;

	var promise = new Promise(function(resolve,reject){
		var schema = self.getSchema();

		schema.findAll().then(function(userList){
			var collection = userList;
			resolve(collection);
		});

	});

	return promise;
};

module.exports = AbstactBusiness;