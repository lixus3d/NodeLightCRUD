var AbstractDao = function(modelName, factory){
	this.modelName = modelName;
	if(factory){
		this.setFactory(factory);
	}
};

AbstractDao.prototype.setFactory = function(factory){
	this._factory = factory;
	return this;
};

AbstractDao.prototype.getFactory = function(){
	return this._factory;
};

AbstractDao.prototype.getCollection = function(rows){
	return this.getFactory().getCollection(this.modelName).load(rows);
};

AbstractDao.prototype.getModel = function(row){
	return this.getFactory().getModel(this.modelName).load(row);
};

AbstractDao.prototype.findById = function(){
	return this.sequelizeCall('findById',arguments,this.rowToModel.bind(this));
};

AbstractDao.prototype.findAndCountAll = function(){
	return this.sequelizeCall('findAndCountAll',arguments,this.resultToCollection.bind(this));
};

AbstractDao.prototype.create = function(){
	return this.sequelizeCall('create',arguments,this.rowToModel.bind(this));
};

AbstractDao.prototype.rowToModel = function(row){
	if(row){
		return this.getModel(row);
	}else{
		return null;
	}
};

AbstractDao.prototype.resultToCollection = function(result){
	var collection = this.getCollection(result.rows)
							.setTotal(result.count)
							;
	return collection;
};

AbstractDao.prototype.sequelizeCall = function(method, args, resolveCallback){
	return this.sequelize[method].apply(this.sequelize,args).then(resolveCallback);
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