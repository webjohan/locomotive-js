var http = require('http'), 
	urllib = require('url'),
	processor = require('./requestprocessor');

function startUp(route, url) {
	function onRequest(request, response) {
		processor.preRequest(request);
		var path = urllib.parse(request.url).pathname;
		route(url, path, request, response);
	}
	http.createServer(onRequest).listen('1337');
	console.log("Server start up done.");
}

exports.start = startUp;