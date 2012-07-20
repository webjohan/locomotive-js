var urls = module.exports = {
		registerUrls : function(){
			var urls = ['/', '/start', '/staticfiles/', '/find/{id}/view/{firstName}/{lastName}/', '/ajax', '/save'];
			return urls;
		},
		regexps : function() {
			return {'{id}':'(\\d+)', '{firstName}':'(\\w+)', '{lastName}':'(\\w+)' };
		}
};