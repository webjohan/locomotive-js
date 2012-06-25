var handler = require('./handlers');

exports.registerUrls = function() {
	var urls = {};
	urls['/'] = handler.root;
	urls['/start'] = handler.start;
	urls['/upload'] = handler.upload;
	urls['/staticfiles/'] = handler.staticfiles;
	return urls;
};