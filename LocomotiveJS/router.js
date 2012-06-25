var resolver = require('./resolver');
/**
 * url is a handler that maps to a handler.js function 
 */
function route(handler, pathname, request, response) {
	var filename, re, ext;
	
	filename = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length);
	re = new RegExp("[.js]|[.css]");

	if (re.test(pathname)){
		ext = pathname.substring(pathname.indexOf('.'), pathname.length);
		switch (ext) {
		case '.js': pathname = "/staticfiles/"; break;
		case '.css': pathname = "/staticfiles/"; break;
		}
	}
	if (typeof handler[pathname] === 'function') {
		if(pathname === '/staticfiles/'){
			handler[pathname](filename, request, response);
		} else {
			handler[pathname](request, response);
		}
	
	} else {
		resolver.raise404(response);
	}
}
exports.route = route;