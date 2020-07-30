const { Router } = require('express');
const funcs = require('../services/users');
const asyncHandler = require('express-async-handler');
const router = new Router();

router.get('/regist', function getRegist(req, res, next) {
    res.render('regist');
});

router.post('/login', asyncHandler(async function postLogin(req, res, next) {
    var userName = req.body.userName;
    var password = req.body.password;
    const userid = await funcs.auth(userName, password);

    if (userid != undefined) {
        req.session.userid = userid;
        console.log(`postlogin : ${userid}`);
        res.redirect('/admin');
    }
    else {
        messageResult = 'Lỗi đăng nhập: user name hoặc password không đúng.';
        res.render('login', { messageResult });
    }
}));

module.exports = router;