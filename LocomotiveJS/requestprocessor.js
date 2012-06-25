var http = require('http');

exports.preRequest = function preRequest(request) {
	if (request.method === 'GET') {
		if(_is_ajax(request.headers)){
			_transformRequest(request, {'is_ajax':function(){ return true; }});
		} else {
			_transformRequest(request, {'is_ajax':function(){ return false; }});
		}
	}
	if (request.method === 'POST') {
		var postdata = "";
		request.on('data', function(postdataChunk){
			postdata += postdataChunk;
		});
		request.on('end', function(){
			_transformRequest(request, _transformPostdata(postdata));
		});
	}
};

function _is_ajax(headers) {
	for (header in headers) {
		if (headers[header] === 'XMLHttpRequest') {
			return true;
		}
	}
	return false;
}

function _transformRequest(request, newProperties) {
	/**
	 * implement both post and get data. call to api should look like this request.data.get/post
	 */
	for(property in newProperties){
		request[property] = newProperties[property];
	}
}

function _transformPostdata(data) {
	var postParameters = data.split('&'), postFields = {};
	postParameters.forEach(function(param){
		var tempFields = param.split('=');
		postFields[tempFields[0]] = tempFields[1];
	});
	return {'data': postFields };
}

//TODO request.is_ajax