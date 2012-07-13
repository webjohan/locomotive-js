var processor = require('./requestprocessor'),
    urllib = require('url'),
    resolver = require('./resolver'),
    http = require('http');

var app = module.exports = {
	start: function(port){
		var self = this;
		http.createServer(function(request, response){
			self.preProcess(self, request, response);	
		}).listen(port);
		return self;
	},
	handlers : ["/", "/start", "/staticfiles/", "/ajax", "/find", "/save"],
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
            if (handler.url == path && request.method === handler['type'])
            	return handler.fn(request, response);
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
