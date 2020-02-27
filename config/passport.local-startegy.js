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
						// Unauth login attempt
						user.loginActivity.push({
							date: Date.now(),
							success: false,
						});
						user
							.update(user)
							.then(() => {})
							.catch(err => {});
						return done(null, false, { message: 'Invalid Password' });
					} else {
						// User is logged in. Log it.
						user.loginActivity.push({
							date: Date.now(),
							success: true,
						});

						user
							.update(user)
							.then(() => {})
							.catch(err => {});
						return done(err, user);
					}
				});
			});
		}),
	);
};
