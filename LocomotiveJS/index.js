var app = require('./app').start('1337'),
	resolver = require('./resolver'),
	db = require('./db'),
	models = require('./models');


app.get('/staticfiles/', function(request, response){
	filename = request.url.substring(request.url.lastIndexOf('/') + 1, request.url.length);
	resolver.resolveResourceOr404(filename, request, response);
});

app.get('/', function(request, response){
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Request handler 'root' was called.");
	response.end();
});

app.get('/start', function(request, response){
	db.find({}, 'users', function(object){
		var context = {};
		resolver.renderTemplateOr404('start.html', context, request, response);
	});
});

app.post('/start', function(request, response){
	request.on('end', function(){
		var post = request.data; //sanitize data
		resolver.renderTemplateOr404('start.html', post, request, response);
	});
});

app.get('/ajax', function(request, response) {
	var context = {'name':'awesome_developer', 'age':'28'};
	resolver.render_as_json(context, response);
});

app.get('/find', function(request, response) {
	db.find({}, 'users', function(object){
		var context = {users: object};
		resolver.renderTemplateOr404('users.html', context, request, response);
	});
});

app.get('/save', function(request, response){
	var user = models.User();
	db.save(user, 'users', function(object){
		var context = {user:object};
		resolver.renderTemplateOr404('users.html', context, request, response);
	});
});