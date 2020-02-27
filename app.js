require('dotenv').config();
const express = require('express');
const app = express();
const i18n = require('i18n');
const path = require('path');
const passport = require('./config/passport-setup');
const authRoute = require('./routes/auth-routes');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const mongodb = require('./mongodb/mongodb.connect');
const uploadRoute = require('./routes/upload-routes');
const allUploads = require('./lib/upload-finder');
const { displayLogs } = require('./controller/logs.controller');

// Encrypt cookie
app.use(
	cookieSession({
		maxAge: 24 * 60 * 60 * 1000 * 2,
		keys: [process.env.SECRET],
	}),
);
app.use(cookieParser());
i18n.configure({
	locales: ['en', 'hi', 'bn', 'ta', 'kn'],

	// sets a custom cookie name to parse locale settings from
	cookie: 'locale',
	defaultLocale: 'en',
	// where to store json files - defaults to './locales'
	directory: __dirname + '/locales',
});
app.use(i18n.init);
mongodb.connect(process.env.dbURI);

// init passport
passport(app);

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	}),
);
app.use('/auth', authRoute);
app.use('/upload', uploadRoute);

app.use(express.static('public'));
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
			message: req.query.message,
			user: req.user,
			urls: urls,
		});
	});
});

app.get('/logs', authcheck, displayLogs);

app.use((err, req, res, next) => {
	res.status(500).json({ message: err.message });
});

module.exports = app;
