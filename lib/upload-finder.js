const User = require('../models/user-models');
module.exports = function(user, cb) {
	if (!user) return cb(undefined);
	User.findById(user.id, (err, res) => {
		var x = res.uploads;
		x.sort((a, b) => b.date - a.date);
		cb(
			x.length < 1
				? undefined
				: x.map(uploadsObject => {
						return { a: uploadsObject['url'], name: uploadsObject['name'] };
				  }),
		);
	});
};
