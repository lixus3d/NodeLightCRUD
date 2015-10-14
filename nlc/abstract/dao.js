var AbstractDao = function(modelName){
	this.modelName = modelName;
};

AbstractDao.prototype.getFactory = function(){
	return app_require('nlc/factory');
};

AbstractDao.prototype.getCollection = function(rows){
	return this.getFactory().getCollection(this.modelName).load(rows);
};

AbstractDao.prototype.getModel = function(row){
	return this.getFactory().getModel(this.modelName).load(row);
};

AbstractDao.prototype.findById = function(){
	var args = arguments;
	var self = this;
	var p = new Promise(function(resolve,reject){
		self.sequelize.findById.apply(self.sequelize,args).then(function(result){
			if( result ){
				var instance = self.getModel(result);
				resolve(instance);
			}else{
				resolve(null);
			}
		}).catch(reject);
	});
	return p;
};

AbstractDao.prototype.findAndCountAll = function(){
	var args = arguments;
	var self = this;
	var p = new Promise(function(resolve,reject){
		self.sequelize.findAndCountAll.apply(self.sequelize,args).then(function(result){
			var collection = self.getCollection(result.rows)
									.setTotal(result.count)
									;
			resolve(collection);
		}).catch(reject);
	});
	return p;
};

AbstractDao.prototype.create = function(){
	var args = arguments;
	var self = this;
	var p = new Promise(function(resolve,reject){
		self.sequelize.create.apply(self.sequelize,args).then(function(result){
			if( result ){
				var instance = self.getModel(result);
				resolve(instance);
			}else{
				resolve(null);
			}
		}).catch(reject);
	});
	return p;
};



var wrappedMethods = [
	'sync',
];

wrappedMethods.forEach(function(method){
	AbstractDao.prototype[method] = function(){
		return this.sequelize[method].apply(this.sequelize,arguments);
	};
});

module.exports = AbstractDao;