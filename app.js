require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const passport = require('./config/passport-setup');
const authRoute = require('./routes/auth-routes');
const cookieSession = require('cookie-session');
const mongodb = require('./mongodb/mongodb.connect');
const uploadRoute = require('./routes/upload-routes');
const allUploads = require('./lib/upload-finder');

// Encrypt cookie
app.use(
	cookieSession({
		maxAge: 24 * 60 * 60 * 1000 * 2,
		keys: [process.env.SECRET],
	}),
);

mongodb.connect(process.env.dbURI);

// init passport
passport(app);

app.use(express.static('public'));
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	}),
);
app.use('/auth', authRoute);
app.use('/upload', uploadRoute);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const authcheck = (req, res, next) => {
	if (req.user) {
		next();
	} else {
		req.session.redirectTo = req.originalUrl;
		res.redirect('/auth/login');
	}
};

app.get('/login', (req, res) => {
	if (!req.user) res.redirect('/auth/login');
	else res.redirect('/');
});

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

app.get('/signup', (req, res) => {
	req.logOut();
	res.redirect('/auth/signup');
});

app.get('/', (req, res) => {
	allUploads(req.user, urls => {
		res.render('index', {
			user: req.user,
			urls: urls,
		});
	});
});

app.use((err, req, res, next) => {
	res.status(500).json({ message: err.message });
});

module.exports = app;
