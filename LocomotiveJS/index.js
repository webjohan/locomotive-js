var http = require('http');
var app = require('./app');
var resolver = require('./resolver');
var dbURL = "localhost:27017/users";
var collections = ["users"];
var db = require('mongojs').connect(dbURL, collections);

http.createServer(function(request, response){
	app.preProcess(app, request, response);	
}).listen('1337');

app.route('/staticfiles/', function(request, response){
	filename = request.url.substring(request.url.lastIndexOf('/') + 1, request.url.length);
	resolver.resolveResourceOr404(filename, request, response);
});

app.route('/', function(request, response){
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Request handler 'root' was called.");
	response.end();
});

app.route('/start', function(request, response){
	console.log("in start");
	var context; 
	if (request.method === 'GET'){
		context = { gurka: 'imma grass yo ass'};
		resolver.renderTemplateOr404('start.html', context, request, response);
	} else if (request.method === 'POST'){
		request.on('end', function(){
			var post = request.data; //sanitize data
			resolver.renderTemplateOr404('start.html', post, request, response);
		});
	}
});

app.route('/ajax', function(request, response) {
	var context = {'name':'henrik', 'age':'28'};
	resolver.render_as_json(context, response);
});

app.route('/findOne', function(request, response) {
	var context =  {};
	db.users.find({name:'henrik'}, function(err, users){
		if (err || !users) resolver.raise404(response);
		else users.forEach(function(user){
			context = {user : user};
		});
		resolver.renderTemplateOr404('users.html', context, request, response);
	});
});