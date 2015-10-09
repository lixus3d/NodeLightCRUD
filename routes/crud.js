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
// Update Partial
router.patch('/:id', CRUDPartial);
// Delete
router.delete('/:id', CRUDDelete);

/**
 * Create the table for the given model (determine by url)
 * TODO : May add a production environnement lock
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 */
function createTable(req, res, next){
	var collection,
		dao,
		modelType
		;

	modelType = core.getModelType(req);
	dao = factory.getDao(modelType);

	dao.sync({force: true}).then(function(){
		res.json( core.buildApiResponse(req, 'create-table', 'OK') );
	}).catch(next);
}

/**
 * Read a list from the storage for a given model (determine by url)
 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
 */
function CRUDReadList(req, res, next){
	var collection,
		dao,
		modelType
		;

	modelType = core.getModelType(req);
	dao = factory.getDao(modelType);

	// console.log(dao);

	dao.findAll({raw: true}).then(function(objectList){
		var collection = factory.getCollection(modelType).load(objectList);
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
		modelType
		;

	modelType = core.getModelType(req);
	dao = factory.getDao(modelType);

	// console.log(dao);

	dao.findById(req.params.id,{raw: true}).then(function(object){
		var model = object;
		res.json( core.buildApiResponse(req, 'read-by-id', model) );
	}).catch(next);
}

function CRUDCreate(req, res, next){

}

function CRUDUpdate(req, res, next){

}

function CRUDPartial(req, res, next){

}

function CRUDDelete(req, res, next){

}



module.exports = router;
