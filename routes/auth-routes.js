const express = require('express');
const router = express.Router();
const { showSignUpForm, signUp } = require('../controller/signup.controller');
const { showLoginForm, logIn } = require('../controller/login.controller');
const { showResetForm, reset } = require('../controller/reset.controller');
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

router.get('/reset', showResetForm);
router.post('/reset', reset);

module.exports = router;
