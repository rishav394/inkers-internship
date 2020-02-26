const passport = require('passport');

const showLoginForm = (req, res) => {
	res.render('login', { error: undefined });
};

const logIn = (req, res, next) => {
	passport.authenticate('local', function(err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.render('login', {
				error: info.message,
			});
		}
		req.logIn(user, function(err) {
			if (err) {
				return next(err);
			}
			var back = req.session.redirectTo || '/';
			delete req.session.redirectTo;
			return res.redirect(back);
		});
	})(req, res, next);
};

module.exports = { showLoginForm, logIn };
