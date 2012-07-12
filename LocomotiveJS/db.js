var dbURL = "localhost:27017/users"; //read from props

var db = module.exports = {
	db : {},
	connect : function(dbUrl, collection){
		this.db = require('mongojs').connect(dbUrl, collection); 
	},
	find: function(object, collection, fn) {
		this.connect("localhost:27017/"+collection);
		var context = [];
		this.db.collection(collection).find(object, function(err, collection){
			if (err || !collection) resolver.raise404(response);
			else collection.forEach(function(object){
				context.push(object);
			});
			return fn(context);
		});
	},
	save: function(object, collection) {
		
	}
};