const mongoose = require('mongoose');

async function connect(dbURI) {
	try {
		await mongoose.connect(dbURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
	} catch (error) {
		console.error(error);
		console.error('Could not connect');
	}
}

module.exports = { connect };
