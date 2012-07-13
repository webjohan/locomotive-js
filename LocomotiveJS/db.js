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
				console.log(object);
				context.push(object);
			});
			return fn(context);
		});
	},
	save: function(object, collection, fn) {
		this.connect("localhost:27017/"+collection);
		this.db.collection(collection).save(object, function(err, saved){
			if (err || !saved) return false;
			else return fn(object);
		});
	},
	_latchModelProperties: function (object){
		object.create = function() {
			for(var prop in object) {
				if (object.hasOwnProperty(prop))
					console.log(prop);
			}
		};
		object.save = function() {
		};
		return object;
	}
};