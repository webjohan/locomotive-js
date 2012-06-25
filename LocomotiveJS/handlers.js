var resolver = require('./resolver'),
	db = require('./db');

function root(request, response) {
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Request handler 'root' was called.");
	response.end();
}

function start(request, response) {
	var context; 
	db.objects().all('logs');
	if (request.method === 'GET'){
		context = { gurka: 'imma grass yo ass'};
		resolver.renderTemplateOr404('start.html', context, request, response);
	} else if (request.method === 'POST'){
		request.on('end', function(){
			var post = request.data; //sanitize data
			db.api().saveObject(post, "henriks test");
			resolver.renderTemplateOr404('start.html', post, request, response);
		});
	}
}

function upload(request, response) {
	var context = {'name':'henrik', 'age':'28'};
	resolver.render_as_json(context, response);
}

function staticfiles(filename, request, response){
	resolver.resolveResourceOr404(filename, request, response);
}

exports.root = root;
exports.start = start;
exports.upload = upload;
exports.staticfiles = staticfiles;