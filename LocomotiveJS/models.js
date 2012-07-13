var db = require('./db');

function User() {
		var name;
		var email;
		var username;
		return {
			setUserName: function (username) {
				this.username = username;
			},
			getUserName: function(){
				return username;
			},
			setEmail: function(email) {
				this.email = email;
			},
			getEmail: function() {
				return email;
			},
			setName:function(name) {
				this.name = name;
			},
			getName: function() {
				return this.name;
			}
		};
};
exports.User = function(){
		return db._latchModelProperties(new User());
};