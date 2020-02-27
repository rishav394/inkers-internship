const User = require('../models/user-models');

const showCPform = (req, res) => {
	if (req.user)
		res.render('changePassword', {
			message: undefined,
		});
	else res.redirect('/');
};

// Callback hell. Should have used Promises instead. TODO: Fix this
const changePassword = (req, res) => {
	if (!req.user) return res.send(403);
	User.findById(req.user.id, (err, doc) => {
		if (err) throw err;
		if (req.body.newP.length < 6)
			return res.render('changePassword', {
				message: 'Password should be more than 6 letters!',
			});
		if (req.body.newP !== req.body.newPC)
			return res.render('changePassword', {
				message: 'New passwords and Confirm New passwords do not match!',
			});
		doc.comparePassword(req.body.oldP, (_err, data) => {
			if (!data)
				return res.render('changePassword', {
					message: 'Invalid old password!',
				});

			User.bcryptpassword(req.body.newP, (_err, hash) => {
				doc.comparePassword(req.body.newP, (_err, data) => {
					if (data)
						return res.render('changePassword', {
							message: 'Old and new Passwords can not be same',
						});
					doc.password = hash;
					doc.update(doc, (updateErr, response) => {
						if (updateErr) throw updateErr;
						return res.render('changePassword', {
							message: 'Password changed successfully!',
						});
					});
				});
			});
		});
	});
};

module.exports = { showCPform, changePassword };
