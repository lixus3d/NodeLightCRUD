var Address = {
	id:{
		type: 'UUID',
		primaryKey: true
	},
	address:{
		type: 'VARCHAR(128)',
	},
	zip:{
		type: 'VARCHAR(5)',
	},
	city:{
		type: 'VARCHAR(128)',
	},
	country:{
		type: 'VARCHAR(2)',
	},
	phone:{
		type: 'VARCHAR(16)',
	}
};

module.exports = Address;