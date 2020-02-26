var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user-models');

module.exports = function() {
	passport.use(
		new LocalStrategy(function(username, password, done) {
			User.findOne({ username: username }, function(err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, { message: 'Incorrect username.' });
				}

				user.comparePassword(password, function(err, data) {
					if (data == false) {
						return done(null, false, { message: 'Invalid Password' });
					} else {
						return done(err, user);
					}
				});
			});
		}),
	);
};
