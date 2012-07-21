var app = require('./app').start('1337'),
	resolver = require('./resolver'),
	db = require('./db');

app.get('/', function(request, response) {
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Request handler 'root' was called.");
	response.end();
});

app.get('/start', function(request, response) {
	db.find({}, 'users', function(object){
		var context = {};
		resolver.renderTemplateOr404('start.html', context, request, response);
	});
});

app.post('/start', function(request, response) {
	request.on('end', function(){
		var post = request.data; //sanitize data
		resolver.renderTemplateOr404('start.html', post, request, response);
	});
});

app.get('/ajax/', function(request, response) {
	var context = {'name':'awesome_developer', 'age':'28'};
	if(request.is_ajax()){
		context = {'name':'jag e ajax', 'age':'30'};
	}
	resolver.render_as_json(context, response);
});

app.get('/find/view/{id}/', function(request, response) {
	//outside the db scope we have access to the request.view object.
	//thus we can build our db query from here.
	db.find({'name':'henrik'}, 'users', function(object){
		object = object[0];
		object.superid = request.view.id;
		var context = {user: object};
		resolver.renderTemplateOr404('user.html', context, request, response);
	});
});

app.get('/save/', function(request, response) {
	var user = {};
	db.save(user, 'users', function(object){
		var context = {user:object};
		resolver.renderTemplateOr404('users.html', context, request, response);
	});
});