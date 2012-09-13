var processor = require('./requestprocessor'),
    urllib = require('url'),
    resolver = require('./resolver'),
    http = require('http'),
    urls = require('./urls'),
	cache = require('./cache'),
	settings = require('./settings');

var app = module.exports = {
	start: function(port){
		var self = this;
		http.createServer(function(request, response){
			if(settings.CACHE === true){
				cache.initStore();
			}
			self.preProcess(self, request, response);
		}).listen(port);
		return self;
	},
	handlers : [],
    route : function(url, fn, type) {
        this.handlers.push({ url: url, fn: fn, type: type });
    },
    preProcess: function onRequest(app, request, response){
        processor.preRequest(request);
        var path = urllib.parse(request.url).pathname;
        if(path.indexOf(settings.STATICFILES_DIR) != -1) {
        	path = settings.STATICFILES_DIR;
        	requestedFile = request.url.substring(request.url.lastIndexOf('/') + 1, request.url.length);
          	return resolver.resolveResourceOr404(requestedFile, request, response);
        }
        var l = app.handlers.length, handler;
        for (var i = 0; i < l; i++) {
        	handler = app.handlers[i];
        	if(handler.url !== undefined){
        		var parsedUrlObject = _parseUrl(handler.url, path, request);
        		if(parsedUrlObject !== undefined)
        			if(parsedUrlObject.parsed)
            			path = parsedUrlObject.url;
            	if (path.charAt(path.length - 1) !== '/') 
            		path += '/';
        		if (handler.url === path && request.method === handler['type']) {
        			return handler.fn(request, response);
        		}
        	}
        }
        resolver.raiseViewDoesNotExist(request, response);
    },
    get: function(url, fn) {
    	if(url.charAt(url.length-1)!== '/') url += '/';
    	this.route(url, fn, 'GET');
    },
    post: function(url, fn) {
    	this.route(url, fn, 'POST');
    },
    put : function(url, fn) {
    	this.route(url, fn, 'PUT');
    }
};

function _parseUrl(regexifiedUrl, url, request) {
    var transformedurl = "";
    var exps = urls.regexps();
    var foundExps = [];
    var orgUrl = regexifiedUrl;
    request.view = {};
    for(ex in exps){
    	if(regexifiedUrl.indexOf(ex) !== -1){
    		foundExps.push(ex);
    	}
    }
    for(exp in foundExps) {
    	if(regexifiedUrl.indexOf(foundExps[exp]) !== -1) {
    		transformedurl = transformedurl.length === 0 ? regexifiedUrl.replace(foundExps[exp], exps[foundExps[exp]]) : transformedurl.replace(foundExps[exp], exps[foundExps[exp]]);
    	}
    	var regex = new RegExp(transformedurl);
		if(url.match(regex)){
			var name, value;
			for(exp in foundExps) {
				name = foundExps[exp].replace('{','').replace('}','');
				value = url.substring(regexifiedUrl.indexOf(foundExps[exp])).replace(/\/\w+\/?(\w+\/)+/,'').replace(/\/\w+/,'').replace('/','');
				regexifiedUrl = regexifiedUrl.replace(foundExps[exp], value);
				request.view[name] = value;
			}
			if(regexifiedUrl.length === url.length){
				return {'parsed':true, 'url':orgUrl, 'request':request};
			} else {
				return {'parsed':true, 'url':url, 'request':request};
			}
			
		}
    }
}
