var Company = {
	id:{
		type: 'BINARY(16)',
		primaryKey: true,
		defaultValue: {generator: 'guid'},
	},
	name:{
		type: 'VARCHAR(128)',
	},
	size:{
		type: 'INTEGER',
		defaultValue: 0
	}
};

module.exports = Company;