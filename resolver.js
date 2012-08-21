var path = require('path'), 
	fs = require('fs'),
	paperboy = require('paperboy'),
	templateRenderer = require('swig');
/**
 * Configuration below
 */
templateRenderer.init({
	autoescape: true,
	root: './',
	encoding: 'unicode',
	cache: false,
});

String.format = function(text) {
    if (arguments.length <= 1)
        return text;
    var tokenCount = arguments.length - 2;
    for (var token = 0; token <= tokenCount; token++)
        text = text.replace(new RegExp( "\\{" + token + "\\}", "gi" ), arguments[ token + 1 ]);
    return text;
};

var renderer = module.exports = {
  renderTemplateOr404 : function (template, data, httpRequest, httpResponse) {
	/**
	 * Resolves a template and compiles it with data from the view
	 */
	var templatepath, compiledTemplate, html, self;
	self = this;
	
	if (template === null || template === undefined || template === ''){
		self.raiseTemplateMissing(httpRequest, httpResponse);
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
			self.raiseTemplateMissing(httpRequest, 	httpResponse);
		}
	});
  },
  resolveResourceOr404 : function (filename, httpRequest, httpResponse) {
	/**
	 * Resolves filename into a resource in the staticfiles dir for serving to user.
	 * This will be refactored massively.
	 */
	var root = path.join(path.dirname(__filename), '');
	paperboy
		.deliver(root, httpRequest, httpResponse)
		.error(function(e){
			this.raise500(httpResponse);
		})
		.otherwise(function(){
			this.raise404(httpResponse);
		});
  },
  render_as_json : function (data, httpResponse){
	httpResponse.writeHeader(200, _generateContentType('json'));
	httpResponse.end(_toJson(data));
  },
  render_to_response : function (data, asContentType, httpResponse) {
	httpResponse.writeHeader(200, _generateContentType(asContentType));
	httpResponse.end(data);
  },
  raise404 : function (httpResponse) {
	this.raiseErrorTemplate(404, httpResponse);
  },
  raise500 : function (httpResponse) {
	this.raiseErrorTemplate(500, httpResponse);
  },
  raiseErrorTemplate : function(type, statusCode, httpResponse, data) {
    var html = _getErrorTemplate(type !== '' ? type : statusCode, data);
    httpResponse.writeHeader(statusCode, _generateContentType('html'));
    httpResponse.end(html);
  },
  raiseTemplateMissing: function(httpRequest, httpResponse){
	  var error = new Error("Template missing");
	  var self = this;
	  _formatStackTrace(error.stack, function(object){
		  var errorData = { 'stack': object, 'url': httpRequest.url };
		  self.raiseErrorTemplate("templateError", 500, httpResponse, errorData);
	  }, true);
  },
  raiseViewDoesNotExist: function(httpRequest, httpResponse) {
  	var error = new Error("ViewDoesNotExist");
  	var self = this;
  	_formatStackTrace(error.stack, function(object) {
  		var errorData = {'stack':object, 'url':httpRequest.url };
  		self.raiseErrorTemplate("viewDoesNotExist", 404, httpResponse, errorData);
  	}, false);	
  },
};

function _render(html, httpResponse) {
	httpResponse.writeHeader(200, _generateContentType('html'));
	httpResponse.end(html);
}

function _getErrorTemplate(statusCode, data){
	var errorpath, compiledTemplate, html;
	errorpath = String.format("templates/errors/{0}.html", statusCode);
	compiledTemplate = templateRenderer.compileFile(errorpath);
	html = compiledTemplate.render(data !== undefined ? data : null);
	return html;
}

function _generateContentType(contentType) {
	var ctype = "";
	/**
	 * extend list to lots of types
	 */
	switch(contentType) {
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
	for (property in data)
	    json += '"'+property+'"'+':'+'"'+data[property]+'",';   
	json = json.substring(0, json.lastIndexOf(','));
	json += '}';
	return json;
}

function _formatStackTrace(stacktrace, fn, marked) {
	stacktrace = stacktrace.replace(/\sat\s/g,"<br/>at ");
	var array = stacktrace.split('<br/>at ');
	var newDict = {};
	for(line in array) {
		var indexOfFirstColon = array[line].indexOf('.js:');
		var substringd = array[line].substring(indexOfFirstColon).replace('.js:','');
		var substringd2 = substringd.replace(/(\:\d+)(\W+)?/, '');
		newDict[substringd2] = line;
	}
	var unsortedArray = _createUnsortedKeyArray(newDict);
	
	sortedArray = _sortArray(unsortedArray);
    var closestStackTraceLine = array[newDict[sortedArray[0].toString()]];
    if (marked)
    	array[newDict[sortedArray[0].toString()]] = '<span class="stacktraceError"><b>'+closestStackTraceLine+'</b></span>';
    else
    	array[newDict[sortedArray[0].toString()]] = ''+closestStackTraceLine+'';
    stacktrace = array.join("<br/>at ");
	return fn(stacktrace);
}

function _createUnsortedKeyArray(dict) {
	var unsortedArray = [];
	for(key in dict) {
		if(!isNaN(key))
			unsortedArray.push(Number(key));
	}
	return unsortedArray;
}

function _sortArray(sortedArray) {
	var swapped;
    do {
        swapped = false;
        for (var i=0; i < sortedArray.length-1; i++) {
            if (sortedArray[i] > sortedArray[i+1]) {
                var temp = sortedArray[i];
                sortedArray[i] = sortedArray[i+1];
                sortedArray[i+1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
	return sortedArray;
}