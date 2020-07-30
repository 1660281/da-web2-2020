const {Router} = require('express');
const users = require('../services/users');
const asyncHandler = require('express-async-handler');
const router = new Router();

router.get('/admin', asyncHandler(async function getAdmin(req, res, next) {
    userid = req.session.userid;
    user = await users.findUserById(userid);
    guests = req.session.guests;
    if (user != null) {
        res.render('admin', { user, guests });
    }
    else{
        res.redirect('/login');
    }
}));

router.get('/admin/profile', asyncHandler(async function getProfile(req, res, next) {
    userid = req.session.userid;
    var user = await users.findUserById(userid);
    if (user != null) {
        res.render('profile', { user });
    }
    else{
        res.redirect('/login');
    }
}));

router.post('/admin/profile', asyncHandler(async function postProfile(req, res, next) {
    userid = await users.findUserById(req.body.id);

    user.email = req.body.email;
    user.displayName = req.body.displayName;

    req.session.user = user;
    result = {
        success: true,
        message: 'Sửa đổi thành công'
    };

    res.render('profile', { user , result });
}));

module.exports = router;