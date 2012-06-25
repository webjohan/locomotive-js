var path = require('path'), 
	fs = require('fs'),
	paperboy = require('paperboy'),
	templateRenderer = require('swig');

function renderTemplateOr404(template, data, httpRequest, httpResponse) {
	/**
	 * Resolves a template and compiles it with data from the view
	 * This will be refactored massively.
	 */
	var templatepath, compiledTemplate, html;
	
	if (template === null || template === undefined || template === ''){
		template = arguments.callee.caller.name + ".html";
	}
	templatepath = 'templates/'+template; //this folder should be read from props.
	path.exists(templatepath, function(exists) {
		if(exists){
			compiledTemplate = templateRenderer.compileFile(templatepath);
			if (data !== null || data !== undefined)
				html = compiledTemplate.render(data);
			else
				html = compiledTemplate.render();
			_render(html, httpResponse);
		} else {
			raise404(httpResponse);
		}
	});
}
function resolveResourceOr404(filename, httpRequest, httpResponse) {
	/**
	 * Resolves filename into a resource in the staticfiles dir for serving to user.
	 * This will be refactored massively.
	 */
	var root = path.join(path.dirname(__filename), '');
	paperboy
		.deliver(root, httpRequest, httpResponse)
		.before(function(root){
			//console.log("about to deliver staticfile: "+filename);
		})
		.after(function(){
			//console.log("file was delivered with 200");
		})
		.error(function(e){
			raise500(httpResponse);
		})
		.otherwise(function(){
			raise404(httpResponse);
		});
}

function render_as_json(data, httpResponse){
	httpResponse.writeHeader(200, _generateContentType('json'));
	httpResponse.end(_toJson(data));
}

function render_to_response(data, asContentType, httpResponse) {
	ctype = _generateContentType(asContentType);
	httpResponse.writeHeader(200, _generateContentType(asContentType));
	httpResponse.end(data);
}

function raise404(httpResponse) {
	var html = _getErrorTemplate(404);
	httpResponse.writeHeader(404, _generateContentType('html'));
	httpResponse.end(html);
}
function raise500(httpResponse) {
	var html = _getErrorTemplate(500);
	httpResponse.writeHeader(500, _generateContentType('html'));
	httpResponse.end(html);
}

/**
 * UTILS SHOULD MOVE
 */
function _render(html, httpResponse) {
	httpResponse.writeHeader(200, _generateContentType('html'));
	httpResponse.end(html);
}

function _getErrorTemplate(statusCode){
	var errorpath, compiledTemplate, html;
	errorpath = String.format("templates/errors/{0}.html", statusCode);
	compiledTemplate = templateRenderer.compileFile(errorpath);
	html = compiledTemplate.render();
	return html;
}

function _generateContentType(contentType) {
	var ctype = "";
	/**
	 * extend list to lots of types
	 */
	switch(contentType){
	case 'json': ctype = 'application/json'; break;
	case 'xml': ctype = 'application/xml'; break;
	case 'atom': ctype = 'application/atom+xml'; break;
	case 'ecmascript': ctype = 'application/ecmascript'; break;
	case 'edi-x12': ctype = 'application/EDI-X12'; break;
	case 'edifact': ctype = 'application/EDIFACT'; break;
	case 'javascript': ctype = 'application/javascript'; break;
	case 'octet-stream': ctype = 'application/octet-stream'; break;
	case 'ogg': ctype = 'application/ogg'; break;
	case 'pdf': ctype = 'application/pdf'; break;
	case 'postscript': ctype = 'application/postscript'; break;
	case 'rdf+xml': ctype = 'application/rdf+xml'; break;
	case 'rss': ctype = 'application/rss+xml'; break;
	case 'soap': ctype = 'application/soap+xml'; break;
	case 'font-woff': ctype = 'application/font-woff'; break;
	case 'xhtml': ctype = 'application/xhtml+xml'; break;
	case 'xml-dtd': ctype = 'application/xml-dtd'; break;
	case 'xop': ctype = 'application/xop+xml'; break;
	case 'zip': ctype = 'application/zip'; break;
	case 'gzip': ctype = 'application/x-gzip'; break;
	case 'html' : ctype = 'text/html'; break;
	}
	return {'Content-Type': ctype};
}

function _toJson(data) {
	var json = '{';
	for (property in data){
	    json += '"'+property+'"'+':'+'"'+data[property]+'",';   
	}
	json = json.substring(0, json.lastIndexOf(','));
	json += '}';
	return json;
}
/**
 * Configuration below
 */
templateRenderer.init({
	autoescape: true,
	root: './'
});

String.format = function(text) {
    if (arguments.length <= 1) {
        return text;
    }
    var tokenCount = arguments.length - 2;
    for (var token = 0; token <= tokenCount; token++ ) {
        text = text.replace( new RegExp( "\\{" + token + "\\}", "gi" ), arguments[ token + 1 ] );
    }
    return text;
};

exports.renderTemplateOr404 = renderTemplateOr404;
exports.resolveResourceOr404 = resolveResourceOr404;
exports.render_to_response = render_to_response;
exports.render_as_json = render_as_json;
exports.raise404 = raise404;
exports.raise500 = raise500;