var db = module.exports = {
	db : {},
	connect : function(dbUrl, collection){
		this.db = require('mongojs').connect(dbUrl, collection); 
	},
	find: function(object, collection, fn) {
		this.connect("localhost:27017/"+collection);
		var context = [];
		var self = this;
		this.db.collection(collection).find(object, function(err, collection){
			if (err || !collection) resolver.raise404(response);
			else collection.forEach(function(object){
				context.push(self._latchModelProperties(object));
			});
			return fn(context);
		});
	},
	save: function(object, collection, fn) {
		this.connect("localhost:27017/"+collection);
		var self = this;
		this.db.collection(collection).save(object, function(err, saved){
			if (err || !saved) return false;
			else return fn(self._latchModelProperties(object));
		});
	},
	createQuery : function(string){},
	createObject: function(object){
          if (object === null)
           	return this._latchModelProperties({});
           return this._latchModelProperties(object);
 	},
	_latchModelProperties: function (object){
		object.create = function() { console.log("triggerd a create"); };
		object.save = function() {};
		return object;
	}
};