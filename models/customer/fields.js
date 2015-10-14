var Customer = {
	id: {
		type: 'BINARY(16)',
		primaryKey: true,
		defaultValue: {generator: 'guid'},
	},
	firstname: {
		type: 'VARCHAR(128)'
	},
	lastname: {
		type: 'VARCHAR(128)'
	}
};

module.exports = Customer;