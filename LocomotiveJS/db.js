var mongo = require('mongodb'),
	Server = mongo.Server,
	Db = mongo.Db;

var mongoServer = new Server('localhost', 27017, {auto_reconnect : true});
var db = new Db('test', mongoServer);

function _getFromCollection(collectionName) {
	console.log(collectionName);
	db.open(function(err, db){
		if(!err) {
			console.log("we are connected to: "+db);
			db.collection(collectionName, function(err, collection) { 
				console.log("we are in coll: "+collectionName); 
				collection.find().toArray(function(err, items) { 
					console.log(items); 
				});
			});
		}
	});
}

function apiImpl(){
	var dbObj = {
			all : function(collection) { 
				console.log("getting objects");
				var allObjects = _getFromCollection(collection);
				console.log("allObjects: "+allObjects);
			},
			saveObject : function(object, collection) {	console.log("saving object: "+object+" to collection: "+collection);}
		};
	return dbObj;
}

exports.objects = apiImpl;