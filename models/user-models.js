const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const saltRounds = 10;

var user = new Schema({
	username: {
		type: String,
		required: [true, '{PATH} is required'],
		unique: true,
		minlength: 4,
		unique: true,
	},
	password: {
		type: String,
		required: [true, '{PATH} is required'],
		minlength: 6,
	},
	created_at: { type: Date, default: Date.now },
	uploads: [
		{
			name: String,
			url: String,
			date: {
				type: Date,
				default: Date.now,
			},
		},
	],
	uploadActivity: [
		{
			date: {
				type: Date,
				default: Date.now,
			},
			name: String,
			success: Boolean,
		},
	],
	loginActivity: [
		{
			date: Date,
			success: Boolean,
		},
	],
});

user.post('save', function(error, doc, next) {
	if (error.name === 'MongoError' && error.code === 11000) {
		next(new Error(`Username ${doc.username} is already taken.`));
	} else {
		next(error);
	}
});

// before saving document to mongodb
user.pre('save', function(next) {
	var self = this;
	mongoose.models['user'].findOne({ username: self.username }, function(
		err,
		user,
	) {
		if (!user) {
			bcrypt.hash(self.password, saltRounds, function(err, hash) {
				if (err) {
					return next(err);
				} else {
					self.password = hash;
					next();
				}
			});
		} else {
			next(new Error('Username already exists!'));
		}
	});
});

// static methods which can be called on document
user.statics = {
	bcryptpassword: function(data, cb) {
		bcrypt.hash(data, saltRounds, function(err, hash) {
			if (err) {
				return cb(err);
			} else {
				return cb(null, hash);
			}
		});
	},
};

// instance methods which can be called on instacnce only
user.methods = {
	comparePassword: function(data, cb) {
		bcrypt.compare(data, this.password, function(err, passRes) {
			if (err) {
				return cb(err);
			} else {
				return cb(null, passRes);
			}
		});
	},
};

const UserModel = mongoose.model('user', user);

module.exports = UserModel;
