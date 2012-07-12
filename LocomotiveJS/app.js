var processor = require('./requestprocessor'),
    urllib = require('url'),
    resolver = require('./resolver');

var app = module.exports = {
    handlers : ["/", "/start", "/staticfiles/", "/ajax", "/findOne"],
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
