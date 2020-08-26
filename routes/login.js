
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


router.post('/login', asyncHandler(async function postLogin(req, res, next) {
    console.log('post login ...');
    user = await funcs.findUserByEmail(req.body.email);
    if (user!= null && funcs.verifyPassword(req.body.password, user.password)) {
        req.session.user = user;
        if (user.role == 0)
            res.redirect('/');
        else
            res.redirect('/emp');
    }
    else {
        messageResult = 'Email hoặc password không đúng.';
        res.render('login/login', { messageResult });
    }
}));


router.get('/logout', function logout(req, res, next) {
    if (req.session.user != null)
        console.log('logout user: ' + req.session.user.id);
    req.session.user = null;
    res.redirect('/login');
});

module.exports = router;