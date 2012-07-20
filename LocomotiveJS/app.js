var processor = require('./requestprocessor'),
    urllib = require('url'),
    resolver = require('./resolver'),
    http = require('http'),
    urls = require('./urls');

var app = module.exports = {
	start: function(port){
		var self = this;
		http.createServer(function(request, response){
			self.preProcess(self, request, response);	
		}).listen(port);
		return self;
	},
	handlers : urls.registerUrls(),
    route : function(url, fn, type) {
        this.handlers.push({ url: url, fn: fn, type: type });
    },
    preProcess: function onRequest(app, request, response){
        processor.preRequest(request);
        var path = urllib.parse(request.url).pathname;
        if(path.indexOf('/staticfiles/') != -1) {
        	path = '/staticfiles/';
        }
        var l = app.handlers.length, handler;
        for (var i = 0; i < l; i++) {
        	handler = app.handlers[i];
        	if(handler.url !== undefined){
        		var obj = _parseUrl(handler.url, path, request);
        		if(obj !== undefined){
        			if(obj.parsed){
            			path = obj.url;
            		}	
        		}
        		if (handler.url === path && request.method === handler['type']) {
        			return handler.fn(request, response);
        		}
        	}
        }
        resolver.raise404(response);
    },
    get: function(url, fn) {
    	this.route(url, fn, 'GET');
    },
    post: function(url, fn) {
    	this.route(url, fn, 'POST');
    }
};

function _parseUrl(regedUrl, url, request) {
    var transformedurl = "";
    var exps = urls.regexps();
    var foundExps = [];
    var orgUrl = regedUrl;
    request.view = {};

    for(ex in exps){
    	if(regedUrl.indexOf(ex)){
    		foundExps.push(ex);
    	}
    }
    for(exp in foundExps) {
    	if(regedUrl.indexOf(foundExps[exp]) !== -1) {
    		transformedurl = transformedurl.length === 0 ? regedUrl.replace(foundExps[exp], exps[foundExps[exp]]) : transformedurl.replace(foundExps[exp], exps[foundExps[exp]]);
    	} else {
    		return {'parsed':true, 'url':url};
    	}
    	var regex = new RegExp(transformedurl);
		if(url.match(regex)){
			var name, value;
			for(exp in foundExps) {
				name = foundExps[exp].replace(':','');
				value = url.substring(regedUrl.indexOf(foundExps[exp])).replace(/\/\w+\/?(\w+\/)+/,'').replace('/','');
				regedUrl = regedUrl.replace(foundExps[exp], value);
				request.view[name] = value;
			}
			return {'parsed':true, 'url':orgUrl, 'request':request};
		}
    }
}
