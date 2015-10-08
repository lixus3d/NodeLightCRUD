
var Core = function(){

	var core = this;


	/**
	 * Return the model type of a request
	 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
	 * @param  {Request} req Express request object instance
	 * @return string The Model name
	 */
	this.getModelType = function(req){
		return req.baseUrl.substr(1);
	};

	/**
	 * Build a json response from the request and an additionnal json object
	 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
	 * @param  {Request} req    Express request object instance
	 * @param  {Object} jsonAdd Additionnal key values to add to the json response
	 * @return {Object}         The response object
	 */
	this.buildApiResponseObject = function(req, jsonAdd){
		return _.merge({
			request: {
				type: 'undefined',
				params: req.params,
			}
		},jsonAdd);
	};

	/**
	 * Convert a response to an object form acceptable in the API
	 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
	 * @param  {mixed} responseReturn A return
	 * @return {Object}
	 */
	this.buildResponseObject = function(response){
		switch(true){
			// TODO : Might create a interface for response, that implements a exportForAPI() , building the complete response object
			case response instanceof NLC.Collection:
				var collection = response;
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
			case response instanceof NLC.Model:
				var model = response;
				return {
					type: 'model',
					params: {
						model: model.getName(),
						complete: model.isComplete()
					},
					model: model.export()
				};
			case response instanceof String:
				return {
					type: 'string',
					string: response
				};
		}
		return convertResponseToObject(response);
	};


	// NOTE : NOT USED , just thinked
	this.buildResponseObject = function(type, infos){
		var response;

		// TODO : Determine the reponse aspect from the given reponse content instance
		// TODO : swith to instanciable response object
		switch(type){
			case 'collection':
				response = {
					type: type,
					params: {
						model: infos.model,
						length: infos.collection.length,
						offset: infos.offset,
						total: infos.total
					},
					collection: infos.collection
				};
				break;
			case 'empty':
				response = {
					type: type,
				};
				break;
			case 'model':
				response = {
					type: type,
					params: infos.params,
					model: infos.model
				};
				break;
			default:
				throw 'Invalid response object type';
		}

		return response;
	};

};

modules.exports = new Core();