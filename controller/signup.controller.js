const User = require('../models/user-models');

const showSignUpForm = (req, res) => {
	res.render('signup', { error: undefined });
};

const signUp = async (req, res) => {
	try {
		if (req.body.password !== req.body.cpassword)
			throw new Error('Passwords do not match');

		const user = await User.create({
			username: req.body.username,
			password: req.body.password,
		});
		req.logIn(user, function(err) {
			if (err) {
				return next(err);
			}
			var back = req.session.redirectTo || '/';
			delete req.session.redirectTo;
			return res.redirect(back);
		});
	} catch (error) {
		res.render('signup', {
			error: error.message,
		});
	}
};

module.exports = { showSignUpForm, signUp };
