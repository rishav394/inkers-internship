var passport = require('passport');
const local = require('./passport.local-startegy');
const User = require('../models/user-models');

module.exports = function(app) {
	app.use(passport.initialize());
	app.use(passport.session());
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
	local();
};
