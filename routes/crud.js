var express = require('express');
var _ = require('lodash');
var router = express.Router();

var factory = app_require('nlc/factory');




// Read List
router.get('/', function(req, res, next) {

	var json = buildApiResponseObject(req,{
		request:{
			type : 'read-list'
		}
	});

	// Do the collection request
	var modelType = getModelType(req);
	var collection;

	if(modelType){
		var business = factory.getBusiness(modelType);
		if(business){
			collection = business.fetchAll();
		}else{
			throw 'Can\'t load '+ modelType +' business';
		}
	}else{
		throw 'Invalid modelType';
	}

	json.response = buildResponseObject(collection);

	res.json(json);
});









// Read One
router.get('/:id', function(req, res, next) {

	var json = buildApiResponseObject(req,{
		request: {
			type: 'read-one',
		}
	});

	// Do the read request
	var model = new NLC.Model();

	json.response = buildResponseObject(model);

	res.json(json);
});

// Create
router.post('/', function(req, res, next) {
	res.json({
		type: 'create',
		params: req.params
	});
});

// Update
router.put('/:id', function(req, res, next) {
	res.json({
		type: 'update',
		params: req.params
	});
});

// Update Partial
router.patch('/:id', function(req, res, next) {
	res.json({
		type: 'update-partial',
		params: req.params
	});
});

// Delete
router.delete('/:id', function(req, res, next) {
	res.json({
		type: 'delete',
		params: req.params
	});
});



module.exports = router;
