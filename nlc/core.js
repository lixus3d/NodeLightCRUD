var _ = require('lodash');
var modelList = app_require('models');
var AbstractCollection = app_require('nlc/abstract/collection');
var AbstractModel = app_require('nlc/abstract/model');

var Core = function(){

	var core = this;


	/**
	 * Return the model type of a request, from the request base url
	 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
	 * @param  {Request} req Express request object instance
	 * @return string The Model name
	 */
	this.getModelType = function(req){
		var modelTypePlural = req.baseUrl.substr(1);
		return this.convertPlural(modelTypePlural);
	};

	/**
	 * Convert a plural name in the url to the model name
	 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
	 * @param  {String} modelTypePlural The plural name of the model
	 * @return {String} The model name
	 */
	this.convertPlural = function(modelTypePlural){
		if(modelList[modelTypePlural]!==undefined){
			return modelList[modelTypePlural];
		}
		throw 'Invalid modelTypePlural given';
	};

	/**
	 * Convert a string to a buffer, usually for binary data like id
	 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
	 * @param  {String} el         The string representation of the binary data
	 * @param  {String} bufferType The encoding type
	 * @return {Buffer}            A node Buffer representing the binary data
	 */
	this.convertToBuffer = function(el,bufferType){
		bufferType = bufferType || 'hex';
		return new Buffer(el,bufferType);
	};

	/**
	 * Build an API response Object
	 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
	 * @param  {Request} req            The request object of the current call
	 * @param  {String} type            The type of request
	 * @param  {mixed} responseContent  The response content to put in the response object
	 * @return {Object}
	 */
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
	 * Convert a response to a conventional object acceptable in the API
	 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
	 * @param  {mixed} responseReturn A return
	 * @return {Object}
	 */
	this.buildResponseObject = function(responseContent){
		switch(true){
			// TODO : Might create an interface for response object, that implements a exportForAPI() , building the complete response object
			case responseContent instanceof AbstractCollection:
				var collection = responseContent;
				return {
					type: 'collection',
					params: {
						model: collection.modelName,
						length: collection.getLength(),
						offset: collection.getOffset(),
						limit: collection.getLimit(),
						total: collection.getTotal()
					},
					collection: responseContent
				};
			case responseContent instanceof AbstractModel:
				var model = responseContent;
				return {
					type: 'model',
					params: {
						type: model.modelName
					},
					model: model
				};
			case responseContent instanceof Object:
				return {
					type: 'object',
					object: responseContent
				};
			case typeof responseContent === 'string':
				return {
					type: 'string',
					string: responseContent
				};
			default:
				return {
					type: 'unknown',
					unknown: responseContent
				};
		}
		return {};
	};

};

module.exports = new Core();