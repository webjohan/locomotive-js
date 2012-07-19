var processor = require('./requestprocessor'),
    urllib = require('url'),
    resolver = require('./resolver'),
    http = require('http'),
    urls = require('./urls').registerUrls();

var app = module.exports = {
    start: function(port){
        var self = this;
        http.createServer(function(request, response){
            self.preProcess(self, request, response);	
        }).listen(port);
        return this;
    },
    handlers : urls,
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
<<<<<<< HEAD
        	if(handler.url !== undefined){
        		var obj = _parseUrl(handler.url, path, request);
        		if(obj.parsed){
        			path = obj.url;
        		}
        		if (handler.url === path && request.method === handler['type']) {
        			return handler.fn(request, response);
        		}
        	}
=======
            var parsedUrl = _parseUrl(handler.url, request.url)
            if (handler.url == path && request.method === handler['type']){
                
                return handler.fn(request, response);
            }
>>>>>>> j
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

<<<<<<< HEAD
function _parseUrl(handlerUrl, actualUrl, request) {
	var listOfRegexes = getRegexes(); 
	for(regexp in listOfRegexes){
		if(handlerUrl.indexOf(regexp) !== -1){
			if(actualUrl.match(listOfRegexes[regexp])) {
				var id = actualUrl.substring(handlerUrl.indexOf(regexp)).replace('/','');
				request.view = { 'id':id };
				return {'parsed':true, 'url':handlerUrl, 'request':request};
			}
		}
		return {'parsed':true, 'url':actualUrl};
	}
}

function getRegexes() {
	return {':id': /^(\/\w+\/\d+\/$)/ };
=======
function _parseUrl(url, requesturl) {
    //if url contains the following expressions: :id, :slug
>>>>>>> j
}