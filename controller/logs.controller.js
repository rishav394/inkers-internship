const User = require('../models/user-models');

const displayLogs = (req, res) => {
	User.findById(req.user.id, (err, doc) => {
		if (err) throw err;
		res.render('logs', {
			upload: doc.uploadActivity,
			login: doc.loginActivity,
			user: req.user,
		});
	});
};

module.exports = { displayLogs };
