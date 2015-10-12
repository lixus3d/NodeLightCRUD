var _ = require('lodash');
var modelList = app_require('models');
var AbstractCollection = app_require('nlc/abstract/collection');

var Core = function(){

	var core = this;


	/**
	 * Return the model type of a request
	 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
	 * @param  {Request} req Express request object instance
	 * @return string The Model name
	 */
	this.getModelType = function(req){
		var modelTypePlural = req.baseUrl.substr(1);
		return this.convertPlural(modelTypePlural);
	};

	this.convertPlural = function(modelTypePlural){
		if(modelList[modelTypePlural]!==undefined){
			return modelList[modelTypePlural];
		}
		throw 'Invalid modelTypePlural given';
	};

	this.buildApiResponse = function(req, type, responseContent){
		var apiResponse = {
			request: {
				type: type,
				params: req.params,
				post: req.body
			},
			response: this.buildResponseObject(responseContent)
		};
		return apiResponse;
	};

	/**
	 * Convert a response to an object form acceptable in the API
	 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
	 * @param  {mixed} responseReturn A return
	 * @return {Object}
	 */
	this.buildResponseObject = function(responseContent){
		switch(true){
			// TODO : Might create a interface for response, that implements a exportForAPI() , building the complete response object

			case responseContent instanceof AbstractCollection:
				var collection = responseContent;
				return {
					type: 'collection',
					params: {
						type: collection.getName(),
						length: collection.getLength(),
						offset: collection.getOffset(),
						total: collection.getTotal()
					},
					collection: responseContent.export()
				};
			case responseContent instanceof Object:
				return {
					type: 'model',
					model: responseContent
				};
			/*
			case responseContent instanceof NLC.Collection:

				var collection = responseContent;
				return {
					type: 'collection',
					// TODO : Might replace with a collection.exportParams()
					params: {
						type: collection.getName(),
						length: collection.length,
						offset: collection.offset,
						total: collection.total
					},
					collection: collection.export()
				};

			case responseContent instanceof NLC.Model:
				var model = responseContent;
				return {
					type: 'model',
					params: {
						type: model.getName(),
						complete: model.isComplete()
					},
					model: model.export()
				};
			*/
			case typeof responseContent === 'string':
				return {
					type: 'string',
					string: responseContent
				};
		}
		return {};
	};

};

module.exports = new Core();