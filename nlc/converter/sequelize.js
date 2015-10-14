var _ = require('lodash');
var Sequelize = require('sequelize');
var uuid = require('node-uuid');

var Converter = function(){

	/**
	 * Convert a modelConfig Object to a sequelize configuration object passed to sequelize.define
	 * @author Emmanuel Gauthier <emmanuel@mobistep.com>
	 * @param  {Object} modelConfig A model config to convert
	 * @return {Object}
	 */
	this.convertConfigToSequelize = function(modelConfig){
		var sequelizeConfig = {};
		// TODO : Use a converter object and cut this into functions
		_.forEach(modelConfig,function(fieldOptions,fieldName){
			var sequelizeFieldOptions = {};
			_.forEach(fieldOptions,function(optionValue,optionName){
				switch(optionName){
					case 'type':
						var res;
						var functionRegex = /^([a-z]+)(\(([0-9,]+)\))?$/gi;

						if(optionValue.match(/^(VARCHAR|STRING)$/g)){
							optionValue = Sequelize.STRING;
						}else if( (res = functionRegex.exec(optionValue))!==null ) {
							var type = res[1].toUpperCase();
							if(type === 'VARCHAR'){
								type = 'STRING';
							}
							var typeParam = null;
							if( res[2] !== undefined ){
								typeParam = res[3].split(',');
							}
							if(typeParam===null){
								optionValue = Sequelize[type];
							}else{
								optionValue = Sequelize[type].apply(Sequelize,typeParam);
							}
							if(typeof optionValue.setter==='function' ){
								sequelizeFieldOptions.set = optionValue.setter;
							}
						}else{
							throw 'Invalid model option';
						}

						sequelizeFieldOptions[optionName] = optionValue;
						break;
					case 'defaultValue':
						if( optionValue instanceof Object){
							var generator;
							if( (optionValue.generator !== undefined) && (generator = optionValue.generator) ){
								// TODO : Add generator classes/methods somewhere
								switch(generator){
									case 'guid':
										optionValue = function(){
											var data = uuid.v1();
											// 58e0a7d7-eebc-11d8-9669-0800200c9a66 => 11d8eebc58e0a7d796690800200c9a66
											var parts = data.split('-');
											data = parts[2]+parts[1]+parts[0]+parts[3]+parts[4];
											// data = parseInt(data,16);
											return new Buffer(data,'hex');
										};
										break;
									default:
										throw 'Not a valid generator given in defaultValue';
								}
							}
							sequelizeFieldOptions[optionName] = optionValue;
						}else if(typeof optionValue === 'string'){
							sequelizeFieldOptions[optionName] = Sequelize[optionValue];
						}else{
							sequelizeFieldOptions[optionName] = optionValue;
						}
						break;
					default:
						sequelizeFieldOptions[optionName] = optionValue;
						break;
				}
			});
			sequelizeConfig[fieldName] = sequelizeFieldOptions;
		});
		return sequelizeConfig;
	};

};

module.exports = new Converter();