var express = require('express');
var _ = require('lodash');
var router = express.Router();

var core = app_require('nlc/core');
var factory = app_require('nlc/factory');
var modelList = app_require('models');

// Create table
router.post('/create', createTable);
// Read list
router.get('/', CRUDReadList);
// Read by id
router.get('/:id', CRUDRead);
// Create
router.post('/', CRUDCreate);
// Update
router.put('/:id', CRUDUpdate);
// TODO : Update Partial
// router.patch('/:id', CRUDPartial);
// Delete
router.delete('/:id', CRUDDelete);

/**
 * Return a param or its defaultValue if given
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 * @param  {Request} req The current request object
 * @param  {String} paramName   The param name you want to retrieve
 * @param  {mixed} defaultValue The default value to retrieve if the param is not present. If no defaultValue and param not present an exception is throwed
 * @return {mixed}
 */
function getParam(req, paramName, defaultValue){
	if( req.params[paramName] === undefined ){
		if(defaultValue!==undefined) return defaultValue;
		else throw 'Missing parameter '+paramName;
	}else{
		switch(paramName){
			case 'id':
				return core.convertToBuffer(req.params.id);
			default:
				return req.params[paramName];
		}
	}
}
/**
 * Return a param or its defaultValue if given
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 * @param  {Request} req The current request object
 * @param  {String} paramName   The param name you want to retrieve
 * @param  {mixed} defaultValue The default value to retrieve if the param is not present. If no defaultValue and param not present an exception is throwed
 * @return {mixed}
 */
function getQuery(req, paramName, defaultValue){
	if( req.query[paramName] === undefined ){
		if(defaultValue!==undefined) return defaultValue;
		else throw 'Missing parameter '+paramName;
	}else{
		return req.query[paramName];
	}
}

/**
 * A quick function to get directly the dao of the current request model
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 * @param  {Request} req The current request object
 * @return {Model}       Sequelize DAO
 */
function getDao(req){
	var	modelType = core.getModelType(req);
	return factory.getDao(modelType);
}

/**
 * Create the table for the given model (determine by url)
 * TODO : May add a production environnement lock
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 */
function createTable(req, res, next){
	getDao(req).sync({force: true}).then(function(){
		res.json( core.buildApiResponse(req, 'create-table', 'OK') );
	}).catch(next);
}

/**
 * Read a list from the storage for a given model (determine by url)
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 */
function CRUDReadList(req, res, next){
	var collection,
		modelType,
		offset,
		limit
		;

	modelType = core.getModelType(req);

	offset = parseInt(getQuery(req,'offset',0),10);
	limit = parseInt(getQuery(req,'limit',100),10);

	getDao(req).findAndCountAll({offset: offset, limit: limit}).then(function(collection){
		collection
			.setOffset(offset)
			.setLimit(limit)
			;
		res.json( core.buildApiResponse(req, 'read-list', collection) );
	}).catch(next);
}

/**
 * Read an instance by its id for a given model (determine by url)
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 */
function CRUDRead(req, res, next){
	var model,
		dao,
		modelType,
		id
		;

	id = getParam(req,'id');

	modelType = core.getModelType(req);

	getDao(req).findById(id).then(function(model){
		if( model ){
			res.json( core.buildApiResponse(req, 'read-by-id', model) );
		}else throw 'Ressource not found';
	}).catch(next);
}

/**
 * Create an instance and persist it for a given model (determine by url)
 * The instance properties is passed in request body as json
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 */
function CRUDCreate(req, res, next){
	var model;

	getDao(req).create(req.body).then(function(object){
		var model = object;
		res.json( core.buildApiResponse(req, 'create', model) );
	}).catch(next);
}

/**
 * Update an instance and persist it for a given model (determine by url)
 * The instance properties is passed in request body as json
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 */
function CRUDUpdate(req, res, next){
	var model,
		id
		;

	id = getParam(req,'id');

	getDao(req).findById(id).then(function(model){
		if(model){
			model.update(req.body).then(function(){
				res.json( core.buildApiResponse(req, 'update', model) );
			}).catch(next);
		}else throw 'Ressource not found';
	}).catch(next);
}

/**
 * Delete an instance for a given model (determine by url)
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 */
function CRUDDelete(req, res, next){
	var model,
		id
		;

	id = getParam(req,'id');

	getDao(req).findById(id).then(function(model){
		if(model){
			model.destroy().then(function(){
				res.json( core.buildApiResponse(req, 'delete', model) );
			}).catch(next);
		}else throw 'Ressource not found';
	}).catch(next);
}



module.exports = router;
