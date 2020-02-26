const User = require('../models/user-models');

module.exports = function(user, cb) {
	if (!user) return cb(undefined);
	User.findById(user.id, (err, res) => {
		cb(
			res.uploads.length < 1
				? undefined
				: res.uploads.map(uploadsObject => {
						return { a: uploadsObject['url'], name: uploadsObject['name'] };
				  }),
		);
	});
};
