const User = require('../models/user-models');

const showResetForm = (req, res) => {
	if (req.user) return res.redirect('/');
	res.render('reset', {});
};
const reset = (req, res) => {
	if (req.user) return res.sendStatus(403);
	var { name, otp } = req.query;

	// Verify OTP and token
	User.findOne({
		username: name,
	})
		.then(doc => {
			User.bcryptpassword(name, (_err, hash) => {
				doc.password = hash;
				doc.updateOne(doc, (err, doc) => {
					if (err) throw err;
					return res.sendStatus(200);
				});
			});
		})
		.catch(err => {
			// Dont want user to know there is no such user
			res.sendStatus(200);
		});
};

module.exports = { showResetForm, reset };
