var CompanyCollection = {
	getTotalSize: function(){
		var size = 0;
		this.each(function(company){
			if(company.size > 0){
				size += company.size;
			}
		});
		return size;
	}
};

module.exports = CompanyCollection;