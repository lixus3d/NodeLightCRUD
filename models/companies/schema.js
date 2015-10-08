var orm = require('nlc/orm');

var Companies = orm.sequelize.define('companies',{
	name: {
		type: Sequelize.STRING,
		field: 'name'
	}
}, {
	freezeTableName: true
});

Companies.sync({force: true}).then(function(){

});

module.exports = Companies;