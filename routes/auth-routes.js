const express = require('express');
const router = express.Router();
const passport = require('passport');
const { showSignUpForm, signUp } = require('../controller/signup.controller');
const { showLoginForm, logIn } = require('../controller/login.controller');
const {
	showCPform,
	changePassword,
} = require('../controller/changePassword.controller');

router.get('/signup', showSignUpForm);
router.post('/signup', signUp);

router.get('/login', showLoginForm);
router.post('/login', logIn);

router.get('/changePassword', showCPform);
router.post('/changePassword', changePassword);

module.exports = router;
