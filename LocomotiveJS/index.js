var server = require('./server'),
	router = require('./router'),
	urls = require('./urls');

var urls = urls.registerUrls();

server.start(router.route, urls);