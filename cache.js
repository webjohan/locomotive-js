var cache = module.exports = {
	initStore : function(){
		if(this.store == undefined)
			this.store = {'isEnabled':true};
	},
	put : function(key, request, expiration){
		//store[key] = {'url':request.url, 'session':request.session};
	},
	get : function(key, request){},
	remove : function(key, request){},
	flush : function(request){
		for(keys in store){
			if(store[key].session == request.session){
				store[key] = null;	
			}
		}
	},
	isCached : function(key, request, callback){
		var self = this;
		console.log("faking cache");
		return callback("wee");	
	},
	expirePrematurely : function(key, url, request, expireNow){},
	setExpiration : function(key, expiration){},
	statistics : function(){},
	size : function(){},
	storage : function(storageType){}
};