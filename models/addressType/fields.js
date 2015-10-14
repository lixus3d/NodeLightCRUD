var AddressType = {
	id:{
		type: 'BINARY(16)',
		primaryKey: true,
		defaultValue: {generator: 'guid'},
	},
	name:{
		type: 'VARCHAR(64)',
	}
};

module.exports = AddressType;