const { Router } = require('express');
const funcs = require('../services/users');
const asyncHandler = require('express-async-handler');
const router = new Router();
const multer = require('multer');
const upload = multer({
    dest: 'uploads/',
    filename: (req, file, callback) => {
        // ở đây các bạn có thể làm bất kỳ điều gì với cái file nhé.
        // Mình ví dụ chỉ cho phép tải lên các loại ảnh png & jpg
        let math = ["image/png", "image/jpeg"];
        if (math.indexOf(file.mimetype) === -1) {
            let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
            return callback(errorMess, null);
        }
        // Tên của file thì mình nối thêm một cái nhãn thời gian để đảm bảo không bị trùng.
        let filename = `${Date.now()}-koi-${file.originalname}`;
        callback(null, filename);
    }
});

router.get('/empViewUser', asyncHandler(async function (req, res, next) {
    if (!req.session.user || req.session.user.role != 1) {
        res.redirect('login');
    }
    var emp = req.session.user;

    id = !req.query.id ? -1 : req.query.id;
    msg = null;
    if (req.query.msgClass && req.query.msgText) {
        msg = {
            class: req.query.msgClass,
            text: req.query.msgText
        }
    }
    var user = await funcs.findByPk(id);

    if (msg) {
        console.log('get empViewUser: id = ' + req.query.id + ' msg: ' + JSON.stringify(msg));
        res.render('emp/emp', { emp, user, page: 'empViewUser', msg });
    }
    else {
        console.log('get empViewUser: id = ' + req.query.id + ' msg: null');
        res.render('emp/emp', { emp, user, page: 'empViewUser' });
    }
}));

router.get('/emp', asyncHandler(async function (req, res, next) {
    if (!req.session.user || req.session.user.role != 1) {
        res.redirect('login');
    }
    page = 1, total = 5;
    if (!req.query.page || req.query.page < 1)
        page = 1;
    else
        page = req.query.page;

    var emp = req.session.user;
    console.log('index: id nhân viên đang đăng nhập: ' + emp.id);

    if (req.session.users) {
        if (req.session.users.length > 0){
            users = req.session.users;
            req.session.users = null;
        }
    }
    else {
        users = await funcs.findAllUser((page - 1) * total, total);
    }
    res.render('emp/emp', { emp, users, page: 'index' });
}));

router.post('/emp', asyncHandler(async function (req, res, next) {
    var q = req.body;
    var result = {
        success: 0,
        data: [],
        error: null
    };
    var users = null;
    console.log('post emp ...');
    console.log(q);
    try {
        switch (q.keyType) {
            case '0':
                users = [await funcs.findByPk(q.key)];
                if (!users[0]) users.pop();
                break;
            case '1':
                users = [await funcs.findUserByEmail(q.key)];
                if (!users[0]) users.pop();
                break;
            case '2':
                users = await funcs.findAllUserByFullName(q.key)
                break;
            default:
                break;
        }
        result.success = 1;
        req.session.users = users;
        res.redirect('/emp');
        // result.data = JSON.stringify(users);
        // console.log(users);
        // res.send(result);
    } catch (error) {
        res.send(error);
    }
}));

router.post('/empUpdateUserState', asyncHandler(async function (req, res, next) {
    try {
        console.log('post empUpdateUserState : ' + JSON.stringify(req.body));
        rowUpdate = await funcs.updateUserState(parseInt(req.body.id), parseInt(req.body.state));
        res.send(rowUpdate > 0 ? '1' : '0');
    } catch (error) {
        res.send(error);
    }
}));

