var handler = require('./handlers');

exports.registerUrls = function() {
//	var urls = {};
//	urls['/'] = handler.root;
//	urls['/start'] = handler.start;
//	urls['/upload'] = handler.upload;
//	urls['/staticfiles/'] = handler.staticfiles;
//	urls['/findOne'] = handler.findOne;
	var urls = ['/', '/start', '/upload', '/staticfiles/', '/findOne'];
	return urls;
};