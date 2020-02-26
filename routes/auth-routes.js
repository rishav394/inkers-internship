const express = require('express');
const router = express.Router();
const passport = require('passport');
const { showSignUpForm, signUp } = require('../controller/signup.controller');
const { showLoginForm, logIn } = require('../controller/login.controller');

router.get('/signup', showSignUpForm);
router.post('/signup', signUp);

router.get('/login', showLoginForm);
router.post('/login', logIn);

module.exports = router;
