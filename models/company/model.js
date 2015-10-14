var Company = {
	getTitle: function(){
		return this.name + ' ('+this.size+')';
	}
	/*
	getAddresses: function(){
		var self = this;

		var factory = this.getFactory();
		var daoAddress = factory.getDao('address');

		var p = factory.newPromise(function(resolve, reject){
			if( self.addresses === undefined){
				daoAddress.findAndCountAll({where: {company_id: this.id}}).then(function(addressesCollection){
					self.addresses = addressesCollection;
					resolve(addressesCollection);
				}).catch(reject);
			}else{
				resolve(self.addresses);
			}
		});

		return p;
	}
	*/
};

module.exports = Company;
