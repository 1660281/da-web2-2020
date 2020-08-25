const { Router } = require('express');
const users = require('../services/users');
const asyncHandler = require('express-async-handler');
const router = new Router();

router.get('/', asyncHandler( async function getIndex(req, res, next) {
    if (req.session.user == undefined || req.session.user === null){
        res.redirect('login');
    }
    user = req.session.user;
    console.log('index: iduser đang đăng nhập: ');
    console.log(user);
    console.log(req.session.user);
    res.render('index/index', {user});
}));
