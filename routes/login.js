const { Router } = require('express');
const funcs = require('../services/users');
const asyncHandler = require('express-async-handler');
const router = new Router();

router.get('/login', function getLogin(req, res, next) {
    if (req.session.user == undefined || req.session.user === null) 
        res.render('login/login');
    else
        res.redirect('/');
});

