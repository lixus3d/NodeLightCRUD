var Address = {
	id:{
		type: 'BINARY(16)',
		primaryKey: true,
		defaultValue: {generator: 'guid'},
	},
	name:{
		type: 'VARCHAR(128)',
	},
	address:{
		type: 'VARCHAR(128)',
	},
	zip:{
		type: 'CHAR(5)',
	},
	city:{
		type: 'VARCHAR(128)',
	},
	country:{
		type: 'CHAR(2)',
	},
	phone:{
		type: 'VARCHAR(16)',
	},
	company_id:{
		type: 'BINARY(16)',
		relation: 'Company'
	}
};

module.exports = Address;